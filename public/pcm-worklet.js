class PcmCapture extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = [];
    this.ratio = sampleRate / 16000;
    this.pos = 0;
  }

  process(inputs) {
    const input = inputs[0]?.[0];
    if (!input) return true;
    for (; this.pos < input.length; this.pos += this.ratio) {
      const s = Math.max(-1, Math.min(1, input[Math.floor(this.pos)]));
      this.buffer.push(s < 0 ? s * 0x8000 : s * 0x7fff);
    }
    this.pos -= input.length;
    if (this.buffer.length >= 1600) {
      const out = Int16Array.from(this.buffer);
      this.buffer = [];
      this.port.postMessage(out.buffer, [out.buffer]);
    }
    return true;
  }
}

registerProcessor('pcm-capture', PcmCapture);
