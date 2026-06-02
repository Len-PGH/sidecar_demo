// PCM ring-buffer playback worklet.
//
// The main thread posts Float32Array chunks (already μ-law-decoded and
// resampled to the AudioContext's sampleRate). This processor copies
// from the ring buffer into the audio output each render quantum. It
// runs in the audio rendering thread, so glitches stay below 5 ms.
//
// The ring buffer is sized for ~500 ms of audio at 48 kHz mono. If a
// listener stalls the network, the ring fills, the main thread drops
// the oldest chunk (handled there), and we under-run silently here.
class PCMRingProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    // 500 ms @ 48 kHz mono = 24,000 samples — comfortable jitter cushion
    // without imposing more than half a second of latency.
    this._capacity = 48000;
    this._buffer = new Float32Array(this._capacity);
    this._readIdx = 0;
    this._writeIdx = 0;
    this._available = 0;
    this.port.onmessage = (e) => {
      const chunk = e.data;
      if (chunk instanceof Float32Array) {
        this._write(chunk);
      } else if (chunk && chunk.cmd === "reset") {
        this._readIdx = this._writeIdx = this._available = 0;
      }
    };
  }

  _write(chunk) {
    // If the chunk would overflow, drop the oldest (advance read head).
    const overflow = this._available + chunk.length - this._capacity;
    if (overflow > 0) {
      this._readIdx = (this._readIdx + overflow) % this._capacity;
      this._available -= overflow;
    }
    // Copy in two slices if the chunk wraps the end of the buffer.
    const tail = this._capacity - this._writeIdx;
    if (chunk.length <= tail) {
      this._buffer.set(chunk, this._writeIdx);
    } else {
      this._buffer.set(chunk.subarray(0, tail), this._writeIdx);
      this._buffer.set(chunk.subarray(tail), 0);
    }
    this._writeIdx = (this._writeIdx + chunk.length) % this._capacity;
    this._available += chunk.length;
  }

  process(_inputs, outputs) {
    const out = outputs[0][0]; // mono
    if (!out) return true;
    const want = out.length;
    if (this._available <= 0) {
      out.fill(0);
      return true;
    }
    const take = Math.min(want, this._available);
    // Copy from ring → output, two slices if wrapping.
    const tail = this._capacity - this._readIdx;
    if (take <= tail) {
      out.set(this._buffer.subarray(this._readIdx, this._readIdx + take), 0);
    } else {
      out.set(this._buffer.subarray(this._readIdx), 0);
      out.set(this._buffer.subarray(0, take - tail), tail);
    }
    this._readIdx = (this._readIdx + take) % this._capacity;
    this._available -= take;
    // If we couldn't fill the whole quantum, zero-pad the rest.
    if (take < want) out.fill(0, take);
    return true;
  }
}

registerProcessor("pcm-ring", PCMRingProcessor);
