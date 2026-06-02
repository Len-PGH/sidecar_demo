# Third-party notices

This project bundles or depends on the following third-party software.

## SignalWire Python SDK — `signalwire-sdk`

- Pulled at install time from PyPI: `signalwire-sdk==3.0.1`
- License: MIT
- Source: <https://github.com/signalwire/signalwire-python>

Provides `AgentBase`, `FunctionResult`, the SWAIG webhook handler, SWML schema
validation, and the FastAPI/uvicorn serve loop.

## SignalWire Browser SDK — `@signalwire/js` (a.k.a. `signalwire-browser-sdk`)

- Vendored as prebuilt bundles in `static/vendor/`:
  - `signalwire.esm.js`
  - `signalwire.umd.js`
- License: MIT (see [`static/vendor/LICENSE`](static/vendor/LICENSE))
- Source: <https://github.com/signalwire/signalwire-js>

The bundles are checked in so the browser doesn't need a CDN or build step to
load the SDK. They were built from the upstream monorepo and are vendored
without modification.

## python-dotenv

- Pulled at install time from PyPI: `python-dotenv>=1.0.0`
- License: BSD-3-Clause
- Source: <https://github.com/theskumar/python-dotenv>

Loads environment variables from a `.env` file at startup.

## SignalWire Python SDK transitive dependencies

`signalwire-sdk==3.0.1` pulls these as runtime requirements (`pip show
signalwire-sdk`): `beautifulsoup4, docopt, fastapi, jsonschema-rs, lxml,
pydantic, pytz, PyYAML, Requests, setuptools, structlog, uvicorn,
websockets`. Each is independently licensed under permissive (MIT, BSD,
Apache-2.0) terms.
