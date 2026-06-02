"""Thin SignalWire REST helpers used by the sidecar app.

Two operations:

  * ``ensure_swml_webhook(...)`` — idempotently create-or-find an
    ``swml_webhook`` resource whose primary URL points at our SWML endpoint,
    so the browser has something to dial.
  * ``mint_sat(...)`` — exchange the project's API key for a short-lived
    Subscriber Access Token (JWT) the browser can hand to ``@signalwire/js``.

Auth is HTTP Basic with ``project_id:api_token``. Never expose those creds
to the browser — only the minted SAT goes over the wire.
"""

from __future__ import annotations

import base64
import json
import logging
from typing import Any
from urllib import error as urllib_error
from urllib import request as urllib_request


log = logging.getLogger(__name__)


class SignalWireError(RuntimeError):
    """Raised when a SignalWire REST call returns a non-2xx response."""

    def __init__(self, status: int, body: str, message: str = "") -> None:
        super().__init__(f"{message or 'signalwire api error'}: HTTP {status}: {body[:400]}")
        self.status = status
        self.body = body


class SignalWireREST:
    def __init__(self, space_url: str, project_id: str, api_token: str, timeout: float = 10.0) -> None:
        space = space_url.replace("https://", "").replace("http://", "").rstrip("/")
        # Operators sometimes pass just the bare space name ("len") and
        # sometimes the full host ("len.signalwire.com"). Normalise both.
        if space and "." not in space:
            space = f"{space}.signalwire.com"
        self.base = f"https://{space}"
        self.project_id = project_id
        self.api_token = api_token
        self.timeout = timeout

    # ----------------------------------------------------------- low level

    def _auth_header(self) -> str:
        raw = f"{self.project_id}:{self.api_token}".encode()
        return "Basic " + base64.b64encode(raw).decode()

    def _request(self, method: str, path: str, body: dict[str, Any] | None = None) -> Any:
        url = f"{self.base}{path}"
        data = None
        headers = {
            "Authorization": self._auth_header(),
            "Accept": "application/json",
        }
        if body is not None:
            data = json.dumps(body).encode()
            headers["Content-Type"] = "application/json"
        req = urllib_request.Request(url, data=data, headers=headers, method=method)
        try:
            with urllib_request.urlopen(req, timeout=self.timeout) as resp:
                raw = resp.read().decode() or "{}"
                return json.loads(raw)
        except urllib_error.HTTPError as e:
            raw = (e.read() or b"").decode()
            raise SignalWireError(e.code, raw, f"{method} {path}") from e

    # ---------------------------------------------------------------- SAT

    def mint_subscriber_token(
        self,
        reference: str,
        password: str | None = None,
        expire_at: int | None = None,
        first_name: str | None = None,
        last_name: str | None = None,
        display_name: str | None = None,
    ) -> dict[str, Any]:
        """Create a Subscriber Access Token (JWT) for the v4 fabric SDK.

        For OUTBOUND (dial) only, ``reference`` is enough. For INBOUND
        (``subscriber.online``) the relay rejects half-provisioned
        anonymous subscribers with ``-32003 Requester validation failed`` —
        pass ``password`` to promote the reference to a fully-credentialed
        subscriber the relay will accept."""
        body: dict[str, Any] = {"reference": reference}
        if password is not None:
            body["password"] = password
        if expire_at is not None:
            body["expire_at"] = expire_at
        if first_name is not None:
            body["first_name"] = first_name
        if last_name is not None:
            body["last_name"] = last_name
        if display_name is not None:
            body["display_name"] = display_name
        return self._request("POST", "/api/fabric/subscribers/tokens", body)

    # ----------------------------------------- Subscribers (cleanup path)

    def list_subscribers_by_reference(self, reference: str) -> list[dict[str, Any]]:
        """Find subscribers whose ``email`` (reference) matches.

        Fabric stores the subscriber reference in the ``email`` column;
        there is no server-side filter, so we page through and match
        client-side. The subscriber list is small for this project."""
        from urllib.parse import quote_plus
        results: list[dict[str, Any]] = []
        page = 0
        while page < 20:  # bound the walk; 20 * 50 = 1000 subscribers max
            resp = self._request(
                "GET",
                f"/api/fabric/subscribers?page_number={page}&page_size=50",
            )
            data = resp.get("data", []) if isinstance(resp, dict) else []
            if not data:
                break
            for s in data:
                if (s.get("email") or "").lower() == reference.lower():
                    results.append(s)
            page += 1
            # If less than a full page came back, we're done.
            if len(data) < 50:
                break
        return results

    def delete_subscriber(self, subscriber_id: str) -> None:
        """DELETE a subscriber by id. Idempotent — 404 is treated as success."""
        try:
            self._request("DELETE", f"/api/fabric/subscribers/{subscriber_id}")
        except SignalWireError as e:
            if e.status == 404:
                return
            raise

    # ------------------------------------------------------- SWML webhook

    def list_swml_webhooks(self, name: str | None = None) -> list[dict[str, Any]]:
        path = "/api/fabric/resources/swml_webhooks"
        if name:
            from urllib.parse import quote
            path = f"{path}?name={quote(name)}"
        resp = self._request("GET", path)
        if isinstance(resp, dict) and "data" in resp:
            return resp["data"]
        return resp if isinstance(resp, list) else []

    def create_swml_webhook(self, name: str, primary_request_url: str,
                            primary_request_method: str = "POST") -> dict[str, Any]:
        return self._request("POST", "/api/fabric/resources/swml_webhooks", {
            "name": name,
            "primary_request_url": primary_request_url,
            "primary_request_method": primary_request_method,
        })

    def update_swml_webhook(self, webhook_id: str, primary_request_url: str,
                            primary_request_method: str = "POST") -> dict[str, Any]:
        # Default update method on Fabric resources is PATCH (matches the
        # signalwire-python SDK's CrudResource._update_method="PATCH").
        return self._request("PATCH", f"/api/fabric/resources/swml_webhooks/{webhook_id}", {
            "primary_request_url": primary_request_url,
            "primary_request_method": primary_request_method,
        })

    def get_resource_addresses(self, resource_id: str) -> list[dict[str, Any]]:
        """List addresses for a resource via the nested resource endpoint.

        The flat ``/api/fabric/addresses`` endpoint is subscriber-scoped and
        rejects project Basic auth with 401 — the resource-nested form is
        the project-credential path."""
        resp = self._request(
            "GET",
            f"/api/fabric/resources/swml_webhooks/{resource_id}/addresses",
        )
        if isinstance(resp, dict) and "data" in resp:
            return resp["data"]
        return resp if isinstance(resp, list) else []

    def ensure_swml_webhook(self, name: str, primary_request_url: str,
                            primary_request_method: str = "POST") -> dict[str, Any]:
        """Create the named SWML webhook if missing; otherwise update its URL.

        Returns the resource record (with `id`, `display_name`, ...).
        """
        existing = [w for w in self.list_swml_webhooks(name=name)
                    if (w.get("swml_webhook") or {}).get("name") == name
                    or w.get("display_name") == name]
        if existing:
            resource = existing[0]
            current_url = (resource.get("swml_webhook") or {}).get("primary_request_url")
            if current_url != primary_request_url:
                log.info("updating swml_webhook %s url -> %s", resource["id"], primary_request_url)
                resource = self.update_swml_webhook(
                    resource["id"], primary_request_url, primary_request_method
                )
            return resource

        log.info("creating swml_webhook name=%s url=%s", name, primary_request_url)
        return self.create_swml_webhook(name, primary_request_url, primary_request_method)

    @staticmethod
    def pick_dial_address(resource: dict[str, Any], addresses: list[dict[str, Any]]) -> str | None:
        """Pick a dial-string for a resource.

        A resource can have multiple aliased addresses (e.g. /public/<name>
        plus an /external/<other-name> that some upstream config wired to the
        same SWML). Prefer the address whose ``name`` matches the resource
        we asked about, then fall back to any audio-channel match.

        Address shape::

            {"name": "sidecar-copilot",
             "channels": {"audio": "/public/sidecar-copilot?channel=audio"}}
        """
        resource_name = (
            (resource.get("swml_webhook") or {}).get("name")
            or resource.get("display_name")
        )

        def audio_path(addr: dict[str, Any]) -> str | None:
            chans = addr.get("channels") or {}
            for key in ("audio", "video", "messaging"):
                v = chans.get(key)
                if isinstance(v, str) and v.startswith("/"):
                    # Strip the ?channel= query — dial({to}) wants the bare path.
                    return v.split("?", 1)[0]
            return None

        # Pass 1: address whose name matches the resource name.
        if resource_name:
            for addr in addresses:
                if addr.get("name") == resource_name or addr.get("display_name") == resource_name:
                    p = audio_path(addr)
                    if p:
                        return p

        # Pass 2: any address with an audio channel.
        for addr in addresses:
            p = audio_path(addr)
            if p:
                return p

        return f"/public/{resource_name}" if resource_name else None

    # ----------------------------------------------------------- Recordings
    #
    # Calls recorded via the SWML `record_call` verb land in SignalWire's
    # LaML-compat recordings store. The Recordings list supports a
    # `CallSid` filter — same id the relay POSTs as `call_id` to our
    # SWML endpoint. Returned objects carry a `media_url` (mp3 / wav) we
    # can hand the browser to play. The URL needs project basic-auth, so
    # we typically proxy it through our own backend instead of linking
    # directly from the browser.

    def list_recordings_for_call(self, call_id: str) -> list[dict[str, Any]]:
        """Return the LaML Recording objects associated with ``call_id``.

        Empty list when SignalWire has nothing yet (call still in
        progress, recording still finalising) or when recording was
        never enabled for the call. No-throws — logs a warning and
        returns ``[]`` on API errors so a missing recording can't break
        the CDR detail render."""
        if not call_id:
            return []
        path = (
            f"/api/laml/2010-04-01/Accounts/{self.project_id}/Recordings.json"
            f"?CallSid={call_id}"
        )
        try:
            resp = self._request("GET", path)
        except SignalWireError as e:
            # 404 just means no recordings — perfectly normal for unrecorded calls.
            if e.status == 404:
                return []
            return []
        if isinstance(resp, dict):
            return resp.get("recordings") or []
        return []
