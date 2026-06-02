var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/chat/index.ts
var chat_exports = {};
__export(chat_exports, {
  ChatMember: () => ChatMember,
  ChatMessage: () => ChatMessage,
  Client: () => Client2
});

// src/createClient.ts
import {
  configureStore,
  connect as connect6,
  getEventEmitter
} from "@signalwire/core";

// src/Client.ts
import {
  BaseClient,
  actions as actions3,
  Chat as ChatNamespace,
  PubSub as PubSubNamespace
} from "@signalwire/core";

// src/features/mediaElements/mediaElementsSagas.ts
import {
  getLogger,
  actions as actions2,
  sagaEffects,
  LOCAL_EVENT_PREFIX
} from "@signalwire/core";
import { setMediaElementSinkId } from "@signalwire/webrtc";

// src/utils/audioElement.ts
var setAudioMediaTrack = ({
  track,
  element
}) => {
  element.autoplay = true;
  element.playsinline = true;
  element.srcObject = new MediaStream([track]);
  track.addEventListener("ended", () => {
    element.srcObject = null;
    element.remove();
  });
  return element;
};

// src/features/actions.ts
import { actions } from "@signalwire/core";
var audioSetSpeakerAction = actions.createAction(
  "swJs/audioSetSpeakerAction"
);

// src/features/mediaElements/mediaElementsSagas.ts
var makeAudioElementSaga = ({ speakerId }) => {
  return function* audioElementSaga({
    instance: room,
    runSaga
  }) {
    if (typeof Audio === "undefined") {
      getLogger().warn("`Audio` is not supported on this environment.");
      return;
    }
    try {
      const audioEl = room.getAudioEl();
      let audioTask;
      const trackHandler = function(event) {
        switch (event.track.kind) {
          case "audio": {
            audioTask = runSaga(audioElementSetupWorker, {
              track: event.track,
              element: audioEl,
              speakerId,
              room
            });
            break;
          }
        }
      };
      room.on("track", trackHandler);
      room.once("destroy", () => {
        audioTask == null ? void 0 : audioTask.cancel();
      });
    } catch (error) {
      getLogger().error("audioElementSaga", error);
    }
  };
};
function* audioElementActionsWatcher({
  element,
  room
}) {
  const setSpeakerActionType = actions2.getCustomSagaActionType(
    room.__uuid,
    audioSetSpeakerAction
  );
  while (true) {
    const action = yield sagaEffects.take([setSpeakerActionType]);
    try {
      switch (action.type) {
        case setSpeakerActionType:
          const response = yield sagaEffects.call(
            setMediaElementSinkId,
            element,
            action.payload
          );
          room.emit(
            // @ts-expect-error
            `${LOCAL_EVENT_PREFIX}.speaker.updated`,
            action.payload
          );
          room.settleCustomSagaTrigger({
            dispatchId: action.dispatchId,
            payload: response,
            kind: "resolve"
          });
          break;
      }
    } catch (error) {
      room.settleCustomSagaTrigger({
        dispatchId: action.dispatchId,
        payload: error,
        kind: "reject"
      });
      getLogger().error(error);
    }
  }
}
function* audioElementSetupWorker({
  track,
  element,
  speakerId,
  room
}) {
  setAudioMediaTrack({ track, element });
  if (speakerId) {
    setMediaElementSinkId(element, speakerId).catch(() => {
    });
  }
  yield sagaEffects.fork(audioElementActionsWatcher, {
    element,
    room
  });
}

// src/cantina/VideoManager.ts
import {
  connect,
  validateEventsToSubscribe,
  BaseConsumer
} from "@signalwire/core";

// src/cantina/workers/videoManagerWorker.ts
import { getLogger as getLogger4, sagaEffects as sagaEffects2 } from "@signalwire/core";

// src/cantina/workers/videoManagerRoomsWorker.ts
import {
  getLogger as getLogger2,
  toExternalJSON,
  stripNamespacePrefix
} from "@signalwire/core";
var videoManagerRoomsWorker = function* (options) {
  getLogger2().trace("videoManagerRoomsWorker started");
  const {
    instance: client,
    action: { type, payload }
  } = options;
  const modPayload = {
    rooms: payload.rooms.map((row) => toExternalJSON(row))
  };
  client.emit(
    stripNamespacePrefix(type),
    // @ts-expect-error
    modPayload
  );
  getLogger2().trace("videoManagerRoomsWorker ended");
};

// src/cantina/workers/videoManagerRoomWorker.ts
import {
  getLogger as getLogger3,
  toExternalJSON as toExternalJSON2,
  stripNamespacePrefix as stripNamespacePrefix2
} from "@signalwire/core";
var videoManagerRoomWorker = function* (options) {
  getLogger3().trace("videoManagerRoomWorker started");
  const {
    instance: client,
    action: { type, payload }
  } = options;
  client.emit(
    stripNamespacePrefix2(type),
    toExternalJSON2(payload)
  );
  getLogger3().trace("videoManagerRoomWorker ended");
};

// src/cantina/workers/videoManagerWorker.ts
var videoManagerWorker = function* (options) {
  getLogger4().trace("videoManagerWorker started");
  const {
    channels: { swEventChannel }
  } = options;
  function* worker(action) {
    const { type } = action;
    switch (type) {
      case "video-manager.rooms.subscribed":
        yield sagaEffects2.fork(videoManagerRoomsWorker, __spreadValues({
          action
        }, options));
        break;
      case "video-manager.room.added":
      case "video-manager.room.deleted":
      case "video-manager.room.ended":
      case "video-manager.room.started":
      case "video-manager.room.updated":
        yield sagaEffects2.fork(videoManagerRoomWorker, __spreadValues({
          action
        }, options));
        break;
      default:
        getLogger4().warn(`Unknown video-manager event: "${type}"`);
        break;
    }
  }
  while (true) {
    const action = yield sagaEffects2.take(
      swEventChannel,
      (action2) => {
        return action2.type.startsWith("video-manager.");
      }
    );
    yield sagaEffects2.fork(worker, action);
  }
  getLogger4().trace("videoManagerWorker ended");
};

// src/cantina/VideoManager.ts
var VideoManagerAPI = class extends BaseConsumer {
  constructor(options) {
    super(options);
    this.runWorker("videoManagerWorker", {
      worker: videoManagerWorker
    });
  }
  /** @internal */
  getSubscriptions() {
    const eventNamesWithPrefix = this.eventNames().map(
      (event) => `video-manager.${event}`
    );
    return validateEventsToSubscribe(eventNamesWithPrefix);
  }
};
var createVideoManagerObject = (params) => {
  const manager = connect({
    store: params.store,
    Component: VideoManagerAPI
  })(params);
  const proxy = new Proxy(manager, {
    get(target, property, receiver) {
      if (property === "_eventsNamespace") {
        return "";
      } else if (property === "eventChannel") {
        return "video-manager.rooms";
      }
      return Reflect.get(target, property, receiver);
    }
  });
  return proxy;
};

// src/buildVideoElement.ts
import {
  getLogger as getLogger20,
  uuid as uuid2
} from "@signalwire/core";

// src/utils/videoElement.ts
import {
  getLogger as getLogger19,
  debounce,
  uuid
} from "@signalwire/core";

// src/VideoOverlays.ts
import { getLogger as getLogger18 } from "@signalwire/core";

// src/video/VideoRoomSession.ts
import {
  connect as connect3,
  extendComponent as extendComponent3,
  Rooms as Rooms6,
  validateEventsToSubscribe as validateEventsToSubscribe3
} from "@signalwire/core";

// src/BaseRoomSession.ts
import {
  connect as connect2,
  LOCAL_EVENT_PREFIX as LOCAL_EVENT_PREFIX2
} from "@signalwire/core";
import {
  BaseConnection as BaseConnection2,
  createSpeakerDeviceWatcher,
  getDisplayMedia,
  getSpeakerById,
  supportsMediaOutput
} from "@signalwire/webrtc";

// src/utils/constants.ts
var SCREENSHARE_AUDIO_CONSTRAINTS = {
  echoCancellation: true,
  noiseSuppression: false,
  autoGainControl: false,
  // @ts-expect-error
  googAutoGainControl: false
};

// src/utils/roomSession.ts
import { getLogger as getLogger5 } from "@signalwire/core";
var getJoinMediaParams = (options) => {
  const {
    authorization,
    audio = true,
    video = true,
    sendAudio,
    sendVideo,
    receiveAudio,
    receiveVideo
  } = options;
  getLogger5().debug("getJoinMediaParams options", __spreadValues({}, options));
  const { audio_allowed, video_allowed, join_as } = authorization;
  const joinAs = join_as != null ? join_as : "member";
  const canSend = joinAs === "member";
  const canSendAudio = canSend && audio_allowed === "both";
  const canSendVideo = canSend && video_allowed === "both";
  const canReceiveAudio = audio_allowed !== "none";
  const canReceiveVideo = video_allowed !== "none";
  const reqToSendAudio = Boolean(sendAudio != null ? sendAudio : audio);
  const reqToSendVideo = Boolean(sendVideo != null ? sendVideo : video);
  const reqToReceiveAudio = Boolean(receiveAudio != null ? receiveAudio : audio);
  const reqToReceiveVideo = Boolean(receiveVideo != null ? receiveVideo : video);
  if (!canSendAudio && reqToSendAudio) {
    getLogger5().info(
      "Not allowed to send audio on this room. Default values will be used."
    );
  }
  if (!canSendVideo && reqToSendVideo) {
    getLogger5().info(
      "Not allowed to send video on this room. Default values will be used."
    );
  }
  if (!canReceiveAudio && reqToReceiveAudio) {
    getLogger5().info(
      "Not allowed to receive video from the room. Default values will be used."
    );
  }
  if (!canReceiveVideo && reqToReceiveVideo) {
    getLogger5().info(
      "Not allowed to receive video from the room. Default values will be used."
    );
  }
  return {
    mustSendAudio: canSendAudio && reqToSendAudio,
    mustSendVideo: canSendVideo && reqToSendVideo,
    mustRecvAudio: canReceiveAudio && reqToReceiveAudio,
    mustRecvVideo: canReceiveVideo && reqToReceiveVideo
  };
};
var checkMediaParams = (options) => {
  return Object.values(options).some(Boolean);
};
var SDK_PREFIX = "sw-sdk-";
var addSDKPrefix = (id) => {
  return `${SDK_PREFIX}${id}`;
};
var OVERLAY_PREFIX = "sw-overlay-";
var addOverlayPrefix = (id) => {
  return `${OVERLAY_PREFIX}${id}`;
};

// src/RoomSessionScreenShare.ts
import {
  Rooms,
  extendComponent
} from "@signalwire/core";
import { BaseConnection } from "@signalwire/webrtc";
var RoomSessionScreenShareConnection = class extends BaseConnection {
  join() {
    return super.invite();
  }
  leave() {
    return super.hangup();
  }
};
var RoomSessionScreenShareAPI = extendComponent(RoomSessionScreenShareConnection, {
  audioMute: Rooms.audioMuteMember,
  audioUnmute: Rooms.audioUnmuteMember,
  videoMute: Rooms.videoMuteMember,
  videoUnmute: Rooms.videoUnmuteMember,
  setMicrophoneVolume: Rooms.setInputVolumeMember,
  setInputVolume: Rooms.setInputVolumeMember,
  setInputSensitivity: Rooms.setInputSensitivityMember
});

// src/video/workers/memberListUpdatedWorker.ts
import {
  sagaEffects as sagaEffects3,
  toSyntheticEvent,
  validateEventsToSubscribe as validateEventsToSubscribe2,
  toInternalEventName
} from "@signalwire/core";
var noop = () => {
};
var EXTERNAL_MEMBER_LIST_UPDATED_EVENT = "memberList.updated";
var INTERNAL_MEMBER_LIST_UPDATED_EVENT = toInternalEventName({
  event: EXTERNAL_MEMBER_LIST_UPDATED_EVENT
});
var SYNTHETIC_MEMBER_LIST_UPDATED_EVENT = toSyntheticEvent(
  INTERNAL_MEMBER_LIST_UPDATED_EVENT
);
var MEMBER_LIST_EVENTS = [
  /** Alias to `video.room.subscribed` */
  "video.room.joined",
  "video.member.joined",
  "video.member.left",
  "video.member.updated"
];
var isMemberListEvent = (event) => {
  return MEMBER_LIST_EVENTS.includes(event);
};
var getMemberListEventsToSubscribe = (subscriptions) => {
  return validateEventsToSubscribe2(MEMBER_LIST_EVENTS).filter((event) => {
    return !subscriptions.includes(event);
  });
};
var shouldHandleMemberList = (subscriptions) => {
  return subscriptions.some(
    (event) => event.includes(EXTERNAL_MEMBER_LIST_UPDATED_EVENT)
  );
};
var getMembersFromAction = (action) => {
  if (action.type === "video.room.joined") {
    return action.payload.room_session.members;
  }
  return [action.payload.member];
};
var getUpdatedMembers = ({
  action,
  memberList
}) => {
  const actionMembers = getMembersFromAction(action);
  switch (action.type) {
    case "video.member.left":
      actionMembers.forEach((member) => {
        memberList.delete(member.id);
      });
      break;
    default:
      actionMembers.forEach((member) => {
        memberList.set(member.id, member);
      });
  }
  return Array.from(memberList.values());
};
var initMemberListSubscriptions = (room, subscriptions) => {
  const events = getMemberListEventsToSubscribe(subscriptions);
  events.forEach((event) => {
    room.once(event, noop);
  });
  const eventBridgeHandler = ({ members }) => {
    room.emit(EXTERNAL_MEMBER_LIST_UPDATED_EVENT, { members });
  };
  room.on(SYNTHETIC_MEMBER_LIST_UPDATED_EVENT, eventBridgeHandler);
  const cleanup = () => {
    room.off(SYNTHETIC_MEMBER_LIST_UPDATED_EVENT, eventBridgeHandler);
  };
  return {
    cleanup
  };
};
function* membersListUpdatedWatcher({
  swEventChannel,
  instance
}) {
  const memberList = /* @__PURE__ */ new Map();
  function* worker(pubSubAction) {
    const roomSessionId = pubSubAction.type === "video.room.joined" ? pubSubAction.payload.room_session.id : pubSubAction.payload.room_session_id;
    const members = getUpdatedMembers({ action: pubSubAction, memberList });
    const memberListPayload = {
      /**
       * At this point it's needed to send the
       * `room_session_id` so the pubSubSaga can properly
       * infer the namespace for emitting the events to the
       * appropiate room.
       */
      room_session_id: roomSessionId,
      members
    };
    instance.emit(SYNTHETIC_MEMBER_LIST_UPDATED_EVENT, memberListPayload);
  }
  while (true) {
    const pubSubAction = yield sagaEffects3.take(
      swEventChannel,
      ({ type }) => {
        return isMemberListEvent(type);
      }
    );
    yield sagaEffects3.fork(worker, pubSubAction);
  }
}
var memberListUpdatedWorker = function* membersChangedWorker({
  channels: { swEventChannel },
  instance
}) {
  const subscriptions = instance.getSubscriptions();
  if (!shouldHandleMemberList(subscriptions)) {
    return;
  }
  const { cleanup } = initMemberListSubscriptions(instance, subscriptions);
  yield sagaEffects3.fork(membersListUpdatedWatcher, {
    swEventChannel,
    instance
  });
  instance.once("destroy", () => {
    cleanup();
  });
};

// src/video/workers/childMemberJoinedWorker.ts
import {
  getLogger as getLogger6,
  sagaEffects as sagaEffects4,
  componentSelectors,
  componentActions
} from "@signalwire/core";
var childMemberJoinedWorker = function* (options) {
  getLogger6().trace("childMemberJoinedWorker started");
  const { channels, instance, initialState, onDone, onFail } = options;
  const { swEventChannel } = channels;
  const { parentId } = initialState;
  if (!parentId) {
    throw new Error("Missing parentId for childMemberJoinedWorker");
  }
  const action = yield sagaEffects4.take(swEventChannel, (action2) => {
    if (action2.type === "video.member.joined") {
      return action2.payload.member.parent_id === parentId;
    }
    return false;
  });
  const { member } = action.payload;
  if (member == null ? void 0 : member.parent_id) {
    const byId = yield sagaEffects4.select(
      componentSelectors.getComponentsById
    );
    const parent = Object.values(byId).find((row) => {
      return "memberId" in row && row.memberId === member.parent_id;
    });
    if (parent) {
      yield sagaEffects4.put(
        componentActions.upsert({
          id: instance.callId,
          roomId: action.payload.room_id,
          roomSessionId: action.payload.room_session_id,
          memberId: member.id
        })
      );
      onDone == null ? void 0 : onDone();
    } else {
      onFail == null ? void 0 : onFail({ error: new Error("Unknown parent_id") });
    }
  }
  getLogger6().trace("childMemberJoinedWorker ended");
};

// src/video/workers/videoWorker.ts
import {
  getLogger as getLogger10,
  sagaEffects as sagaEffects5,
  MemberPosition,
  stripNamespacePrefix as stripNamespacePrefix5
} from "@signalwire/core";

// src/video/workers/videoStreamWorker.ts
import {
  getLogger as getLogger7,
  Rooms as Rooms2
} from "@signalwire/core";
var videoStreamWorker = function* (options) {
  getLogger7().trace("videoStreamWorker started");
  const {
    instance: roomSession,
    action: { type, payload },
    instanceMap: { get, set, remove }
  } = options;
  let streamInstance = get(payload.stream.id);
  if (!streamInstance) {
    streamInstance = Rooms2.createRoomSessionStreamObject({
      store: roomSession.store,
      payload
    });
  } else {
    streamInstance.setPayload(payload);
  }
  set(payload.stream.id, streamInstance);
  switch (type) {
    case "video.stream.started":
      roomSession.emit("stream.started", streamInstance);
      break;
    case "video.stream.ended":
      roomSession.emit("stream.ended", streamInstance);
      remove(payload.stream.id);
      break;
    default:
      getLogger7().warn(`Unknown video.stream event: "${type}"`);
      break;
  }
  getLogger7().trace("videoStreamWorker ended");
};

// src/video/workers/videoRecordWorker.ts
import {
  getLogger as getLogger8,
  Rooms as Rooms3,
  stripNamespacePrefix as stripNamespacePrefix3
} from "@signalwire/core";
var videoRecordWorker = function* (options) {
  getLogger8().trace("videoRecordWorker started");
  const {
    instance: roomSession,
    action: { type, payload },
    instanceMap: { get, set, remove }
  } = options;
  let recordingInstance = get(payload.recording.id);
  if (!recordingInstance) {
    recordingInstance = Rooms3.createRoomSessionRecordingObject({
      store: roomSession.store,
      payload
    });
  } else {
    recordingInstance.setPayload(payload);
  }
  set(payload.recording.id, recordingInstance);
  const event = stripNamespacePrefix3(type);
  switch (type) {
    case "video.recording.started":
    case "video.recording.updated": {
      roomSession.emit(event, recordingInstance);
      break;
    }
    case "video.recording.ended":
      roomSession.emit(event, recordingInstance);
      remove(payload.recording.id);
      break;
    default:
      getLogger8().warn(`Unknown video.stream event: "${type}"`);
      break;
  }
  getLogger8().trace("videoRecordWorker ended");
};

// src/video/workers/videoPlaybackWorker.ts
import {
  getLogger as getLogger9,
  Rooms as Rooms4,
  stripNamespacePrefix as stripNamespacePrefix4
} from "@signalwire/core";
var videoPlaybackWorker = function* (options) {
  getLogger9().trace("videoPlaybackWorker started");
  const {
    instance: roomSession,
    action: { type, payload },
    instanceMap: { get, set, remove }
  } = options;
  let playbackInstance = get(payload.playback.id);
  if (!playbackInstance) {
    playbackInstance = Rooms4.createRoomSessionPlaybackObject({
      store: roomSession.store,
      payload
    });
  } else {
    playbackInstance.setPayload(payload);
  }
  set(payload.playback.id, playbackInstance);
  const event = stripNamespacePrefix4(type);
  switch (type) {
    case "video.playback.started":
    case "video.playback.updated": {
      roomSession.emit(event, playbackInstance);
      break;
    }
    case "video.playback.ended":
      roomSession.emit(event, playbackInstance);
      remove(payload.playback.id);
      break;
    default:
      getLogger9().warn(`Unknown video.stream event: "${type}"`);
      break;
  }
  getLogger9().trace("videoPlaybackWorker ended");
};

// src/video/workers/videoWorker.ts
var videoWorker = function* (options) {
  getLogger10().trace("videoWorker started");
  const { channels, instance: roomSession } = options;
  const { swEventChannel } = channels;
  function* worker(action) {
    const { type, payload } = action;
    switch (type) {
      case "video.room.subscribed":
        yield sagaEffects5.fork(MemberPosition.memberPositionWorker, __spreadProps(__spreadValues({}, options), {
          instance: roomSession,
          initialState: payload
        }));
        return;
      case "video.playback.started":
      case "video.playback.updated":
      case "video.playback.ended":
        yield sagaEffects5.fork(videoPlaybackWorker, __spreadValues({
          action
        }, options));
        return;
      // Return since we don't need to handle the raw event for this
      case "video.recording.started":
      case "video.recording.updated":
      case "video.recording.ended":
        yield sagaEffects5.fork(videoRecordWorker, __spreadValues({
          action
        }, options));
        return;
      case "video.stream.ended":
      case "video.stream.started":
        yield sagaEffects5.fork(videoStreamWorker, __spreadValues({
          action
        }, options));
        return;
      case "video.room.audience_count": {
        roomSession.emit("room.audienceCount", payload);
        return;
      }
      case "video.member.talking": {
        const { member } = payload;
        if ("talking" in member) {
          const suffix = member.talking ? "started" : "ended";
          roomSession.emit(`member.talking.${suffix}`, payload);
          const deprecatedSuffix = member.talking ? "start" : "stop";
          roomSession.emit(`member.talking.${deprecatedSuffix}`, payload);
        }
        break;
      }
      case "video.layout.changed": {
        roomSession.currentLayoutEvent = action.payload;
        break;
      }
      default:
        break;
    }
    const event = stripNamespacePrefix5(type, "video");
    roomSession.emit(event, payload);
  }
  const isVideoEvent = (action) => {
    return action.type.startsWith("video.");
  };
  while (true) {
    const action = yield sagaEffects5.take(
      swEventChannel,
      isVideoEvent
    );
    yield sagaEffects5.fork(worker, action);
  }
  getLogger10().trace("videoWorker ended");
};

// src/BaseRoomSession.ts
var BaseRoomSessionConnection = class extends BaseConnection2 {
  constructor() {
    super(...arguments);
    __publicField(this, "_screenShareList", /* @__PURE__ */ new Set());
    __publicField(this, "_audioEl");
    __publicField(this, "_overlayMap");
    __publicField(this, "_localVideoOverlay");
  }
  get audioEl() {
    return this._audioEl;
  }
  set overlayMap(map) {
    this._overlayMap = map;
  }
  get overlayMap() {
    return this._overlayMap;
  }
  set localVideoOverlay(overlay) {
    this._localVideoOverlay = overlay;
  }
  get localVideoOverlay() {
    return this._localVideoOverlay;
  }
  get screenShareList() {
    return Array.from(this._screenShareList);
  }
  _attachSpeakerTrackListener() {
    if (!supportsMediaOutput()) return;
    createSpeakerDeviceWatcher().then((deviceWatcher) => {
      deviceWatcher.on("removed", async (data) => {
        var _a, _b;
        const sinkId = this._audioEl.sinkId;
        const disconnectedSpeaker = data.changes.find((device) => {
          const payloadDeviceId = device.payload.deviceId;
          return payloadDeviceId === sinkId || payloadDeviceId === "" && sinkId === "default" || payloadDeviceId === "default" && sinkId === "";
        });
        if (disconnectedSpeaker) {
          this.emit("speaker.disconnected", {
            deviceId: disconnectedSpeaker.payload.deviceId,
            label: disconnectedSpeaker.payload.label
          });
          await ((_b = (_a = this._audioEl).setSinkId) == null ? void 0 : _b.call(_a, ""));
          const defaultSpeakers = await getSpeakerById("default");
          if (!(defaultSpeakers == null ? void 0 : defaultSpeakers.deviceId)) return;
          this.emit("speaker.updated", {
            previous: {
              deviceId: disconnectedSpeaker.payload.deviceId,
              label: disconnectedSpeaker.payload.label
            },
            current: {
              deviceId: defaultSpeakers.deviceId,
              label: defaultSpeakers.label
            }
          });
        }
      });
    });
  }
  /** @internal */
  _finalize() {
    this._screenShareList.clear();
    super._finalize();
  }
  /** @internal */
  async hangup(id) {
    this._screenShareList.forEach((screenShare) => {
      screenShare.leave();
    });
    return super.hangup(id);
  }
  leave() {
    return this.hangup();
  }
  /**
   * This method will be called by `join()` right before the
   * `connect()` happens and it's a way for us to control
   * exactly when the workers are attached.
   * @internal
   */
  attachPreConnectWorkers() {
    this.runWorker("memberListUpdated", {
      worker: memberListUpdatedWorker
    });
  }
  /** @internal */
  getAudioEl() {
    if (this._audioEl) return this._audioEl;
    this._audioEl = new Audio();
    this._attachSpeakerTrackListener();
    return this._audioEl;
  }
  getMemberOverlay(memberId) {
    return this.overlayMap.get(addOverlayPrefix(memberId));
  }
  /**
   * Allow sharing the screen within the room.
   */
  async startScreenShare(opts = {}) {
    return new Promise(async (resolve, reject) => {
      var _a;
      const {
        autoJoin = true,
        audio = false,
        video = true,
        layout,
        positions
      } = opts;
      try {
        const displayStream = await getDisplayMedia({
          audio: audio === true ? SCREENSHARE_AUDIO_CONSTRAINTS : audio,
          video
        });
        const options = __spreadProps(__spreadValues({}, this.options), {
          screenShare: true,
          recoverCall: false,
          localStream: displayStream,
          remoteStream: void 0,
          userVariables: __spreadProps(__spreadValues({}, ((_a = this.options) == null ? void 0 : _a.userVariables) || {}), {
            memberCallId: this.callId,
            memberId: this.memberId
          }),
          layout,
          positions
        });
        const screenShare = connect2({
          store: this.store,
          Component: RoomSessionScreenShareAPI
        })(options);
        displayStream.getVideoTracks().forEach((t) => {
          t.addEventListener("ended", () => {
            if (screenShare && screenShare.active) {
              screenShare.leave();
            }
          });
        });
        screenShare.once("destroy", () => {
          screenShare.emit("room.left");
          this._screenShareList.delete(screenShare);
        });
        screenShare.runWorker("childMemberJoinedWorker", {
          worker: childMemberJoinedWorker,
          onDone: () => resolve(screenShare),
          onFail: reject,
          initialState: {
            parentId: this.memberId
          }
        });
        this._screenShareList.add(screenShare);
        if (autoJoin) {
          return await screenShare.join();
        }
        return resolve(screenShare);
      } catch (error) {
        this.logger.error("ScreenShare Error", error);
        reject(error);
      }
    });
  }
  updateSpeaker({ deviceId }) {
    const prevId = this.audioEl.sinkId;
    this.once(
      // @ts-expect-error
      `${LOCAL_EVENT_PREFIX2}.speaker.updated`,
      async (newId) => {
        const prevSpeaker = await getSpeakerById(prevId);
        const newSpeaker = await getSpeakerById(newId);
        const isSame = (newSpeaker == null ? void 0 : newSpeaker.deviceId) === (prevSpeaker == null ? void 0 : prevSpeaker.deviceId);
        if (!(newSpeaker == null ? void 0 : newSpeaker.deviceId) || isSame) return;
        this.emit("speaker.updated", {
          previous: {
            deviceId: prevSpeaker == null ? void 0 : prevSpeaker.deviceId,
            label: prevSpeaker == null ? void 0 : prevSpeaker.label
          },
          current: {
            deviceId: newSpeaker.deviceId,
            label: newSpeaker.label
          }
        });
      }
    );
    return this.triggerCustomSaga(audioSetSpeakerAction(deviceId));
  }
};

// src/RoomSessionDevice.ts
import {
  Rooms as Rooms5,
  extendComponent as extendComponent2
} from "@signalwire/core";
import { BaseConnection as BaseConnection3 } from "@signalwire/webrtc";
var RoomSessionDeviceConnection = class extends BaseConnection3 {
  join() {
    return super.invite();
  }
  leave() {
    return super.hangup();
  }
};
var RoomSessionDeviceAPI = extendComponent2(RoomSessionDeviceConnection, {
  audioMute: Rooms5.audioMuteMember,
  audioUnmute: Rooms5.audioUnmuteMember,
  videoMute: Rooms5.videoMuteMember,
  videoUnmute: Rooms5.videoUnmuteMember,
  setInputVolume: Rooms5.setInputVolumeMember,
  setMicrophoneVolume: Rooms5.setInputVolumeMember,
  setInputSensitivity: Rooms5.setInputSensitivityMember
});

// src/video/VideoRoomSession.ts
var VideoRoomSessionConnection = class extends BaseRoomSessionConnection {
  constructor(options) {
    super(options);
    __publicField(this, "_deviceList", /* @__PURE__ */ new Set());
    __publicField(this, "_currentLayoutEvent");
    this.initWorker();
  }
  set currentLayoutEvent(event) {
    this._currentLayoutEvent = event;
  }
  get currentLayoutEvent() {
    return this._currentLayoutEvent;
  }
  get currentLayout() {
    var _a;
    return (_a = this._currentLayoutEvent) == null ? void 0 : _a.layout;
  }
  get currentPosition() {
    var _a, _b;
    return (_b = (_a = this._currentLayoutEvent) == null ? void 0 : _a.layout.layers.find(
      (layer) => layer.member_id === this.memberId
    )) == null ? void 0 : _b.position;
  }
  get deviceList() {
    return Array.from(this._deviceList);
  }
  get interactivityMode() {
    return this.select(({ session }) => {
      var _a;
      const { authorization } = session;
      return (_a = authorization == null ? void 0 : authorization.join_as) != null ? _a : "";
    });
  }
  get permissions() {
    return this.select(({ session }) => {
      var _a, _b;
      const { authorization } = session;
      return (_b = (_a = authorization == null ? void 0 : authorization.room) == null ? void 0 : _a.scopes) != null ? _b : [];
    });
  }
  initWorker() {
    this.runWorker("videoWorker", {
      worker: videoWorker
    });
  }
  /** @internal */
  getSubscriptions() {
    const eventNamesWithPrefix = this.eventNames().map((event) => {
      return `video.${String(event)}`;
    });
    return validateEventsToSubscribe3(
      eventNamesWithPrefix
    );
  }
  /** @internal */
  _finalize() {
    this._deviceList.clear();
    super._finalize();
  }
  /** @internal */
  async hangup(id) {
    this._deviceList.forEach((device) => {
      device.leave();
    });
    return super.hangup(id);
  }
  join() {
    return super.invite();
  }
  /**
   * @deprecated Use {@link getLayouts} instead. `getLayoutList` will
   * be removed in v3.0.0
   */
  getLayoutList() {
    return this.getLayouts();
  }
  /**
   * @deprecated Use {@link getMembers} instead. `getMemberList` will
   * be removed in v3.0.0
   */
  getMemberList() {
    return this.getMembers();
  }
  /** @deprecated Use {@link startScreenShare} instead. */
  async createScreenShareObject(opts = {}) {
    return this.startScreenShare(opts);
  }
  /**
   * Allow to add a camera to the room.
   */
  addCamera(opts = {}) {
    const _a = opts, { autoJoin = true } = _a, video = __objRest(_a, ["autoJoin"]);
    return this.addDevice({
      autoJoin,
      video
    });
  }
  /**
   * Allow to add a microphone to the room.
   */
  addMicrophone(opts = {}) {
    const _a = opts, { autoJoin = true } = _a, audio = __objRest(_a, ["autoJoin"]);
    return this.addDevice({
      autoJoin,
      audio
    });
  }
  /**
   * Allow to add additional devices to the room like cameras or microphones.
   */
  async addDevice(opts = {}) {
    return new Promise(async (resolve, reject) => {
      var _a;
      const { autoJoin = true, audio = false, video = false } = opts;
      if (!audio && !video) {
        throw new TypeError(
          "At least one of `audio` or `video` must be requested."
        );
      }
      const options = __spreadProps(__spreadValues({}, this.options), {
        localStream: void 0,
        remoteStream: void 0,
        audio,
        video,
        additionalDevice: true,
        recoverCall: false,
        userVariables: __spreadProps(__spreadValues({}, ((_a = this.options) == null ? void 0 : _a.userVariables) || {}), {
          memberCallId: this.callId,
          memberId: this.memberId
        })
      });
      const roomDevice = connect3({
        store: this.store,
        Component: RoomSessionDeviceAPI
      })(options);
      roomDevice.once("destroy", () => {
        roomDevice.emit("room.left");
        this._deviceList.delete(roomDevice);
      });
      try {
        roomDevice.runWorker("childMemberJoinedWorker", {
          worker: childMemberJoinedWorker,
          onDone: () => resolve(roomDevice),
          onFail: reject,
          initialState: {
            parentId: this.memberId
          }
        });
        this._deviceList.add(roomDevice);
        if (autoJoin) {
          return await roomDevice.join();
        }
        return resolve(roomDevice);
      } catch (error) {
        this.logger.error("RoomDevice Error", error);
        reject(error);
      }
    });
  }
};
var VideoRoomSessionAPI = extendComponent3(VideoRoomSessionConnection, {
  audioMute: Rooms6.audioMuteMember,
  audioUnmute: Rooms6.audioUnmuteMember,
  videoMute: Rooms6.videoMuteMember,
  videoUnmute: Rooms6.videoUnmuteMember,
  deaf: Rooms6.deafMember,
  undeaf: Rooms6.undeafMember,
  setInputVolume: Rooms6.setInputVolumeMember,
  setOutputVolume: Rooms6.setOutputVolumeMember,
  setMicrophoneVolume: Rooms6.setInputVolumeMember,
  setSpeakerVolume: Rooms6.setOutputVolumeMember,
  setInputSensitivity: Rooms6.setInputSensitivityMember,
  removeMember: Rooms6.removeMember,
  removeAllMembers: Rooms6.removeAllMembers,
  getMembers: Rooms6.getMembers,
  getLayouts: Rooms6.getLayouts,
  setLayout: Rooms6.setLayout,
  setPositions: Rooms6.setPositions,
  setMemberPosition: Rooms6.setMemberPosition,
  hideVideoMuted: Rooms6.hideVideoMuted,
  showVideoMuted: Rooms6.showVideoMuted,
  getRecordings: Rooms6.getRecordings,
  startRecording: Rooms6.startRecording,
  getPlaybacks: Rooms6.getPlaybacks,
  play: Rooms6.play,
  setHideVideoMuted: Rooms6.setHideVideoMuted,
  getMeta: Rooms6.getMeta,
  setMeta: Rooms6.setMeta,
  updateMeta: Rooms6.updateMeta,
  deleteMeta: Rooms6.deleteMeta,
  getMemberMeta: Rooms6.getMemberMeta,
  setMemberMeta: Rooms6.setMemberMeta,
  updateMemberMeta: Rooms6.updateMemberMeta,
  deleteMemberMeta: Rooms6.deleteMemberMeta,
  promote: Rooms6.promote,
  demote: Rooms6.demote,
  getStreams: Rooms6.getStreams,
  startStream: Rooms6.startStream,
  lock: Rooms6.lock,
  unlock: Rooms6.unlock,
  setRaisedHand: Rooms6.setRaisedHand,
  setPrioritizeHandraise: Rooms6.setPrioritizeHandraise
});
var isVideoRoomSession = (room) => {
  return room instanceof VideoRoomSessionConnection;
};
var createVideoRoomSessionObject = (params) => {
  const room = connect3({
    store: params.store,
    customSagas: params.customSagas,
    Component: VideoRoomSessionAPI
  })(params);
  return room;
};

// src/fabric/FabricRoomSession.ts
import {
  connect as connect5,
  toSnakeCaseKeys
} from "@signalwire/core";

// src/utils/storage.ts
import jwtDecode from "jwt-decode";
import { getLogger as getLogger11 } from "@signalwire/core";
var getStorage = () => {
  if (window && window.sessionStorage) {
    return window.sessionStorage;
  }
  return void 0;
};
var sessionStorageManager = (token) => {
  var _a;
  let roomName = "";
  try {
    const jwtPayload = jwtDecode(token);
    roomName = (_a = jwtPayload == null ? void 0 : jwtPayload.r) != null ? _a : "";
  } catch (e) {
    try {
      const jwtPayload = jwtDecode(token, { header: true });
      roomName = jwtPayload.typ || "";
    } catch (e2) {
      if (process.env.NODE_ENV !== "production") {
        getLogger11().error("[sessionStorageManager] error decoding JWT", token);
      }
      roomName = "";
    }
  }
  const valid = Boolean(roomName);
  return {
    authStateKey: valid && `as-${roomName}`,
    protocolKey: valid && `pt-${roomName}`,
    callIdKey: valid && `ci-${roomName}`
  };
};

// src/fabric/utils/constants.ts
var PREVIOUS_CALLID_STORAGE_KEY = "ci-SAT";
var DEFAULT_API_REQUEST_RETRIES = 10;
var DEFAULT_API_REQUEST_RETRIES_DELAY = 300;
var DEFAULT_API_REQUEST_RETRIES_DELAY_INCREMENT = 100;

// src/fabric/workers/wsClientWorker.ts
import {
  getLogger as getLogger12,
  sagaEffects as sagaEffects6
} from "@signalwire/core";
var wsClientWorker = function* (options) {
  getLogger12().debug("wsClientWorker started");
  const { channels, initialState, instance: client } = options;
  const { swEventChannel } = channels;
  const { handleIncomingInvite } = initialState;
  function* fireHoseWorker(action) {
    client.emit(action.type, action.payload);
  }
  function* vertoInviteWorker(action) {
    handleIncomingInvite(action.payload.params);
  }
  const isVertoInvite2 = (action) => {
    if (action.type === "webrtc.message") {
      return action.payload.method === "verto.invite";
    }
    return false;
  };
  try {
    while (true) {
      const action = yield sagaEffects6.take(
        swEventChannel,
        () => true
      );
      yield sagaEffects6.fork(fireHoseWorker, action);
      if (isVertoInvite2(action)) {
        getLogger12().debug("Receiving a call over WebSocket", action);
        yield sagaEffects6.fork(
          vertoInviteWorker,
          action
        );
      }
    }
  } finally {
    getLogger12().trace("wsClientWorker ended");
  }
};

// src/fabric/workers/fabricWorker.ts
import {
  getLogger as getLogger17,
  sagaEffects as sagaEffects9
} from "@signalwire/core";

// src/fabric/FabricRoomSessionMember.ts
import {
  connect as connect4,
  BaseComponent
} from "@signalwire/core";
var FabricRoomSessionMemberAPI = class extends BaseComponent {
  constructor(options) {
    super(options);
    __publicField(this, "_payload");
    this._payload = options.payload;
  }
  get id() {
    return this._payload.member.member_id;
  }
  get callId() {
    return this._payload.member.call_id;
  }
  get nodeId() {
    return this._payload.member.node_id;
  }
  get memberId() {
    return this.id;
  }
  get roomSessionId() {
    return this._payload.room_session_id;
  }
  get roomId() {
    return this._payload.room_id;
  }
  get parentId() {
    return this._payload.member.parent_id;
  }
  get subscriberId() {
    return this._payload.member.subscriber_id;
  }
  get addressId() {
    return this._payload.member.address_id;
  }
  get name() {
    return this._payload.member.name;
  }
  get type() {
    return this._payload.member.type;
  }
  get requestedPosition() {
    return this._payload.member.requested_position;
  }
  get currentPosition() {
    return this._payload.member.current_position;
  }
  get meta() {
    return this._payload.member.meta;
  }
  get handraised() {
    return this._payload.member.handraised;
  }
  get talking() {
    return this._payload.member.talking;
  }
  get audioMuted() {
    return this._payload.member.audio_muted;
  }
  get videoMuted() {
    return this._payload.member.video_muted;
  }
  get deaf() {
    return this._payload.member.deaf;
  }
  get visible() {
    return this._payload.member.visible;
  }
  get inputVolume() {
    return this._payload.member.input_volume;
  }
  get outputVolume() {
    return this._payload.member.output_volume;
  }
  get inputSensitivity() {
    return this._payload.member.input_sensitivity;
  }
  get echoCancellation() {
    return this._payload.member.echo_cancellation;
  }
  get autoGain() {
    return this._payload.member.auto_gain;
  }
  get noiseSuppression() {
    return this._payload.member.noise_suppression;
  }
  /** @internal */
  setPayload(payload) {
    const newPayload = __spreadProps(__spreadValues(__spreadValues({}, this._payload), payload), {
      member: __spreadValues(__spreadValues({}, this._payload.member), payload.member)
    });
    this._payload = newPayload;
  }
};
var createFabricRoomSessionMemberObject = (params) => {
  const member = connect4({
    store: params.store,
    Component: FabricRoomSessionMemberAPI
  })(params);
  return member;
};

// src/fabric/workers/callSegmentWorker.ts
import {
  getLogger as getLogger16,
  sagaEffects as sagaEffects8
} from "@signalwire/core";

// src/fabric/workers/callLeftWorker.ts
import { getLogger as getLogger13 } from "@signalwire/core";
var callLeftWorker = function* (options) {
  getLogger13().trace("callLeftWorker started");
  const {
    action: { payload },
    instance: cfRoomSession,
    instanceMap
  } = options;
  const { room_session_id } = payload;
  instanceMap.getAll().forEach(([key, obj]) => {
    if (obj instanceof FabricRoomSessionMemberAPI && obj.roomSessionId === room_session_id) {
      instanceMap.remove(key);
    }
  });
  cfRoomSession.emit("call.left", payload);
  cfRoomSession.emit("room.left", payload);
  getLogger13().trace("callLeftWorker ended");
};

// src/fabric/workers/callJoinWorker.ts
import {
  getLogger as getLogger15,
  sagaEffects as sagaEffects7,
  MemberPosition as MemberPosition2,
  stripNamespacePrefix as stripNamespacePrefix6
} from "@signalwire/core";

// src/fabric/workers/fabricMemberWorker.ts
import {
  fromSnakeToCamelCase,
  getLogger as getLogger14
} from "@signalwire/core";
var fabricMemberWorker = function* (options) {
  getLogger14().trace("fabricMemberWorker started");
  const {
    instance: roomSession,
    action: { type, payload },
    instanceMap: { get, set, remove }
  } = options;
  const memberId = payload.member.member_id;
  let memberInstance = get(memberId);
  if (!memberInstance && type !== "member.talking") {
    memberInstance = createFabricRoomSessionMemberObject({
      store: roomSession.store,
      payload
    });
  }
  if (memberInstance) {
    memberInstance.setPayload(payload);
  }
  set(memberId, memberInstance);
  if (type.startsWith("member.updated.")) {
    const clientType = fromSnakeToCamelCase(type);
    roomSession.emit(clientType, payload);
  }
  switch (type) {
    case "member.joined":
      roomSession.emit(type, payload);
      break;
    case "member.updated":
      roomSession.emit(type, payload);
      break;
    case "member.left":
      roomSession.emit(type, payload);
      remove(memberId);
      break;
    case "member.talking":
      roomSession.emit(type, payload);
      break;
    default:
      break;
  }
  getLogger14().trace("fabricMemberWorker ended");
};

// src/fabric/utils/capabilitiesHelpers.ts
var CapabilityOnOffState = class {
  constructor(_flags) {
    this._flags = _flags;
  }
  get on() {
    return this._flags.some((flag) => !flag.endsWith(".off"));
  }
  get off() {
    return this._flags.some((flag) => !flag.endsWith(".on"));
  }
};
var MemberCapability = class {
  constructor(_flags, _memberType) {
    this._flags = _flags;
    this._memberType = _memberType;
    __publicField(this, "_muteAudio");
    __publicField(this, "_muteVideo");
    __publicField(this, "_deaf");
    __publicField(this, "_raisehand");
  }
  get muteAudio() {
    var _a;
    this._muteAudio = (_a = this._muteAudio) != null ? _a : new CapabilityOnOffState(
      this._flags.filter(
        (flag) => flag === this._memberType || flag === `${this._memberType}.mute` || flag.startsWith(`${this._memberType}.mute.audio`)
      )
    );
    return this._muteAudio;
  }
  get muteVideo() {
    var _a;
    this._muteVideo = (_a = this._muteVideo) != null ? _a : new CapabilityOnOffState(
      this._flags.filter(
        (flag) => flag === this._memberType || flag === `${this._memberType}.mute` || flag.startsWith(`${this._memberType}.mute.video`)
      )
    );
    return this._muteVideo;
  }
  get microphoneVolume() {
    return this._flags.some(
      (flag) => flag === this._memberType || flag === `${this._memberType}.microphone` || flag.startsWith(`${this._memberType}.microphone.volume`)
    );
  }
  get microphoneSensitivity() {
    return this._flags.some(
      (flag) => flag === this._memberType || flag === `${this._memberType}.microphone` || flag.startsWith(`${this._memberType}.microphone.sensitivity`)
    );
  }
  get speakerVolume() {
    return this._flags.some(
      (flag) => flag === this._memberType || flag === `${this._memberType}.speaker` || flag.startsWith(`${this._memberType}.speaker.volume`)
    );
  }
  get deaf() {
    var _a;
    this._deaf = (_a = this._deaf) != null ? _a : new CapabilityOnOffState(
      this._flags.filter(
        (flag) => flag === this._memberType || flag.startsWith(`${this._memberType}.deaf`)
      )
    );
    return this._deaf;
  }
  get raisehand() {
    var _a;
    this._raisehand = (_a = this._raisehand) != null ? _a : new CapabilityOnOffState(
      this._flags.filter(
        (flag) => flag === this._memberType || flag.startsWith(`${this._memberType}.raisehand`)
      )
    );
    return this._raisehand;
  }
  get position() {
    return this._flags.some(
      (flag) => flag === this._memberType || flag.startsWith(`${this._memberType}.position`)
    );
  }
  get meta() {
    return this._flags.some(
      (flag) => flag === this._memberType || flag.startsWith(`${this._memberType}.meta`)
    );
  }
  get remove() {
    return this._flags.some(
      (flag) => flag === this._memberType || flag.startsWith(`${this._memberType}.remove`)
    );
  }
  get audioFlags() {
    return this._flags.some(
      (flag) => flag === this._memberType || flag.startsWith(`${this._memberType}.audioflags.set`)
    );
  }
};
var CallCapabilities = class {
  constructor(_flags) {
    this._flags = _flags;
    __publicField(this, "_self");
    __publicField(this, "_member");
    __publicField(this, "_vmutedHide");
    __publicField(this, "_lock");
  }
  _buildMemberCapability(memberType) {
    return new MemberCapability(
      this._flags.filter((flag) => flag.startsWith(memberType)),
      memberType
    );
  }
  get self() {
    var _a;
    this._self = (_a = this._self) != null ? _a : this._buildMemberCapability("self");
    return this._self;
  }
  get member() {
    var _a;
    this._member = (_a = this._member) != null ? _a : this._buildMemberCapability("member");
    return this._member;
  }
  get end() {
    return this._flags.some((capability) => capability === "end");
  }
  get setLayout() {
    return this._flags.some((capability) => capability.startsWith("layout"));
  }
  get sendDigit() {
    return this._flags.some((capability) => capability.startsWith("digit"));
  }
  get vmutedHide() {
    var _a;
    this._vmutedHide = (_a = this._vmutedHide) != null ? _a : new CapabilityOnOffState(
      this._flags.filter((flag) => flag.startsWith("vmuted"))
    );
    return this._vmutedHide;
  }
  get lock() {
    var _a;
    this._lock = (_a = this._lock) != null ? _a : new CapabilityOnOffState(
      this._flags.filter((flag) => flag.startsWith("lock"))
    );
    return this._lock;
  }
  get device() {
    return this._flags.some((capability) => capability === "device");
  }
  get screenshare() {
    return this._flags.some((capability) => capability === "screenshare");
  }
};
var mapCapabilityPayload = (capabilities) => new CallCapabilities(capabilities);

// src/fabric/utils/eventMappers.ts
var mapInternalFabricMemberToInternalVideoMemberEntity = (params) => {
  return __spreadProps(__spreadValues({}, params), {
    id: params.member_id
  });
};
var mapInternalFabricMemberToInternalVideoMemberUpdatedEntity = (params) => {
  return __spreadProps(__spreadValues({}, mapInternalFabricMemberToInternalVideoMemberEntity(params)), {
    updated: params.updated.map(
      (key) => key === "member_id" ? "id" : key
    )
  });
};
var mapCallJoinedToRoomSubscribedEventParams = (params) => {
  return __spreadProps(__spreadValues({}, params), {
    room: __spreadProps(__spreadValues({}, params.room_session), {
      members: params.room_session.members.map(
        mapInternalFabricMemberToInternalVideoMemberEntity
      )
    }),
    room_session: __spreadProps(__spreadValues({}, params.room_session), {
      members: params.room_session.members.map(
        mapInternalFabricMemberToInternalVideoMemberEntity
      )
    })
  });
};
var mapFabricMemberToVideoMemberJoinAndLeftEventParams = (params) => {
  return {
    room_session_id: params.room_session_id,
    room_id: params.room_id,
    member: mapInternalFabricMemberToInternalVideoMemberEntity(params.member)
  };
};
var mapFabricMemberActionToVideoMemberJoinAndLeftAction = (action) => {
  return {
    type: `video.${action.type}`,
    payload: mapFabricMemberToVideoMemberJoinAndLeftEventParams(action.payload)
  };
};
var mapFabricMemberEventToVideoMemberUpdatedEventParams = (params) => {
  return {
    room_session_id: params.room_session_id,
    room_id: params.room_id,
    member: mapInternalFabricMemberToInternalVideoMemberUpdatedEntity(
      params.member
    )
  };
};
var mapFabricMemberActionToVideoMemberUpdatedAction = (action) => {
  return {
    type: `video.${action.type}`,
    payload: mapFabricMemberEventToVideoMemberUpdatedEventParams(
      action.payload
    )
  };
};
var mapFabricLayoutActionToVideoLayoutAction = (action) => {
  return {
    type: `video.${action.type}`,
    payload: action.payload
  };
};

// src/fabric/workers/callJoinWorker.ts
var callJoinWorker = function* (options) {
  var _a;
  getLogger15().trace("callJoinWorker started");
  const { action, instanceMap, instance: cfRoomSession } = options;
  const { payload } = action;
  const { get, set } = instanceMap;
  yield sagaEffects7.fork(MemberPosition2.memberPositionWorker, __spreadProps(__spreadValues({}, options), {
    /**
     * The {@link memberPositionWorker} worker understands only the Video SDK events.
     * So, we need to map CF SDK event to Video SDK event.
     * Similar to what we do in the {@link callSegmentWorker}, for member events.
     */
    initialState: mapCallJoinedToRoomSubscribedEventParams(payload),
    dispatcher: function* (subType, subPayload) {
      const fabricType = stripNamespacePrefix6(subType, "video");
      const fabricPaylod = __spreadProps(__spreadValues({}, subPayload), {
        member: __spreadProps(__spreadValues({}, subPayload.member), {
          member_id: subPayload.member.id
        })
      });
      yield sagaEffects7.fork(fabricMemberWorker, __spreadProps(__spreadValues({}, options), {
        action: { type: fabricType, payload: fabricPaylod }
      }));
    }
  }));
  (_a = payload.room_session.members) == null ? void 0 : _a.forEach((member) => {
    let memberInstance = get(member.member_id);
    if (!memberInstance) {
      memberInstance = createFabricRoomSessionMemberObject({
        store: cfRoomSession.store,
        payload: {
          member,
          room_id: payload.room_id,
          room_session_id: payload.room_session_id
        }
      });
    } else {
      memberInstance.setPayload({
        member,
        room_id: payload.room_id,
        room_session_id: payload.room_session_id
      });
    }
    set(member.member_id, memberInstance);
  });
  cfRoomSession.member = get(payload.member_id);
  cfRoomSession.capabilities = mapCapabilityPayload(payload.capabilities);
  const fabricEvent = __spreadProps(__spreadValues({}, payload), {
    capabilities: cfRoomSession.capabilities
  });
  cfRoomSession.emit("call.joined", fabricEvent);
  getLogger15().trace("callJoinWorker ended");
};

// src/fabric/workers/callSegmentWorker.ts
var callSegmentWorker = function* (options) {
  const {
    action,
    channels: { swEventChannel },
    instance: cfRoomSession
  } = options;
  const segmentCallId = action.payload.call_id;
  const segmentRooSessionId = action.payload.room_session_id;
  getLogger16().debug(
    `callSegmentWorker started for: callId ${segmentCallId}, roomSessionId ${segmentRooSessionId}`
  );
  yield sagaEffects8.fork(callJoinWorker, __spreadProps(__spreadValues({}, options), {
    action
  }));
  function* worker(action2) {
    const { type, payload } = action2;
    switch (type) {
      case "call.joined":
        break;
      case "call.left":
        yield sagaEffects8.call(callLeftWorker, __spreadProps(__spreadValues({}, options), {
          action: action2
        }));
        return true;
      case "call.updated":
        cfRoomSession.emit(type, payload);
        cfRoomSession.emit("room.updated", payload);
        break;
      case "call.play":
        cfRoomSession.emit(type, payload);
        break;
      case "call.connect":
        cfRoomSession.emit(type, payload);
        break;
      case "call.room":
        cfRoomSession.emit(type, payload);
        break;
      /**
       * The Core module includes a generic worker, {@link memberPositionWorker},
       * which listens for member & layout events to add a "current_position" parameter
       * and handle member "updated" parameter.
       * This worker in CF SDK is initialized by the {@link callJoinWorker} worker.
       *
       * To ensure compatibility, we map these events to Video SDK events and
       * re-publish them on the channel so that they can be processed by the
       * generic worker. Note that the generic worker only dispatches "member.updated"
       * and "member.updated.*" events.
       *
       * Additionally, the "member.joined" event is monitored by another worker,
       * {@link childMemberJoinedWorker}, specifically for the screen share API.
       */
      case "member.joined":
      case "member.left": {
        yield sagaEffects8.fork(fabricMemberWorker, __spreadProps(__spreadValues({}, options), {
          action: action2
        }));
        const videoAction = mapFabricMemberActionToVideoMemberJoinAndLeftAction(action2);
        yield sagaEffects8.put(swEventChannel, videoAction);
        break;
      }
      case "member.updated": {
        const videoAction = mapFabricMemberActionToVideoMemberUpdatedAction(action2);
        yield sagaEffects8.put(swEventChannel, videoAction);
        break;
      }
      case "layout.changed": {
        cfRoomSession.currentLayoutEvent = action2.payload;
        cfRoomSession.emit(type, payload);
        const videoAction = mapFabricLayoutActionToVideoLayoutAction(action2);
        yield sagaEffects8.put(swEventChannel, videoAction);
        break;
      }
      case "member.talking": {
        yield sagaEffects8.fork(fabricMemberWorker, __spreadProps(__spreadValues({}, options), {
          action: action2
        }));
        break;
      }
      default: {
        getLogger16().warn("Got an unknown fabric event", action2);
      }
    }
    return false;
  }
  const isSegmentEvent = (action2) => {
    const { type, payload } = action2;
    const shouldWatch = type.startsWith("call.") || type.startsWith("member.") || type.startsWith("layout.");
    const hasSegmentCallId = "call_id" in payload && segmentCallId === payload.call_id;
    const hasSegmentRoomSessionId = segmentRooSessionId === payload.room_session_id;
    if (shouldWatch && (hasSegmentCallId || hasSegmentRoomSessionId)) {
      return true;
    }
    return false;
  };
  while (true) {
    const action2 = yield sagaEffects8.take(
      swEventChannel,
      isSegmentEvent
    );
    const task = yield sagaEffects8.fork(worker, action2);
    const shouldStop = yield sagaEffects8.join(task);
    if (shouldStop) return;
  }
};

// src/fabric/workers/fabricWorker.ts
var fabricWorker = function* (options) {
  getLogger17().trace("fabricWorker started");
  const {
    channels: { swEventChannel },
    instance: cfRoomSession
  } = options;
  function* worker(action) {
    const { type, payload } = action;
    switch (type) {
      case "call.joined": {
        if (!cfRoomSession.selfMember) {
          const memberInstance = createFabricRoomSessionMemberObject({
            store: cfRoomSession.store,
            payload: {
              member: action.payload.room_session.members.find(
                (m) => m.member_id === action.payload.member_id
              ),
              room_id: action.payload.room_id,
              room_session_id: action.payload.room_session_id
            }
          });
          cfRoomSession.selfMember = memberInstance;
        }
        yield sagaEffects9.fork(callSegmentWorker, __spreadProps(__spreadValues({}, options), {
          instance: cfRoomSession,
          action
        }));
        break;
      }
      case "call.state":
        cfRoomSession.emit(type, payload);
        break;
    }
  }
  let firstCallJoinedReceived = false;
  const isFirstCallJoinedorCallStateEvent = (action) => {
    if (action.type === "call.state") {
      return true;
    }
    if (action.type !== "call.joined") {
      return false;
    }
    if (!firstCallJoinedReceived) {
      const callId = action.payload.call_id;
      const originCallId = action.payload.origin_call_id;
      if (callId === originCallId) {
        firstCallJoinedReceived = true;
        return true;
      }
      return false;
    }
    return true;
  };
  while (true) {
    const action = yield sagaEffects9.take(
      swEventChannel,
      isFirstCallJoinedorCallStateEvent
    );
    yield sagaEffects9.fork(worker, action);
  }
  getLogger17().trace("fabricWorker ended");
};

// src/fabric/utils/validators.ts
import {
  CapabilityError
} from "@signalwire/core";
var isSelfMember = (params, ctx) => {
  return !(params == null ? void 0 : params.memberId) || params.memberId === ctx.member.id;
};
function validateAudioMute(params) {
  var _a, _b;
  const isSelf = isSelfMember(params, this);
  const capability = isSelf ? (_a = this.capabilities) == null ? void 0 : _a.self.muteAudio.off : (_b = this.capabilities) == null ? void 0 : _b.member.muteAudio.off;
  if (!capability) {
    throw new CapabilityError("Missing audio mute capability");
  }
}
function validateAudioUnmute(params) {
  var _a, _b;
  const isSelf = isSelfMember(params, this);
  const capability = isSelf ? (_a = this.capabilities) == null ? void 0 : _a.self.muteAudio.on : (_b = this.capabilities) == null ? void 0 : _b.member.muteAudio.on;
  if (!capability) {
    throw new CapabilityError("Missing audio unmute capability");
  }
}
function validateVideoMute(params) {
  var _a, _b;
  const isSelf = isSelfMember(params, this);
  const capability = isSelf ? (_a = this.capabilities) == null ? void 0 : _a.self.muteVideo.off : (_b = this.capabilities) == null ? void 0 : _b.member.muteVideo.off;
  if (!capability) {
    throw new CapabilityError("Missing video mute capability");
  }
}
function validateVideoUnmute(params) {
  var _a, _b;
  const isSelf = isSelfMember(params, this);
  const capability = isSelf ? (_a = this.capabilities) == null ? void 0 : _a.self.muteVideo.on : (_b = this.capabilities) == null ? void 0 : _b.member.muteVideo.on;
  if (!capability) {
    throw new CapabilityError("Missing video unmute capability");
  }
}
function validateDeaf(params) {
  var _a, _b;
  const isSelf = isSelfMember(params, this);
  const capability = isSelf ? (_a = this.capabilities) == null ? void 0 : _a.self.deaf.on : (_b = this.capabilities) == null ? void 0 : _b.member.deaf.on;
  if (!capability) {
    throw new CapabilityError("Missing deaf capability");
  }
}
function validateUndeaf(params) {
  var _a, _b;
  const isSelf = isSelfMember(params, this);
  const capability = isSelf ? (_a = this.capabilities) == null ? void 0 : _a.self.deaf.off : (_b = this.capabilities) == null ? void 0 : _b.member.deaf.off;
  if (!capability) {
    throw new CapabilityError("Missing undeaf capability");
  }
}
function validateRemoveMember(params) {
  var _a;
  if (!(params == null ? void 0 : params.memberId)) {
    throw new TypeError('Invalid or missing "memberId" argument');
  }
  const capability = (_a = this.capabilities) == null ? void 0 : _a.member.remove;
  if (!capability) {
    throw new CapabilityError("Missing remove member capability");
  }
}
function validateSetRaiseHand(params) {
  var _a, _b, _c, _d;
  const { raised = true } = params || {};
  const self = isSelfMember(params, this);
  const raiseCap = self ? (_a = this.capabilities) == null ? void 0 : _a.self.raisehand.on : (_b = this.capabilities) == null ? void 0 : _b.member.raisehand.on;
  const lowerCap = self ? (_c = this.capabilities) == null ? void 0 : _c.self.raisehand.off : (_d = this.capabilities) == null ? void 0 : _d.member.raisehand.off;
  if (raised && !raiseCap) {
    throw new CapabilityError("Missing raisehand capability");
  }
  if (!raised && !lowerCap) {
    throw new CapabilityError("Missing lowerhand capability");
  }
}
function validateSetLayout() {
  var _a;
  if (!((_a = this.capabilities) == null ? void 0 : _a.setLayout)) {
    throw new CapabilityError("Missing setLayout capability");
  }
}
function validateSetInputVolume(params) {
  var _a, _b, _c, _d;
  const isSelf = isSelfMember(params, this);
  const capability = isSelf ? (_b = (_a = this.capabilities) == null ? void 0 : _a.self) == null ? void 0 : _b.microphoneVolume : (_d = (_c = this.capabilities) == null ? void 0 : _c.member) == null ? void 0 : _d.microphoneVolume;
  if (!capability) {
    throw new CapabilityError("Missing setInputVolume capability");
  }
  if (params.volume < -50 || params.volume > 50) {
    throw new RangeError("The volume ranges from -50 to 50");
  }
}
function validateSetOutputVolume(params) {
  var _a, _b, _c, _d;
  const isSelf = isSelfMember(params, this);
  const capability = isSelf ? (_b = (_a = this.capabilities) == null ? void 0 : _a.self) == null ? void 0 : _b.speakerVolume : (_d = (_c = this.capabilities) == null ? void 0 : _c.member) == null ? void 0 : _d.speakerVolume;
  if (!capability) {
    throw new CapabilityError("Missing setOutputVolume capability");
  }
  if (params.volume < -50 || params.volume > 50) {
    throw new RangeError("The volume ranges from -50 to 50");
  }
}
function validateSetInputSensitivity(params) {
  var _a, _b;
  const isSelf = isSelfMember(params, this);
  const capability = isSelf ? (_a = this.capabilities) == null ? void 0 : _a.self.microphoneSensitivity : (_b = this.capabilities) == null ? void 0 : _b.member.microphoneSensitivity;
  if (!capability) {
    throw new CapabilityError("Missing setInputSensitivity capability");
  }
  if (params.value < 0 || params.value > 100) {
    throw new RangeError("The sensitivity value ranges from 0 to 100");
  }
}
function validateSetPositions(params) {
  var _a, _b;
  if (params.positions && !Object.keys(params.positions).length) {
    throw new TypeError("Invalid positions specified");
  }
  const hasSelfPositions = Object.keys(params.positions).some(
    (p) => ["self", `${this.memberId}`].includes(p)
  );
  const capability = hasSelfPositions ? (_a = this.capabilities) == null ? void 0 : _a.self.position : (_b = this.capabilities) == null ? void 0 : _b.member.position;
  if (!capability) {
    throw new CapabilityError("Missing setPositions capability");
  }
}
function validateLock() {
  var _a;
  if (!((_a = this.capabilities) == null ? void 0 : _a.lock.on)) {
    throw new CapabilityError("Missing lock capability");
  }
}
function validateUnlock() {
  var _a;
  if (!((_a = this.capabilities) == null ? void 0 : _a.lock.off)) {
    throw new CapabilityError("Missing unlock capability");
  }
}
function validateSetAudioFlags(params) {
  var _a, _b;
  const isSelf = isSelfMember(params, this);
  const capability = isSelf ? (_a = this.capabilities) == null ? void 0 : _a.self.audioFlags : (_b = this.capabilities) == null ? void 0 : _b.member.audioFlags;
  if (!capability) {
    throw new CapabilityError("Missing audio flags capability");
  }
  const { echoCancellation, autoGain, noiseSuppression } = params || {};
  if (echoCancellation === void 0 && autoGain === void 0 && noiseSuppression === void 0) {
    throw new TypeError(
      "Invalid parameters: you must specify at least one of `echoCancellation`, `autoGain`, or `noiseSuppression`"
    );
  }
}
function validateEnd() {
  var _a;
  const capability = (_a = this.capabilities) == null ? void 0 : _a.end;
  if (!capability) {
    throw new CapabilityError("Missing 'end' capability");
  }
}

// src/fabric/utils/validationProxy.ts
var validationsMap = {
  audioMute: validateAudioMute,
  audioUnmute: validateAudioUnmute,
  videoMute: validateVideoMute,
  videoUnmute: validateVideoUnmute,
  deaf: validateDeaf,
  undeaf: validateUndeaf,
  removeMember: validateRemoveMember,
  setRaisedHand: validateSetRaiseHand,
  setLayout: validateSetLayout,
  setInputVolume: validateSetInputVolume,
  setOutputVolume: validateSetOutputVolume,
  setInputSensitivity: validateSetInputSensitivity,
  setPositions: validateSetPositions,
  lock: validateLock,
  unlock: validateUnlock,
  setAudioFlags: validateSetAudioFlags,
  end: validateEnd
};
function createFabricRoomSessionValidateProxy(instance) {
  return new Proxy(instance, {
    get(target, prop, receiver) {
      if (typeof prop === "string" && prop in validationsMap) {
        const targetConn = target;
        const origMethod = targetConn[prop];
        if (typeof origMethod === "function") {
          return async function(...args) {
            const validator = validationsMap[prop];
            if (validator) {
              validator.apply(targetConn, args);
            }
            return origMethod.apply(targetConn, args);
          };
        }
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}

// src/fabric/FabricRoomSession.ts
var FabricRoomSessionConnection = class extends BaseRoomSessionConnection {
  constructor(options) {
    super(options);
    // this is "self" parameter required by the RPC, and is always "the member" on the 1st call segment
    __publicField(this, "_self");
    // this is "the member" on the last/active call segment
    __publicField(this, "_member");
    __publicField(this, "_currentLayoutEvent");
    //describes what are methods are allow for the user in a call segment
    __publicField(this, "_capabilities");
    this.initWorker();
  }
  get memberId() {
    var _a;
    return (_a = this._member) == null ? void 0 : _a.memberId;
  }
  dialogParams(rtcPeerId) {
    const params = super.dialogParams(rtcPeerId);
    params.dialogParams.attach = this.options.attach || this.resuming;
    params.dialogParams.reattaching = this.options.attach || this.resuming;
    return params;
  }
  set currentLayoutEvent(event) {
    this._currentLayoutEvent = event;
  }
  get currentLayoutEvent() {
    return this._currentLayoutEvent;
  }
  get currentLayout() {
    var _a;
    return (_a = this._currentLayoutEvent) == null ? void 0 : _a.layout;
  }
  get currentPosition() {
    var _a, _b;
    return (_b = (_a = this._currentLayoutEvent) == null ? void 0 : _a.layout.layers.find(
      (layer) => layer.member_id === this.memberId
    )) == null ? void 0 : _b.position;
  }
  get capabilities() {
    return this._capabilities;
  }
  set capabilities(capabilities) {
    this._capabilities = capabilities;
  }
  get selfMember() {
    return this._self;
  }
  set selfMember(member) {
    this._self = member;
  }
  set member(member) {
    this._member = member;
  }
  get member() {
    return this._member;
  }
  initWorker() {
    this.runWorker("fabricWorker", {
      worker: fabricWorker
    });
    this.runWorker("makeAudioElement", {
      worker: makeAudioElementSaga({
        speakerId: this.options.speakerId
      })
    });
  }
  async join() {
    var _a, _b;
    if (this.options.attach) {
      this.options.prevCallId = (_b = (_a = getStorage()) == null ? void 0 : _a.getItem(PREVIOUS_CALLID_STORAGE_KEY)) != null ? _b : void 0;
      this.logger.debug(
        `Tying to reattach to previuos call? ${!!this.options.prevCallId} - prevCallId: ${this.options.prevCallId}`
      );
    }
    return super.invite();
  }
  executeAction(params, options = {}) {
    var _a, _b, _c;
    const { method, channel, memberId, extraParams = {} } = params;
    const targetMember = !memberId || memberId === "all" ? this.member : this.instanceMap.get(memberId);
    if (!targetMember) {
      throw new Error(
        memberId && memberId !== "all" ? `Member ${memberId} not found` : "No target member available"
      );
    }
    return this.execute(
      {
        method,
        params: __spreadValues(__spreadProps(__spreadValues({}, channel && { channels: [channel] }), {
          self: {
            member_id: (_a = this.selfMember) == null ? void 0 : _a.id,
            call_id: (_b = this.selfMember) == null ? void 0 : _b.callId,
            node_id: (_c = this.selfMember) == null ? void 0 : _c.nodeId
          },
          target: {
            member_id: memberId === "all" ? memberId : targetMember.id,
            call_id: targetMember.callId,
            node_id: targetMember.nodeId
          }
        }), extraParams)
      },
      options
    );
  }
  /** @internal */
  async resume() {
    var _a;
    this.logger.warn(`[resume] Call ${this.id}`);
    if ((_a = this.peer) == null ? void 0 : _a.instance) {
      const { connectionState } = this.peer.instance;
      this.logger.debug(
        `[resume] connectionState for ${this.id} is '${connectionState}'`
      );
      if (["closed", "failed", "disconnected"].includes(connectionState)) {
        this.resuming = !this.selfMember;
        this.peer.restartIce();
      }
    }
  }
  async start() {
    return new Promise(async (resolve, reject) => {
      try {
        this.once("room.subscribed", (params) => {
          var _a;
          (_a = getStorage()) == null ? void 0 : _a.setItem(PREVIOUS_CALLID_STORAGE_KEY, params.call_id);
          resolve();
        });
        this.once("destroy", () => {
          var _a;
          (_a = getStorage()) == null ? void 0 : _a.removeItem(PREVIOUS_CALLID_STORAGE_KEY);
        });
        await this.join();
      } catch (error) {
        this.logger.error("WSClient call start", error);
        reject(error);
      }
    });
  }
  async audioMute(params) {
    return this.executeAction({
      method: "call.mute",
      channel: "audio",
      memberId: params == null ? void 0 : params.memberId
    });
  }
  async audioUnmute(params) {
    return this.executeAction({
      method: "call.unmute",
      channel: "audio",
      memberId: params == null ? void 0 : params.memberId
    });
  }
  async videoMute(params) {
    return this.executeAction({
      method: "call.mute",
      channel: "video",
      memberId: params == null ? void 0 : params.memberId
    });
  }
  async videoUnmute(params) {
    return this.executeAction({
      method: "call.unmute",
      channel: "video",
      memberId: params == null ? void 0 : params.memberId
    });
  }
  async deaf(params) {
    return this.executeAction({
      method: "call.deaf",
      memberId: params == null ? void 0 : params.memberId
    });
  }
  async undeaf(params) {
    return this.executeAction({
      method: "call.undeaf",
      memberId: params == null ? void 0 : params.memberId
    });
  }
  async getLayouts() {
    return this.executeAction(
      {
        method: "call.layout.list"
      },
      {
        transformResolve: (payload) => ({
          layouts: payload.layouts
        })
      }
    );
  }
  async getMembers() {
    return this.executeAction(
      {
        method: "call.member.list"
      },
      {
        transformResolve: (payload) => ({
          members: payload.members
        })
      }
    );
  }
  async removeMember(params) {
    return this.executeAction({
      method: "call.member.remove",
      memberId: params.memberId
    });
  }
  async setRaisedHand(params) {
    const { raised = true, memberId } = params || {};
    return this.executeAction({
      method: raised ? "call.raisehand" : "call.lowerhand",
      memberId
    });
  }
  async setLayout(params) {
    const extraParams = {
      layout: params.name,
      positions: params.positions
    };
    return this.executeAction({
      method: "call.layout.set",
      extraParams
    });
  }
  async setInputVolume(params) {
    return this.executeAction({
      method: "call.microphone.volume.set",
      memberId: params.memberId,
      extraParams: {
        volume: params.volume
      }
    });
  }
  async setOutputVolume(params) {
    return this.executeAction({
      method: "call.speaker.volume.set",
      memberId: params.memberId,
      extraParams: {
        volume: params.volume
      }
    });
  }
  async setInputSensitivity(params) {
    return this.executeAction({
      method: "call.microphone.sensitivity.set",
      memberId: params.memberId,
      extraParams: {
        sensitivity: params.value
      }
    });
  }
  async setPositions(params) {
    var _a, _b, _c;
    const targets = [];
    Object.entries(params.positions).forEach(([key, value]) => {
      const targetMember = key === "self" ? this.member : this.instanceMap.get(key);
      if (targetMember) {
        targets.push({
          target: {
            member_id: targetMember.id,
            call_id: targetMember.callId,
            node_id: targetMember.nodeId
          },
          position: value
        });
      }
    });
    if (!targets.length) {
      throw new Error("Invalid targets");
    }
    return this.execute({
      method: "call.member.position.set",
      params: {
        self: {
          member_id: (_a = this.selfMember) == null ? void 0 : _a.id,
          call_id: (_b = this.selfMember) == null ? void 0 : _b.callId,
          node_id: (_c = this.selfMember) == null ? void 0 : _c.nodeId
        },
        targets
      }
    });
  }
  async lock() {
    return this.executeAction({
      method: "call.lock"
    });
  }
  async unlock() {
    return this.executeAction({
      method: "call.unlock"
    });
  }
  async setAudioFlags(params) {
    const _a = params, { memberId } = _a, rest = __objRest(_a, ["memberId"]);
    return this.executeAction({
      method: "call.audioflags.set",
      memberId,
      extraParams: toSnakeCaseKeys(rest)
    });
  }
  async end(params) {
    return this.executeAction({
      method: "call.end",
      memberId: params == null ? void 0 : params.memberId
    });
  }
};
var isFabricRoomSession = (room) => {
  return room instanceof FabricRoomSessionConnection;
};
var createFabricRoomSessionObject = (params) => {
  const room = connect5({
    store: params.store,
    Component: FabricRoomSessionConnection
  })(params);
  return createFabricRoomSessionValidateProxy(room);
};

// src/VideoOverlays.ts
var UserOverlay = class {
  constructor(options) {
    __publicField(this, "id");
    __publicField(this, "_domElement");
    __publicField(this, "_status");
    this.id = options.id;
    this._status = "hidden";
  }
  get userId() {
    return this.id.split(OVERLAY_PREFIX)[1];
  }
  get domElement() {
    return this._domElement;
  }
  set domElement(element) {
    getLogger18().debug("Setting domElement for ", this.id);
    this._domElement = element;
  }
  get status() {
    return this._status;
  }
  set status(status) {
    this._status = status;
  }
  hide() {
    if (!this.domElement) {
      return getLogger18().warn("Missing overlay to hide");
    }
    this.domElement.style.opacity = "0";
    this.status = "hidden";
  }
  show() {
    if (!this.domElement) {
      return getLogger18().warn("Missing overlay to show");
    }
    this.domElement.style.opacity = "1";
    this.status = "visible";
  }
};
var LocalVideoOverlay = class extends UserOverlay {
  constructor(options) {
    super(options);
    __publicField(this, "_mirrored");
    __publicField(this, "_room");
    this._mirrored = options.mirrorLocalVideoOverlay;
    this._room = options.room;
    this.fabricMemberVideoMutedHandler = this.fabricMemberVideoMutedHandler.bind(this);
    this.videoMemberVideoMutedHandler = this.videoMemberVideoMutedHandler.bind(this);
    this.attachListeners();
  }
  get userId() {
    return this.id.split(SDK_PREFIX)[1];
  }
  get mirrored() {
    return this._mirrored;
  }
  attachListeners() {
    if (isFabricRoomSession(this._room)) {
      this._room.on(
        "member.updated.videoMuted",
        this.fabricMemberVideoMutedHandler
      );
    } else if (isVideoRoomSession(this._room)) {
      this._room.on(
        "member.updated.videoMuted",
        this.videoMemberVideoMutedHandler
      );
    }
  }
  /** @internal */
  detachListeners() {
    if (isFabricRoomSession(this._room)) {
      this._room.off(
        "member.updated.videoMuted",
        this.fabricMemberVideoMutedHandler
      );
    } else if (isVideoRoomSession(this._room)) {
      this._room.off(
        "member.updated.videoMuted",
        this.videoMemberVideoMutedHandler
      );
    }
  }
  memberVideoMutedHandler(memberId, videoMuted) {
    try {
      if (memberId === this._room.memberId) {
        videoMuted ? this.hide() : this.show();
      }
    } catch (error) {
      getLogger18().error("Error handling videoMuted in LocalVideoOverlay", error);
    }
  }
  fabricMemberVideoMutedHandler(params) {
    this.memberVideoMutedHandler(
      params.member.member_id,
      params.member.video_muted
    );
  }
  videoMemberVideoMutedHandler(params) {
    this.memberVideoMutedHandler(params.member.id, params.member.video_muted);
  }
  setMediaStream(stream) {
    if (!this.domElement) {
      return getLogger18().warn("Missing local overlay to set the stream");
    }
    const localVideo = this.domElement.querySelector("video");
    if (localVideo) {
      localVideo.srcObject = stream;
    }
  }
  setMirror(mirror = this._mirrored) {
    if (!this.domElement || !this.domElement.firstChild) {
      return getLogger18().warn("Missing local overlay to set the mirror");
    }
    const videoEl = this.domElement.firstChild;
    videoEl.style.transform = mirror ? "scale(-1, 1)" : "scale(1, 1)";
    videoEl.style.webkitTransform = mirror ? "scale(-1, 1)" : "scale(1, 1)";
    this._mirrored = mirror;
  }
};

// src/utils/videoElement.ts
var buildVideo = () => {
  const video = document.createElement("video");
  video.muted = true;
  video.autoplay = true;
  video.playsInline = true;
  video.addEventListener("pause", () => {
    video.play().catch((error) => {
      getLogger19().error("Video Element Paused", video, error);
    });
  });
  return video;
};
var waitForVideoReady = ({ element }) => {
  return new Promise((resolve) => {
    element.addEventListener("canplay", function listener() {
      element.removeEventListener("canplay", listener);
      resolve();
    });
    element.addEventListener("resize", function listener() {
      element.removeEventListener("resize", listener);
      resolve();
    });
  });
};
var _getLocationStyles = ({
  x,
  y,
  width,
  height
}) => {
  return {
    top: `${y}%`,
    left: `${x}%`,
    width: `${width}%`,
    height: `${height}%`
  };
};
var _buildLayer = ({ location }) => {
  const { top, left, width, height } = _getLocationStyles(location);
  const layer = document.createElement("div");
  layer.style.position = "absolute";
  layer.style.overflow = "hidden";
  layer.style.top = top;
  layer.style.left = left;
  layer.style.width = width;
  layer.style.height = height;
  return layer;
};
var _updateLayer = ({
  location,
  element
}) => {
  const { top, left, width, height } = _getLocationStyles(location);
  element.style.top = top;
  element.style.left = left;
  element.style.width = width;
  element.style.height = height;
  return element;
};
var makeLayoutChangedHandler = (params) => {
  const {
    applyLocalVideoOverlay,
    applyMemberOverlay,
    overlayMap,
    localVideoOverlay,
    mirrorLocalVideoOverlay,
    rootElement
  } = params;
  return async (params2) => {
    getLogger19().debug("Process layout.changed");
    try {
      const { layout, memberId, localStream } = params2;
      const { layers = [] } = layout;
      const mcuLayers = rootElement.querySelector(".mcuLayers");
      const fragment = document.createDocumentFragment();
      const currentOverlayIds = /* @__PURE__ */ new Set();
      if (applyLocalVideoOverlay) {
        const location = layers.find(({ member_id }) => member_id === memberId);
        const overlayId = localVideoOverlay.id;
        let myLayerEl = localVideoOverlay.domElement;
        currentOverlayIds.add(overlayId);
        if (!location) {
          getLogger19().warn("Local video overlay location not found", memberId);
          localVideoOverlay.status = "hidden";
          if (myLayerEl) {
            localVideoOverlay.hide();
          }
        } else {
          if (myLayerEl) {
            getLogger19().debug("Update local video overlay");
            _updateLayer({ location, element: myLayerEl });
          } else {
            getLogger19().debug("Build local video overlay");
            myLayerEl = _buildLayer({ location });
            myLayerEl.id = overlayId;
            const localVideo = buildVideo();
            localVideo.srcObject = localStream;
            localVideo.disablePictureInPicture = true;
            localVideo.style.width = "100%";
            localVideo.style.height = "100%";
            localVideo.style.pointerEvents = "none";
            localVideo.style.objectFit = "cover";
            myLayerEl.appendChild(localVideo);
            localVideoOverlay.domElement = myLayerEl;
            if (mirrorLocalVideoOverlay) {
              localVideoOverlay.setMirror();
            }
          }
          const hasVideo = localStream.getVideoTracks().filter((t) => t.enabled && t.readyState === "live").length > 0;
          if (hasVideo && location.visible) {
            localVideoOverlay.setMediaStream(localStream);
            localVideoOverlay.show();
          } else {
            localVideoOverlay.hide();
          }
          fragment.appendChild(myLayerEl);
        }
      }
      if (applyMemberOverlay) {
        layers.forEach((location) => {
          const memberIdInLocation = location.member_id;
          if (!memberIdInLocation) return;
          const overlayId = addOverlayPrefix(memberIdInLocation);
          currentOverlayIds.add(overlayId);
          let overlay = overlayMap.get(overlayId);
          if (overlay && overlay.domElement) {
            getLogger19().debug("Update an overlay for", memberIdInLocation);
            _updateLayer({ location, element: overlay.domElement });
          } else {
            getLogger19().debug("Build an overlay for", memberIdInLocation);
            overlay = new UserOverlay({ id: overlayId });
            overlayMap.set(overlayId, overlay);
            const newLayer = _buildLayer({ location });
            newLayer.id = `${overlayId}-${uuid()}`;
            overlay.domElement = newLayer;
          }
          if (!location.visible) {
            overlay.hide();
          } else {
            overlay.show();
          }
          fragment.appendChild(overlay.domElement);
        });
      }
      overlayMap.forEach((overlay, overlayId) => {
        if (!currentOverlayIds.has(overlayId)) {
          if (overlay.domElement && overlay.domElement.parentNode) {
            overlay.domElement.parentNode.removeChild(overlay.domElement);
          }
          overlayMap.delete(overlayId);
        }
      });
      if (mcuLayers) {
        mcuLayers.innerHTML = "";
        mcuLayers.appendChild(fragment);
      }
    } catch (error) {
      getLogger19().error("Layout Changed Error", error);
    }
  };
};
var cleanupElement = (rootElement) => {
  while (rootElement.firstChild) {
    rootElement.removeChild(rootElement.firstChild);
  }
};
var setVideoMediaTrack = ({
  track,
  element
}) => {
  element.srcObject = new MediaStream([track]);
  track.addEventListener("ended", () => {
    element.srcObject = null;
    element.remove();
  });
};
var createRootElementResizeObserver = ({
  video,
  rootElement,
  paddingWrapper
}) => {
  const computePaddingWrapperWidth = (width, height) => {
    const nativeVideoRatio = video.videoWidth / video.videoHeight;
    const rootElementRatio = width / height;
    if (nativeVideoRatio > rootElementRatio) {
      return "100%";
    } else {
      return `${height * nativeVideoRatio}px`;
    }
  };
  const update = debounce(
    ({ width, height }) => {
      const maxPaddingBottom = video.videoHeight / video.videoWidth * 100;
      if (paddingWrapper) {
        const pb = height / width * 100;
        paddingWrapper.style.paddingBottom = `${pb > maxPaddingBottom ? maxPaddingBottom : pb}%`;
        paddingWrapper.style.width = computePaddingWrapperWidth(width, height);
      }
    },
    100
  );
  const observer = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.contentBoxSize) {
        const { inlineSize, blockSize } = Array.isArray(entry.contentBoxSize) ? entry.contentBoxSize[0] : entry.contentBoxSize;
        update({ width: inlineSize, height: blockSize });
      } else if (entry.contentRect) {
        update({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
  });
  const onVideoResize = () => {
    const width = rootElement.clientWidth;
    const height = rootElement.clientHeight;
    update({ width, height });
  };
  return {
    start: () => {
      observer.observe(rootElement);
      video.addEventListener("resize", onVideoResize);
    },
    stop: () => {
      observer.disconnect();
      video.removeEventListener("resize", onVideoResize);
    }
  };
};

// src/buildVideoElement.ts
var buildVideoElement = async (params) => {
  var _a;
  try {
    const {
      room,
      rootElement: element,
      applyLocalVideoOverlay = true,
      applyMemberOverlay = true,
      mirrorLocalVideoOverlay = true
    } = params;
    let hasVideoTrack = false;
    const overlayMap = /* @__PURE__ */ new Map();
    const id = uuid2();
    let rootElement;
    if (element) {
      rootElement = element;
    } else {
      rootElement = document.createElement("div");
      rootElement.id = `rootElement-${id}`;
    }
    const overlayId = addSDKPrefix(id);
    const localVideoOverlay = new LocalVideoOverlay({
      id: overlayId,
      mirrorLocalVideoOverlay,
      room
    });
    if (applyLocalVideoOverlay) {
      overlayMap.set(overlayId, localVideoOverlay);
    }
    const makeLayout = makeLayoutChangedHandler({
      applyLocalVideoOverlay,
      applyMemberOverlay,
      overlayMap,
      localVideoOverlay,
      mirrorLocalVideoOverlay,
      rootElement
    });
    const processLayoutChanged = (params2) => {
      var _a2;
      const hasVideoSender = (_a2 = room.peer) == null ? void 0 : _a2.hasVideoSender;
      if (hasVideoSender && room.localStream) {
        makeLayout({
          layout: params2.layout,
          localStream: room.localStream,
          memberId: room.memberId
        });
      } else {
        getLogger20().debug(
          "No local video sender or local stream, hiding local video overlay",
          hasVideoSender,
          room.localStream
        );
        localVideoOverlay.hide();
      }
    };
    const layoutChangedHandler = (params2) => {
      getLogger20().debug("Received layout.changed - videoTrack", hasVideoTrack);
      if (hasVideoTrack) {
        processLayoutChanged(params2);
        return;
      }
    };
    const processVideoTrack = async (track) => {
      hasVideoTrack = true;
      await videoElementSetup({
        applyLocalVideoOverlay,
        applyMemberOverlay,
        rootElement,
        track
      });
      const roomCurrentLayoutEvent = room.currentLayoutEvent;
      if (roomCurrentLayoutEvent) {
        processLayoutChanged(roomCurrentLayoutEvent);
      }
    };
    const videoTrack = (_a = room.peer) == null ? void 0 : _a.remoteVideoTrack;
    if (videoTrack) {
      await processVideoTrack(videoTrack);
    }
    const trackHandler = async function(event) {
      if (event.track.kind === "video") {
        await processVideoTrack(event.track);
      }
    };
    const unsubscribe = () => {
      cleanupElement(rootElement);
      overlayMap.clear();
      room.overlayMap = overlayMap;
      if (isFabricRoomSession(room)) {
        room.off("track", trackHandler);
        room.off("layout.changed", layoutChangedHandler);
        room.off("destroy", unsubscribe);
      } else if (isVideoRoomSession(room)) {
        room.off("track", trackHandler);
        room.off("layout.changed", layoutChangedHandler);
        room.off("destroy", unsubscribe);
      }
      localVideoOverlay.detachListeners();
    };
    if (isFabricRoomSession(room)) {
      room.on("track", trackHandler);
      room.on("layout.changed", layoutChangedHandler);
      room.once("destroy", unsubscribe);
    } else if (isVideoRoomSession(room)) {
      room.on("track", trackHandler);
      room.on("layout.changed", layoutChangedHandler);
      room.once("destroy", unsubscribe);
    }
    room.overlayMap = overlayMap;
    room.localVideoOverlay = localVideoOverlay;
    return { element: rootElement, overlayMap, localVideoOverlay, unsubscribe };
  } catch (error) {
    getLogger20().error("Unable to build the video element");
    throw error;
  }
};
var videoElementSetup = async (options) => {
  try {
    const { applyLocalVideoOverlay, applyMemberOverlay, track, rootElement } = options;
    const videoElement = buildVideo();
    setVideoMediaTrack({ element: videoElement, track });
    videoElement.style.width = "100%";
    videoElement.style.maxHeight = "100%";
    if (rootElement.querySelector(".mcuContent")) {
      getLogger20().debug("MCU Content already there");
      return;
    }
    const mcuWrapper = document.createElement("div");
    mcuWrapper.style.position = "absolute";
    mcuWrapper.style.top = "0";
    mcuWrapper.style.left = "0";
    mcuWrapper.style.right = "0";
    mcuWrapper.style.bottom = "0";
    mcuWrapper.appendChild(videoElement);
    const paddingWrapper = document.createElement("div");
    paddingWrapper.classList.add("paddingWrapper");
    paddingWrapper.style.paddingBottom = "56.25%";
    paddingWrapper.style.position = "relative";
    paddingWrapper.style.width = "100%";
    paddingWrapper.appendChild(mcuWrapper);
    let layersWrapper = null;
    if (applyLocalVideoOverlay || applyMemberOverlay) {
      layersWrapper = document.createElement("div");
      layersWrapper.classList.add("mcuLayers");
      layersWrapper.style.display = "none";
      paddingWrapper.appendChild(layersWrapper);
    }
    const relativeWrapper = document.createElement("div");
    relativeWrapper.classList.add("mcuContent");
    relativeWrapper.style.position = "relative";
    relativeWrapper.style.width = "100%";
    relativeWrapper.style.height = "100%";
    relativeWrapper.style.margin = "0 auto";
    relativeWrapper.style.display = "flex";
    relativeWrapper.style.alignItems = "center";
    relativeWrapper.style.justifyContent = "center";
    relativeWrapper.appendChild(paddingWrapper);
    rootElement.style.width = "100%";
    rootElement.style.height = "100%";
    rootElement.appendChild(relativeWrapper);
    getLogger20().debug("MCU readyState 1 >>", videoElement.readyState);
    if (videoElement.readyState === HTMLMediaElement.HAVE_NOTHING) {
      getLogger20().debug("Wait for the MCU to be ready");
      await waitForVideoReady({ element: videoElement });
    }
    getLogger20().debug("MCU is ready..");
    const rootElementResizeObserver = createRootElementResizeObserver({
      rootElement,
      video: videoElement,
      paddingWrapper
    });
    rootElementResizeObserver.start();
    track.addEventListener("ended", () => {
      if (rootElementResizeObserver) {
        rootElementResizeObserver.stop();
      }
    });
    if (layersWrapper) {
      layersWrapper.style.display = "block";
    }
  } catch (error) {
    getLogger20().error("Handle video track error", error);
  }
};

// src/Client.ts
var ClientAPI = class extends BaseClient {
  constructor() {
    super(...arguments);
    __publicField(this, "_videoManager");
    __publicField(this, "_chat");
    __publicField(this, "_pubSub");
  }
  get rooms() {
    return {
      makeRoomObject: (makeRoomOptions) => {
        const _a = makeRoomOptions, {
          rootElement,
          applyLocalVideoOverlay = true,
          applyMemberOverlay = true,
          mirrorLocalVideoOverlay = true,
          stopCameraWhileMuted = true,
          stopMicrophoneWhileMuted = true
        } = _a, options = __objRest(_a, [
          "rootElement",
          "applyLocalVideoOverlay",
          "applyMemberOverlay",
          "mirrorLocalVideoOverlay",
          "stopCameraWhileMuted",
          "stopMicrophoneWhileMuted"
        ]);
        const customSagas = [];
        customSagas.push(
          makeAudioElementSaga({
            speakerId: options.speakerId
          })
        );
        const room = createVideoRoomSessionObject(__spreadProps(__spreadValues({}, options), {
          store: this.store,
          customSagas
        }));
        if (rootElement) {
          try {
            buildVideoElement({
              applyLocalVideoOverlay,
              applyMemberOverlay,
              mirrorLocalVideoOverlay,
              room,
              rootElement
            });
          } catch (error) {
            this.logger.error("Unable to build the video element automatically");
          }
        }
        room.on("room.subscribed", (params) => {
          var _a2;
          const member = (_a2 = params.room_session.members) == null ? void 0 : _a2.find(
            (m) => m.id === room.memberId
          );
          if (member == null ? void 0 : member.audio_muted) {
            try {
              room.stopOutboundAudio();
            } catch (error) {
              this.logger.error("Error handling audio_muted", error);
            }
          }
          if (member == null ? void 0 : member.video_muted) {
            try {
              room.stopOutboundVideo();
            } catch (error) {
              this.logger.error("Error handling video_muted", error);
            }
          }
        });
        if (stopMicrophoneWhileMuted) {
          room.on("member.updated.audio_muted", ({ member }) => {
            try {
              if (member.id === room.memberId && "audio_muted" in member) {
                member.audio_muted ? room.stopOutboundAudio() : room.restoreOutboundAudio();
              }
            } catch (error) {
              this.logger.error("Error handling audio_muted", error);
            }
          });
        }
        if (stopCameraWhileMuted) {
          room.on("member.updated.video_muted", ({ member }) => {
            try {
              if (member.id === room.memberId && "video_muted" in member) {
                member.video_muted ? room.stopOutboundVideo() : room.restoreOutboundVideo();
              }
            } catch (error) {
              this.logger.error("Error handling video_muted", error);
            }
          });
        }
        return room;
      }
    };
  }
  get chat() {
    if (!this._chat) {
      this._chat = ChatNamespace.createBaseChatObject({
        store: this.store
      });
    }
    return this._chat;
  }
  get pubSub() {
    if (!this._pubSub) {
      this._pubSub = PubSubNamespace.createBasePubSubObject({
        store: this.store
      });
    }
    return this._pubSub;
  }
  /** @internal */
  get videoManager() {
    if (!this._videoManager) {
      this._videoManager = createVideoManagerObject(this.options);
    }
    return this._videoManager;
  }
  /**
   * Reauthenticate with the SignalWire network using a new token
   * For now it returns void since with an invalid token the server
   * will close the connection right away so we can hook on the session
   * events in case. Need to improve it.
   *
   * @internal
   */
  reauthenticate(token) {
    this.store.dispatch(actions3.reauthAction({ token }));
  }
};

// src/JWTSession.ts
import jwtDecode2 from "jwt-decode";
import {
  BaseJWTSession,
  getLogger as getLogger21
} from "@signalwire/core";

// src/utils/CloseEvent.ts
import { SWCloseEvent as CoreCloseEvent } from "@signalwire/core";
var SwCloseEvent = typeof CloseEvent === "function" ? CloseEvent : CoreCloseEvent;

// src/JWTSession.ts
var JWTSession = class extends BaseJWTSession {
  constructor(options) {
    var _a;
    let decodedJwt = {};
    try {
      decodedJwt = jwtDecode2(options.token, {
        header: true
      });
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        getLogger21().debug("[JWTSession] error decoding the JWT");
      }
    }
    super(__spreadProps(__spreadValues({}, options), {
      host: (decodedJwt == null ? void 0 : decodedJwt.ch) || options.host
    }));
    this.options = options;
    __publicField(this, "WebSocketConstructor", WebSocket);
    __publicField(this, "CloseEventConstructor", SwCloseEvent);
    __publicField(this, "agent", "@signalwire/js/browser/3.30.0");
    __publicField(this, "tokenTyp");
    this.tokenTyp = (_a = decodedJwt.typ) != null ? _a : "VRT";
  }
  get allowReattach() {
    var _a;
    return ((_a = this.options) == null ? void 0 : _a.reattach) !== false && (this.isVRT() || this.isSAT());
  }
  async retrieveRelayProtocol() {
    var _a, _b;
    if (!this.allowReattach) {
      return "";
    }
    const { protocolKey } = sessionStorageManager(this.options.token);
    if (protocolKey) {
      this.logger.trace("Search protocol for", protocolKey);
      return (_b = (_a = getStorage()) == null ? void 0 : _a.getItem(protocolKey)) != null ? _b : "";
    }
    return "";
  }
  async persistRelayProtocol() {
    var _a;
    if (!this.allowReattach) {
      return;
    }
    const { protocolKey } = sessionStorageManager(this.options.token);
    if (protocolKey) {
      this.logger.trace("Persist protocol", protocolKey, this.relayProtocol);
      (_a = getStorage()) == null ? void 0 : _a.setItem(protocolKey, this.relayProtocol);
    }
  }
  removeRelayProtocol() {
    var _a;
    const { protocolKey } = sessionStorageManager(this.options.token);
    if (protocolKey) {
      this.logger.debug("Remove protocol", protocolKey, this.relayProtocol);
      (_a = getStorage()) == null ? void 0 : _a.removeItem(protocolKey);
    }
  }
  removePrevCallId() {
    var _a;
    const { callIdKey } = sessionStorageManager(this.options.token);
    if (callIdKey) {
      this.logger.debug("Remove Call", callIdKey);
      (_a = getStorage()) == null ? void 0 : _a.removeItem(callIdKey);
    }
  }
  async retrieveSwAuthorizationState() {
    var _a, _b;
    const { authStateKey } = sessionStorageManager(this.options.token);
    if (authStateKey) {
      return (_b = (_a = getStorage()) == null ? void 0 : _a.getItem(authStateKey)) != null ? _b : "";
    }
    return "";
  }
  async persistSwAuthorizationState(state) {
    var _a;
    if (!this.allowReattach) {
      return;
    }
    const { authStateKey } = sessionStorageManager(this.options.token);
    if (authStateKey) {
      this.logger.trace("Persist auth state", authStateKey, state);
      (_a = getStorage()) == null ? void 0 : _a.setItem(authStateKey, state);
    }
  }
  removeSwAuthorizationState() {
    var _a;
    const { authStateKey } = sessionStorageManager(this.options.token);
    if (authStateKey) {
      this.logger.trace("Remove auth state", authStateKey);
      (_a = getStorage()) == null ? void 0 : _a.removeItem(authStateKey);
    }
  }
  _onSocketClose(event) {
    var _a, _b, _c;
    if (this.status === "disconnected") {
      const { protocolKey, authStateKey, callIdKey } = sessionStorageManager(
        this.options.token
      );
      this.logger.debug("Cleaning up storage");
      if (protocolKey) {
        this.logger.debug("Remove protocolKey", protocolKey);
        (_a = getStorage()) == null ? void 0 : _a.removeItem(protocolKey);
      }
      if (authStateKey) {
        this.logger.debug("Remove authStateKey", authStateKey);
        (_b = getStorage()) == null ? void 0 : _b.removeItem(authStateKey);
      }
      if (callIdKey) {
        this.logger.debug("Remove callIdKey", callIdKey);
        (_c = getStorage()) == null ? void 0 : _c.removeItem(callIdKey);
      }
    }
    super._onSocketClose(event);
  }
  isVRT() {
    return this.tokenTyp === "VRT";
  }
  isSAT() {
    return this.tokenTyp === "SAT";
  }
};

// src/createClient.ts
var createClient = (userOptions) => {
  const baseUserOptions = __spreadProps(__spreadValues({}, userOptions), {
    emitter: getEventEmitter()
  });
  const store = configureStore({
    userOptions: baseUserOptions,
    SessionConstructor: JWTSession
  });
  const client = connect6({
    store,
    Component: ClientAPI
  })(baseUserOptions);
  return client;
};

// src/chat/Client.ts
var INTERCEPTED_METHODS = [
  "subscribe",
  "publish",
  "getMessages",
  "getMembers",
  "getMemberState",
  "getAllowedChannels",
  "setMemberState"
];
var Client2 = function(chatOptions) {
  const client = createClient(chatOptions);
  const createInterceptor = (prop) => {
    return async (...params) => {
      await client.connect();
      return client.chat[prop](...params);
    };
  };
  const interceptors = {
    _session: client,
    disconnect: () => client.disconnect()
  };
  return new Proxy(client.chat, {
    get(target, prop, receiver) {
      if (prop in interceptors) {
        return interceptors[prop];
      }
      if (INTERCEPTED_METHODS.includes(prop)) {
        return createInterceptor(prop);
      }
      return Reflect.get(target, prop, receiver);
    }
  });
};

// src/chat/index.ts
import { ChatMember, ChatMessage } from "@signalwire/core";

// src/pubSub/index.ts
var pubSub_exports = {};
__export(pubSub_exports, {
  Client: () => Client3,
  PubSubMessage: () => PubSubMessage
});
import { PubSub } from "@signalwire/core";

// src/utils/interfaces/video.ts
import { INTERNAL_MEMBER_UPDATABLE_PROPS } from "@signalwire/core";
var INTERNAL_MEMBER_UPDATED_EVENTS = Object.keys(
  INTERNAL_MEMBER_UPDATABLE_PROPS
).map((key) => {
  return `member.updated.${key}`;
});

// src/pubSub/Client.ts
var INTERCEPTED_METHODS2 = [
  "getAllowedChannels",
  "subscribe",
  "publish"
];
var Client3 = function(pubSubOptions) {
  const client = createClient(pubSubOptions);
  const createInterceptor = (prop) => {
    return async (...params) => {
      await client.connect();
      return client.pubSub[prop](...params);
    };
  };
  const interceptors = {
    _session: client,
    disconnect: () => client.disconnect()
  };
  return new Proxy(client.pubSub, {
    get(target, prop, receiver) {
      if (prop in interceptors) {
        return interceptors[prop];
      }
      if (INTERCEPTED_METHODS2.includes(prop)) {
        return createInterceptor(prop);
      }
      return Reflect.get(target, prop, receiver);
    }
  });
};

// src/pubSub/index.ts
var PubSubMessage = PubSub.PubSubMessage;

// src/fabric/index.ts
var fabric_exports = {};
__export(fabric_exports, {
  SignalWire: () => SignalWire,
  isFabricRoomSession: () => isFabricRoomSession
});

// src/fabric/HTTPClient.ts
import jwtDecode3 from "jwt-decode";
import { getLogger as getLogger22, HttpError as HttpError2 } from "@signalwire/core";

// src/fabric/createHttpClient.ts
import {
  asyncRetry,
  AuthError,
  HttpError,
  increasingDelay
} from "@signalwire/core";
var DEFAULT_MAX_RETRIES = 0;
var DEFAULT_INITIAL_DELAY = 0;
var DEFAULT_DELAY_VARIATION = 0;
var DEFAULT_TIMEOUT = 3e4;
async function http(input, init, maxRetries, retriesDelay, retriesDelayIncrement) {
  const response = await asyncRetry({
    asyncCallable: () => fetch(input, init),
    maxRetries,
    validator: (response2) => {
      if (!response2.ok && response2.status >= 500) {
        throw new HttpError(response2.status, response2.statusText);
      }
    },
    delayFn: increasingDelay({
      initialDelay: retriesDelay,
      variation: retriesDelayIncrement
    })
  });
  if (!response.ok) {
    if (response.status === 401) {
      throw new AuthError(response.status, "Unauthorized");
    }
    let errorResponse;
    try {
      errorResponse = await response.json();
    } catch (e) {
    }
    const errorMessage = (errorResponse == null ? void 0 : errorResponse.errors) ? JSON.stringify(errorResponse.errors) : "Not Found";
    throw new HttpError(response.status, errorMessage, errorResponse);
  }
  try {
    response.parsedBody = await response.json();
  } catch (e) {
  }
  return response;
}
var createHttpClient = (_a, fetcher = http) => {
  var _b = _a, {
    baseUrl,
    maxApiRequestRetries: retries = DEFAULT_MAX_RETRIES,
    apiRequestRetriesDelay: retriesDelay = DEFAULT_INITIAL_DELAY,
    apiRequestRetriesDelayIncrement: retriesDelayIncrement = DEFAULT_DELAY_VARIATION,
    timeout = DEFAULT_TIMEOUT
  } = _b, globalOptions = __objRest(_b, [
    "baseUrl",
    "maxApiRequestRetries",
    "apiRequestRetriesDelay",
    "apiRequestRetriesDelayIncrement",
    "timeout"
  ]);
  const apiClient = async (path, options) => {
    const headers = __spreadValues(__spreadValues(__spreadValues({}, (options == null ? void 0 : options.body) ? { "Content-Type": "application/json" } : {}), globalOptions.headers), options == null ? void 0 : options.headers);
    const reqInit = getRequestInit(__spreadProps(__spreadValues(__spreadValues({}, globalOptions), options), {
      headers
    }));
    let timerId;
    if (timeout) {
      const controller = new AbortController();
      const signal = controller.signal;
      reqInit.signal = signal;
      timerId = setTimeout(() => {
        controller.abort();
      }, timeout);
    }
    try {
      const response = await fetcher(
        getUrl({
          path,
          baseUrl,
          searchParams: options == null ? void 0 : options.searchParams
        }),
        reqInit,
        retries,
        retriesDelay,
        retriesDelayIncrement
      );
      return { body: response.parsedBody };
    } catch (e) {
      throw e;
    } finally {
      timerId && clearTimeout(timerId);
    }
  };
  return apiClient;
};
var getBody = (body) => {
  return typeof body === "string" ? body : JSON.stringify(body);
};
var getRequestInit = (options) => {
  return Object.entries(options).reduce((reducer, [key, value]) => {
    if (key === "body") {
      return __spreadProps(__spreadValues({}, reducer), {
        body: getBody(value)
      });
    } else if (value != void 0) {
      return __spreadProps(__spreadValues({}, reducer), {
        [key]: value
      });
    }
    return reducer;
  }, {});
};
var getUrl = ({
  path,
  baseUrl,
  searchParams
}) => {
  const url = new URL(path, baseUrl);
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value != void 0) {
        url.searchParams.append(key, value);
      }
    });
  }
  return url.toString();
};

// src/utils/paginatedResult.ts
function buildPaginatedResult(body, client) {
  const anotherPage = async (url) => {
    if (!url) return Promise.resolve(void 0);
    const { body: body2 } = await client(url);
    return buildPaginatedResult(body2, client);
  };
  return {
    data: body.data,
    self: async () => {
      const { self } = body.links;
      return anotherPage(self);
    },
    nextPage: async () => {
      const { next } = body.links;
      return anotherPage(next);
    },
    prevPage: async () => {
      const { prev } = body.links;
      return anotherPage(prev);
    },
    firstPage: async () => {
      const { first } = body.links;
      return anotherPage(first);
    },
    hasNext: Boolean(body.links.next),
    hasPrev: Boolean(body.links.prev)
  };
}

// src/utils/makeQueryParamsUrl.ts
function makeQueryParamsUrls(path, queryParams) {
  const queryString = queryParams.toString();
  return queryString ? `${path}?${queryString}` : path;
}

// src/fabric/utils/typeGuard.ts
var isGetAddressByNameParams = (obj) => {
  return obj && "name" in obj;
};
var isGetAddressByIdParams = (obj) => {
  return obj && "id" in obj;
};
var isGetAddressesResponse = (obj) => {
  return obj && "data" in obj;
};

// src/fabric/HTTPClient.ts
var HTTPClient = class {
  constructor(options) {
    this.options = options;
    __publicField(this, "httpClient");
    this.httpClient = createHttpClient({
      baseUrl: `https://${this.httpHost}`,
      headers: {
        Authorization: `Bearer ${this.options.token}`
      },
      maxApiRequestRetries: this.options.maxApiRequestRetries,
      apiRequestRetriesDelay: this.options.apiRequestRetriesDelay,
      apiRequestRetriesDelayIncrement: this.options.apiRequestRetriesDelayIncrement
    });
  }
  get fetch() {
    return this.httpClient;
  }
  get httpHost() {
    let decodedJwt = {};
    try {
      decodedJwt = jwtDecode3(this.options.token, {
        header: true
      });
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        getLogger22().debug("[JWTSession] error decoding the JWT");
      }
    }
    const host = this.options.host || (decodedJwt == null ? void 0 : decodedJwt.ch);
    if (!host) {
      return "fabric.signalwire.com";
    }
    return `fabric.${host.split(".").splice(1).join(".")}`;
  }
  async getAddress(params) {
    let path = "/api/fabric/addresses";
    if (isGetAddressByNameParams(params)) {
      path = `${path}?name=${params.name}`;
    } else if (isGetAddressByIdParams(params)) {
      path = `${path}/${params.id}`;
    }
    const { body } = await this.httpClient(path);
    if (isGetAddressesResponse(body)) {
      if (!body.data[0]) throw new HttpError2(404, "Not Found");
      return body.data[0];
    }
    return body;
  }
  async getAddresses(params) {
    const { type, displayName, pageSize, sortBy, sortOrder } = params || {};
    let path = "/api/fabric/addresses";
    const queryParams = new URLSearchParams();
    if (type) {
      queryParams.append("type", type);
    }
    if (displayName) {
      queryParams.append("display_name", displayName);
    }
    if (pageSize) {
      queryParams.append("page_size", pageSize.toString());
    }
    if (sortBy) {
      queryParams.append("sort_by", sortBy);
    }
    if (sortOrder) {
      queryParams.append("sort_order", sortOrder);
    }
    const queryUrl = makeQueryParamsUrls(path, queryParams);
    getLogger22().debug(`[getAddresses] query URL ${queryUrl}`);
    const { body } = await this.httpClient(queryUrl);
    return buildPaginatedResult(body, this.httpClient);
  }
  async registerDevice(params) {
    const { deviceType, deviceToken } = params;
    const path = "/subscriber/devices";
    const { body } = await this.httpClient(path, {
      method: "POST",
      body: {
        device_type: deviceType,
        device_token: deviceToken
      }
    });
    return body;
  }
  async unregisterDevice(params) {
    const { id } = params;
    const path = `/subscriber/devices/${id}`;
    await this.httpClient(path, {
      method: "DELETE"
    });
  }
  async getSubscriberInfo() {
    let path = "/api/fabric/subscriber/info";
    const { body } = await this.httpClient(path);
    return body;
  }
};

// src/fabric/WSClient.ts
import {
  actions as actions4,
  BaseClient as BaseClient2,
  VertoBye,
  VertoSubscribe
} from "@signalwire/core";

// src/fabric/IncomingCallManager.ts
var IncomingCallManager = class {
  constructor(options) {
    this.options = options;
    __publicField(this, "_client");
    __publicField(this, "_pendingInvites", {});
    __publicField(this, "_handlers", {});
    this._client = options.client;
  }
  _buildNotification(invite) {
    const accept = async (params) => {
      return new Promise((resolve, reject2) => {
        delete this._pendingInvites[invite.callID];
        try {
          const call = this.options.buildInboundCall(invite, params);
          call.answer();
          resolve(call);
        } catch (e) {
          reject2(e);
        }
      });
    };
    const reject = () => {
      delete this._pendingInvites[invite.callID];
      return this.options.executeVertoBye(invite.callID, invite.nodeId);
    };
    return {
      invite: {
        details: invite,
        accept: (params) => accept(params),
        reject: () => reject()
      }
    };
  }
  setNotificationHandlers(handlers) {
    this._handlers.all = handlers.all;
    if (handlers.pushNotification && this._handlers.all != handlers.pushNotification || !handlers.pushNotification) {
      this._handlers.pushNotification = handlers.pushNotification;
    }
    if (handlers.websocket && this._handlers.all != handlers.websocket || !handlers.websocket) {
      this._handlers.websocket = handlers.websocket;
    }
  }
  handleIncomingInvite(incomingInvite) {
    var _a, _b;
    if (incomingInvite.callID in this._pendingInvites) {
      this._client.logger.debug(
        `skiping nottification for pending invite to callID: ${incomingInvite.callID}`
      );
      return;
    }
    this._pendingInvites[incomingInvite.callID] = incomingInvite;
    if (!(this._handlers.all || this._handlers[incomingInvite.source])) {
      this._client.logger.warn("Skiping nottification due to no listeners");
      return;
    }
    const notification = this._buildNotification(incomingInvite);
    (_b = (_a = this._handlers).all) == null ? void 0 : _b.call(_a, notification);
    const handler = this._handlers[incomingInvite.source];
    handler == null ? void 0 : handler(notification);
  }
};

// src/fabric/createWSClient.ts
import { configureStore as configureStore2 } from "@signalwire/core";

// src/fabric/SATSession.ts
import {
  asyncRetry as asyncRetry2,
  increasingDelay as increasingDelay2,
  RPCReauthenticate,
  UNIFIED_CONNECT_VERSION,
  isConnectRequest,
  getLogger as getLogger23,
  isVertoInvite,
  SYMBOL_EXECUTE_CONNECTION_CLOSED,
  SYMBOL_EXECUTE_TIMEOUT
} from "@signalwire/core";
var SATSession = class extends JWTSession {
  constructor(options) {
    super(options);
    this.options = options;
    __publicField(this, "connectVersion", UNIFIED_CONNECT_VERSION);
  }
  get signature() {
    if (this._rpcConnectResult) {
      const { authorization } = this._rpcConnectResult;
      return authorization.jti;
    }
    return void 0;
  }
  async _checkTokenExpiration() {
  }
  /**
   * Reauthenticate with the SignalWire Network using a newer SAT.
   * If the session has expired, this will reconnect it.
   * @return Promise<void>
   */
  async reauthenticate() {
    this.logger.debug("Session Reauthenticate", {
      ready: this.ready,
      expired: this.expired
    });
    if (!this.ready || this.expired) {
      return this.connect();
    }
    const params = {
      project: this._rpcConnectResult.authorization.project_id,
      jwt_token: this.options.token
    };
    try {
      const reauthResponse = await this.execute(RPCReauthenticate(params));
      this._rpcConnectResult = __spreadValues(__spreadValues({}, this._rpcConnectResult), reauthResponse);
    } catch (error) {
      throw error;
    }
  }
  async execute(msg) {
    return asyncRetry2({
      asyncCallable: async () => {
        await this._waitConnected();
        return super.execute(msg);
      },
      maxRetries: this.options.maxApiRequestRetries,
      delayFn: increasingDelay2({
        initialDelay: this.options.apiRequestRetriesDelay,
        variation: this.options.apiRequestRetriesDelayIncrement
      }),
      expectedErrorHandler: (error) => {
        getLogger23().warn(error);
        if (isConnectRequest(msg)) {
          return true;
        }
        if (isVertoInvite(msg) && ![SYMBOL_EXECUTE_CONNECTION_CLOSED, SYMBOL_EXECUTE_TIMEOUT].includes(error)) {
          getLogger23().debug("skip verto.invite retry on error:", error);
          return true;
        }
        return false;
      }
    });
  }
};

// src/fabric/createWSClient.ts
var createWSClient = (options) => {
  const store = configureStore2({
    userOptions: options,
    SessionConstructor: SATSession
  });
  return __spreadProps(__spreadValues({}, options), { store });
};

// src/fabric/WSClient.ts
var WSClient = class extends BaseClient2 {
  constructor(wsClientOptions) {
    const client = createWSClient(wsClientOptions);
    super(client);
    this.wsClientOptions = wsClientOptions;
    __publicField(this, "_incomingCallManager");
    __publicField(this, "_disconnected", false);
    this._incomingCallManager = new IncomingCallManager({
      client: this,
      buildInboundCall: this.buildInboundCall.bind(this),
      executeVertoBye: this.executeVertoBye.bind(this)
    });
    this.runWorker("wsClientWorker", {
      worker: wsClientWorker,
      initialState: {
        handleIncomingInvite: (invite) => {
          this._incomingCallManager.handleIncomingInvite(__spreadValues({
            source: "websocket"
          }, invite));
        }
      }
    });
  }
  makeFabricObject(makeRoomOptions) {
    const _a = makeRoomOptions, {
      rootElement,
      applyLocalVideoOverlay = true,
      applyMemberOverlay = true,
      stopCameraWhileMuted = true,
      stopMicrophoneWhileMuted = true,
      mirrorLocalVideoOverlay = true
    } = _a, options = __objRest(_a, [
      "rootElement",
      "applyLocalVideoOverlay",
      "applyMemberOverlay",
      "stopCameraWhileMuted",
      "stopMicrophoneWhileMuted",
      "mirrorLocalVideoOverlay"
    ]);
    const room = createFabricRoomSessionObject(__spreadProps(__spreadValues({}, options), {
      store: this.store
    }));
    if (rootElement) {
      try {
        buildVideoElement({
          applyLocalVideoOverlay,
          applyMemberOverlay,
          mirrorLocalVideoOverlay,
          room,
          rootElement
        });
      } catch (error) {
        this.logger.error("Unable to build the video element automatically");
      }
    }
    const joinMutedHandler = (params) => {
      var _a2;
      const member = (_a2 = params.room_session.members) == null ? void 0 : _a2.find(
        (m) => m.member_id === room.memberId
      );
      if (member == null ? void 0 : member.audio_muted) {
        try {
          room.stopOutboundAudio();
        } catch (error) {
          this.logger.error("Error handling audio_muted", error);
        }
      }
      if (member == null ? void 0 : member.video_muted) {
        try {
          room.stopOutboundVideo();
        } catch (error) {
          this.logger.error("Error handling video_muted", error);
        }
      }
    };
    room.on("room.subscribed", joinMutedHandler);
    if (stopMicrophoneWhileMuted) {
      room.on("member.updated.audioMuted", ({ member }) => {
        try {
          if (member.member_id === room.memberId && "audio_muted" in member) {
            member.audio_muted ? room.stopOutboundAudio() : room.restoreOutboundAudio();
          }
        } catch (error) {
          this.logger.error("Error handling audio_muted", error);
        }
      });
    }
    if (stopCameraWhileMuted) {
      room.on("member.updated.videoMuted", ({ member }) => {
        try {
          if (member.member_id === room.memberId && "video_muted" in member) {
            member.video_muted ? room.stopOutboundVideo() : room.restoreOutboundVideo();
          }
        } catch (error) {
          this.logger.error("Error handling video_muted", error);
        }
      });
    }
    return room;
  }
  buildOutboundCall(params) {
    var _a, _b, _c, _d, _e, _f;
    let video = false;
    let negotiateVideo = false;
    if (params.to) {
      const [pathname, query] = params.to.split("?");
      if (!pathname) {
        throw new Error("Invalid destination address");
      }
      const queryParams = new URLSearchParams(query);
      const channel = queryParams.get("channel");
      if (channel === "video") {
        video = true;
        negotiateVideo = true;
      }
    }
    const call = this.makeFabricObject({
      audio: (_a = params.audio) != null ? _a : true,
      video: (_b = params.video) != null ? _b : video,
      negotiateAudio: (_c = params.negotiateAudio) != null ? _c : true,
      negotiateVideo: (_d = params.negotiateVideo) != null ? _d : negotiateVideo,
      rootElement: params.rootElement || this.wsClientOptions.rootElement,
      applyLocalVideoOverlay: params.applyLocalVideoOverlay,
      applyMemberOverlay: params.applyMemberOverlay,
      stopCameraWhileMuted: params.stopCameraWhileMuted,
      stopMicrophoneWhileMuted: params.stopMicrophoneWhileMuted,
      mirrorLocalVideoOverlay: params.mirrorLocalVideoOverlay,
      watchMediaPackets: false,
      destinationNumber: (_e = params.to) != null ? _e : "",
      nodeId: params.nodeId,
      attach: (_f = params.attach) != null ? _f : false,
      disableUdpIceServers: params.disableUdpIceServers || false,
      userVariables: params.userVariables || this.wsClientOptions.userVariables,
      fromFabricAddressId: params.fromFabricAddressId
    });
    call.once("destroy", () => {
      this.logger.debug("RTC Connection Destroyed");
      call.destroy();
    });
    this.session.once("session.disconnected", () => {
      this.logger.debug("Session Disconnected");
      call.destroy();
      this.destroy();
    });
    call.attachPreConnectWorkers();
    return call;
  }
  buildInboundCall(payload, params) {
    var _a, _b, _c, _d;
    const call = this.makeFabricObject({
      audio: (_a = params.audio) != null ? _a : true,
      video: (_b = params.video) != null ? _b : true,
      negotiateAudio: (_c = params.negotiateAudio) != null ? _c : true,
      negotiateVideo: (_d = params.negotiateVideo) != null ? _d : true,
      rootElement: params.rootElement || this.wsClientOptions.rootElement,
      applyLocalVideoOverlay: true,
      applyMemberOverlay: true,
      stopCameraWhileMuted: true,
      stopMicrophoneWhileMuted: true,
      watchMediaPackets: false,
      nodeId: payload.nodeId,
      remoteSdp: payload.sdp,
      prevCallId: payload.callID,
      disableUdpIceServers: params.disableUdpIceServers || false,
      userVariables: params.userVariables || this.wsClientOptions.userVariables
    });
    call.once("destroy", () => {
      this.logger.debug("RTC Connection Destroyed");
      call.destroy();
    });
    this.session.once("session.disconnected", () => {
      this.logger.debug("Session Disconnected");
      call.destroy();
      this.destroy();
    });
    call.attachPreConnectWorkers();
    return call;
  }
  async executeVertoBye(callId, nodeId) {
    try {
      return await this.execute({
        method: "webrtc.verto",
        params: {
          callID: callId,
          node_id: nodeId,
          message: VertoBye({
            cause: "USER_BUSY",
            causeCode: "17",
            dialogParams: { callID: callId }
          })
        }
      });
    } catch (error) {
      this.logger.warn("The call is not available anymore", callId);
      throw error;
    }
  }
  async executeVertoSubscribe(callId, nodeId) {
    try {
      return await this.execute({
        method: "webrtc.verto",
        params: {
          callID: callId,
          node_id: nodeId,
          subscribe: [],
          message: VertoSubscribe({
            sessid: callId,
            eventChannel: []
          })
        }
      });
    } catch (error) {
      this.logger.warn("The call is not available anymore", callId);
      throw error;
    }
  }
  disconnect() {
    return new Promise((resolve, _reject) => {
      if (this._disconnected) {
        resolve();
      }
      this.session.once("session.disconnected", () => {
        this.destroy();
        resolve();
        this._disconnected = true;
      });
      super.disconnect();
    });
  }
  async dial(params) {
    return new Promise(async (resolve, reject) => {
      var _a;
      try {
        (_a = getStorage()) == null ? void 0 : _a.removeItem(PREVIOUS_CALLID_STORAGE_KEY);
        const call = this.buildOutboundCall(params);
        resolve(call);
      } catch (error) {
        this.logger.error("Unable to connect and dial a call", error);
        reject(error);
      }
    });
  }
  async reattach(params) {
    return new Promise(async (resolve, reject) => {
      try {
        const call = this.buildOutboundCall(__spreadProps(__spreadValues({}, params), { attach: true }));
        resolve(call);
      } catch (error) {
        this.logger.error("Unable to connect and reattach a call", error);
        reject(error);
      }
    });
  }
  handlePushNotification(params) {
    const { incomingCallHandler } = params;
    this._incomingCallManager.setNotificationHandlers({
      pushNotification: incomingCallHandler
    });
    return new Promise(
      async (resolve, reject) => {
        const { decrypted, type } = params;
        if (type !== "call_invite") {
          this.logger.warn("Unknown notification type", params);
          reject("Unknown notification type");
        }
        this.logger.debug("handlePushNotification", params);
        const {
          params: { params: payload },
          node_id: nodeId
        } = decrypted;
        try {
          try {
            await this.executeVertoSubscribe(payload.callID, nodeId);
          } catch (error) {
            this.logger.warn("Verto Subscribe", error);
          }
          this._incomingCallManager.handleIncomingInvite(__spreadValues({
            source: "pushNotification",
            nodeId
          }, payload));
          resolve({ resultType: "inboundCall" });
        } catch (error) {
          reject(error);
        }
      }
    );
  }
  updateToken(token) {
    return new Promise((resolve, reject) => {
      this.session.once("session.auth_error", (error) => {
        reject(error);
      });
      this.session.once("session.connected", () => {
        resolve();
      });
      this.store.dispatch(actions4.reauthAction({ token }));
    });
  }
  /**
   * Mark the client as 'online' to receive calls over WebSocket
   */
  async online({ incomingCallHandlers }) {
    if (incomingCallHandlers.all || incomingCallHandlers.pushNotification) {
      this.logger.warn(
        `Make sure the device is not registered to receive Push Notifications while it is online`
      );
    }
    this._incomingCallManager.setNotificationHandlers(incomingCallHandlers);
    return this.execute({
      method: "subscriber.online",
      params: {}
    });
  }
  /**
   * Mark the client as 'offline' to receive calls over WebSocket
   */
  offline() {
    this._incomingCallManager.setNotificationHandlers({});
    return this.execute({
      method: "subscriber.offline",
      params: {}
    });
  }
};

// src/fabric/SignalWire.ts
var SignalWire = /* @__PURE__ */ (() => {
  let instance = null;
  return (params) => {
    if (!instance) {
      instance = new Promise(async (resolve, reject) => {
        try {
          const options = __spreadValues({
            maxApiRequestRetries: DEFAULT_API_REQUEST_RETRIES,
            apiRequestRetriesDelay: DEFAULT_API_REQUEST_RETRIES_DELAY,
            apiRequestRetriesDelayIncrement: DEFAULT_API_REQUEST_RETRIES_DELAY_INCREMENT
          }, params);
          const wsClient = new WSClient(options);
          const httpClient = new HTTPClient(options);
          const conversationError = (method) => {
            return () => {
              throw new Error(
                `This version Conversation.${method} is unsupported by the backend. Use @signalwire/client instead.`
              );
            };
          };
          await wsClient.connect();
          resolve({
            registerDevice: httpClient.registerDevice.bind(httpClient),
            unregisterDevice: httpClient.unregisterDevice.bind(httpClient),
            getSubscriberInfo: httpClient.getSubscriberInfo.bind(httpClient),
            disconnect: async () => {
              await wsClient.disconnect();
              instance = null;
            },
            online: wsClient.online.bind(wsClient),
            offline: wsClient.offline.bind(wsClient),
            dial: wsClient.dial.bind(wsClient),
            reattach: wsClient.reattach.bind(wsClient),
            handlePushNotification: wsClient.handlePushNotification.bind(wsClient),
            updateToken: wsClient.updateToken.bind(wsClient),
            address: {
              getAddresses: httpClient.getAddresses.bind(httpClient),
              getAddress: httpClient.getAddress.bind(httpClient)
            },
            conversation: {
              getConversations: conversationError(
                "getConversations"
              ),
              getMessages: conversationError(
                "getMessages"
              ),
              getConversationMessages: conversationError(
                "getConversationMessages"
              ),
              subscribe: conversationError(
                "subscribe"
              ),
              sendMessage: conversationError(
                "sendMessage"
              ),
              join: conversationError(
                "join"
              )
            },
            chat: {
              getMessages: conversationError(
                "getMessages"
              ),
              subscribe: conversationError(
                "subscribe"
              ),
              sendMessage: conversationError(
                "sendMessage"
              ),
              join: conversationError(
                "join"
              )
            },
            // @ts-expect-error For debugging purposes
            on: wsClient.on.bind(wsClient),
            off: wsClient.off.bind(wsClient),
            __httpClient: httpClient,
            __wsClient: wsClient
          });
        } catch (error) {
          reject(error);
        }
      }).catch((error) => {
        instance = null;
        throw error;
      });
    }
    return instance;
  };
})();

// src/video/index.ts
var video_exports = {};
__export(video_exports, {
  RoomSession: () => RoomSession,
  createClient: () => createClient,
  createRoomObject: () => createRoomObject,
  isVideoRoomSession: () => isVideoRoomSession,
  joinRoom: () => joinRoom
});

// src/createRoomObject.ts
import { getLogger as getLogger24 } from "@signalwire/core";
var VIDEO_CONSTRAINTS = {
  aspectRatio: { ideal: 16 / 9 }
};
var createRoomObject = (roomOptions) => {
  return new Promise(async (resolve, reject) => {
    const _a = roomOptions, {
      audio = true,
      video = true,
      iceServers,
      rootElementId,
      applyLocalVideoOverlay = true,
      autoJoin = false,
      stopCameraWhileMuted = true,
      stopMicrophoneWhileMuted = true,
      speakerId
    } = _a, userOptions = __objRest(_a, [
      "audio",
      "video",
      "iceServers",
      "rootElementId",
      "applyLocalVideoOverlay",
      "autoJoin",
      "stopCameraWhileMuted",
      "stopMicrophoneWhileMuted",
      "speakerId"
    ]);
    const client = createClient(__spreadValues({}, userOptions));
    await client.connect();
    if (!client) {
      return;
    }
    let rootElement;
    if (rootElementId) {
      const el = document.getElementById(rootElementId);
      if (el) {
        rootElement = el;
      } else {
        rootElement = document.body;
        getLogger24().warn(
          `We couldn't find an element with id: ${rootElementId}: using 'document.body' instead.`
        );
      }
    }
    const roomObject = client.rooms.makeRoomObject({
      audio,
      video: video === true ? VIDEO_CONSTRAINTS : video,
      negotiateAudio: true,
      negotiateVideo: true,
      iceServers,
      rootElement,
      applyLocalVideoOverlay,
      stopCameraWhileMuted,
      stopMicrophoneWhileMuted,
      speakerId
    });
    roomObject.once("destroy", () => {
      roomObject.emit("room.left");
      client.disconnect();
    });
    const join = () => {
      return new Promise(async (resolve2, reject2) => {
        try {
          roomObject.once("room.subscribed", (_payload) => {
            resolve2(roomObject);
          });
          await roomObject.join();
        } catch (error) {
          getLogger24().error("Join", error);
          client.disconnect();
          reject2(error);
        }
      });
    };
    const room = new Proxy(roomObject, {
      get(target, prop, receiver) {
        if (prop === "join") {
          return join;
        }
        return Reflect.get(target, prop, receiver);
      }
    });
    if (autoJoin) {
      try {
        await room.join();
        resolve(room);
      } catch (error) {
        reject(error);
      }
    } else {
      resolve(room);
    }
  });
};

// src/joinRoom.ts
var joinRoom = (roomOptions) => {
  return createRoomObject(__spreadProps(__spreadValues({}, roomOptions), {
    autoJoin: true
  }));
};

// src/video/RoomSession.ts
import {
  getLogger as getLogger25
} from "@signalwire/core";
var UNSAFE_PROP_ACCESS = [
  "audioMute",
  "audioUnmute",
  "deaf",
  "getLayouts",
  "getMembers",
  "getRecordings",
  "hideVideoMuted",
  "leave",
  "removerMember",
  "restoreOutboundAudio",
  "restoreOutboundVideo",
  "setInputSensitivity",
  "setInputVolume",
  "setLayout",
  "setPositions",
  "setMemberPosition",
  "setOutputVolume",
  "showVideoMuted",
  "startRecording",
  "stopOutboundAudio",
  "stopOutboundVideo",
  "undeaf",
  "videoMute",
  "videoUnmute",
  "setMicrophoneVolume",
  "setSpeakerVolume",
  "getMeta",
  "setMeta",
  "updateMeta",
  "deleteMeta",
  "getMemberMeta",
  "setMemberMeta",
  "updateMemberMeta",
  "deleteMemberMeta",
  "promote",
  "demote",
  "lock",
  "unlock"
];
var REQUIRED_EVENTS = [
  "member.joined",
  "layout.changed"
];
var noop2 = () => {
};
var RoomSession = function(roomOptions) {
  const _a = roomOptions, {
    audio: audioFromConstructor = true,
    video: videoFromConstructor = true,
    iceServers,
    rootElement,
    applyLocalVideoOverlay = true,
    mirrorLocalVideoOverlay = false,
    stopCameraWhileMuted = true,
    stopMicrophoneWhileMuted = true,
    speakerId,
    destinationNumber,
    localStream,
    watchMediaPackets,
    watchMediaPacketsTimeout,
    disableUdpIceServers = false
  } = _a, userOptions = __objRest(_a, [
    "audio",
    "video",
    "iceServers",
    "rootElement",
    "applyLocalVideoOverlay",
    "mirrorLocalVideoOverlay",
    "stopCameraWhileMuted",
    "stopMicrophoneWhileMuted",
    "speakerId",
    "destinationNumber",
    "localStream",
    "watchMediaPackets",
    "watchMediaPacketsTimeout",
    "disableUdpIceServers"
  ]);
  const deprecatedParams = ["audio", "video"];
  deprecatedParams.forEach((param) => {
    if (param in roomOptions) {
      getLogger25().warn(
        `The '${param}' parameter on the RoomSession constructor is deprecated. Set it on the '.join()' function instead.`
      );
    }
  });
  const allowReattach = (roomOptions == null ? void 0 : roomOptions.reattach) !== false;
  const { callIdKey } = sessionStorageManager(userOptions.token);
  const reattachManager = {
    joined: ({ call_id }) => {
      var _a2;
      if (allowReattach && callIdKey) {
        (_a2 = getStorage()) == null ? void 0 : _a2.setItem(callIdKey, call_id);
      }
    },
    init: () => {
      if (allowReattach) {
        room.on("room.subscribed", reattachManager.joined);
      }
      room.options.prevCallId = reattachManager.getPrevCallId();
    },
    destroy: () => {
      var _a2;
      if (!allowReattach) {
        return;
      }
      room.off("room.subscribed", reattachManager.joined);
      if (callIdKey) {
        (_a2 = getStorage()) == null ? void 0 : _a2.removeItem(callIdKey);
      }
    },
    getPrevCallId: () => {
      var _a2, _b;
      if (!allowReattach || !callIdKey) {
        return;
      }
      return (_b = (_a2 = getStorage()) == null ? void 0 : _a2.getItem(callIdKey)) != null ? _b : void 0;
    }
  };
  const client = createClient(userOptions);
  const room = client.rooms.makeRoomObject({
    // audio,
    // video: video === true ? VIDEO_CONSTRAINTS : video,
    negotiateAudio: true,
    negotiateVideo: true,
    iceServers,
    rootElement,
    applyLocalVideoOverlay,
    mirrorLocalVideoOverlay,
    stopCameraWhileMuted,
    stopMicrophoneWhileMuted,
    speakerId,
    destinationNumber,
    localStream,
    watchMediaPackets,
    watchMediaPacketsTimeout,
    prevCallId: reattachManager.getPrevCallId(),
    disableUdpIceServers
  });
  room.once("destroy", () => {
    room.emit("room.left", { reason: room.leaveReason });
    reattachManager.destroy();
    client.disconnect();
  });
  client.session.once("session.disconnected", () => {
    room.destroy();
  });
  const join = (params) => {
    return new Promise(async (resolve, reject) => {
      var _a2, _b;
      try {
        room.attachPreConnectWorkers();
        await client.connect();
        const audio = (_a2 = params == null ? void 0 : params.audio) != null ? _a2 : audioFromConstructor;
        const video = (_b = params == null ? void 0 : params.video) != null ? _b : videoFromConstructor;
        const authorization = client._sessionAuthorization;
        getLogger25().debug("getJoinMediaParams authorization?", authorization);
        if (authorization && authorization.type === "video") {
          const mediaOptions = getJoinMediaParams(__spreadValues({
            authorization,
            // constructor values override the send
            sendAudio: Boolean(audio),
            sendVideo: Boolean(video)
          }, params));
          if (!checkMediaParams(mediaOptions)) {
            client.disconnect();
            return reject(
              new Error(
                `Invalid arguments to join the room. The token used has join_as: '${authorization.join_as}'. 
${JSON.stringify(params, null, 2)}
`
              )
            );
          }
          getLogger25().debug("Set mediaOptions", mediaOptions);
          room.updateMediaOptions({
            audio: mediaOptions.mustSendAudio ? audio || true : false,
            video: mediaOptions.mustSendVideo ? video || true : false,
            negotiateAudio: mediaOptions.mustRecvAudio,
            negotiateVideo: mediaOptions.mustRecvVideo
          });
        }
        room.once("room.subscribed", () => {
          resolve(room);
        });
        reattachManager.init();
        REQUIRED_EVENTS.forEach((event) => room.once(event, noop2));
        await room.join();
      } catch (error) {
        getLogger25().error("RoomSession Join", error);
        client.disconnect();
        reject(error);
      }
    });
  };
  const interceptors = {
    join
  };
  return new Proxy(room, {
    get(target, prop, receiver) {
      if (prop in interceptors) {
        return interceptors[prop];
      }
      if (!target.active && UNSAFE_PROP_ACCESS.includes(prop)) {
        throw new Error(
          `Tried to access the property/method "${prop}" before the room was connected. Please call roomSession.join() first.`
        );
      }
      return Reflect.get(target, prop, receiver);
    }
  });
};

// src/webrtc.ts
var webrtc_exports = {};
__export(webrtc_exports, {
  checkCameraPermissions: () => checkCameraPermissions,
  checkMicrophonePermissions: () => checkMicrophonePermissions,
  checkPermissions: () => checkPermissions,
  checkSpeakerPermissions: () => checkSpeakerPermissions,
  createCameraDeviceWatcher: () => createCameraDeviceWatcher,
  createDeviceWatcher: () => createDeviceWatcher,
  createMicrophoneAnalyzer: () => createMicrophoneAnalyzer,
  createMicrophoneDeviceWatcher: () => createMicrophoneDeviceWatcher,
  createSpeakerDeviceWatcher: () => createSpeakerDeviceWatcher2,
  enumerateDevices: () => enumerateDevices,
  enumerateDevicesByKind: () => enumerateDevicesByKind,
  getCameraDevices: () => getCameraDevices,
  getCameraDevicesWithPermissions: () => getCameraDevicesWithPermissions,
  getDevices: () => getDevices,
  getDevicesWithPermissions: () => getDevicesWithPermissions,
  getDisplayMedia: () => getDisplayMedia2,
  getMicrophoneDevices: () => getMicrophoneDevices,
  getMicrophoneDevicesWithPermissions: () => getMicrophoneDevicesWithPermissions,
  getSpeakerDevices: () => getSpeakerDevices,
  getSpeakerDevicesWithPermissions: () => getSpeakerDevicesWithPermissions,
  getSupportedConstraints: () => getSupportedConstraints,
  getUserMedia: () => getUserMedia,
  requestPermissions: () => requestPermissions,
  setMediaElementSinkId: () => setMediaElementSinkId2,
  stopStream: () => stopStream,
  stopTrack: () => stopTrack,
  supportsGetDisplayMedia: () => supportsGetDisplayMedia,
  supportsGetUserMedia: () => supportsGetUserMedia,
  supportsMediaDevices: () => supportsMediaDevices,
  supportsMediaOutput: () => supportsMediaOutput2
});
import {
  getDevices,
  getCameraDevices,
  getMicrophoneDevices,
  getSpeakerDevices,
  getDevicesWithPermissions,
  getCameraDevicesWithPermissions,
  getMicrophoneDevicesWithPermissions,
  getSpeakerDevicesWithPermissions,
  checkPermissions,
  checkCameraPermissions,
  checkMicrophonePermissions,
  checkSpeakerPermissions,
  requestPermissions,
  createDeviceWatcher,
  createCameraDeviceWatcher,
  createMicrophoneDeviceWatcher,
  createSpeakerDeviceWatcher as createSpeakerDeviceWatcher2,
  supportsMediaDevices,
  supportsGetUserMedia,
  supportsGetDisplayMedia,
  getUserMedia,
  getDisplayMedia as getDisplayMedia2,
  enumerateDevices,
  enumerateDevicesByKind,
  getSupportedConstraints,
  supportsMediaOutput as supportsMediaOutput2,
  setMediaElementSinkId as setMediaElementSinkId2,
  stopStream,
  stopTrack,
  createMicrophoneAnalyzer
} from "@signalwire/webrtc";
export {
  chat_exports as Chat,
  fabric_exports as Fabric,
  LocalVideoOverlay,
  pubSub_exports as PubSub,
  SignalWire,
  UserOverlay,
  video_exports as Video,
  webrtc_exports as WebRTC,
  buildVideoElement,
  isFabricRoomSession
};
//# sourceMappingURL=index.esm.js.map
