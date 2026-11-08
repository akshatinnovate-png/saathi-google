const BCP47 = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN', ta: 'ta-IN', bn: 'bn-IN', es: 'es-US', fr: 'fr-FR', ar: 'ar-XA' };

const toBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
};
const fromBase64 = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

export async function liveAvailable() {
  try {
    const res = await fetch('/web-config');
    return res.ok && (await res.json()).live === true;
  } catch {
    return false;
  }
}

export function createLiveSession({ language = 'en', onState = () => {}, onYou = () => {}, onSaathi = () => {}, onTool = () => {} }) {
  let ws;
  let mic;
  let inCtx;
  let outCtx;
  let playAt = 0;
  const playing = new Set();
  let youText = '';
  let saathiText = '';

  const stopPlayback = () => {
    for (const src of playing) { try { src.stop(); } catch { } }
    playing.clear();
    playAt = 0;
  };

  function play(b64) {
    const bytes = fromBase64(b64);
    const pcm = new Int16Array(bytes.buffer, bytes.byteOffset, Math.floor(bytes.byteLength / 2));
    const buffer = outCtx.createBuffer(1, pcm.length, 24000);
    const ch = buffer.getChannelData(0);
    for (let i = 0; i < pcm.length; i++) ch[i] = pcm[i] / 0x8000;
    const src = outCtx.createBufferSource();
    src.buffer = buffer;
    src.connect(outCtx.destination);
    playAt = Math.max(playAt, outCtx.currentTime);
    src.start(playAt);
    playAt += buffer.duration;
    playing.add(src);
    src.onended = () => { playing.delete(src); if (!playing.size) onState('listening'); };
    onState('speaking');
  }

  async function runTool(call) {
    onTool(call.name);
    let response;
    try {
      const res = await fetch('/api/live/tool', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: call.name, args: call.args ?? {} }) });
      response = await res.json();
    } catch (err) {
      response = { error: err.message };
    }
    ws?.readyState === WebSocket.OPEN && ws.send(JSON.stringify({ toolResponse: { functionResponses: [{ id: call.id, name: call.name, response }] } }));
  }

  async function onMessage(event) {
    const msg = JSON.parse(typeof event.data === 'string' ? event.data : await event.data.text());
    if (msg.setupComplete) { await startMic(); onState('listening'); return; }
    if (msg.toolCall?.functionCalls) { for (const call of msg.toolCall.functionCalls) runTool(call); return; }
    const sc = msg.serverContent;
    if (!sc) return;
    if (sc.interrupted) stopPlayback();
    if (sc.inputTranscription?.text) { youText += sc.inputTranscription.text; onYou(youText.trim()); }
    if (sc.outputTranscription?.text) { saathiText += sc.outputTranscription.text; onSaathi(saathiText.trim()); }
    for (const part of sc.modelTurn?.parts ?? []) if (part.inlineData?.data && /audio\/pcm/.test(part.inlineData.mimeType ?? '')) play(part.inlineData.data);
    if (sc.turnComplete) { youText = ''; saathiText = ''; }
  }

  async function startMic() {
    mic = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 } });
    inCtx = new AudioContext();
    await inCtx.audioWorklet.addModule('/pcm-worklet.js');
    const node = new AudioWorkletNode(inCtx, 'pcm-capture');
    node.port.onmessage = ({ data }) => {
      if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ realtimeInput: { audio: { data: toBase64(data), mimeType: 'audio/pcm;rate=16000' } } }));
    };
    inCtx.createMediaStreamSource(mic).connect(node);
  }

  return {
    async start() {
      onState('connecting');
      const res = await fetch(`/api/live/session?language=${encodeURIComponent(language)}`);
      const session = await res.json();
      if (!res.ok) throw new Error(session.error ?? 'Gemini Live is not available.');
      outCtx = new AudioContext({ sampleRate: 24000 });
      ws = new WebSocket(`${session.socket}?access_token=${encodeURIComponent(session.token)}`);
      ws.onmessage = (e) => { onMessage(e).catch(() => {}); };
      ws.onclose = () => { this.stop(); onState('closed'); };
      ws.onerror = () => onState('error');
      await new Promise((resolve, reject) => { ws.onopen = resolve; setTimeout(() => reject(new Error('Gemini Live did not answer.')), 15000); });
      ws.send(JSON.stringify({
        setup: {
          model: session.model,
          generationConfig: { responseModalities: ['AUDIO'], speechConfig: { languageCode: BCP47[language] ?? 'en-IN' } },
          systemInstruction: { parts: [{ text: session.systemInstruction }] },
          tools: session.tools,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
      }));
    },
    stop() {
      stopPlayback();
      mic?.getTracks().forEach((t) => t.stop());
      mic = null;
      inCtx?.close().catch(() => {});
      inCtx = null;
      if (ws && ws.readyState <= WebSocket.OPEN) ws.close();
      ws = null;
    },
  };
}
