// Sidecar UI — driven by the @signalwire/js SDK from signalwire-typescript-web.
//
//   1. POST /token → mint a SAT (and learn the dial address).
//   2. new SignalWire(new StaticCredentialProvider({token})) → connect.
//   3. client.register() → go online for inbound calls.
//   4. client.session.incomingCalls$ → subscribe; call.answer() on Accept.
//   5. client.dial(address, {audio,video}) → outbound.
//   6. WebSocket /ws/events → live sidecar event stream from the backend.

const SW = window.SignalWire;
if (!SW || !SW.SignalWire || !SW.StaticCredentialProvider) {
  throw new Error("v4 SDK bundle did not load — expected window.SignalWire.{SignalWire,StaticCredentialProvider}");
}

// API base — where the sidecar app's /token, /ws/events, etc. live.
// Hardcoded to /sidecar (matches ROUTE in .env). Change here if you change
// ROUTE on the server side.
const API_BASE = "/sidecar";

const $ = (id) => document.getElementById(id);
const els = {
  ledToken: $("led-token"),
  ledCall: $("led-call"),
  ledWs: $("led-ws"),
  dialInput: $("dial-address"),
  destInput: $("destination-number"),
  btnConnect: $("btn-connect"),
  btnOnline: $("btn-online"),
  btnDial: $("btn-dial"),
  btnMute: $("btn-mute"),
  btnHangup: $("btn-hangup"),
  btnListen: $("btn-listen"),
  btnAccept: $("btn-accept"),
  btnReject: $("btn-reject"),
  state: $("call-state"),
  meter: $("meter"),
  remoteAudio: $("remote-audio"),
  events: $("events"),
  filterText: $("filter-text"),
  showRaw: $("show-raw"),
  autoScroll: $("auto-scroll"),
  btnClear: $("btn-clear"),
  invite: $("invite"),
  inviteFrom: $("invite-from"),
  postCall: $("post-call"),
  btnNewCall: $("btn-new-call"),
  callStatusPill: $("call-status-pill"),
  stats: {
    insights: $("stat-insights"),
    skips: $("stat-skips"),
    tools: $("stat-tools"),
    errors: $("stat-errors"),
  },
  // New UI surfaces (added in the dashboard rewrite). Tolerant of absence
  // so the script still works if someone reverts the HTML.
  coachHero:     $("coach-hero"),
  coachListening: $("coach-listening"),
  coachCard:     $("coach-card"),
  coachText:     $("coach-text"),
  coachTs:       $("coach-ts"),
  coachList:     $("coach-list"),
  coachEmptyHint: $("coach-empty-hint"),
  transcriptStream: $("transcript-stream"),
  transcriptEmpty:  $("transcript-empty"),
  transcriptAutoscroll: $("transcript-autoscroll"),
  contextCards:  $("context-cards"),
  contextEmpty:  $("context-empty"),
  callTimer:     $("call-timer"),
  statInsightsWrap: $("stat-insights-wrap"),
};

const state = {
  client: null,
  call: null,
  online: false,
  pendingCall: null,
  meterRaf: 0,
  ws: null,
  wsTicket: null,
  stats: { insights: 0, skips: 0, tools: 0, errors: 0 },
  audioContext: null,
  // Live audio tap state — set by connectAudioListener / cleared by
  // disconnectAudioListener. Worklet node sits inside audioContext.
  audioTap: {
    ws: null,           // WebSocket to /sidecar/ws/audio/listen
    workletNode: null,  // AudioWorkletNode running pcm-ring
    workletReady: null, // Promise resolving once the worklet module is registered
  },
  // Held call subscriptions so we can teardown.
  callSubs: [],
};

const setLed = (el, kind) => { el.classList.remove("on", "warn", "bad"); if (kind) el.classList.add(kind); };
const setState = (text) => { els.state.textContent = text; };

// Self-heal: the relay sometimes holds a stale registration for our
// subscriber (common after a host reboot or long idle), so the first
// dial/register times out with RPCTimeoutError / CallCreateError. When that
// signature shows up we recover transparently — tear down the wedged client,
// DELETE the subscriber so the next /token mints a fresh identity, reconnect,
// and REPLAY whatever the user was doing (the dial with its destination, or
// go-online). No page reload, no lost intent.
//
// `_pendingIntent` records the in-flight action so it can be replayed.
// Bounded by `_HEAL_MAX` so a genuine outage can't loop forever; the counter
// resets once a call actually connects (see attachCall) or registration
// succeeds (see _bindRegistrationState).
let _healing = false;
let _healAttempts = 0;
const _HEAL_MAX = 2;
let _pendingIntent = null;   // {kind:'dial', destination} | {kind:'online'} | null

function _isWedge(err) {
  const msg = String((err && err.message) || err || "");
  const name = (err && err.name) || "";
  return name === "RPCTimeoutError"
      || name === "CallCreateError"
      || /RPC request .* timed out/i.test(msg)
      || /Call create timeout/i.test(msg);
}

async function maybeSelfHeal(err) {
  if (_healing) return true;            // a heal is already running
  if (!_isWedge(err)) return false;     // not the wedge signature — caller handles it
  // A live, attached call means the SESSION is healthy — it is not wedged.
  // The SDK auto-fires call.layout.list on call.joined, which on an
  // audio-only fabric call returns -32602 / times out (RPCTimeoutError).
  // That benign per-call error must NOT trigger the destroy-and-reconnect
  // recovery: doing so kills the connected call and orphans the PSTN leg.
  // Self-heal exists only to recover a session stuck before a call (can't
  // dial / can't go online), so suppress it whenever a call is up.
  if (state.call) {
    console.warn("[sidecar] ignoring wedge-signature error during active call:",
                 (err && (err.message || err.name)) || err);
    return true;
  }
  if (_healAttempts >= _HEAL_MAX) {
    setState("session stuck — reload the page to recover");
    setLed(els.ledToken, "bad");
    return true;
  }
  _healing = true;
  _healAttempts += 1;
  setState("connection stuck — recovering…");
  setLed(els.ledToken, "warn");
  try {
    // INBOUND-SAFE GATE. The delete-and-recreate recovery is correct for an
    // OUTBOUND dial wedge (fresh identity clears a half-provisioned subscriber).
    // But when the rep is registered for inbound (online), or an inbound call
    // is in flight, the subscriber identity MUST be preserved — deleting it
    // drops the registration the DID's SWML bridges to (/private/<subscriber>)
    // and kills the very call we're answering. In that case we reconnect and
    // re-register WITHOUT deleting the subscriber.
    const inboundContext = state.online || !!state.pendingCall
                           || (_pendingIntent && _pendingIntent.kind === "online");
    // 1. Drop the wedged client so the fresh token gets a clean one.
    try { state.client?.disconnect?.(); } catch {}
    state.client = null;
    state.online = false;
    state.pendingCall = null;
    if (els.invite) els.invite.hidden = true;
    setLed(els.ledCall, "");
    if (!inboundContext) {
      // 2. OUTBOUND ONLY: evict the wedged subscriber so the next /token mints
      //    a fresh identity.
      try {
        await fetch(`${API_BASE}/subscriber`, { method: "DELETE", credentials: "include" });
      } catch (e) { console.warn("[sidecar] subscriber reset failed:", e); }
      // 3. Let the relay settle the deletion before re-minting.
      await new Promise((r) => setTimeout(r, 500));
    }
    // 4. Reconnect: fresh /token + new SDK client (connect() re-wires the
    //    error/registration/incoming subscriptions on the new client).
    await connect();
    if (!state.client) throw new Error("reconnect produced no client");
    // 5. Replay. Inbound context → go back online so the rep is ready for the
    //    next inbound call (the wedged call itself is gone). Outbound → replay
    //    the dial that wedged.
    const intent = _pendingIntent;
    if (inboundContext) {
      setState("reconnected — going back online…");
      await toggleOnline();
    } else if (intent && intent.kind === "dial") {
      setState("reconnected — retrying dial…");
      els.destInput.value = intent.destination;
      await dial();
    } else if (intent && intent.kind === "online") {
      setState("reconnected — going online…");
      await toggleOnline();
    } else {
      setState("reconnected — ready to dial");
    }
  } catch (e) {
    console.warn("[sidecar] self-heal failed:", e);
    setState("recovery failed — reload the page");
    setLed(els.ledToken, "bad");
  } finally {
    _healing = false;
  }
  return true;
}

// ----- token + client -----------------------------------------------

async function fetchToken() {
  // /token is gated by HTTP Basic. credentials:'include' lets the browser
  // attach the cached basic-auth credentials it prompted for on the first
  // call; it'll prompt the user on a 401 and re-try transparently.
  const resp = await fetch(`${API_BASE}/token`, {
    method: "POST",
    credentials: "include",
  });
  if (resp.status === 401)
    throw new Error("authentication required (set SIDECAR_UI_PASSWORD)");
  if (resp.status === 503)
    throw new Error("UI auth disabled — server has no SIDECAR_UI_PASSWORD set");
  if (!resp.ok) throw new Error(`token endpoint ${resp.status}`);
  const data = await resp.json();
  // Capture customer_role from the token response so the side-detection
  // in renderEvent/utterance below uses whatever the server has
  // configured, not a stale hardcoded default.
  if (data && data.customer_role) state.customerRole = data.customer_role;
  if (data && data.ws_ticket) {
    const fresh = state.wsTicket !== data.ws_ticket;
    state.wsTicket = data.ws_ticket;
    // openWS() was called at module load before any ticket existed and
    // bailed out. Now that we have one, open the connection (or
    // re-open if we just rotated to a different ticket).
    if (fresh && (!state.ws || state.ws.readyState >= 2)) {
      openWS();
    }
  }
  return data;
}

async function connect() {
  els.btnConnect.disabled = true;
  setState("minting SAT…");
  setLed(els.ledToken, "warn");
  try {
    const { token, address, api_host: apiHost } = await fetchToken();
    if (address && !els.dialInput.value) els.dialInput.value = address;

    const credentials = new SW.StaticCredentialProvider({ token });
    state.client = new SW.SignalWire(credentials);

    // SDK rc.0 bug: API host is derived from the JWT `ch` claim (the relay
    // host) and cached on construction, so subscriber-info GETs go to
    // fabric.signalwire.com. Override the dependency container's baseURL
    // synchronously — runs before validateCredentials' microtask chain
    // reaches the first HTTP request.
    if (apiHost && state.client._deps) {
      state.client._deps.baseURL = apiHost;
      console.log("[sidecar] override baseURL →", state.client._deps._baseURL);
    } else {
      console.warn("[sidecar] could NOT override baseURL", { apiHost, hasDeps: !!state.client._deps });
    }

    state.client.errors$.subscribe(async (e) => {
      console.error("client error", e);
      if (await maybeSelfHeal(e)) return;
      setState(`error: ${e.message || e.name}`);
    });

    // Keep the Go Online / Go Offline button honest — it mirrors the
    // SDK's real registration state, not the (always-resolving) register()
    // call. See _bindRegistrationState.
    _bindRegistrationState(state.client);

    // Wait for ready.
    await new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error("ready timeout")), 10000);
      const sub = state.client.ready$.subscribe((ready) => {
        if (ready) { clearTimeout(t); sub.unsubscribe?.(); resolve(); }
      });
    });

    setLed(els.ledToken, "on");
    // First moment the SignalWire client is genuinely ready: reveal the
    // status chip and show "Ready to dial". Kept hidden up to this point
    // so the user doesn't see "ready" before /token + register actually
    // succeed.
    if (els.callStatusPill) els.callStatusPill.hidden = false;
    setState("Ready to dial");
    els.btnDial.disabled = false;
    els.btnOnline.disabled = false;

    // Pre-wire incoming-call subscription so it fires the moment we register.
    state.client.session?.incomingCalls$.subscribe((calls) => {
      const ringing = (calls || []).find((c) => c.status === "ringing");
      if (ringing && ringing !== state.pendingCall) {
        state.pendingCall = ringing;
        showInvite(ringing);
      }
    });
  } catch (e) {
    setLed(els.ledToken, "bad");
    if (await maybeSelfHeal(e)) return;
    setState(`connect failed: ${e.message}`);
    els.btnConnect.disabled = false;
  }
}

// Reflect the SDK's authoritative registration state onto the button.
// register() swallows relay errors into client.errors$ and resolves
// either way, so the ONLY trustworthy signal that we're actually online
// is isRegistered$ (the SDK flips it to true only on a 200 from
// subscriber.online). Wiring the button to this observable means a
// failed Go Online never shows "Go Offline", and a relay-side drop or
// self-heal reset flips the button back automatically.
function _bindRegistrationState(client) {
  client.isRegistered$.subscribe((reg) => {
    state.online = !!reg;
    if (reg) { _healAttempts = 0; }   // registered → healthy again
    els.btnOnline.textContent = reg ? "Go Offline" : "Go Online";
    els.btnOnline.classList.toggle("online-active", !!reg);
    // Don't stomp an active call's status line; only narrate idle state.
    if (!state.call) {
      setState(reg ? "online — waiting for inbound calls" : "Ready to dial");
    }
  });
}

async function toggleOnline() {
  if (!state.client) return;
  els.btnOnline.disabled = true;
  const goingOnline = !state.online;
  // Capture the next error emission during the RPC window so a failure
  // gets surfaced instead of vanishing into errors$ (which only logs).
  let rpcErr = null;
  const errSub = state.client.errors$.subscribe((e) => { rpcErr = e; });
  try {
    if (goingOnline) {
      // Record the intent so a wedge can be replayed by the self-heal.
      _pendingIntent = { kind: "online" };
      setState("going online…");
      await state.client.register();   // resolves even on failure
      // Give isRegistered$ a tick to settle, then trust IT, not register().
      await new Promise((r) => setTimeout(r, 200));
      if (!state.client.isRegistered) {
        // Genuine rejection. If it's the known relay-wedge timeout, recover
        // + replay the go-online transparently; otherwise surface the reason.
        if (rpcErr && (await maybeSelfHeal(rpcErr))) return;
        _pendingIntent = null;
        throw new Error(
          rpcErr ? (rpcErr.message || rpcErr.name || String(rpcErr))
                 : "relay rejected subscriber.online"
        );
      }
      _pendingIntent = null;   // registered — nothing to replay
      // Success path — the isRegistered$ subscription updates the button.
    } else {
      _pendingIntent = null;   // going offline; nothing to replay
      await state.client.unregister();   // this one DOES throw on failure
    }
  } catch (e) {
    setState(`go online failed: ${e.message || e.name || e}`);
  } finally {
    errSub.unsubscribe?.();
    els.btnOnline.disabled = false;
  }
}

// ----- inbound -------------------------------------------------------

function showInvite(call) {
  els.inviteFrom.textContent = `from ${call.fromName || call.from || "?"}`;
  els.invite.hidden = false;
  setState("ringing — incoming call");
  // Hide the panel if the call stops ringing (timed out, cancelled, etc).
  call.status$.subscribe((status) => {
    if (status !== "ringing") els.invite.hidden = true;
    if (status === "connected" || status === "active") attachCall(call);
  });
}

async function acceptInvite() {
  if (!state.pendingCall) return;
  const call = state.pendingCall;
  els.invite.hidden = true;
  setLed(els.ledCall, "warn");
  setState("answering…");
  try {
    // Pass media options (mirrors the outbound dial). Without them the SDK
    // answers with no audio media → the SDP answer never completes and the
    // relay leg stays unanswered (created → cancel), so the caller never
    // bridges even though the rep "answered".
    state.callDirection = "inbound";
    await call.answer({ audio: true, video: false });
    // Track the answered call exactly like an outbound dial: this wires
    // remoteStream$ → the audio element (so the rep HEARS the caller),
    // status/destroy handlers, and resets the heal counter. Without it the
    // inbound call is live on the wire but untracked — no audio, and a
    // benign per-call RPC error could trip the self-heal into killing it.
    attachCall(call);
  } catch (e) {
    setLed(els.ledCall, "bad");
    setState(`answer failed: ${e.message}`);
  }
}

async function rejectInvite() {
  if (!state.pendingCall) return;
  const call = state.pendingCall;
  els.invite.hidden = true;
  state.pendingCall = null;
  try { await call.reject(); } catch {}
  setState(state.online ? "online — waiting for inbound calls" : "offline");
}

// ----- outbound ------------------------------------------------------

async function dial() {
  if (!state.client) return;
  const to = els.dialInput.value.trim();
  const destination = els.destInput.value.trim();
  if (!to) { setState("enter a dial address first"); return; }
  if (!destination) { setState("enter a destination number"); return; }
  // Validate E.164 HERE, not in the SWML cond. The relay's expression engine
  // returns "Empty result" on a regex `when` (/.../.test(...)), so the server
  // branches only on PRESENCE of destination_number — it trusts the browser to
  // send a well-formed number. Reject anything that isn't +<7–15 digits>.
  if (!/^\+[1-9]\d{6,14}$/.test(destination)) {
    setState("destination must be E.164, e.g. +14155551234");
    return;
  }
  // A dial starts a fresh call — drop the post-call banner if it's still
  // up AND kill any pending banner-reveal timer from the previous call's
  // teardown so it doesn't pop up mid-ringing.
  _cancelPostCallBanner();
  // Record the intent so a wedge mid-dial can be replayed by the self-heal.
  _pendingIntent = { kind: "dial", destination };
  state.callDirection = "outbound";
  els.btnDial.disabled = true;
  setLed(els.ledCall, "warn");
  setState(`dialing ${to} → ${destination}…`);
  try {
    // The dial address is always the sidecar resource (e.g. /public/sidecar-copilot).
    // The real destination rides along in userVariables — the SWML template
    // pulls it via %{vars.userVariables.destination_number} for the connect verb.
    const call = await state.client.dial(to, {
      audio: true,
      video: false,
      userVariables: { destination_number: destination },
    });
    attachCall(call);
    _pendingIntent = null;          // connected — nothing to replay
  } catch (e) {
    setLed(els.ledCall, "bad");
    if (await maybeSelfHeal(e)) return;   // wedge → recover + replay this dial
    _pendingIntent = null;
    setState(`dial failed: ${e.message}`);
    els.btnDial.disabled = false;
  }
}

function attachCall(call) {
  state.call = call;
  state.pendingCall = null;
  state.muted = false;
  _callEndedFired = false;
  _healAttempts = 0;          // a call connected → we're healthy again
  _pendingIntent = null;
  // Belt-and-suspenders: if any prior teardown scheduled the banner
  // reveal and it hasn't fired yet, kill it — we have a real new call
  // attaching now.
  _cancelPostCallBanner();
  els.btnHangup.disabled = false;
  els.btnMute.disabled = false;
  els.btnDial.disabled = true;
  _renderMuteIcon(false);

  // Track whether we've seen the call enter a live/in-progress state.
  // status$ is a BehaviorSubject — its first emission to a new subscriber
  // is the *current* value, which for a freshly-dialed call is typically
  // "disconnected" (the default before the relay has accepted anything).
  // Treating that initial tick as a terminal event flipped the UI into
  // the post-call banner state instantly. Gate the terminal transitions
  // on having actually progressed past the dial setup.
  const LIVE_STATES = new Set([
    "connected", "active", "connecting", "ringing", "trying", "early",
    "requesting", "success", "reconnecting",
  ]);
  const TERMINAL_STATES = new Set([
    "disconnecting", "disconnected", "destroyed", "ended", "error",
  ]);
  let everLive = false;

  const sub1 = call.status$.subscribe((status) => {
    setState(`call ${status}`);
    if (LIVE_STATES.has(status)) everLive = true;
    if (status === "connected" || status === "active") {
      _callLive = true;
      setLed(els.ledCall, "on");
      // Coach orb is hidden until we're actually on a live call. It hides
      // again automatically when an insight arrives (pushInsight) and on
      // call teardown (teardownCall → hides explicitly).
      if (els.coachListening && els.coachCard?.hidden !== false) {
        els.coachListening.hidden = false;
      }
    }
    if (TERMINAL_STATES.has(status) && everLive) {
      _callLive = false;
      _onCallEnded();
    }
  });
  // Belt-and-suspenders: the SDK fires call.once("destroy") regardless of
  // whether status$ delivers a final tick. Without this, a hangup that
  // never emits "destroyed" on status$ would leave the chip stuck on
  // "call connected" forever.
  try {
    call.once?.("destroy", _onCallEnded);
  } catch (_) { /* SDK quirk — observable-only call object */ }

  // Remote audio.
  const sub2 = call.remoteStream$.subscribe((stream) => {
    if (stream) {
      els.remoteAudio.srcObject = stream;
      startMeter(stream);
    }
  });
  state.callSubs = [sub1, sub2];
}

// Deferred "New call" banner timer — set when a call appears to have
// ended, cleared when a fresh call starts. See teardownCall() for the
// rationale (defensive against spurious terminal status during ringing).
let _postCallTimer = 0;
function _cancelPostCallBanner() {
  if (_postCallTimer) {
    clearTimeout(_postCallTimer);
    _postCallTimer = 0;
  }
  if (els.postCall) els.postCall.hidden = true;
}

// True between the call reaching connected/active and a real terminal state.
// The inbound ai_sidecar emits a `final` event at BRIDGE time (transcribe_close
// fires the instant `connect` answers), which must NOT be treated as the call
// ending — the bridged conversation is just starting. While _callLive is true
// the SDK call lifecycle (status$ terminal / "destroy") is the sole authority
// for teardown; the ai_sidecar `final` only paints its summary bubble.
let _callLive = false;
let _callEndedFired = false;
function _onCallEnded() {
  // UI flush — always safe to re-run; the chip / button / led writes
  // are idempotent. This block runs even if `state.call` is already null
  // so an out-of-band terminal signal (or a duplicate event) can still
  // unstick a UI that got left on "connected".
  setLed(els.ledCall, "");
  els.btnHangup.disabled = true;
  els.btnMute.disabled = true;
  els.btnDial.disabled = false;
  stopMeter();
  setState("call ended");
  // Subscription teardown / audio listener shutdown / post-call banner —
  // these only need to happen once. Guard with _callEndedFired so a
  // repeat call doesn't double-show the banner or re-disconnect things.
  if (_callEndedFired) return;
  _callEndedFired = true;
  teardownCall();
}

function teardownCall() {
  _callLive = false;
  state.callSubs.forEach((s) => s?.unsubscribe?.());
  state.callSubs = [];
  state.call = null;
  // Hide the coach orb — no call means nothing to listen for.
  if (els.coachListening) els.coachListening.hidden = true;
  // Schedule the "Call ended → click for new call" banner for 20s out
  // instead of showing immediately. Workaround for cases where the SDK
  // emits a spurious terminal status during the dial-setup phase: if
  // the call actually does connect within those 20s, dial() / attachCall()
  // cancel the timer and the banner never appears. If the call really
  // ended, 20s of "did it really hang up?" lag is much better than
  // 0s of false-positive banner during ringing.
  _cancelPostCallBanner();
  _postCallTimer = setTimeout(() => {
    if (els.postCall) els.postCall.hidden = false;
    _postCallTimer = 0;
  }, 20_000);
  // Pull down the audio listener if it was running. The relay-side tap
  // ends naturally with the call; the browser-side socket just needs to
  // stop drawing from the (now-empty) hub.
  disconnectAudioListener();
}

async function hangup() {
  if (!state.call) {
    // Already torn down or never attached — still flush the UI so an
    // out-of-band hangup (network drop, remote end, SDK quirk) doesn't
    // leave the chip stuck on "connected".
    _onCallEnded();
    return;
  }
  // Snapshot before the hangup so the post-hangup forced teardown can
  // still find a call ref if status$/destroy never fire.
  const call = state.call;
  setState("hanging up…");
  els.btnHangup.disabled = true;
  try {
    await call.hangup();
  } catch (e) {
    console.warn("[hangup] error from sdk:", e);
  }
  // Forced teardown — `_onCallEnded` is idempotent (guarded by
  // `_callEndedFired`), so if status$ already drove it we no-op. Without
  // this, a hangup that completes without an emitted terminal status
  // would leave the UI stuck saying "call connected".
  _onCallEnded();
}

function toggleMute() {
  if (!state.call) return;
  // Mute by flipping track.enabled on the local audio tracks. This is the
  // standard WebRTC mute pattern — the track stays attached to the peer
  // connection, audio is just silenced at the source. Instant in both
  // directions.
  //
  // We deliberately do NOT use call.self.mute() / unmute() here: that
  // path tears down the local mic device via vertoManager and re-acquires
  // it on unmute, which adds ~5 s of getUserMedia + ICE renegotiation lag
  // before audio comes back. The track.enabled flip avoids that entirely.
  const want = !state.muted;
  const stream = state.call?.localStream;
  if (!stream || typeof stream.getAudioTracks !== "function") {
    console.warn("[mute] no localStream on call — can't toggle");
    return;
  }
  const tracks = stream.getAudioTracks();
  for (const t of tracks) t.enabled = !want;
  state.muted = want;
  _renderMuteIcon(want);
}

function _renderMuteIcon(muted) {
  const icon = els.btnMute.querySelector(".material-symbols-rounded");
  if (icon) icon.textContent = muted ? "mic_off" : "mic";
  els.btnMute.classList.toggle("muted", !!muted);
  els.btnMute.title = muted ? "Unmute" : "Mute";
}

// ----- audio meter --------------------------------------------------

function startMeter(stream) {
  stopMeter();
  state.audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  const src = state.audioContext.createMediaStreamSource(stream);
  const analyser = state.audioContext.createAnalyser();
  analyser.fftSize = 512;
  src.connect(analyser);
  const buf = new Uint8Array(analyser.frequencyBinCount);
  const tick = () => {
    analyser.getByteTimeDomainData(buf);
    let peak = 0;
    for (const v of buf) peak = Math.max(peak, Math.abs(v - 128));
    els.meter.style.width = Math.min(100, (peak / 128) * 200) + "%";
    state.meterRaf = requestAnimationFrame(tick);
  };
  tick();
}
function stopMeter() {
  if (state.meterRaf) cancelAnimationFrame(state.meterRaf);
  state.meterRaf = 0;
  els.meter.style.width = "0%";
}

// ----- events websocket ---------------------------------------------

async function refreshWSTicket() {
  // Mint a fresh ws ticket without re-minting a SAT. Used by the
  // auto-reconnect path so a stale ticket (e.g. after a server restart
  // cleared its in-memory ticket store) doesn't loop indefinitely.
  try {
    const r = await fetch(`${API_BASE}/ws-ticket`, {
      method: "POST", credentials: "include",
    });
    if (!r.ok) throw new Error(`ws-ticket ${r.status}`);
    const d = await r.json();
    if (d && d.ws_ticket) state.wsTicket = d.ws_ticket;
    return !!(d && d.ws_ticket);
  } catch (e) {
    console.warn("refreshWSTicket failed:", e.message);
    return false;
  }
}

function openWS() {
  // The WS upgrade can't carry HTTP Basic; we authenticate via a short-lived
  // ticket minted by /token (or /ws-ticket on reconnect). If we don't have
  // one yet, defer — connect() will call openWS() again once /token returns.
  if (!state.wsTicket) {
    setLed(els.ledWs, "bad");
    console.warn("openWS: no ws_ticket yet, deferring");
    return;
  }
  const proto = location.protocol === "https:" ? "wss" : "ws";
  const url = `${proto}://${location.host}${API_BASE}/ws/events`
            + `?ticket=${encodeURIComponent(state.wsTicket)}`;
  setLed(els.ledWs, "warn");
  state.ws = new WebSocket(url);
  state.ws.onopen = () => setLed(els.ledWs, "on");
  state.ws.onclose = async () => {
    setLed(els.ledWs, "bad");
    // Refresh the ticket before reconnecting so a stale one (e.g. after a
    // server restart) doesn't drive the auth gate into a rejection loop.
    // If the refresh itself fails (auth lost / page offline), back off.
    const ok = await refreshWSTicket();
    setTimeout(openWS, ok ? 2000 : 10000);
  };
  state.ws.onerror = () => setLed(els.ledWs, "bad");
  state.ws.onmessage = (msg) => {
    try { renderEvent(JSON.parse(msg.data)); }
    catch (e) { console.error("bad ws frame", e, msg.data); }
  };
}

function bumpStat(type) {
  if (type === "insight") state.stats.insights++;
  else if (type === "skip") state.stats.skips++;
  else if (type === "tool_call") state.stats.tools++;
  else if (type === "error") state.stats.errors++;
  else return;
  els.stats.insights.textContent = state.stats.insights;
  els.stats.skips.textContent = state.stats.skips;
  els.stats.tools.textContent = state.stats.tools;
  els.stats.errors.textContent = state.stats.errors;
}

function classify(evt) {
  // Sidecar events carry a `type`. Some platform events don't — e.g. the
  // post-call `transcribe.conversation_log` summary, raw transcript pushes,
  // or generic webhook deliveries. Synthesize a type-ish label so they
  // render with a useful row instead of "?".
  if (evt.type) return evt.type;
  const disp = evt.channel_data?.content_disposition;
  if (disp === "transcribe.conversation_log") return "conversation_log";
  if (typeof disp === "string" && disp.startsWith("transcribe.")) return disp;
  if (evt.utterance) return "transcribe.utterance";
  if (Array.isArray(evt.conversation_log)) return "conversation_log";
  if (evt.conversation_summary) return "conversation_summary";
  return "event";
}

// Many fields ride in as JSON strings — try to revive them, fall back to raw.
function reviveMaybeJSON(v) {
  if (typeof v !== "string") return v;
  if (v.length < 2 || (v[0] !== "{" && v[0] !== "[")) return v;
  try { return JSON.parse(v); } catch { return v; }
}

// Compact `{key: value, key: value}` for tool args — no escape soup.
function fmtArgs(args) {
  const obj = reviveMaybeJSON(args);
  if (obj == null || typeof obj !== "object") return String(obj ?? "");
  const parts = Object.entries(obj).map(([k, v]) => {
    const s = typeof v === "string" ? `"${v}"` : JSON.stringify(v);
    return `${k}=${s}`;
  });
  return parts.join(", ");
}

// Tool results usually arrive as `{"response": "X"}` — peel that wrapper.
function fmtToolResponse(resp) {
  const r = reviveMaybeJSON(resp);
  if (r && typeof r === "object" && "response" in r) return String(r.response);
  return String(r ?? "");
}

function fmtAction(action) {
  const a = reviveMaybeJSON(action);
  if (a && typeof a === "object") {
    const key = Object.keys(a)[0];
    if (!key) return "";
    const inner = a[key];
    if (inner && typeof inner === "object" && "topic" in inner) return `${key} → ${inner.topic}`;
    return key;
  }
  return String(a ?? "");
}

function summarize(evt, t) {
  if (t === "insight") return evt.raw || "";
  if (t === "skip") return evt.reason || "(no reason)";
  if (t === "turn") return evt.customer_text || "";
  if (t === "thought") return evt.text || "";
  if (t === "tool_call") return `${evt.name}(${fmtArgs(evt.arguments)})`;
  if (t === "tool_result") return `${evt.name} → ${fmtToolResponse(evt.response)}`;
  if (t === "action") return fmtAction(evt.action);
  if (t === "global_data_change") return `${evt.key}: ${JSON.stringify(evt.old_value)} → ${JSON.stringify(evt.new_value)}`;
  if (t === "history_pruned") return `${evt.tokens_before} → ${evt.tokens_after} tokens`;
  if (t === "error") return `${evt.error_reason}: ${evt.detail || ""}`;
  if (t === "final") return evt.summary || `${(evt.duration_ms||0)/1000}s, ${(evt.insights||[]).length} insights`;
  if (t === "start") return `model=${evt.model} · tools=${(evt.tools||[]).length}`;
  if (t === "stop") return evt.stop_reason || "";
  if (t === "request") return `${evt.model || ""} · ${evt.messages_count ?? 0}m / ${evt.messages_token_count ?? 0}t`;
  if (t === "conversation_log") {
    const m = evt.metrics || {};
    const lastUtt = (evt.conversation_log || []).slice(-1)[0];
    const tail = lastUtt ? ` · last: "${lastUtt.content || ""}"` : "";
    return `${m.total_utterances ?? (evt.conversation_log || []).length} utterances${tail}`;
  }
  if (t === "conversation_summary") return evt.conversation_summary || "";
  if (t === "transcribe.utterance" || t === "utterance") {
    const u = evt.utterance || {};
    const role = u.role || "?";
    return `${role}: ${u.content || ""}`;
  }
  return "";
}

// Collapse the noisy `transcribe.utterance` label down to "utterance" for
// display so the type column doesn't blow out. Same for any other long
// disposition-style labels.
function displayLabel(t) {
  if (t === "transcribe.utterance") return "utterance";
  if (t === "transcribe.conversation_log") return "conversation_log";
  return t;
}

function renderEvent(frame) {
  const evt = frame.event || {};
  const t = classify(evt);
  // Drop the WebSocket-handshake placeholder our backend emits on connect.
  if (t === "_hello") return;
  bumpStat(t);
  const li = document.createElement("li");
  // Dots aren't valid in plain CSS class selectors → use dashes for the
  // class hook while keeping the human label as the displayed type.
  li.classList.add(`t-${t.replace(/\./g, "-")}`);
  const ts = new Date(evt.ts ? Math.floor(evt.ts / 1000) : Date.now());
  const time = _fmtClockET(ts);
  const rawJSON = JSON.stringify(frame, null, 2);
  const summary = summarize(evt, t);
  li.innerHTML = `
    <span class="ts">${time}</span>
    <span class="type">${displayLabel(t)}</span>
    <span class="summary"></span>
    <pre class="json"></pre>
  `;
  li.querySelector(".summary").textContent = summary;
  li.querySelector(".json").textContent = rawJSON;
  if (els.showRaw.checked) li.classList.add("expanded");
  li.addEventListener("click", () => li.classList.toggle("expanded"));
  const filter = els.filterText.value.trim().toLowerCase();
  if (filter && !`${t} ${summary} ${rawJSON}`.toLowerCase().includes(filter)) li.style.display = "none";
  els.events.appendChild(li);
  if (els.autoScroll.checked) els.events.parentElement.scrollTop = els.events.parentElement.scrollHeight;

  // Fan the event out to the dashboard's prettier surfaces — coach pane,
  // transcript bubbles, context cards. Best-effort; swallowed if helpers
  // are absent (e.g. an older HTML still being served from a stale cache).
  try { routeToDashboard(t, evt, time); } catch (e) { console.warn("ui route:", e); }
}

// ====================================================================
// Dashboard surfaces — coach (insights), transcript bubbles, context cards
// ====================================================================

// Wall-clock HH:MM:SS, locked to Eastern. toTimeString() would honor the
// viewer's browser timezone, making timestamps drift away from what the
// SignalWire dashboard / relay logs show; the demo runs on ET so we pin
// every visible time to America/New_York instead.
function _fmtClockET(d) {
  return d.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    timeZone: "America/New_York",
  });
}

function timeOf(evt, fallback) {
  if (evt && evt.ts) return _fmtClockET(new Date(Math.floor(evt.ts / 1000)));
  return fallback || _fmtClockET(new Date());
}

function routeToDashboard(t, evt, ts) {
  if (t === "insight")        pushInsight(evt, ts);
  else if (t === "tool_call")  noteToolCall(evt, ts);
  else if (t === "tool_result") {
    pushContextCard(evt, ts);
    // Many tools (log_objection, lookup_competitor, escalate_to_supervisor)
    // tuck the actual sales advice into the response prose. If the LLM
    // hasn't emitted an `insight` event, surface that prose into the Coach
    // pane so the rep sees the rebuttal/positioning instead of waiting.
    // sidecar_skip responses ("ok") are excluded — they're noise.
    const resp = reviveMaybeJSON(evt.response);
    const respText = typeof resp === "string" ? resp
                   : (resp && typeof resp === "object" && typeof resp.response === "string") ? resp.response
                   : null;
    if (respText && evt.name !== "sidecar_skip" && respText !== "ok") {
      pushInsight({ raw: respText, _source: `from ${evt.name}` }, ts);
    }
  }
  // Transcript: prefer transcribe.utterance (has explicit role for BOTH
  // legs). Ignore `turn` here — it duplicates the customer side since the
  // sidecar emits both the per-tick customer turn AND the raw utterances.
  else if (t === "transcribe.utterance" || t === "utterance") {
    const u = evt.utterance || {};
    const role = (u.role || "").toLowerCase();
    // SignalWire labels the two legs relative to the leg that ran the SWML
    // (the A-leg): that leg is "local-caller", the connected-out leg is
    // "remote-caller". The configured customer_role (from /token) describes
    // the OUTBOUND shape — rep dials in (A-leg = local-caller), customer is
    // the connect-out leg (remote-caller) → customer = "remote-caller".
    // INBOUND flips it: the PSTN customer IS the A-leg (local-caller) and the
    // rep is the connect-out (remote-caller). So on inbound we invert the
    // configured role; otherwise the bubbles come out swapped.
    const cfgCustomer = (state.customerRole || "remote-caller").toLowerCase();
    const customerRole = state.callDirection === "inbound"
      ? (cfgCustomer === "remote-caller" ? "local-caller" : "remote-caller")
      : cfgCustomer;
    const kind = role === customerRole ? "customer" : "rep";
    if (u.content) pushBubble(kind, u.content, ts);
    // Side-channel the utterance to the backend so the monitor page can
    // paint a real-time speaker indicator. These events flow from the
    // SignalWire SDK direct to this browser; the backend never sees
    // them without this push.
    //
    // Skip the POST for events the backend already fanned out — they
    // carry origin="monitor_relay". Without this guard we'd POST the
    // synthetic broadcast back, which triggers another broadcast, etc.
    if (role && state.call && state.call.id && evt.origin !== "monitor_relay") {
      fetch(`${API_BASE}/speaker-event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          call_id: state.call.id,
          role,
          content: u.content || "",
        }),
      }).catch(() => {});
    }
  }
  else if (t === "skip")        pushBubble("note", `coach: skip — ${evt.reason || ""}`, ts);
  else if (t === "final") {
    pushBubble("note", `call ended · ${summarize(evt, t)}`, ts);
    // Server-driven teardown. The relay's `final` event is the
    // authoritative "this call is over" signal and it arrives here over
    // /ws/events. The SDK's call.status$ sometimes never delivers a
    // terminal state on a remote-side / abrupt hangup, which leaves the
    // UI stuck on "connected". Flipping the UI here doesn't depend on the
    // SDK. _onCallEnded is idempotent (guarded by _callEndedFired), so if
    // status$ DID already fire this is a no-op; if it didn't, this is what
    // unsticks the page. Single active call at a time, so no id match needed.
    //
    // BUT: on inbound the ai_sidecar emits `final` at bridge time
    // (transcribe_close), long before the call actually ends. Only honor it
    // as a teardown when no call is live — i.e. it's a genuine end-of-call
    // (e.g. a remote hangup where status$ didn't deliver a terminal tick).
    // When a call IS live, the SDK terminal/destroy handlers own teardown.
    if (state.call && !_callLive) _onCallEnded();
  }
  // Authoritative end-of-call from the relay (connect-status `ended`, pushed
  // by the server). Unlike the ai_sidecar `final` (which fires early, at
  // bridge time on inbound), this fires only when the bridged leg actually
  // ends — so force teardown regardless of _callLive. Fixes the pill staying
  // on "call connected" after a hangup the SDK didn't surface a terminal for.
  else if (t === "call_ended") {
    _callLive = false;
    if (state.call) _onCallEnded();
  }
  else if (t === "start")       resetDashboard();
}

function pushInsight(evt, ts) {
  if (!els.coachCard) return;
  const text = evt.raw || "";
  if (!text) return;

  // Hero (current latest)
  if (els.coachListening) els.coachListening.hidden = true;
  if (els.coachEmptyHint) els.coachEmptyHint.hidden = true;
  els.coachCard.hidden = false;
  els.coachText.textContent = text;
  els.coachTs.textContent = evt._source ? `${ts} · ${evt._source}` : ts;
  // re-trigger flash animation
  els.coachCard.style.animation = "none";
  void els.coachCard.offsetWidth; // force reflow
  els.coachCard.style.animation = "";

  // Recent list — newest at top, cap 6
  if (els.coachList) {
    const li = document.createElement("li");
    li.innerHTML = `<span class="li-ts"></span><span class="li-text"></span>`;
    li.querySelector(".li-ts").textContent = ts;
    li.querySelector(".li-text").textContent = text;
    els.coachList.insertBefore(li, els.coachList.firstChild);
    while (els.coachList.children.length > 6) els.coachList.lastChild.remove();
  }
  // Flash stat counter
  if (els.statInsightsWrap) {
    els.statInsightsWrap.classList.remove("flash");
    void els.statInsightsWrap.offsetWidth;
    els.statInsightsWrap.classList.add("flash");
  }
}

const _bubbleSeen = []; // small ring of recent (kind|text) for dedup
function pushBubble(kind, text, ts) {
  if (!els.transcriptStream || !text) return;
  // Dedup: drop exact repeats of the last few bubbles (turn vs utterance overlap).
  const key = `${kind}|${text}`;
  if (_bubbleSeen.includes(key)) return;
  _bubbleSeen.push(key); if (_bubbleSeen.length > 8) _bubbleSeen.shift();

  if (els.transcriptEmpty) els.transcriptEmpty.hidden = true;
  const b = document.createElement("div");
  b.className = `bubble ${kind}`;
  const safe = String(text).replace(/[&<>]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  b.innerHTML = `<div class="bubble-meta">${kind} · ${ts}</div>${safe}`;
  els.transcriptStream.appendChild(b);
  if (!els.transcriptAutoscroll || els.transcriptAutoscroll.checked) {
    els.transcriptStream.scrollTop = els.transcriptStream.scrollHeight;
  }
}

function noteToolCall(evt, ts) {
  // Lightweight inline note so the rep sees "the AI is looking something up"
  // even before the result lands. Result lands separately via tool_result.
  const args = fmtArgs(evt.arguments || {});
  pushBubble("note", `coach is calling ${evt.name}(${args})…`, ts);
}

function pushContextCard(evt, ts) {
  if (!els.contextCards) return;
  if (els.contextEmpty) els.contextEmpty.hidden = true;

  const name = evt.name || "tool";
  const resp = reviveMaybeJSON(evt.response);
  const card = document.createElement("article");
  card.className = "ctx-card fresh";
  setTimeout(() => card.classList.remove("fresh"), 1100);

  // One-line summary depending on tool
  const tag = ({
    lookup_competitor: "competitor",
    get_account_status: "account",
    log_objection: "objection",
    schedule_followup: "followup",
    flag_buying_signal: "signal",
    escalate_to_supervisor: "escalation",
  })[name] || "tool";

  card.innerHTML = `
    <div class="ctx-card-head">
      <span class="ctx-title"></span>
      <span class="ctx-tag ${tag}">${tag}</span>
    </div>
    <div class="ctx-body"></div>
    <div class="ctx-ts" style="margin-top:.3rem;"></div>
  `;
  card.querySelector(".ctx-title").textContent = name;
  card.querySelector(".ctx-ts").textContent = ts;

  const body = card.querySelector(".ctx-body");
  if (resp && typeof resp === "object") {
    const dl = document.createElement("dl");
    Object.entries(resp).forEach(([k, v]) => {
      const dt = document.createElement("dt"); dt.textContent = k;
      const dd = document.createElement("dd");
      if (v && typeof v === "object") {
        // Nested object/array — render as a wrapped <pre> rather than a
        // single overflowing string. Constrained by the CSS rules.
        const pre = document.createElement("pre");
        pre.textContent = JSON.stringify(v, null, 2);
        dd.appendChild(pre);
      } else {
        const text = v == null ? "" : String(v);
        dd.textContent = text;
        // Anything long enough to spill multiple lines gets line-clamped
        // with a click-to-expand handler. Cheaper than measuring height.
        if (text.length > 140) {
          dd.classList.add("long");
          dd.addEventListener("click", () => dd.classList.toggle("expanded"));
        }
      }
      dl.appendChild(dt); dl.appendChild(dd);
    });
    body.appendChild(dl);
  } else {
    const text = String(resp ?? "");
    if (text.length > 200) {
      // Free-form long string at the top level: pre-wrap it.
      const pre = document.createElement("pre");
      pre.textContent = text;
      body.appendChild(pre);
    } else {
      body.textContent = text;
    }
  }
  // Newest on top, cap 5 cards
  els.contextCards.insertBefore(card, els.contextCards.firstChild);
  while (els.contextCards.children.length > 5) els.contextCards.lastChild.remove();
}

function resetDashboard() {
  // Only un-hide the listening orb if a call is actually live. The orb
  // is gated on call state — without that check, a stray `start` event
  // (e.g. arriving after the call already ended) would resurrect it.
  if (els.coachListening) els.coachListening.hidden = !state.call;
  if (els.coachCard) els.coachCard.hidden = true;
  if (els.coachList) els.coachList.innerHTML = "";
  if (els.transcriptStream) {
    els.transcriptStream.querySelectorAll(".bubble").forEach((b) => b.remove());
    if (els.transcriptEmpty) els.transcriptEmpty.hidden = false;
  }
  if (els.contextCards) {
    els.contextCards.querySelectorAll(".ctx-card").forEach((c) => c.remove());
    if (els.contextEmpty) els.contextEmpty.hidden = false;
  }
}

// ====================================================================
// Call duration timer (drives the topbar #call-timer)
// ====================================================================

let callTimerId = 0;
let callTimerStart = 0;
function startCallTimer() {
  if (!els.callTimer) return;
  els.callTimer.hidden = false;
  callTimerStart = Date.now();
  clearInterval(callTimerId);
  const tick = () => {
    const s = Math.floor((Date.now() - callTimerStart) / 1000);
    const mm = String(Math.floor(s / 60));
    const ss = String(s % 60).padStart(2, "0");
    els.callTimer.textContent = `${mm}:${ss}`;
  };
  tick();
  callTimerId = setInterval(tick, 1000);
}
function stopCallTimer() {
  clearInterval(callTimerId); callTimerId = 0;
  if (els.callTimer) els.callTimer.hidden = true;
}

// Drive the call timer off the visible call-state text. setState() writes
// to #call-state.textContent; a MutationObserver lets us react without
// having to patch setState itself (it's a const we can't reassign).
if (els.state) {
  const obs = new MutationObserver(() => {
    const s = (els.state.textContent || "").toLowerCase();
    if (s.includes("active") || s.includes("connected") || s.includes("answered")) {
      if (!callTimerId) startCallTimer();
    } else if (s === "idle" || s.includes("ended") || s.includes("destroyed") || s.includes("hangup")) {
      stopCallTimer();
    }
  });
  obs.observe(els.state, { childList: true, characterData: true, subtree: true });
}

// ----- wiring -------------------------------------------------------

// ----- live audio tap ------------------------------------------------
//
// The SignalWire `tap` SWML verb streams the call's μ-law audio to
// /sidecar/ws/audio on the server. The server fans frames out to any
// /sidecar/ws/audio/listen subscribers. Here we open one such listener,
// decode μ-law → PCM, resample 8 kHz → AudioContext sampleRate, and
// post the samples into the pcm-ring AudioWorklet for playback.

// 256-entry μ-law decode table. Standard G.711 μ-law, output normalised
// to [-1, 1) so it can feed AudioContext Float32 samples directly.
const _MULAW_TABLE = (() => {
  const t = new Float32Array(256);
  for (let b = 0; b < 256; b++) {
    let v = ~b & 0xff;
    const sign = v & 0x80 ? -1 : 1;
    const exponent = (v >> 4) & 0x07;
    const mantissa = v & 0x0f;
    const sample = sign * (((mantissa << 3) + 0x84) << exponent) - sign * 0x84;
    t[b] = sample / 32768; // 16-bit PCM range
  }
  return t;
})();

function _mulawDecode(bytes) {
  const out = new Float32Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) out[i] = _MULAW_TABLE[bytes[i]];
  return out;
}

// Linear-interpolated upsample 8 kHz → outRate. AudioContext rate is
// typically 48 kHz, sometimes 44.1 kHz; we don't assume. Good enough for
// voice — perceptual quality past ~24 kHz reconstruction is bounded by
// the 4 kHz μ-law passband anyway.
function _resampleTo(audioCtxRate, src) {
  const ratio = audioCtxRate / 8000;
  const outLen = Math.floor(src.length * ratio);
  const out = new Float32Array(outLen);
  for (let i = 0; i < outLen; i++) {
    const srcPos = i / ratio;
    const i0 = Math.floor(srcPos);
    const i1 = Math.min(i0 + 1, src.length - 1);
    const frac = srcPos - i0;
    out[i] = src[i0] * (1 - frac) + src[i1] * frac;
  }
  return out;
}

async function _ensureAudioWorklet() {
  if (!state.audioContext) {
    state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Some browsers create the context in 'suspended' state until a user
  // gesture. We're called from a click handler so resume() will succeed.
  if (state.audioContext.state === "suspended") await state.audioContext.resume();
  if (!state.audioTap.workletReady) {
    state.audioTap.workletReady = state.audioContext.audioWorklet.addModule(
      `./audio_worklet.js?v=${Date.now()}`
    );
  }
  await state.audioTap.workletReady;
}

async function connectAudioListener() {
  if (state.audioTap.ws) return; // already on
  const ticket = state.wsTicket;
  if (!ticket) { setState("listen unavailable — no ws ticket"); return; }

  await _ensureAudioWorklet();

  const ctx = state.audioContext;
  if (!state.audioTap.workletNode) {
    const node = new AudioWorkletNode(ctx, "pcm-ring", {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [1],
    });
    node.connect(ctx.destination);
    state.audioTap.workletNode = node;
  } else {
    state.audioTap.workletNode.port.postMessage({ cmd: "reset" });
  }

  const proto = location.protocol === "https:" ? "wss:" : "ws:";
  const url = `${proto}//${location.host}${API_BASE}/ws/audio/listen`
    + `?ticket=${encodeURIComponent(ticket)}`;
  const ws = new WebSocket(url);
  ws.binaryType = "arraybuffer";
  ws.onmessage = (ev) => {
    if (!(ev.data instanceof ArrayBuffer)) return;
    const pcm = _mulawDecode(new Uint8Array(ev.data));
    const upsampled = _resampleTo(ctx.sampleRate, pcm);
    state.audioTap.workletNode.port.postMessage(upsampled, [upsampled.buffer]);
  };
  ws.onclose = () => {
    if (state.audioTap.ws === ws) state.audioTap.ws = null;
    if (els.btnListen) els.btnListen.classList.remove("active");
  };
  ws.onerror = (e) => console.warn("[sidecar] audio listen ws error:", e);
  state.audioTap.ws = ws;
  if (els.btnListen) els.btnListen.classList.add("active");
  setState("listening to call audio");
}

function disconnectAudioListener() {
  const ws = state.audioTap.ws;
  state.audioTap.ws = null;
  try { ws?.close(); } catch {}
  if (els.btnListen) els.btnListen.classList.remove("active");
  state.audioTap.workletNode?.port?.postMessage({ cmd: "reset" });
}

function toggleListen() {
  if (state.audioTap.ws) disconnectAudioListener();
  else connectAudioListener();
}

els.btnConnect.addEventListener("click", connect);
els.btnOnline.addEventListener("click", toggleOnline);
els.btnDial.addEventListener("click", dial);
els.btnMute.addEventListener("click", toggleMute);
els.btnHangup.addEventListener("click", hangup);
els.btnAccept.addEventListener("click", acceptInvite);
els.btnReject.addEventListener("click", rejectInvite);
els.btnListen?.addEventListener("click", toggleListen);
els.btnNewCall?.addEventListener("click", () => {
  // Clear the dashboard back to its empty-state look (transcript, coach
  // history, context cards, stats). The Connect/Online/Dial flow itself
  // is unaffected — the user is just clearing the previous call's debris.
  resetDashboard();
  state.stats = { insights: 0, skips: 0, tools: 0, errors: 0 };
  els.stats.insights.textContent = "0";
  els.stats.skips.textContent = "0";
  els.stats.tools.textContent = "0";
  els.stats.errors.textContent = "0";
  if (els.postCall) els.postCall.hidden = true;
  setState("ready to dial");
});
els.btnClear.addEventListener("click", () => { els.events.innerHTML = ""; });
els.showRaw.addEventListener("change", () => {
  document.querySelectorAll("#events li").forEach((li) => li.classList.toggle("expanded", els.showRaw.checked));
});
els.filterText.addEventListener("input", () => {
  const f = els.filterText.value.trim().toLowerCase();
  document.querySelectorAll("#events li").forEach((li) => {
    li.style.display = !f || li.textContent.toLowerCase().includes(f) ? "" : "none";
  });
});

els.btnDial.disabled = true;
els.btnOnline.disabled = true;
els.btnMute.disabled = true;
els.btnHangup.disabled = true;

openWS();
