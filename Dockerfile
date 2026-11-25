FROM python:3.11-slim

WORKDIR /app

# curl is needed for the HEALTHCHECK; everything else is pure-Python.
# Installing a package does not refresh what the base image already
# satisfies, so base security updates need an explicit upgrade. This
# fixes the image at BUILD time -- it is only as fresh as its last rebuild.
RUN apt-get update && apt-get upgrade -y --no-install-recommends && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# The python image's own build tooling is separately stale: `wheel` and
# setuptools' vendored `jaraco.context` each carry a HIGH with a published
# fix. Build-time tools rather than runtime imports, but free to update.
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY sidecar_app.py signalwire_rest.py sample_data.py cdr_store.py live_data.py ./
COPY static ./static

# Cache-busting: replace {{BUILD}} placeholders in index.html with a unique
# epoch value at build time. Each `docker build` produces a different value,
# so the browser/CDN see new asset URLs on every redeploy regardless of
# their Cache-Control headers. Combined with the no-cache middleware in
# sidecar_app.py, this means a redeploy is immediately visible to clients.
ARG BUILD_EPOCH=auto
RUN if [ "${BUILD_EPOCH}" = "auto" ]; then BUILD=$(date +%s); else BUILD=${BUILD_EPOCH}; fi; \
    sed -i "s/{{BUILD}}/$BUILD/g" /app/static/index.html && \
    echo "build epoch=$BUILD baked into index.html"

ENV PORT=5000 \
    HOST=0.0.0.0 \
    ROUTE=/sidecar

EXPOSE 5000

RUN useradd -r -m -s /bin/false appuser \
    && mkdir -p /data \
    && chown -R appuser:appuser /app /data
VOLUME ["/data"]
USER appuser

# sidecar_app.py reads CLI flags but every flag has an env-var default, so
# running with no args is fine when the env is populated. We add --route
# explicitly because gunicorn/uvicorn-via-CLI would expect a port; this
# app drives uvicorn itself.
CMD ["python", "sidecar_app.py"]
