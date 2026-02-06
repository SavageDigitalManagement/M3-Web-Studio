const fileInput = document.getElementById("fileInput");
const trackArea = document.getElementById("trackArea");
const ruler = document.getElementById("ruler");
const playhead = document.getElementById("playhead");
const ghosthead = document.getElementById("ghosthead");
const timeReadout = document.getElementById("timeReadout");
const barBeatReadout = document.getElementById("barBeatReadout");
const projectLen = document.getElementById("projectLen");
const tempoValue = document.getElementById("tempoValue");
const mixerSidebar = document.getElementById("mixerSidebar");
const mixerPanel = document.getElementById("mixerPanel");
const zoom = document.getElementById("zoom");
const settingsBtn = document.getElementById("settingsBtn");
const settingsHud = document.getElementById("settingsHud");
const closeHud = document.getElementById("closeHud");
const bpmInput = document.getElementById("bpmInput");
const snapToggle = document.getElementById("snapToggle");
const followToggle = document.getElementById("followToggle");
const gridSelect = document.getElementById("gridSelect");
const metroToggle = document.getElementById("metroToggle");
const zoomHud = document.getElementById("zoomHud");
const analysisUrlInput = document.getElementById("analysisUrl");
const analysisOverlay = document.getElementById("analysisOverlay");
const analysisProgress = document.getElementById("analysisProgress");
const timeline = document.getElementById("timeline");
const contextMenu = document.getElementById("contextMenu");
const tabAudio = document.getElementById("tabAudio");
const tabTracks = document.getElementById("tabTracks");
const tabMixer = document.getElementById("tabMixer");
const tabProject = document.getElementById("tabProject");
const tabActions = document.getElementById("tabActions");
const tabEffects = document.getElementById("tabEffects");
const panelAudio = document.getElementById("panelAudio");
const panelMixer = document.getElementById("panelMixer");
const panelEffects = document.getElementById("panelEffects");
const panelTracks = document.getElementById("panelTracks");
const panelProject = document.getElementById("panelProject");
const panelActions = document.getElementById("panelActions");
const clipName = document.getElementById("clipName");
const clipPreview = document.getElementById("clipPreview");
const previewWrap = document.getElementById("previewWrap");
const previewPlayhead = document.getElementById("previewPlayhead");
const eqControls = document.getElementById("eqControls");
const audioPlay = document.getElementById("audioPlay");
const audioPause = document.getElementById("audioPause");
const audioStop = document.getElementById("audioStop");
const audioSplit = document.getElementById("audioSplit");
const audioDuplicate = document.getElementById("audioDuplicate");
const audioDelete = document.getElementById("audioDelete");
const panelResize = document.getElementById("panelResize");
const exportBtn = document.getElementById("exportBtn");
const exportFormat = document.getElementById("exportFormat");
const rangeSelector = document.getElementById("rangeSelector");
const rangeLeft = rangeSelector.querySelector(".range-handle.left");
const rangeRight = rangeSelector.querySelector(".range-handle.right");
const rangeBody = rangeSelector.querySelector(".range-body");
const miniFollowToggle = document.getElementById("miniFollowToggle");
const ytUrl = document.getElementById("ytUrl");
const ripSelectedBtn = document.getElementById("ripSelectedBtn");
const ripNewBtn = document.getElementById("ripNewBtn");
const menuToggle = document.getElementById("menuToggle");
const bottomDrawer = document.getElementById("bottomDrawer");
const effectOverlay = document.getElementById("effectOverlay");
const effectTitle = document.getElementById("effectTitle");
const effectType = document.getElementById("effectType");
const effectDuration = document.getElementById("effectDuration");
const effectCurve = document.getElementById("effectCurve");
const effectApply = document.getElementById("effectApply");
const effectCancel = document.getElementById("effectCancel");
const fxFadeIn = document.getElementById("fxFadeIn");
const fxFadeOut = document.getElementById("fxFadeOut");
const fxCrossfade = document.getElementById("fxCrossfade");
const saveProjectFile = document.getElementById("saveProjectFile");
const loadProjectFile = document.getElementById("loadProjectFile");
const saveProjectAs = document.getElementById("saveProjectAs");
const projectFileInput = document.getElementById("projectFileInput");
const includeAudioInFile = document.getElementById("includeAudioInFile");
const saveProjectLocal = document.getElementById("saveProjectLocal");
const loadProjectLocal = document.getElementById("loadProjectLocal");
const clearProjectLocal = document.getElementById("clearProjectLocal");
const projectStatus = document.getElementById("projectStatus");
const clipRate = document.getElementById("clipRate");
const clipPitch = document.getElementById("clipPitch");
const clipRateVal = document.getElementById("clipRateVal");
const clipPitchVal = document.getElementById("clipPitchVal");
const clipFxReset = document.getElementById("clipFxReset");
const clipFxApply = document.getElementById("clipFxApply");
const fxDelayOn = document.getElementById("fxDelayOn");
const fxDelayTime = document.getElementById("fxDelayTime");
const fxDelayFeedback = document.getElementById("fxDelayFeedback");
const fxDelayMix = document.getElementById("fxDelayMix");
const fxReverbOn = document.getElementById("fxReverbOn");
const fxReverbMix = document.getElementById("fxReverbMix");
const fxSatOn = document.getElementById("fxSatOn");
const fxSatDrive = document.getElementById("fxSatDrive");
const fxCompOn = document.getElementById("fxCompOn");
const fxCompThreshold = document.getElementById("fxCompThreshold");
const fxCompRatio = document.getElementById("fxCompRatio");
const relinkOverlay = document.getElementById("relinkOverlay");
const relinkList = document.getElementById("relinkList");
const relinkInput = document.getElementById("relinkInput");
const relinkApply = document.getElementById("relinkApply");
const relinkSkip = document.getElementById("relinkSkip");
const fxIntensity = document.getElementById("fxIntensity");
const fxNoiseToggle = document.getElementById("fxNoiseToggle");
const fxGlowToggle = document.getElementById("fxGlowToggle");
const languageSelect = document.getElementById("languageSelect");
const desktopGuideText = document.getElementById("desktopGuideText");
const mobileGuideText = document.getElementById("mobileGuideText");

let I18N = {};

const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stopBtn = document.getElementById("stopBtn");
const addTrackBtn = document.getElementById("addTrack");

const splitBtn = document.getElementById("splitBtn");
const duplicateBtn = document.getElementById("duplicateBtn");
const deleteBtn = document.getElementById("deleteBtn");

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const ANALYSIS_API_BASE = "https://m3-web-studio.onrender.com";
if (analysisUrlInput) {
  analysisUrlInput.value = ANALYSIS_API_BASE;
}

const state = {
  tracks: [],
  pxPerSec: 120,
  playing: false,
  startTime: 0,
  playhead: 0,
  selectedClipId: null,
  selectedTrackId: null,
  activeSources: [],
  bpm: 120,
  snap: true,
  follow: true,
  grid: 4,
  lastBeat: -1,
  timelineLen: 600,
  timelineHeight: 900,
  playStartOffset: 0
};

let pendingProject = null;

let clipboardClip = null;
let undoStack = [];
let redoStack = [];
let rangeDrag = null;
let selectingRange = false;

state.rangeVisible = false;
state.rangeStart = 0;
state.rangeEnd = 0;

const EQ_BANDS = [
  { f: 60 }, { f: 120 }, { f: 250 }, { f: 500 },
  { f: 1000 }, { f: 2000 }, { f: 4000 }, { f: 8000 }
];

function getSelectedTrack() {
  const idx = state.tracks.findIndex(t => t.id === state.selectedTrackId);
  return idx >= 0 ? state.tracks[idx] : state.tracks[0];
}

function ensureTrackEffects(track) {
  if (!track.effects) {
    track.effects = {
      delay: { enabled: false, time: 0.2, feedback: 0.3, mix: 0.25 },
      reverb: { enabled: false, mix: 0.2 },
      saturation: { enabled: false, drive: 0.2 },
      compressor: { enabled: false, threshold: -18, ratio: 4 }
    };
  }
  return track.effects;
}
let metroTimer = null;

function addTrack(name = `Track ${state.tracks.length + 1}`) {
  pushUndo();
  state.timelineHeight = Math.max(state.timelineHeight, 90 * Math.max(30, state.tracks.length + 1));
  const track = {
    id: crypto.randomUUID(),
    name,
    clips: [],
    volume: 1,
    mute: false,
    solo: false,
    effects: {
      delay: { enabled: false, time: 0.2, feedback: 0.3, mix: 0.25 },
      reverb: { enabled: false, mix: 0.2 },
      saturation: { enabled: false, drive: 0.2 },
      compressor: { enabled: false, threshold: -18, ratio: 4 }
    },
    eq: EQ_BANDS.map(b => ({ freq: b.f, gain: 0 })),
    lowCut: 20,
    highCut: 20000
  };
  state.tracks.push(track);
  if (!state.selectedTrackId) state.selectedTrackId = track.id;
  const minHeight = state.tracks.length * 90 + 120;
  if (state.timelineHeight < minHeight) state.timelineHeight = minHeight;
  render();
}

function addClipToTrack(track, buffer, name) {
  pushUndo();
  const clip = {
    id: crypto.randomUUID(),
    name,
    buffer,
    duration: buffer.duration,
    bpm: state.bpm,
    playbackRate: 1,
    key: null,
    camelot: null,
    sourceFile: null,
    startOffset: 0,
    endOffset: 0,
    fadeIn: 0,
    fadeOut: 0,
    fadeActive: false,
    rate: 1,
    pitch: 0,
    originalBuffer: null,
    fadeInCurve: 0.5,
    fadeOutCurve: 0.5,
    start: 0
  };
  track.clips.push(clip);
  return clip;
}

function snapshotState() {
  return {
    tracks: state.tracks.map(t => ({
      ...t,
      clips: t.clips.map(c => ({ ...c }))
    })),
    selectedClipId: state.selectedClipId,
    selectedTrackId: state.selectedTrackId,
    bpm: state.bpm,
    grid: state.grid,
    pxPerSec: state.pxPerSec,
    timelineLen: state.timelineLen,
    timelineHeight: state.timelineHeight
  };
}

function applySnapshot(snap) {
  state.tracks = snap.tracks;
  state.selectedClipId = snap.selectedClipId;
  state.selectedTrackId = snap.selectedTrackId;
  state.bpm = snap.bpm;
  state.grid = snap.grid;
  state.pxPerSec = snap.pxPerSec;
  state.timelineLen = snap.timelineLen;
  state.timelineHeight = snap.timelineHeight;
  bpmInput.value = String(state.bpm);
  tempoValue.textContent = String(state.bpm);
  zoom.value = state.pxPerSec;
  zoomHud.value = state.pxPerSec;
  gridSelect.value = String(state.grid);
}

function pushUndo() {
  undoStack.push(snapshotState());
  if (undoStack.length > 100) undoStack.shift();
  redoStack = [];
}

function undo() {
  if (!undoStack.length) return;
  redoStack.push(snapshotState());
  applySnapshot(undoStack.pop());
  render();
  if (state.playing) refreshPlayback();
}

function redo() {
  if (!redoStack.length) return;
  undoStack.push(snapshotState());
  applySnapshot(redoStack.pop());
  render();
  if (state.playing) refreshPlayback();
}

function getClipDuration(clip) {
  const rate = clip.playbackRate || 1;
  const trimmed = Math.max(0, clip.buffer.duration - (clip.startOffset || 0) - (clip.endOffset || 0));
  return trimmed / rate;
}

function getClipWindow(clip) {
  const startOffset = clip.startOffset || 0;
  const endOffset = clip.endOffset || 0;
  const trimmed = Math.max(0, clip.buffer.duration - startOffset - endOffset);
  return { startOffset, endOffset, trimmed };
}

function buildFadeCurve(curveVal, points = 64, invert = false) {
  const clamped = Math.max(0, Math.min(1, curveVal));
  const exp = 0.5 + clamped * 3.5;
  const out = new Float32Array(points);
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    const v = invert ? Math.pow(1 - t, exp) : Math.pow(t, exp);
    out[i] = v;
  }
  return out;
}

function applyFades(gainNode, startTime, duration, clip) {
  if (!clip.fadeActive) {
    gainNode.gain.setValueAtTime(1, startTime);
    return;
  }
  const fadeIn = Math.min(clip.fadeIn || 0, duration / 2);
  const fadeOut = Math.min(clip.fadeOut || 0, duration / 2);
  const hasIn = fadeIn > 0.001;
  const hasOut = fadeOut > 0.001;

  if (hasIn) {
    const curve = buildFadeCurve(clip.fadeInCurve ?? 0.5, 64, false);
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.setValueCurveAtTime(curve, startTime, fadeIn);
  } else {
    gainNode.gain.setValueAtTime(1, startTime);
  }

  if (hasOut) {
    const curve = buildFadeCurve(clip.fadeOutCurve ?? 0.5, 64, true);
    const outStart = startTime + duration - fadeOut;
    gainNode.gain.setValueAtTime(1, outStart);
    gainNode.gain.setValueCurveAtTime(curve, outStart, fadeOut);
  }
}

function recomputePlaybackRate(clip) {
  const pitch = clip.pitch ?? 0;
  const pitchRatio = Math.pow(2, pitch / 12);
  clip.playbackRate = pitchRatio;
}

function buildHannWindow(size) {
  const window = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    window[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (size - 1)));
  }
  return window;
}

function stretchBufferGranular(buffer, ratio) {
  const clamped = Math.max(0.5, Math.min(2, ratio));
  if (Math.abs(clamped - 1) < 0.001) return buffer;
  const rate = buffer.sampleRate;
  const grainSize = Math.max(512, Math.floor(rate * 0.08));
  const hopIn = Math.floor(grainSize * 0.5);
  const hopOut = Math.floor(hopIn * clamped);
  const outLength = Math.floor(buffer.length * clamped) + grainSize;
  const outBuffer = audioCtx.createBuffer(buffer.numberOfChannels, outLength, rate);
  const window = buildHannWindow(grainSize);

  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const input = buffer.getChannelData(ch);
    const output = outBuffer.getChannelData(ch);
    let outPos = 0;
    for (let inPos = 0; inPos + grainSize < input.length; inPos += hopIn) {
      for (let i = 0; i < grainSize; i++) {
        output[outPos + i] += input[inPos + i] * window[i];
      }
      outPos += hopOut;
      if (outPos + grainSize >= output.length) break;
    }
  }
  return outBuffer;
}

async function applyTimeStretch(clip, ratio) {
  if (!clip) return;
  const clamped = Math.max(0.5, Math.min(2, ratio));
  if (Math.abs(clamped - 1) < 0.001) {
    if (clip.originalBuffer) {
      clip.buffer = clip.originalBuffer;
      clip.duration = clip.buffer.duration;
      clip.originalBuffer = null;
      clip.rate = 1;
      clip.startOffset = 0;
      clip.endOffset = 0;
    }
    return;
  }
    setProjectStatus(t("status.stretching", "Applying time stretch..."));
  if (!clip.originalBuffer) clip.originalBuffer = clip.buffer;
  await new Promise(requestAnimationFrame);
  const stretched = stretchBufferGranular(clip.originalBuffer, clamped);
  clip.buffer = stretched;
  clip.duration = stretched.duration;
  clip.rate = clamped;
  clip.startOffset = 0;
  clip.endOffset = 0;
  setProjectStatus(t("status.stretchApplied", "Time stretch applied."));
}

function createImpulse(ctx, seconds = 1.2, decay = 2.5) {
  const rate = ctx.sampleRate;
  const length = Math.floor(rate * seconds);
  const impulse = ctx.createBuffer(2, length, rate);
  for (let ch = 0; ch < impulse.numberOfChannels; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return impulse;
}

function makeSaturationCurve(amount = 0.2) {
  const k = Math.max(0.01, amount * 40);
  const n = 1024;
  const curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / (n - 1) - 1;
    curve[i] = (1 + k) * x / (1 + k * Math.abs(x));
  }
  return curve;
}

function applyTrackFxChain(ctx, inputNode, track) {
  const fx = ensureTrackEffects(track);
  let node = inputNode;

  if (fx.saturation.enabled) {
    const shaper = ctx.createWaveShaper();
    shaper.curve = makeSaturationCurve(fx.saturation.drive);
    shaper.oversample = "4x";
    node.connect(shaper);
    node = shaper;
  }

  if (fx.compressor.enabled) {
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = fx.compressor.threshold;
    comp.ratio.value = fx.compressor.ratio;
    node.connect(comp);
    node = comp;
  }

  if (fx.delay.enabled) {
    const delay = ctx.createDelay(1.0);
    delay.delayTime.value = fx.delay.time;
    const feedback = ctx.createGain();
    feedback.gain.value = fx.delay.feedback;
    const wet = ctx.createGain();
    wet.gain.value = fx.delay.mix;
    const dry = ctx.createGain();
    dry.gain.value = 1 - fx.delay.mix;
    const sum = ctx.createGain();

    node.connect(dry).connect(sum);
    node.connect(delay);
    delay.connect(feedback).connect(delay);
    delay.connect(wet).connect(sum);
    node = sum;
  }

  if (fx.reverb.enabled) {
    const convolver = ctx.createConvolver();
    convolver.buffer = createImpulse(ctx, 1.3, 2.5);
    const wet = ctx.createGain();
    wet.gain.value = fx.reverb.mix;
    const dry = ctx.createGain();
    dry.gain.value = 1 - fx.reverb.mix;
    const sum = ctx.createGain();
    node.connect(dry).connect(sum);
    node.connect(convolver);
    convolver.connect(wet).connect(sum);
    node = sum;
  }

  return node;
}

function render() {
  trackArea.innerHTML = "";
  mixerSidebar.innerHTML = "";
  mixerPanel.innerHTML = "";
  trackArea.style.minHeight = `${state.timelineHeight}px`;

  const maxEnd = Math.max(
    state.timelineLen,
    ...state.tracks.flatMap(t => t.clips.map(c => c.start + getClipDuration(c)))
  );
  state.timelineLen = Math.max(state.timelineLen, maxEnd);
  projectLen.textContent = `${maxEnd.toFixed(1)}s`;

  state.tracks.forEach((track, index) => {
    const row = document.createElement("div");
    row.className = "track" + (state.selectedTrackId === track.id ? " selected" : "");
    row.style.height = "90px";

    const label = document.createElement("div");
    label.className = "track-label" + (state.selectedTrackId === track.id ? " selected" : "");
    label.textContent = track.name;
    if (state.selectedTrackId === track.id) {
      label.style.color = "#6bffb8";
    }
    row.appendChild(label);
    label.addEventListener("click", () => {
      state.selectedTrackId = track.id;
      render();
    });
    row.addEventListener("click", (e) => {
      if (e.target.closest(".clip")) return;
      state.selectedTrackId = track.id;
      render();
    });
    row.addEventListener("dblclick", () => {
      state.selectedTrackId = track.id;
      render();
    });

    track.clips.forEach((clip) => {
      const clipEl = document.createElement("div");
      clipEl.className = "clip" + (state.selectedClipId === clip.id ? " selected" : "");
      clipEl.style.left = `${clip.start * state.pxPerSec}px`;
      clipEl.style.width = `${getClipDuration(clip) * state.pxPerSec}px`;
      clipEl.dataset.clipId = clip.id;

      const nameEl = document.createElement("div");
      nameEl.textContent = clip.name;
      nameEl.style.fontSize = "11px";
      nameEl.style.color = "#e6f1f2";

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.floor(getClipDuration(clip) * state.pxPerSec));
      canvas.height = 36;
      drawWaveform(canvas, clip);

      clipEl.appendChild(nameEl);
      clipEl.appendChild(canvas);

      const leftHandle = document.createElement("div");
      leftHandle.className = "clip-handle left";
      const rightHandle = document.createElement("div");
      rightHandle.className = "clip-handle right";

      clipEl.appendChild(leftHandle);
      clipEl.appendChild(rightHandle);

      leftHandle.addEventListener("mousedown", (e) => startResize(e, clip, "left"));
      rightHandle.addEventListener("mousedown", (e) => startResize(e, clip, "right"));

      clipEl.addEventListener("mousedown", (e) => startDrag(e, track, clip, clipEl));
      clipEl.addEventListener("click", (e) => {
        state.selectedClipId = clip.id;
        state.selectedTrackId = track.id;
        const bpmText = clip.bpm ? `${clip.bpm} BPM` : "-- BPM";
        const keyText = clip.key ? clip.key : "--";
        const camText = clip.camelot ? clip.camelot : "--";
        clipName.textContent = `${clip.name} · ${bpmText} · ${camText} ${keyText}`;
    drawFullWaveform(clipPreview, clip);
        render();
      });

      row.appendChild(clipEl);
    });

    trackArea.appendChild(row);

    // Mixer
    const buildMix = () => {
      const mix = document.createElement("div");
      mix.className = "mixer-track";
      mix.innerHTML = `
        <div class="title">${track.name}</div>
        <div class="mixer-controls">
          <button class="mute ${track.mute ? "active" : ""}">M</button>
          <button class="solo ${track.solo ? "active" : ""}">S</button>
          <input type="range" min="0" max="1" step="0.01" value="${track.volume}">
        </div>
      `;

      const [muteBtn, soloBtn] = mix.querySelectorAll("button");
      const vol = mix.querySelector("input");

      muteBtn.addEventListener("click", () => {
        track.mute = !track.mute;
        if (state.playing) refreshPlayback();
        render();
      });

      soloBtn.addEventListener("click", () => {
        track.solo = !track.solo;
        if (state.playing) refreshPlayback();
        render();
      });

      vol.addEventListener("input", () => {
        track.volume = parseFloat(vol.value);
        if (state.playing) refreshPlayback();
      });

      return mix;
    };

    mixerSidebar.appendChild(buildMix());
    mixerPanel.appendChild(buildMix());
  });

  const selected = findSelectedClip();
  if (selected) {
    const bpmText = selected.bpm ? `${selected.bpm} BPM` : "-- BPM";
    const keyText = selected.key ? selected.key : "--";
    const camText = selected.camelot ? selected.camelot : "--";
    clipName.textContent = `${selected.name} · ${bpmText} · ${camText} ${keyText}`;
    drawFullWaveform(clipPreview, selected);
    updatePreviewPlayhead();
    updateEffectsUI();
  } else {
    const dict = I18N[languageSelect?.value] || I18N.en || {};
    clipName.textContent = dict["clip.none"] || "No clip selected";
    const ctx = clipPreview.getContext("2d");
    ctx.clearRect(0, 0, clipPreview.width, clipPreview.height);
    updatePreviewPlayhead();
    updateEffectsUI();
  }

  renderRuler(maxEnd);
  updateCursorHeight();

  if (tabMixer.classList.contains("active")) {
    const track = getSelectedTrack();
    if (track) renderEqControls(track);
  }
}

function updateCursorHeight() {
  const height = Math.max(trackArea.scrollHeight, state.timelineHeight) - 32;
  playhead.style.height = `${Math.max(0, height)}px`;
  ghosthead.style.height = `${Math.max(0, height)}px`;
}

function updateEffectsUI() {
  const clip = findSelectedClip();
  const track = getSelectedTrack();
  if (clip) {
    clipRate.value = String(clip.rate ?? 1);
    clipPitch.value = String(clip.pitch ?? 0);
    clipRateVal.textContent = `${(clip.rate ?? 1).toFixed(2)}x`;
    clipPitchVal.textContent = `${clip.pitch ?? 0} st`;
  } else {
    clipRate.value = "1";
    clipPitch.value = "0";
    clipRateVal.textContent = "1.00x";
    clipPitchVal.textContent = "0 st";
  }

  if (track) {
    const fx = ensureTrackEffects(track);
    fxDelayOn.checked = fx.delay.enabled;
    fxDelayTime.value = fx.delay.time;
    fxDelayFeedback.value = fx.delay.feedback;
    fxDelayMix.value = fx.delay.mix;
    fxReverbOn.checked = fx.reverb.enabled;
    fxReverbMix.value = fx.reverb.mix;
    fxSatOn.checked = fx.saturation.enabled;
    fxSatDrive.value = fx.saturation.drive;
    fxCompOn.checked = fx.compressor.enabled;
    fxCompThreshold.value = fx.compressor.threshold;
    fxCompRatio.value = fx.compressor.ratio;
  }
}

function renderRuler(lengthSec) {
  ruler.innerHTML = "";
  const totalWidth = lengthSec * state.pxPerSec;
  ruler.style.width = `${totalWidth}px`;
  trackArea.style.width = `${totalWidth}px`;

  const beatSec = 60 / state.bpm;
  const gridSec = beatSec * (4 / state.grid);
  const maxMarks = Math.ceil(lengthSec / gridSec);
  const gridPx = gridSec * state.pxPerSec;
  const barPx = beatSec * state.pxPerSec * 4;
  trackArea.style.setProperty("--grid-px", `${gridPx}px`);
  trackArea.style.setProperty("--bar-px", `${barPx}px`);

  for (let i = 0; i <= maxMarks; i++) {
    const s = i * gridSec;
    const mark = document.createElement("div");
    mark.style.position = "absolute";
    mark.style.left = `${s * state.pxPerSec}px`;
    mark.style.height = "32px";
    mark.style.width = "1px";
    mark.style.background = i % state.grid === 0 ? "#2a3c45" : "#1a252e";

    const label = document.createElement("div");
    if (i % state.grid === 0) {
      const beat = s / beatSec;
      const bar = Math.floor(beat / 4) + 1;
      const beatInBar = Math.floor(beat % 4) + 1;
      if (state.grid === 1) label.textContent = `${bar}`;
      if (state.grid === 2) label.textContent = `${bar}.${beatInBar <= 2 ? 1 : 3}`;
      if (state.grid === 4) label.textContent = `${bar}.${beatInBar}`;
      if (state.grid === 8) label.textContent = `${bar}.${beatInBar}.${(beat % 1) < 0.5 ? 1 : 2}`;
      if (state.grid === 16) label.textContent = `${bar}.${beatInBar}.${Math.floor((beat % 1) * 4) + 1}`;
    }
    label.style.position = "absolute";
    label.style.left = "4px";
    label.style.top = "4px";
    label.style.fontSize = "10px";
    label.style.color = "#8fb9bf";
    if (i % state.grid === 0) mark.appendChild(label);

    ruler.appendChild(mark);
  }

  updateRangeUI();
}

function drawWaveform(canvas, clip) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(0,229,255,0.8)";
  ctx.lineWidth = 1;

  const buffer = clip.buffer;
  const data = buffer.getChannelData(0);
  const { startOffset, endOffset } = getClipWindow(clip);
  const startSample = Math.max(0, Math.floor(startOffset * buffer.sampleRate));
  const endSample = Math.min(data.length, Math.floor((buffer.duration - endOffset) * buffer.sampleRate));
  const totalSamples = Math.max(1, endSample - startSample);
  const step = Math.ceil(totalSamples / canvas.width);
  const amp = canvas.height / 2;
  ctx.beginPath();
  for (let i = 0; i < canvas.width; i++) {
    let min = 1.0;
    let max = -1.0;
    for (let j = 0; j < step; j++) {
      const datum = data[startSample + (i * step) + j] || 0;
      if (datum < min) min = datum;
      if (datum > max) max = datum;
    }
    ctx.moveTo(i, (1 + min) * amp);
    ctx.lineTo(i, (1 + max) * amp);
  }
  ctx.stroke();
}

function drawFullWaveform(canvas, clip) {
  if (!clip || !clip.buffer) return;
  const { startOffset, endOffset, trimmed } = getClipWindow(clip);
  const previewPxPerSec = Math.max(120, state.pxPerSec * 1.2);
  canvas.width = Math.max(1, Math.floor(trimmed * previewPxPerSec));
  canvas.height = 120;
  canvas.dataset.pxPerSec = String(previewPxPerSec);
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(107,255,184,0.8)";
  ctx.lineWidth = 1;
  const buffer = clip.buffer;
  const data = buffer.getChannelData(0);
  const startSample = Math.max(0, Math.floor(startOffset * buffer.sampleRate));
  const endSample = Math.min(data.length, Math.floor((buffer.duration - endOffset) * buffer.sampleRate));
  const totalSamples = Math.max(1, endSample - startSample);
  const step = Math.ceil(totalSamples / canvas.width);
  const amp = canvas.height / 2;
  ctx.beginPath();
  for (let i = 0; i < canvas.width; i++) {
    let min = 1.0;
    let max = -1.0;
    for (let j = 0; j < step; j++) {
      const datum = data[startSample + (i * step) + j] || 0;
      if (datum < min) min = datum;
      if (datum > max) max = datum;
    }
    ctx.moveTo(i, (1 + min) * amp);
    ctx.lineTo(i, (1 + max) * amp);
  }
  ctx.stroke();
}

function startDrag(e, track, clip, clipEl) {
  if (e.button !== 0) return;
  state.selectedClipId = clip.id;
  state.selectedTrackId = track.id;
  if (e.altKey) {
    render();
    return;
  }
  document.body.classList.add("dragging");
  const startX = e.clientX;
  const original = clip.start;
  const disableSnap = e.shiftKey;

  function onMove(ev) {
    const dx = ev.clientX - startX;
    const delta = dx / state.pxPerSec;
    let next = Math.max(0, original + delta);
    if (state.snap && !disableSnap) {
      const beat = 60 / state.bpm;
      const gridSec = beat * (4 / state.grid);
      next = Math.round(next / gridSec) * gridSec;
    }
    clip.start = next;
    clipEl.style.left = `${clip.start * state.pxPerSec}px`;

    const rect = trackArea.getBoundingClientRect();
    const y = ev.clientY - rect.top + trackArea.scrollTop;
    const targetIndex = Math.max(0, Math.floor(y / 90));
    const currentIndex = state.tracks.findIndex(t => t.clips.includes(clip));
    if (targetIndex !== currentIndex) {
      while (state.tracks.length <= targetIndex) addTrack();
      const from = state.tracks[currentIndex];
      if (from) from.clips = from.clips.filter(c => c.id !== clip.id);
      state.tracks[targetIndex].clips.push(clip);
      state.selectedTrackId = state.tracks[targetIndex].id;
    }
    const end = clip.start + getClipDuration(clip);
    if (end > state.timelineLen - 5) {
      state.timelineLen = end + 30;
      renderRuler(state.timelineLen);
    }
  }

  function onUp() {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
    document.body.classList.remove("dragging");
    pushUndo();
    render();
  }

  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
}

function startResize(e, clip, side) {
  e.stopPropagation();
  pushUndo();
  const startX = e.clientX;
  const originalStart = clip.start;
  const originalStartOffset = clip.startOffset || 0;
  const originalEndOffset = clip.endOffset || 0;
  const rate = clip.playbackRate || 1;
  const minLen = 0.1;

  function onMove(ev) {
    const dx = (ev.clientX - startX) / state.pxPerSec;
    if (side === "left") {
      const maxStartOffset = clip.buffer.duration - originalEndOffset - minLen * rate;
      const nextStartOffset = Math.min(maxStartOffset, Math.max(0, originalStartOffset + dx * rate));
      const deltaTimeline = (nextStartOffset - originalStartOffset) / rate;
      clip.startOffset = nextStartOffset;
      clip.start = Math.max(0, originalStart + deltaTimeline);
    } else {
      const maxEndOffset = clip.buffer.duration - originalStartOffset - minLen * rate;
      const nextEndOffset = Math.min(maxEndOffset, Math.max(0, originalEndOffset - dx * rate));
      clip.endOffset = nextEndOffset;
    }
    const nextDur = getClipDuration(clip);
    clip.fadeIn = Math.min(clip.fadeIn || 0, nextDur / 2);
    clip.fadeOut = Math.min(clip.fadeOut || 0, nextDur / 2);
    render();
  }

  function onUp() {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
  }

  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
}

function startFade(e, clip, side) {
  e.stopPropagation();
  e.preventDefault();
  pushUndo();
  const rect = e.currentTarget.parentElement.getBoundingClientRect();
  const clipHeight = Math.max(1, rect.height);
  const clipWidth = getClipDuration(clip) * state.pxPerSec;

  function onMove(ev) {
    const localX = Math.max(0, Math.min(clipWidth, ev.clientX - rect.left));
    const localY = Math.max(0, Math.min(clipHeight, ev.clientY - rect.top));
    const curve = 1 - (localY / clipHeight);
    const clipDur = getClipDuration(clip);
    if (side === "in") {
      clip.fadeIn = Math.min(clipDur / 2, localX / state.pxPerSec);
      clip.fadeInCurve = curve;
    } else {
      clip.fadeOut = Math.min(clipDur / 2, (clipWidth - localX) / state.pxPerSec);
      clip.fadeOutCurve = curve;
    }
    clip.fadeActive = true;
    render();
  }

  function onUp() {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
    document.body.classList.remove("dragging");
  }

  document.body.classList.add("dragging");
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
}

function updatePlayhead() {
  if (!state.playing) return;
  const now = audioCtx.currentTime - state.startTime + state.playStartOffset;
  const maxClipEnd = Math.max(0, ...state.tracks.flatMap(t => t.clips.map(c => c.start + getClipDuration(c))));
  if (maxClipEnd > 0 && now >= maxClipEnd) {
    stop();
    return;
  }
  setPlayhead(now, true);
  ghosthead.style.display = "block";
  ghosthead.style.left = `${now * state.pxPerSec}px`;
  if (metroToggle.checked) {
    const beat = Math.floor(now / (60 / state.bpm));
    if (beat !== state.lastBeat) {
      state.lastBeat = beat;
      metronomeTick(beat % 4 === 0);
    }
  }
  if (state.follow) {
    const x = state.playhead * state.pxPerSec;
    trackArea.parentElement.scrollLeft = Math.max(0, x - trackArea.parentElement.clientWidth / 2);
  }
  requestAnimationFrame(updatePlayhead);
}

function setPlayhead(time, fromPlayback = false) {
  state.playhead = Math.max(0, time);
  playhead.style.left = `${state.playhead * state.pxPerSec}px`;
  timeReadout.textContent = formatTime(state.playhead);
  barBeatReadout.textContent = formatBarBeat(state.playhead);
  updatePreviewPlayhead();
  if (!fromPlayback && state.playing) {
    refreshPlayback();
  }
  if (state.playhead > state.timelineLen - 5) {
    state.timelineLen = state.playhead + 30;
    renderRuler(state.timelineLen);
  }
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = (sec % 60).toFixed(1).padStart(4, "0");
  return `${String(m).padStart(2, "0")}:${s}`;
}

function formatBarBeat(sec) {
  const beatSec = 60 / state.bpm;
  const totalBeats = sec / beatSec;
  const bar = Math.floor(totalBeats / 4) + 1;
  const beatInBar = Math.floor(totalBeats % 4) + 1;
  const sub = Math.floor((totalBeats % 1) * state.grid) + 1;
  return `${bar}.${beatInBar}.${sub}`;
}

function updatePreviewPlayhead() {
  const clip = findSelectedClip();
  if (!clip) {
    previewPlayhead.style.display = "none";
    return;
  }
  const px = parseFloat(clipPreview.dataset.pxPerSec || String(state.pxPerSec));
  const local = state.playhead - clip.start;
  const clipLen = getClipDuration(clip);
  if (local < 0 || local > clipLen) {
    previewPlayhead.style.display = "none";
    return;
  }
  previewPlayhead.style.display = "block";
  const left = local * px + 8;
  previewPlayhead.style.left = `${left}px`;
  if (miniFollowToggle.checked) {
    const viewport = previewWrap.clientWidth;
    const target = Math.max(0, left - viewport * 0.5);
    previewWrap.scrollLeft = target;
  }
}

function initRange() {
  const beat = 60 / state.bpm;
  state.rangeStart = 0;
  state.rangeEnd = beat * 4;
  updateRangeUI();
}

function updateRangeUI() {
  if (!state.rangeVisible) {
    rangeSelector.classList.add("hidden");
    return;
  }
  rangeSelector.classList.remove("hidden");
  const left = state.rangeStart * state.pxPerSec;
  const right = state.rangeEnd * state.pxPerSec;
  const width = Math.max(8, right - left);
  rangeBody.style.left = `${left}px`;
  rangeBody.style.width = `${width}px`;
  rangeLeft.style.left = `${left - 5}px`;
  rangeRight.style.left = `${left + width - 5}px`;
}

async function handleFiles(files) {
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    if (!state.tracks.length) addTrack();
    const idx = state.tracks.findIndex(t => t.id === state.selectedTrackId);
    const track = idx >= 0 ? state.tracks[idx] : state.tracks[0];
    const clip = addClipToTrack(track, audioBuffer, file.name);
    clip.sourceFile = file;
    if (!state.selectedClipId) {
      state.selectedClipId = track.clips[track.clips.length - 1].id;
      clipName.textContent = file.name;
      drawFullWaveform(clipPreview, audioBuffer);
    }
  }
  render();
}

function play() {
  if (state.playing) return;
  audioCtx.resume();
  stopSources();
  state.lastBeat = -1;
  state.playStartOffset = state.playhead;
  const maxClipEnd = Math.max(0, ...state.tracks.flatMap(t => t.clips.map(c => c.start + getClipDuration(c))));
  if (maxClipEnd > 0 && state.playhead >= maxClipEnd) {
    setPlayhead(0);
  }
  state.playing = true;
  state.startTime = audioCtx.currentTime;
  scheduleSources();

  updatePlayhead();
}

function scheduleSources() {
  const soloTracks = state.tracks.filter(t => t.solo);
  state.tracks.forEach((track) => {
    if (soloTracks.length && !track.solo) return;
    if (track.mute) return;

      track.clips.forEach((clip) => {
        const clipStart = clip.start;
        const clipDuration = getClipDuration(clip);
        const clipEnd = clip.start + clipDuration;
        if (state.playStartOffset > clipEnd) return;
        if (clipDuration <= 0) return;
        const { startOffset, trimmed } = getClipWindow(clip);

        const source = audioCtx.createBufferSource();
        source.buffer = clip.buffer;
        source.playbackRate.value = clip.playbackRate || 1;

      const lowCut = audioCtx.createBiquadFilter();
      lowCut.type = "highpass";
      lowCut.frequency.value = track.lowCut;

      const highCut = audioCtx.createBiquadFilter();
      highCut.type = "lowpass";
      highCut.frequency.value = track.highCut;

      const eqNodes = track.eq.map(b => {
        const f = audioCtx.createBiquadFilter();
        f.type = "peaking";
        f.frequency.value = b.freq;
        f.Q.value = 1;
        f.gain.value = b.gain;
        return f;
      });

        const clipGain = audioCtx.createGain();
        clipGain.gain.value = 1;

        const gain = audioCtx.createGain();
        gain.gain.value = track.volume;

      let chain = source;
      chain.connect(lowCut);
      chain = lowCut;
      eqNodes.forEach(node => {
        chain.connect(node);
        chain = node;
      });
        chain.connect(highCut);
        const fxOut = applyTrackFxChain(audioCtx, highCut, track);
        fxOut.connect(clipGain).connect(gain).connect(audioCtx.destination);
        state.activeSources.push(source);

        const startAt = Math.max(0, clipStart - state.playStartOffset);
        const offsetTimeline = Math.max(0, state.playStartOffset - clipStart);
        const rate = clip.playbackRate || 1;
        const offsetBuf = startOffset + offsetTimeline * rate;
        const durationTimeline = Math.min(clipDuration - offsetTimeline, trimmed / rate - offsetTimeline);
        if (durationTimeline <= 0) return;
        const durationBuf = durationTimeline * rate;
        const startTime = audioCtx.currentTime + startAt;

        applyFades(clipGain, startTime, durationTimeline, clip);

        source.start(startTime, offsetBuf, durationBuf);
      });
    });
}

function pause() {
  state.playing = false;
  stopSources();
  stopMetronome();
}

function stop() {
  state.playing = false;
  stopSources();
  stopMetronome();
  setPlayhead(0);
}

function splitClip() {
  const clip = findSelectedClip();
  if (!clip) return;
  pushUndo();
  const cut = state.playhead;
  const clipDuration = getClipDuration(clip);
  if (cut <= clip.start || cut >= clip.start + clipDuration) return;

  const leftDur = cut - clip.start;
  const rightDur = clipDuration - leftDur;
  const rate = clip.playbackRate || 1;
  const originalFadeIn = clip.fadeIn || 0;
  const originalFadeOut = clip.fadeOut || 0;
  const { startOffset, endOffset } = getClipWindow(clip);
  const bufferDur = clip.buffer.duration;
  const cutOffset = startOffset + leftDur * rate;

  clip.startOffset = startOffset;
  clip.endOffset = Math.max(0, bufferDur - cutOffset);
  clip.fadeOut = 0;
  clip.fadeIn = Math.min(originalFadeIn, leftDur);

    const rightClip = {
      id: crypto.randomUUID(),
      name: clip.name + " (B)",
      buffer: clip.buffer,
      duration: clip.buffer.duration,
      bpm: clip.bpm,
        playbackRate: clip.playbackRate,
        rate: clip.rate ?? 1,
        pitch: clip.pitch ?? 0,
      rate: clip.rate ?? 1,
      pitch: clip.pitch ?? 0,
      key: clip.key,
      camelot: clip.camelot,
      sourceFile: clip.sourceFile,
    startOffset: cutOffset,
    endOffset,
    fadeIn: 0,
    fadeInCurve: clip.fadeInCurve ?? 0.5,
    fadeOut: Math.min(originalFadeOut, rightDur),
    fadeOutCurve: clip.fadeOutCurve ?? 0.5,
    fadeActive: clip.fadeActive || false,
    start: cut
  };

  const track = findTrackByClip(clip.id);
  track.clips.push(rightClip);
  render();
}

function splitClipAtTime(clip, cutTime) {
  const clipDuration = getClipDuration(clip);
  if (cutTime <= clip.start || cutTime >= clip.start + clipDuration) return null;
  const leftDur = cutTime - clip.start;
  const rightDur = clipDuration - leftDur;
  const rate = clip.playbackRate || 1;
  const originalFadeIn = clip.fadeIn || 0;
  const originalFadeOut = clip.fadeOut || 0;
  const { startOffset, endOffset } = getClipWindow(clip);
  const bufferDur = clip.buffer.duration;
  const cutOffset = startOffset + leftDur * rate;

  clip.startOffset = startOffset;
  clip.endOffset = Math.max(0, bufferDur - cutOffset);
  clip.fadeOut = 0;
  clip.fadeIn = Math.min(originalFadeIn, leftDur);

    const rightClip = {
      id: crypto.randomUUID(),
      name: clip.name + " (B)",
      buffer: clip.buffer,
      duration: clip.buffer.duration,
      bpm: clip.bpm,
      playbackRate: clip.playbackRate,
      rate: clip.rate ?? 1,
      pitch: clip.pitch ?? 0,
      key: clip.key,
      camelot: clip.camelot,
    sourceFile: clip.sourceFile,
    startOffset: cutOffset,
    endOffset,
    fadeIn: 0,
    fadeInCurve: clip.fadeInCurve ?? 0.5,
    fadeOut: Math.min(originalFadeOut, rightDur),
    fadeOutCurve: clip.fadeOutCurve ?? 0.5,
    fadeActive: clip.fadeActive || false,
    start: cutTime
  };

  const track = findTrackByClip(clip.id);
  if (!track) return null;
  track.clips.push(rightClip);
  return rightClip;
}

function duplicateClip() {
  const clip = findSelectedClip();
  if (!clip) return;
  pushUndo();
  const dup = { ...clip, id: crypto.randomUUID(), start: clip.start + getClipDuration(clip) + 0.2 };
  const track = findTrackByClip(clip.id);
  track.clips.push(dup);
  render();
}

function deleteClip() {
  const clip = findSelectedClip();
  if (!clip) return;
  pushUndo();
  const track = findTrackByClip(clip.id);
  track.clips = track.clips.filter(c => c.id !== clip.id);
  state.selectedClipId = null;
  render();
}

function copyClip() {
  const clip = findSelectedClip();
  if (!clip) return;
  clipboardClip = { ...clip, id: crypto.randomUUID() };
}

function cutClip() {
  const clip = findSelectedClip();
  if (!clip) return;
  clipboardClip = { ...clip, id: crypto.randomUUID() };
  deleteClip();
}

function setClipBpm() {
  const clip = findSelectedClip();
  if (!clip) return;
  pushUndo();
  const current = clip.bpm || state.bpm;
  const next = parseFloat(prompt("Set clip BPM (affects playback speed):", String(current)));
  if (!Number.isFinite(next) || next <= 0) return;
  clip.bpm = next;
  clip.rate = state.bpm / next;
  clip.pitch = clip.pitch ?? 0;
  recomputePlaybackRate(clip);
  applyTimeStretch(clip, clip.rate);
  render();
  if (state.playing) refreshPlayback();
}

function pasteClipAt(timeSec, trackIndex = 0) {
  if (!clipboardClip) return;
  pushUndo();
  while (state.tracks.length <= trackIndex) addTrack();
  const beat = 60 / state.bpm;
  const gridSec = beat * (4 / state.grid);
  let start = timeSec;
  if (state.snap) start = Math.round(start / gridSec) * gridSec;
  const copy = { ...clipboardClip, id: crypto.randomUUID(), start };
  state.tracks[trackIndex].clips.push(copy);
  render();
}

async function analyzeSelectedClip() {
  const clip = findSelectedClip();
  if (!clip) return;
  const api = (analysisUrlInput.value || "").trim();
  if (!api) {
    alert(t("alert.setAnalysisUrl", "Set the Analysis API URL in Settings first."));
    return;
  }
  if (!clip.sourceFile) {
    alert(t("alert.noOriginalFile", "No original file stored for this clip. Re-import it from disk."));
    return;
  }
  try {
    analysisOverlay.classList.remove("hidden");
    analysisProgress.style.width = "10%";
    let pct = 10;
    const timer = setInterval(() => {
      pct = Math.min(95, pct + 5);
      analysisProgress.style.width = `${pct}%`;
    }, 500);

    const form = new FormData();
    form.append("file", clip.sourceFile, clip.sourceFile.name);
    const res = await fetch(`${api.replace(/\/$/, "")}/analyze?seconds=60`, {
      method: "POST",
      body: form
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    clearInterval(timer);
    analysisProgress.style.width = "100%";
  if (data.bpm) {
    clip.bpm = Math.round(data.bpm);
    clip.rate = state.bpm / clip.bpm;
    clip.pitch = clip.pitch ?? 0;
    recomputePlaybackRate(clip);
    applyTimeStretch(clip, clip.rate);
  }
    clip.key = data.key || clip.key;
    clip.camelot = data.camelot || clip.camelot;
    render();
  } catch (err) {
    alert(`${t("alert.analyzeFailed", "Analyze failed")}: ${err.message}`);
  } finally {
    setTimeout(() => {
      analysisOverlay.classList.add("hidden");
      analysisProgress.style.width = "0%";
    }, 300);
  }
}
function showContextMenu(e) {
  contextMenu.innerHTML = "";
  const clipEl = e.target.closest(".clip");
  const rect = trackArea.getBoundingClientRect();
  const y = e.clientY - rect.top + trackArea.scrollTop;
  const trackIndex = Math.max(0, Math.floor(y / 90));
  const hasRange = state.rangeVisible && state.rangeEnd > state.rangeStart;
  if (hasRange) {
    const btns = [
      { label: "Fade In Selection…", action: () => openEffectModal("fadeIn") },
      { label: "Fade Out Selection…", action: () => openEffectModal("fadeOut") },
      { label: "Crossfade Selection…", action: () => openEffectModal("crossfade") }
    ];
    btns.forEach(b => addMenuItem(b.label, b.action));
    contextMenu.style.left = `${e.clientX}px`;
    contextMenu.style.top = `${e.clientY}px`;
    contextMenu.classList.remove("hidden");
    return;
  }
  if (clipEl) {
    const clipId = clipEl.dataset.clipId;
    state.selectedClipId = clipId;
    const track = findTrackByClip(clipId);
    if (track) state.selectedTrackId = track.id;
    const btns = [
      { label: "Split", action: splitClip },
      { label: "Duplicate", action: duplicateClip },
      { label: "Analyze BPM/Key", action: analyzeSelectedClip },
      { label: "Set Clip BPM", action: setClipBpm },
      { label: "Copy", action: copyClip },
      { label: "Cut", action: cutClip },
      { label: "Paste", action: () => pasteClipAt(state.playhead, trackIndex) },
      { label: "Delete", action: deleteClip }
    ];
    btns.forEach(b => addMenuItem(b.label, b.action));
    render();
  } else {
    const btns = [
      { label: "Add Track", action: () => addTrack() },
      { label: "Paste", action: () => pasteClipAt(state.playhead, trackIndex) }
    ];
    btns.forEach(b => addMenuItem(b.label, b.action));
  }
  contextMenu.style.left = `${e.clientX}px`;
  contextMenu.style.top = `${e.clientY}px`;
  contextMenu.classList.remove("hidden");
}

function addMenuItem(label, action) {
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.addEventListener("click", () => {
    contextMenu.classList.add("hidden");
    action();
  });
  contextMenu.appendChild(btn);
}

function showAudioContextMenu(e) {
  const clip = findSelectedClip();
  if (!clip) return;
  contextMenu.innerHTML = "";
  const hasRange = state.rangeVisible && state.rangeEnd > state.rangeStart;
  if (hasRange) {
    const btns = [
      { label: "Fade In Selection…", action: () => openEffectModal("fadeIn") },
      { label: "Fade Out Selection…", action: () => openEffectModal("fadeOut") },
      { label: "Crossfade Selection…", action: () => openEffectModal("crossfade") }
    ];
    btns.forEach(b => addMenuItem(b.label, b.action));
    contextMenu.style.left = `${e.clientX}px`;
    contextMenu.style.top = `${e.clientY}px`;
    contextMenu.classList.remove("hidden");
    return;
  }
  const btns = [
    { label: "Split", action: splitClip },
    { label: "Duplicate", action: duplicateClip },
    { label: "Analyze BPM/Key", action: analyzeSelectedClip },
    { label: "Set Clip BPM", action: setClipBpm },
    { label: "Copy", action: copyClip },
    { label: "Cut", action: cutClip },
    { label: "Delete", action: deleteClip }
  ];
  btns.forEach(b => addMenuItem(b.label, b.action));
  contextMenu.style.left = `${e.clientX}px`;
  contextMenu.style.top = `${e.clientY}px`;
  contextMenu.classList.remove("hidden");
}

function findSelectedClip() {
  for (const t of state.tracks) {
    const clip = t.clips.find(c => c.id === state.selectedClipId);
    if (clip) return clip;
  }
  return null;
}

function findTrackByClip(id) {
  return state.tracks.find(t => t.clips.some(c => c.id === id));
}

function openEffectModal(type = "fadeIn") {
  if (!effectOverlay) return;
  const hasRange = state.rangeVisible && state.rangeEnd > state.rangeStart;
  if (!hasRange) {
    alert(t("alert.selectRange", "Select a range first (Alt + drag)."));
    return;
  }
  effectType.value = type;
  effectTitle.textContent = `Apply ${type === "crossfade" ? "Crossfade" : type === "fadeOut" ? "Fade Out" : "Fade In"}`;
  effectOverlay.classList.remove("hidden");
}

function closeEffectModal() {
  effectOverlay.classList.add("hidden");
}

function applySelectionEffect() {
  const hasRange = state.rangeVisible && state.rangeEnd > state.rangeStart;
  if (!hasRange) return;
  const effect = effectType.value;
  const duration = Math.max(0.05, parseFloat(effectDuration.value || "0.5"));
  const curve = Math.max(0, Math.min(1, parseFloat(effectCurve.value || "0.5")));
  pushUndo();

  const start = state.rangeStart;
  const end = state.rangeEnd;
  state.tracks.forEach(track => {
    track.clips.slice().forEach((clip) => {
      const clipStart = clip.start;
      const clipEnd = clip.start + getClipDuration(clip);
      if (clipEnd <= start || clipStart >= end) return;

      let working = clip;
      if (start > clipStart && start < clipEnd) {
        const right = splitClipAtTime(working, start);
        if (!right) return;
        working = right;
      }
      const workingEnd = working.start + getClipDuration(working);
      if (end > working.start && end < workingEnd) {
        splitClipAtTime(working, end);
      }

      if (effect === "fadeIn" || effect === "crossfade") {
        const len = Math.min(duration, getClipDuration(working) / 2);
        working.fadeIn = len;
        working.fadeInCurve = curve;
        working.fadeActive = true;
      }
      if (effect === "fadeOut" || effect === "crossfade") {
        const len = Math.min(duration, getClipDuration(working) / 2);
        working.fadeOut = len;
        working.fadeOutCurve = curve;
        working.fadeActive = true;
      }
    });
  });

  render();
  if (state.playing) refreshPlayback();
  closeEffectModal();
}

function setProjectStatus(msg) {
  if (projectStatus) projectStatus.textContent = msg;
}

function t(key, fallback = "") {
  const dict = I18N[languageSelect?.value] || I18N.en || {};
  return dict[key] || fallback || key;
}

function showRelinkModal(project, missingNames) {
  pendingProject = project;
  relinkList.innerHTML = missingNames.map(n => `<div>• ${n}</div>`).join("");
  relinkOverlay.classList.remove("hidden");
}

function hideRelinkModal() {
  relinkOverlay.classList.add("hidden");
  relinkInput.value = "";
}

function findMissingSources(project) {
  const missing = new Set();
  for (const t of project.tracks || []) {
    for (const c of t.clips || []) {
      if (!c.audioData && c.sourceName) missing.add(c.sourceName);
    }
  }
  return Array.from(missing);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

async function bufferToWavDataUrl(buffer) {
  const wav = encodeWav(buffer);
  const blob = new Blob([wav], { type: "audio/wav" });
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to encode audio"));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

async function serializeProject(includeAudio) {
  const project = {
    version: 1,
    savedAt: new Date().toISOString(),
    bpm: state.bpm,
    grid: state.grid,
    pxPerSec: state.pxPerSec,
    timelineLen: state.timelineLen,
    timelineHeight: state.timelineHeight,
    rangeVisible: state.rangeVisible,
    rangeStart: state.rangeStart,
    rangeEnd: state.rangeEnd,
    tracks: []
  };

  for (const track of state.tracks) {
      const t = {
        id: track.id,
        name: track.name,
        volume: track.volume,
        mute: track.mute,
        solo: track.solo,
        effects: ensureTrackEffects(track),
        eq: track.eq,
        lowCut: track.lowCut,
        highCut: track.highCut,
        clips: []
      };

    for (const clip of track.clips) {
      const c = {
        id: clip.id,
        name: clip.name,
        start: clip.start,
        startOffset: clip.startOffset || 0,
        endOffset: clip.endOffset || 0,
        fadeIn: clip.fadeIn || 0,
        fadeOut: clip.fadeOut || 0,
          fadeInCurve: clip.fadeInCurve ?? 0.5,
          fadeOutCurve: clip.fadeOutCurve ?? 0.5,
          fadeActive: clip.fadeActive || false,
          rate: clip.rate ?? 1,
          pitch: clip.pitch ?? 0,
          bpm: clip.bpm,
          playbackRate: clip.playbackRate,
        key: clip.key,
        camelot: clip.camelot,
        sourceName: clip.sourceFile?.name || null,
        sourceType: clip.sourceFile?.type || null,
        audioData: null
      };

      if (includeAudio) {
        if (clip.sourceFile) {
          c.audioData = await readFileAsDataUrl(clip.sourceFile);
        } else if (clip.buffer) {
          c.audioData = await bufferToWavDataUrl(clip.buffer);
          c.sourceType = "audio/wav";
        }
      }

      t.clips.push(c);
    }
    project.tracks.push(t);
  }

  return project;
}

async function loadProject(project, relinkFiles = [], allowMissing = false) {
  stop();
  state.tracks = [];
  state.selectedClipId = null;
  state.selectedTrackId = null;
  state.bpm = project.bpm || 120;
  state.grid = project.grid || 4;
  state.pxPerSec = project.pxPerSec || 120;
  state.timelineLen = project.timelineLen || 600;
  state.timelineHeight = project.timelineHeight || 900;
  state.rangeVisible = project.rangeVisible || false;
  state.rangeStart = project.rangeStart || 0;
  state.rangeEnd = project.rangeEnd || 0;
  bpmInput.value = String(state.bpm);
  tempoValue.textContent = String(state.bpm);
  zoom.value = state.pxPerSec;
  zoomHud.value = state.pxPerSec;
  gridSelect.value = String(state.grid);

  if (!relinkFiles.length && !allowMissing) {
    const missing = findMissingSources(project);
    if (missing.length) {
      showRelinkModal(project, missing);
      return;
    }
  }

  const fileMap = new Map();
  relinkFiles.forEach(f => fileMap.set(f.name, f));

  for (const t of project.tracks || []) {
    const track = {
      id: t.id || crypto.randomUUID(),
      name: t.name || "Track",
      clips: [],
      volume: t.volume ?? 1,
      mute: t.mute ?? false,
      solo: t.solo ?? false,
      effects: t.effects || {
        delay: { enabled: false, time: 0.2, feedback: 0.3, mix: 0.25 },
        reverb: { enabled: false, mix: 0.2 },
        saturation: { enabled: false, drive: 0.2 },
        compressor: { enabled: false, threshold: -18, ratio: 4 }
      },
      eq: t.eq || EQ_BANDS.map(b => ({ freq: b.f, gain: 0 })),
      lowCut: t.lowCut ?? 20,
      highCut: t.highCut ?? 20000
    };

    for (const c of t.clips || []) {
      let buffer = null;
      let sourceFile = null;
      if (c.audioData) {
        const res = await fetch(c.audioData);
        const arrayBuffer = await res.arrayBuffer();
        buffer = await audioCtx.decodeAudioData(arrayBuffer);
        sourceFile = new File([arrayBuffer], c.sourceName || "audio.wav", { type: c.sourceType || "audio/wav" });
      } else if (c.sourceName && fileMap.has(c.sourceName)) {
        const file = fileMap.get(c.sourceName);
        const arrayBuffer = await file.arrayBuffer();
        buffer = await audioCtx.decodeAudioData(arrayBuffer);
        sourceFile = file;
      }

      if (!buffer) continue;

        const clip = {
          id: c.id || crypto.randomUUID(),
          name: c.name || "Clip",
          buffer,
          duration: buffer.duration,
          bpm: c.bpm || state.bpm,
          playbackRate: c.playbackRate || 1,
        key: c.key || null,
        camelot: c.camelot || null,
        sourceFile,
        startOffset: c.startOffset || 0,
        endOffset: c.endOffset || 0,
        fadeIn: c.fadeIn || 0,
        fadeOut: c.fadeOut || 0,
          fadeInCurve: c.fadeInCurve ?? 0.5,
          fadeOutCurve: c.fadeOutCurve ?? 0.5,
          fadeActive: c.fadeActive || false,
          rate: c.rate ?? 1,
          pitch: c.pitch ?? 0,
          start: c.start || 0
        };
        recomputePlaybackRate(clip);
      track.clips.push(clip);
    }

    state.tracks.push(track);
  }

  if (state.tracks.length) {
    state.selectedTrackId = state.tracks[0].id;
    if (state.tracks[0].clips.length) state.selectedClipId = state.tracks[0].clips[0].id;
  }
  render();
  setProjectStatus(t("status.projectLoaded", "Project loaded."));
}

function sliceBuffer(buffer, startSec, durationSec) {
  const sampleRate = buffer.sampleRate;
  const start = Math.floor(startSec * sampleRate);
  const length = Math.floor(durationSec * sampleRate);
  const newBuf = audioCtx.createBuffer(buffer.numberOfChannels, length, sampleRate);
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const channel = buffer.getChannelData(ch).slice(start, start + length);
    newBuf.copyToChannel(channel, ch);
  }
  return newBuf;
}

function stopSources() {
  state.activeSources.forEach(src => {
    try { src.stop(); } catch {}
  });
  state.activeSources = [];
}

function refreshPlayback() {
  if (!state.playing) return;
  stopSources();
  state.startTime = audioCtx.currentTime;
  state.playStartOffset = state.playhead;
  scheduleSources();
}

function renderEqControls(track) {
  eqControls.innerHTML = "";
  const low = document.createElement("div");
  low.className = "eq-band";
  low.innerHTML = `
    <div>Low Cut</div>
    <input type="range" min="20" max="400" value="${track.lowCut}">
    <div>${track.lowCut} Hz</div>
  `;
  const lowInput = low.querySelector("input");
  lowInput.addEventListener("input", () => {
    track.lowCut = parseInt(lowInput.value, 10);
    low.querySelector("div:last-child").textContent = `${track.lowCut} Hz`;
    refreshPlayback();
  });
  eqControls.appendChild(low);

  track.eq.forEach((band, idx) => {
    const cell = document.createElement("div");
    cell.className = "eq-band";
    cell.innerHTML = `
      <div>${band.freq} Hz</div>
      <input type="range" min="-12" max="12" value="${band.gain}">
      <div>${band.gain} dB</div>
    `;
    const input = cell.querySelector("input");
    input.addEventListener("input", () => {
      band.gain = parseInt(input.value, 10);
      cell.querySelector("div:last-child").textContent = `${band.gain} dB`;
      refreshPlayback();
    });
    eqControls.appendChild(cell);
  });

  const high = document.createElement("div");
  high.className = "eq-band";
  high.innerHTML = `
    <div>High Cut</div>
    <input type="range" min="4000" max="20000" value="${track.highCut}">
    <div>${track.highCut} Hz</div>
  `;
  const highInput = high.querySelector("input");
  highInput.addEventListener("input", () => {
    track.highCut = parseInt(highInput.value, 10);
    high.querySelector("div:last-child").textContent = `${track.highCut} Hz`;
    refreshPlayback();
  });
  eqControls.appendChild(high);
}

function metronomeTick(isDownbeat) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.frequency.value = isDownbeat ? 1600 : 1000;
  gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.09);
}

function stopMetronome() {
  if (metroTimer) {
    clearInterval(metroTimer);
    metroTimer = null;
  }
}

fileInput.addEventListener("change", async (e) => {
  await handleFiles(e.target.files);
  e.target.value = "";
});
addTrackBtn.addEventListener("click", () => addTrack());
zoom.addEventListener("input", () => {
  state.pxPerSec = parseInt(zoom.value, 10);
  zoomHud.value = zoom.value;
  render();
});

tabAudio.addEventListener("click", () => {
  panelAudio.classList.remove("hidden");
  panelTracks.classList.add("hidden");
  panelMixer.classList.add("hidden");
  panelProject.classList.add("hidden");
  panelActions.classList.add("hidden");
  panelEffects.classList.add("hidden");
  tabAudio.classList.add("active");
  tabTracks.classList.remove("active");
  tabMixer.classList.remove("active");
  tabProject.classList.remove("active");
  tabActions.classList.remove("active");
  tabEffects.classList.remove("active");
});

tabTracks.addEventListener("click", () => {
  panelAudio.classList.add("hidden");
  panelTracks.classList.remove("hidden");
  panelMixer.classList.add("hidden");
  panelProject.classList.add("hidden");
  panelActions.classList.add("hidden");
  panelEffects.classList.add("hidden");
  tabAudio.classList.remove("active");
  tabTracks.classList.add("active");
  tabMixer.classList.remove("active");
  tabProject.classList.remove("active");
  tabActions.classList.remove("active");
  tabEffects.classList.remove("active");
});

tabMixer.addEventListener("click", () => {
  panelAudio.classList.add("hidden");
  panelTracks.classList.add("hidden");
  panelMixer.classList.remove("hidden");
  panelProject.classList.add("hidden");
  panelActions.classList.add("hidden");
  panelEffects.classList.add("hidden");
  tabAudio.classList.remove("active");
  tabTracks.classList.remove("active");
  tabMixer.classList.add("active");
  tabProject.classList.remove("active");
  tabActions.classList.remove("active");
  tabEffects.classList.remove("active");
  const track = getSelectedTrack();
  if (track) renderEqControls(track);
});

tabProject.addEventListener("click", () => {
  panelAudio.classList.add("hidden");
  panelTracks.classList.add("hidden");
  panelMixer.classList.add("hidden");
  panelProject.classList.remove("hidden");
  panelActions.classList.add("hidden");
  panelEffects.classList.add("hidden");
  tabAudio.classList.remove("active");
  tabTracks.classList.remove("active");
  tabMixer.classList.remove("active");
  tabProject.classList.add("active");
  tabActions.classList.remove("active");
  tabEffects.classList.remove("active");
});

tabActions.addEventListener("click", () => {
  panelAudio.classList.add("hidden");
  panelTracks.classList.add("hidden");
  panelMixer.classList.add("hidden");
  panelProject.classList.add("hidden");
  panelActions.classList.remove("hidden");
  panelEffects.classList.add("hidden");
  tabAudio.classList.remove("active");
  tabTracks.classList.remove("active");
  tabMixer.classList.remove("active");
  tabProject.classList.remove("active");
  tabActions.classList.add("active");
  tabEffects.classList.remove("active");
});

tabEffects.addEventListener("click", () => {
  panelAudio.classList.add("hidden");
  panelTracks.classList.add("hidden");
  panelMixer.classList.add("hidden");
  panelProject.classList.add("hidden");
  panelActions.classList.add("hidden");
  panelEffects.classList.remove("hidden");
  tabAudio.classList.remove("active");
  tabTracks.classList.remove("active");
  tabMixer.classList.remove("active");
  tabProject.classList.remove("active");
  tabActions.classList.remove("active");
  tabEffects.classList.add("active");
});

zoomHud.addEventListener("input", () => {
  zoom.value = zoomHud.value;
  state.pxPerSec = parseInt(zoomHud.value, 10);
  render();
});

settingsBtn.addEventListener("click", () => {
  settingsHud.classList.toggle("hidden");
});

closeHud.addEventListener("click", () => {
  settingsHud.classList.add("hidden");
});

bpmInput.addEventListener("input", () => {
  state.bpm = Math.max(40, Math.min(220, parseInt(bpmInput.value || "120", 10)));
  tempoValue.textContent = String(state.bpm);
  state.tracks.forEach(track => {
    track.clips.forEach(clip => {
      if (clip.bpm) {
        clip.playbackRate = state.bpm / clip.bpm;
      }
    });
  });
  render();
});

snapToggle.addEventListener("change", () => {
  state.snap = snapToggle.checked;
});

followToggle.addEventListener("change", () => {
  state.follow = followToggle.checked;
});

gridSelect.addEventListener("change", () => {
  state.grid = parseInt(gridSelect.value, 10);
  render();
});

document.addEventListener("keydown", (e) => {
  if (e.target && e.target.tagName === "INPUT") return;
  if (e.code === "Space") {
    e.preventDefault();
    state.playing ? pause() : play();
  }
  if (e.ctrlKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
    e.preventDefault();
    const track = state.tracks.find(t => t.id === state.selectedTrackId);
    if (!track || !track.clips.length) return;
    const sorted = [...track.clips].sort((a, b) => a.start - b.start);
    const currentIdx = sorted.findIndex(c => c.id === state.selectedClipId);
    let nextIdx = currentIdx;
    if (e.key === "ArrowLeft") nextIdx = Math.max(0, currentIdx - 1);
    if (e.key === "ArrowRight") nextIdx = Math.min(sorted.length - 1, currentIdx + 1);
    const nextClip = sorted[nextIdx] || sorted[0];
    state.selectedClipId = nextClip.id;
    state.selectedTrackId = track.id;
    clipName.textContent = nextClip.name;
    drawFullWaveform(clipPreview, nextClip.buffer);
    render();
  }
  if (e.key === "/") {
    e.preventDefault();
    state.rangeVisible = !state.rangeVisible;
    if (state.rangeEnd <= state.rangeStart) initRange();
    updateRangeUI();
  }
  if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === "z") {
    e.preventDefault();
    undo();
    return;
  }
  if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "z") || (e.ctrlKey && e.key.toLowerCase() === "y")) {
    e.preventDefault();
    redo();
    return;
  }
  if (!e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
    e.preventDefault();
    const idx = state.tracks.findIndex(t => t.id === state.selectedTrackId);
    if (idx === -1) return;
    const next = e.key === "ArrowUp" ? Math.max(0, idx - 1) : Math.min(state.tracks.length - 1, idx + 1);
    state.selectedTrackId = state.tracks[next].id;
    render();
  }
  if (e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown")) {
    e.preventDefault();
    const clip = findSelectedClip();
    if (!clip) return;
    const beat = 60 / state.bpm;
    let gridSec = beat * (4 / state.grid);
    if (e.shiftKey) gridSec = 0.01;
    if (e.key === "ArrowLeft") {
      clip.start = Math.max(0, clip.start - gridSec);
    }
    if (e.key === "ArrowRight") {
      clip.start = clip.start + gridSec;
    }
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      const currentIndex = state.tracks.findIndex(t => t.clips.includes(clip));
      let target = currentIndex + (e.key === "ArrowUp" ? -1 : 1);
      target = Math.max(0, target);
      while (state.tracks.length <= target) addTrack();
      const from = state.tracks[currentIndex];
      if (from) from.clips = from.clips.filter(c => c.id !== clip.id);
      state.tracks[target].clips.push(clip);
      state.selectedTrackId = state.tracks[target].id;
    }
    pushUndo();
    render();
  }
  if (e.key === "+" || e.key === "=") {
    zoom.value = Math.min(100000, parseInt(zoom.value, 10) + 10);
    zoom.dispatchEvent(new Event("input"));
  }
  if (e.key === "-") {
    zoom.value = Math.max(5, parseInt(zoom.value, 10) - 10);
    zoom.dispatchEvent(new Event("input"));
  }
  if (e.key.toLowerCase() === "s") splitClip();
  if (e.key.toLowerCase() === "d") duplicateClip();
  if (e.key === "Delete" || e.key === "Backspace") deleteClip();
  if (e.ctrlKey && e.key.toLowerCase() === "x") cutClip();
  if (e.ctrlKey && e.key.toLowerCase() === "v") {
    const idx = state.tracks.findIndex(t => t.id === state.selectedTrackId);
    pasteClipAt(state.playhead, idx >= 0 ? idx : 0);
  }
  if (e.key === ",") {
    e.preventDefault();
    setPlayhead(0);
    if (state.playing) refreshPlayback();
  }
});

document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  showContextMenu(e);
});

document.addEventListener("click", () => {
  contextMenu.classList.add("hidden");
});

timeline.addEventListener("wheel", (e) => {
  if (!e.shiftKey) return;
  e.preventDefault();
  const delta = e.deltaY > 0 ? -10 : 10;
  state.pxPerSec = Math.max(5, state.pxPerSec + delta);
  zoom.value = state.pxPerSec;
  zoomHud.value = state.pxPerSec;
  render();
});

document.addEventListener("wheel", (e) => {
  if (!e.ctrlKey) return;
  const overTimeline = e.target.closest(".timeline");
  const overSidebar = e.target.closest(".sidebar");
  const overBottom = e.target.closest(".bottom-panel");
  e.preventDefault();
  if (overTimeline) {
    timeline.scrollLeft += e.deltaY;
    return;
  }
  if (overSidebar) {
    overSidebar.scrollTop += e.deltaY;
    return;
  }
  if (overBottom) {
    overBottom.scrollTop += e.deltaY;
    return;
  }
  timeline.scrollTop += e.deltaY;
}, { passive: false });

let isPanning = false;
let spaceDown = false;
let panStart = { x: 0, y: 0, scrollLeft: 0, scrollTop: 0 };
let touchState = null;
let panCandidate = null;
let suppressClick = false;

timeline.addEventListener("mousedown", (e) => {
  if (e.button !== 0) return;
  if (e.target.closest(".clip")) return;
  if (spaceDown) {
    isPanning = true;
    panStart = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: timeline.scrollLeft,
      scrollTop: timeline.scrollTop
    };
    return;
  }
  panCandidate = {
    x: e.clientX,
    y: e.clientY,
    scrollLeft: timeline.scrollLeft,
    scrollTop: timeline.scrollTop
  };
});

timeline.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1) {
    const t = e.touches[0];
    touchState = {
      mode: "pan",
      startX: t.clientX,
      startY: t.clientY,
      scrollLeft: timeline.scrollLeft,
      scrollTop: timeline.scrollTop
    };
  } else if (e.touches.length === 2) {
    const [a, b] = e.touches;
    const dx = b.clientX - a.clientX;
    const dy = b.clientY - a.clientY;
    touchState = {
      mode: "pinch",
      startDist: Math.hypot(dx, dy),
      startZoom: state.pxPerSec
    };
  }
}, { passive: false });

timeline.addEventListener("touchmove", (e) => {
  if (!touchState) return;
  e.preventDefault();
  if (touchState.mode === "pan" && e.touches.length === 1) {
    const t = e.touches[0];
    const dx = t.clientX - touchState.startX;
    const dy = t.clientY - touchState.startY;
    timeline.scrollLeft = touchState.scrollLeft - dx;
    timeline.scrollTop = touchState.scrollTop - dy;
  } else if (touchState.mode === "pinch" && e.touches.length === 2) {
    const [a, b] = e.touches;
    const dx = b.clientX - a.clientX;
    const dy = b.clientY - a.clientY;
    const dist = Math.hypot(dx, dy);
    const scale = dist / Math.max(1, touchState.startDist);
    const next = Math.max(5, Math.min(100000, Math.round(touchState.startZoom * scale)));
    if (next !== state.pxPerSec) {
      state.pxPerSec = next;
      zoom.value = state.pxPerSec;
      zoomHud.value = state.pxPerSec;
      render();
    }
  }
}, { passive: false });

timeline.addEventListener("touchend", () => {
  touchState = null;
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    spaceDown = true;
    timeline.style.cursor = "grab";
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "Space") {
    spaceDown = false;
    timeline.style.cursor = "default";
    isPanning = false;
  }
});

document.addEventListener("mousemove", (e) => {
  if (panCandidate && !isPanning) {
    const dx = e.clientX - panCandidate.x;
    const dy = e.clientY - panCandidate.y;
    if (Math.hypot(dx, dy) > 4) {
      isPanning = true;
      panStart = panCandidate;
      panCandidate = null;
      suppressClick = true;
      document.body.classList.add("dragging");
    }
  }
  if (!isPanning) return;
  timeline.scrollLeft = panStart.scrollLeft - (e.clientX - panStart.x);
  timeline.scrollTop = panStart.scrollTop - (e.clientY - panStart.y);
});

document.addEventListener("mouseup", () => {
  isPanning = false;
  panCandidate = null;
  document.body.classList.remove("dragging");
});

timeline.addEventListener("scroll", () => {
  const scrollRight = timeline.scrollLeft + timeline.clientWidth;
  const totalWidth = state.timelineLen * state.pxPerSec;
  if (scrollRight > totalWidth - 300) {
    state.timelineLen += 120;
    renderRuler(state.timelineLen);
  }
  const scrollBottom = timeline.scrollTop + timeline.clientHeight;
  if (scrollBottom > state.timelineHeight - 300) {
    state.timelineHeight += 600;
    trackArea.style.minHeight = `${state.timelineHeight}px`;
    updateCursorHeight();
  }
});

playBtn.addEventListener("click", play);
pauseBtn.addEventListener("click", pause);
stopBtn.addEventListener("click", stop);

splitBtn.addEventListener("click", splitClip);
duplicateBtn.addEventListener("click", duplicateClip);
deleteBtn.addEventListener("click", deleteClip);

audioPlay.addEventListener("click", play);
audioPause.addEventListener("click", pause);
audioStop.addEventListener("click", stop);
audioSplit.addEventListener("click", splitClip);
audioDuplicate.addEventListener("click", duplicateClip);
audioDelete.addEventListener("click", deleteClip);

ripSelectedBtn.addEventListener("click", () => ripYouTube(false));
ripNewBtn.addEventListener("click", () => ripYouTube(true));

fxFadeIn.addEventListener("click", () => openEffectModal("fadeIn"));
fxFadeOut.addEventListener("click", () => openEffectModal("fadeOut"));
fxCrossfade.addEventListener("click", () => openEffectModal("crossfade"));

effectApply.addEventListener("click", applySelectionEffect);
effectCancel.addEventListener("click", closeEffectModal);
effectOverlay.addEventListener("click", (e) => {
  if (e.target === effectOverlay) closeEffectModal();
});

document.addEventListener("click", (e) => {
  const target = e.target.closest(".btn, .tab, .file, .clip, .panel, .mixer-track");
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.2;
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
  target.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove());
});

clipRate.addEventListener("input", () => {
  const clip = findSelectedClip();
  if (!clip) return;
  clip.rate = parseFloat(clipRate.value);
  clipRateVal.textContent = `${clip.rate.toFixed(2)}x`;
});

clipPitch.addEventListener("input", () => {
  const clip = findSelectedClip();
  if (!clip) return;
  clip.pitch = parseInt(clipPitch.value, 10);
  recomputePlaybackRate(clip);
  clipPitchVal.textContent = `${clip.pitch} st`;
  if (state.playing) refreshPlayback();
});

clipFxApply.addEventListener("click", async () => {
  const clip = findSelectedClip();
  if (!clip) return;
  await applyTimeStretch(clip, clip.rate ?? 1);
  render();
  if (state.playing) refreshPlayback();
});

clipFxReset.addEventListener("click", () => {
  const clip = findSelectedClip();
  if (!clip) return;
  clip.rate = 1;
  clip.pitch = 0;
  applyTimeStretch(clip, 1);
  recomputePlaybackRate(clip);
  updateEffectsUI();
  if (state.playing) refreshPlayback();
});

function bindTrackFxToggle(input, setter) {
  input.addEventListener("change", () => {
    const track = getSelectedTrack();
    if (!track) return;
    setter(track);
    if (state.playing) refreshPlayback();
  });
}

function bindTrackFxSlider(input, setter) {
  input.addEventListener("input", () => {
    const track = getSelectedTrack();
    if (!track) return;
    setter(track);
    if (state.playing) refreshPlayback();
  });
}

bindTrackFxToggle(fxDelayOn, (track) => {
  ensureTrackEffects(track).delay.enabled = fxDelayOn.checked;
});
bindTrackFxSlider(fxDelayTime, (track) => {
  ensureTrackEffects(track).delay.time = parseFloat(fxDelayTime.value);
});
bindTrackFxSlider(fxDelayFeedback, (track) => {
  ensureTrackEffects(track).delay.feedback = parseFloat(fxDelayFeedback.value);
});
bindTrackFxSlider(fxDelayMix, (track) => {
  ensureTrackEffects(track).delay.mix = parseFloat(fxDelayMix.value);
});
bindTrackFxToggle(fxReverbOn, (track) => {
  ensureTrackEffects(track).reverb.enabled = fxReverbOn.checked;
});
bindTrackFxSlider(fxReverbMix, (track) => {
  ensureTrackEffects(track).reverb.mix = parseFloat(fxReverbMix.value);
});
bindTrackFxToggle(fxSatOn, (track) => {
  ensureTrackEffects(track).saturation.enabled = fxSatOn.checked;
});
bindTrackFxSlider(fxSatDrive, (track) => {
  ensureTrackEffects(track).saturation.drive = parseFloat(fxSatDrive.value);
});
bindTrackFxToggle(fxCompOn, (track) => {
  ensureTrackEffects(track).compressor.enabled = fxCompOn.checked;
});
bindTrackFxSlider(fxCompThreshold, (track) => {
  ensureTrackEffects(track).compressor.threshold = parseFloat(fxCompThreshold.value);
});
bindTrackFxSlider(fxCompRatio, (track) => {
  ensureTrackEffects(track).compressor.ratio = parseFloat(fxCompRatio.value);
});

relinkApply.addEventListener("click", async () => {
  if (!pendingProject) return;
  const files = Array.from(relinkInput.files || []);
  hideRelinkModal();
  await loadProject(pendingProject, files, true);
  pendingProject = null;
  setProjectStatus(t("status.relinkComplete", "Relink complete."));
});

relinkSkip.addEventListener("click", async () => {
  if (!pendingProject) return;
  hideRelinkModal();
  await loadProject(pendingProject, [], true);
  pendingProject = null;
  setProjectStatus(t("status.loadedWithoutAudio", "Loaded without missing audio."));
});

relinkOverlay.addEventListener("click", (e) => {
  if (e.target === relinkOverlay) hideRelinkModal();
});

saveProjectFile.addEventListener("click", async () => {
  try {
    setProjectStatus(t("status.savingProject", "Saving project file..."));
    const includeAudio = includeAudioInFile?.checked ?? true;
    const project = await serializeProject(includeAudio);
    const blob = new Blob([JSON.stringify(project)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "m3-project.m3proj";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setProjectStatus(includeAudio ? t("status.projectSavedWithAudio", "Project file saved (with audio).") : t("status.projectSavedNoAudio", "Project file saved (no audio)."));
  } catch (err) {
    setProjectStatus(`${t("status.saveFailed", "Save failed")}: ${err.message}`);
  }
});

saveProjectAs.addEventListener("click", async () => {
  try {
    setProjectStatus(t("status.savingProject", "Saving project file..."));
    const includeAudio = includeAudioInFile?.checked ?? true;
    const project = await serializeProject(includeAudio);
    const rawName = prompt(t("prompt.saveAs", "Save project as:"), "m3-project");
    if (!rawName) return;
    const cleaned = rawName.replace(/[^a-z0-9 _.-]/gi, "").trim() || "m3-project";
    const filename = cleaned.toLowerCase().endsWith(".m3proj") ? cleaned : `${cleaned}.m3proj`;
    const blob = new Blob([JSON.stringify(project)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setProjectStatus(includeAudio ? t("status.projectSavedWithAudio", "Project file saved (with audio).") : t("status.projectSavedNoAudio", "Project file saved (no audio)."));
  } catch (err) {
    setProjectStatus(`${t("status.saveFailed", "Save failed")}: ${err.message}`);
  }
});

loadProjectFile.addEventListener("click", () => {
  projectFileInput.click();
});

projectFileInput.addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const project = JSON.parse(text);
    await loadProject(project);
  } catch (err) {
    setProjectStatus(`${t("status.loadFailed", "Load failed")}: ${err.message}`);
  } finally {
    projectFileInput.value = "";
  }
});

saveProjectLocal.addEventListener("click", async () => {
  try {
    const project = await serializeProject(false);
    localStorage.setItem("m3_project", JSON.stringify(project));
    setProjectStatus(t("status.savedLocal", "Project saved to browser storage."));
  } catch (err) {
    setProjectStatus(`${t("status.localSaveFailed", "Local save failed")}: ${err.message}`);
  }
});

loadProjectLocal.addEventListener("click", async () => {
  try {
    const raw = localStorage.getItem("m3_project");
    if (!raw) {
      setProjectStatus(t("status.noLocalProject", "No local project found."));
      return;
    }
    const project = JSON.parse(raw);
    await loadProject(project);
  } catch (err) {
    setProjectStatus(`${t("status.localLoadFailed", "Local load failed")}: ${err.message}`);
  }
});

clearProjectLocal.addEventListener("click", () => {
  localStorage.removeItem("m3_project");
  setProjectStatus(t("status.localCleared", "Local project cleared."));
});

function initParticles() {
  const canvas = document.getElementById("fxParticles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  const count = 42;
  const particles = Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: 0.8 + Math.random() * 1.6,
    vx: (Math.random() - 0.5) * 0.0006,
    vy: (Math.random() - 0.5) * 0.0006,
    hue: Math.random() > 0.5 ? 180 : 290
  }));

  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.max(1, Math.floor(width * devicePixelRatio));
    canvas.height = Math.max(1, Math.floor(height * devicePixelRatio));
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > 1) p.vx *= -1;
      if (p.y < 0 || p.y > 1) p.vy *= -1;
      const x = p.x * width;
      const y = p.y * height;
      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, 0.35)`;
      ctx.arc(x, y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", resize);
  resize();
  tick();
}

function clampRange() {
  state.rangeStart = Math.max(0, state.rangeStart);
  state.rangeEnd = Math.max(state.rangeStart + 0.1, state.rangeEnd);
}

function timeFromClientX(clientX) {
  const rect = trackArea.getBoundingClientRect();
  const x = clientX - rect.left + trackArea.scrollLeft;
  return Math.max(0, x / state.pxPerSec);
}

rangeLeft.addEventListener("mousedown", (e) => {
  e.preventDefault();
  rangeDrag = "left";
});

rangeRight.addEventListener("mousedown", (e) => {
  e.preventDefault();
  rangeDrag = "right";
});

rangeBody.addEventListener("mousedown", (e) => {
  e.preventDefault();
  rangeDrag = "body";
});

document.addEventListener("mousemove", (e) => {
  if (selectingRange) {
    const t = timeFromClientX(e.clientX);
    state.rangeStart = Math.min(state.rangeStart, t);
    state.rangeEnd = Math.max(state.rangeEnd, t);
    updateRangeUI();
    return;
  }
  if (!rangeDrag) return;
  const t = timeFromClientX(e.clientX);
  if (rangeDrag === "left") {
    state.rangeStart = Math.min(t, state.rangeEnd - 0.1);
  } else if (rangeDrag === "right") {
    state.rangeEnd = Math.max(t, state.rangeStart + 0.1);
  } else if (rangeDrag === "body") {
    const span = state.rangeEnd - state.rangeStart;
    state.rangeStart = t;
    state.rangeEnd = t + span;
  }
  clampRange();
  updateRangeUI();
});

document.addEventListener("mouseup", () => {
  selectingRange = false;
  rangeDrag = null;
});

let resizing = false;
let resizeStart = 0;
let resizeHeight = 240;
let panelCollapsed = false;

function setBottomHeight(px) {
  const clamped = Math.max(180, Math.min(420, px));
  document.documentElement.style.setProperty("--bottom-height", `${clamped}px`);
  resizeHeight = clamped;
}

function applyPanelState() {
  if (panelCollapsed) {
    document.body.classList.add("panel-collapsed");
    document.documentElement.style.setProperty("--bottom-height", "60px");
  } else {
    document.body.classList.remove("panel-collapsed");
    document.documentElement.style.setProperty("--bottom-height", `${resizeHeight}px`);
  }
}

panelResize.addEventListener("mousedown", (e) => {
  resizing = true;
  resizeStart = e.clientY;
  const current = getComputedStyle(document.documentElement).getPropertyValue("--bottom-height").trim();
  resizeHeight = parseInt(current.replace("px", ""), 10) || 240;
  panelCollapsed = false;
  applyPanelState();
});

document.addEventListener("mousemove", (e) => {
  if (!resizing) return;
  const dy = resizeStart - e.clientY;
  setBottomHeight(resizeHeight + dy);
  applyPanelState();
});

document.addEventListener("mouseup", () => {
  resizing = false;
});

setBottomHeight(240);
applyPanelState();

menuToggle.addEventListener("click", () => {});

exportBtn.addEventListener("click", async () => {
  const format = exportFormat.value;
  const baseName = prompt(t("prompt.exportName", "Export file name:"), "m3-export");
  if (!baseName) return;
  const safeName = baseName.replace(/[^a-z0-9 _.-]/gi, "").trim() || "m3-export";
  if (format === "wav") {
    await exportWavMix(safeName);
    return;
  }
  await exportCompressed(format, safeName);
});

async function exportWavMix(baseName) {
  const liveClips = state.tracks.flatMap(t => t.clips.filter(c => c.buffer && c.duration > 0));
  const maxEnd = Math.max(0, ...liveClips.map(c => c.start + getClipDuration(c)));
  if (maxEnd <= 0) return;
  const useRange = state.rangeVisible && state.rangeEnd > state.rangeStart;
  const exportStart = useRange ? state.rangeStart : 0;
  const exportEnd = useRange ? state.rangeEnd : maxEnd;
  const exportLen = Math.max(0, exportEnd - exportStart);
  if (exportLen <= 0) return;
  const OfflineCtx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!OfflineCtx) return;
  const sampleRate = audioCtx.sampleRate;
  const off = new OfflineCtx(2, Math.ceil(exportLen * sampleRate), sampleRate);

  const soloTracks = state.tracks.filter(t => t.solo);
  state.tracks.forEach((track) => {
    if (soloTracks.length && !track.solo) return;
    if (track.mute) return;

    track.clips.filter(c => c.buffer && c.duration > 0).forEach((clip) => {
      const clipDuration = getClipDuration(clip);
      const clipStart = clip.start;
      const clipEnd = clip.start + clipDuration;
      if (clipEnd <= exportStart || clipStart >= exportEnd) return;
      if (clipDuration <= 0) return;
      const { startOffset, trimmed } = getClipWindow(clip);
      const source = off.createBufferSource();
      source.buffer = clip.buffer;
      source.playbackRate.value = clip.playbackRate || 1;

      const lowCut = off.createBiquadFilter();
      lowCut.type = "highpass";
      lowCut.frequency.value = track.lowCut;

      const highCut = off.createBiquadFilter();
      highCut.type = "lowpass";
      highCut.frequency.value = track.highCut;

      const eqNodes = track.eq.map(b => {
        const f = off.createBiquadFilter();
        f.type = "peaking";
        f.frequency.value = b.freq;
        f.Q.value = 1;
        f.gain.value = b.gain;
        return f;
      });

      const clipGain = off.createGain();
      clipGain.gain.value = 1;

      const gain = off.createGain();
      gain.gain.value = track.volume;

      let chain = source;
      chain.connect(lowCut);
      chain = lowCut;
      eqNodes.forEach(node => {
        chain.connect(node);
        chain = node;
      });
      chain.connect(highCut);
      const fxOut = applyTrackFxChain(off, highCut, track);
      fxOut.connect(clipGain).connect(gain).connect(off.destination);

      const localStart = Math.max(0, clipStart - exportStart);
      const offsetTimeline = Math.max(0, exportStart - clipStart);
      const rate = clip.playbackRate || 1;
      const offsetBuf = startOffset + offsetTimeline * rate;
      const durationTimeline = Math.min(clipDuration - offsetTimeline, exportEnd - clipStart);
      if (durationTimeline <= 0) return;
      const durationBuf = durationTimeline * rate;
      const startTime = localStart;

      applyFades(clipGain, startTime, durationTimeline, clip);

      source.start(startTime, offsetBuf, durationBuf);
    });
  });

  const rendered = await off.startRendering();
  const wav = encodeWav(rendered);
  const blob = new Blob([wav], { type: "audio/wav" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = useRange ? `${baseName}-range.wav` : `${baseName}.wav`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function exportCompressed(format, baseName) {
  const liveClips = state.tracks.flatMap(t => t.clips.filter(c => c.buffer && c.duration > 0));
  const maxEnd = Math.max(0, ...liveClips.map(c => c.start + getClipDuration(c)));
  if (maxEnd <= 0) return;
  const useRange = state.rangeVisible && state.rangeEnd > state.rangeStart;
  const exportStart = useRange ? state.rangeStart : 0;
  const exportEnd = useRange ? state.rangeEnd : maxEnd;
  const exportLen = Math.max(0, exportEnd - exportStart);
  if (exportLen <= 0) return;
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const dest = ctx.createMediaStreamDestination();

  const soloTracks = state.tracks.filter(t => t.solo);
  state.tracks.forEach((track) => {
    if (soloTracks.length && !track.solo) return;
    if (track.mute) return;

    track.clips.filter(c => c.buffer && c.duration > 0).forEach((clip) => {
      const clipDuration = getClipDuration(clip);
      const clipStart = clip.start;
      const clipEnd = clip.start + clipDuration;
      if (clipEnd <= exportStart || clipStart >= exportEnd) return;
      if (clipDuration <= 0) return;
      const { startOffset, trimmed } = getClipWindow(clip);
      const source = ctx.createBufferSource();
      source.buffer = clip.buffer;
      source.playbackRate.value = clip.playbackRate || 1;

      const lowCut = ctx.createBiquadFilter();
      lowCut.type = "highpass";
      lowCut.frequency.value = track.lowCut;

      const highCut = ctx.createBiquadFilter();
      highCut.type = "lowpass";
      highCut.frequency.value = track.highCut;

      const eqNodes = track.eq.map(b => {
        const f = ctx.createBiquadFilter();
        f.type = "peaking";
        f.frequency.value = b.freq;
        f.Q.value = 1;
        f.gain.value = b.gain;
        return f;
      });

      const clipGain = ctx.createGain();
      clipGain.gain.value = 1;

      const gain = ctx.createGain();
      gain.gain.value = track.volume;

      let chain = source;
      chain.connect(lowCut);
      chain = lowCut;
      eqNodes.forEach(node => {
        chain.connect(node);
        chain = node;
      });
      chain.connect(highCut);
      const fxOut = applyTrackFxChain(ctx, highCut, track);
      fxOut.connect(clipGain).connect(gain).connect(dest);

      const localStart = Math.max(0, clipStart - exportStart);
      const offsetTimeline = Math.max(0, exportStart - clipStart);
      const rate = clip.playbackRate || 1;
      const offsetBuf = startOffset + offsetTimeline * rate;
      const durationTimeline = Math.min(clipDuration - offsetTimeline, exportEnd - clipStart);
      if (durationTimeline <= 0) return;
      const durationBuf = durationTimeline * rate;
      const startTime = ctx.currentTime + localStart;

      applyFades(clipGain, startTime, durationTimeline, clip);

      source.start(startTime, offsetBuf, durationBuf);
    });
  });

  const mimeTypes = format === "ogg"
    ? ["audio/ogg;codecs=opus", "audio/ogg"]
    : ["audio/webm;codecs=opus", "audio/webm"];
  const mimeType = mimeTypes.find(t => MediaRecorder.isTypeSupported(t)) || "";
  const recorder = new MediaRecorder(dest.stream, mimeType ? { mimeType } : {});
  const chunks = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size) chunks.push(e.data);
  };

  recorder.start();
  await new Promise(resolve => setTimeout(resolve, exportLen * 1000 + 300));
  recorder.stop();
  await new Promise(resolve => recorder.onstop = resolve);

  const blob = new Blob(chunks, { type: mimeType || "audio/webm" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = useRange ? `${baseName}-range.${format === "ogg" ? "ogg" : "webm"}` : `${baseName}.${format === "ogg" ? "ogg" : "webm"}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  ctx.close();
}

function encodeWav(buffer) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const length = buffer.length * numChannels * 2;
  const result = new ArrayBuffer(44 + length);
  const view = new DataView(result);

  function writeString(offset, str) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  writeString(0, "RIFF");
  view.setUint32(4, 36 + length, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, length, true);

  let offset = 44;
  const channels = [];
  for (let i = 0; i < numChannels; i++) channels.push(buffer.getChannelData(i));
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      let sample = Math.max(-1, Math.min(1, channels[ch][i]));
      sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, sample, true);
      offset += 2;
    }
  }

  return result;
}

async function ripYouTube(intoNewTrack) {
  const api = (analysisUrlInput.value || "").trim();
  const url = (ytUrl.value || "").trim();
  if (!api) {
    alert(t("alert.setBackendUrl", "Set the Backend API URL in Settings first."));
    return;
  }
  if (!url) {
    alert(t("alert.pasteUrl", "Paste a YouTube URL first."));
    return;
  }
  try {
    const res = await fetch(`${api.replace(/\/$/, "")}/rip`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const filename = res.headers.get("x-filename") || "youtube-audio.webm";
    const file = new File([blob], filename, { type: blob.type || "audio/webm" });
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    if (intoNewTrack) addTrack();
    if (!state.tracks.length) addTrack();
    const idx = state.tracks.findIndex(t => t.id === state.selectedTrackId);
    const track = idx >= 0 ? state.tracks[idx] : state.tracks[0];
    const clip = addClipToTrack(track, audioBuffer, filename);
    clip.sourceFile = file;
    state.selectedClipId = clip.id;
    state.selectedTrackId = track.id;
    render();
  } catch (err) {
    alert(`${t("alert.ripFailed", "Rip failed")}: ${err.message}`);
  }
}

ruler.addEventListener("click", (e) => {
  const rect = ruler.getBoundingClientRect();
  const x = e.clientX - rect.left + ruler.scrollLeft;
  let t = x / state.pxPerSec;
  if (state.snap) {
    const beat = 60 / state.bpm;
    const gridSec = beat * (4 / state.grid);
    t = Math.round(t / gridSec) * gridSec;
  }
  setPlayhead(t);
});

previewWrap.addEventListener("click", (e) => {
  const clip = findSelectedClip();
  if (!clip) return;
  const rect = clipPreview.getBoundingClientRect();
  const scrollX = previewWrap.scrollLeft;
  const x = e.clientX - rect.left + scrollX;
  const px = parseFloat(clipPreview.dataset.pxPerSec || String(state.pxPerSec));
  const timeInClip = Math.max(0, x / px);
  setPlayhead(clip.start + timeInClip);
});

previewWrap.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  e.stopPropagation();
  showAudioContextMenu(e);
});


trackArea.addEventListener("dragover", (e) => {
  e.preventDefault();
});

trackArea.addEventListener("mousedown", (e) => {
  if (e.button !== 0 || !e.altKey) return;
  e.preventDefault();
  e.stopPropagation();
  selectingRange = true;
  state.rangeVisible = true;
  const t = timeFromClientX(e.clientX);
  state.rangeStart = t;
  state.rangeEnd = t;
  updateRangeUI();
}, true);

trackArea.addEventListener("drop", (e) => {
  e.preventDefault();
  if (e.dataTransfer.files && e.dataTransfer.files.length) {
    const rect = trackArea.getBoundingClientRect();
    const y = e.clientY - rect.top + trackArea.scrollTop;
    const trackIndex = Math.floor(y / 90);
    while (state.tracks.length <= trackIndex) addTrack();
    const x = e.clientX - rect.left + trackArea.scrollLeft;
    let start = x / state.pxPerSec;
    if (state.snap) {
      const beat = 60 / state.bpm;
      const gridSec = beat * (4 / state.grid);
      start = Math.round(start / gridSec) * gridSec;
    }
    Array.from(e.dataTransfer.files).forEach(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      const clip = {
        id: crypto.randomUUID(),
        name: file.name,
        buffer: audioBuffer,
        duration: audioBuffer.duration,
        bpm: state.bpm,
        playbackRate: 1,
        key: null,
        camelot: null,
        sourceFile: file,
        startOffset: 0,
        endOffset: 0,
        fadeIn: 0,
        fadeOut: 0,
        fadeActive: false,
        rate: 1,
        pitch: 0,
        originalBuffer: null,
        fadeInCurve: 0.5,
        fadeOutCurve: 0.5,
        start
      };
      state.tracks[trackIndex].clips.push(clip);
      render();
    });
  }
});

trackArea.addEventListener("click", (e) => {
  if (document.body.classList.contains("dragging")) return;
  if (suppressClick) {
    suppressClick = false;
    return;
  }
  if (e.target.closest(".clip")) return;
  const rect = trackArea.getBoundingClientRect();
  const x = e.clientX - rect.left + trackArea.scrollLeft;
  const y = e.clientY - rect.top + trackArea.scrollTop;
  const trackIndex = Math.max(0, Math.floor(y / 90));
  if (state.tracks[trackIndex]) {
    state.selectedTrackId = state.tracks[trackIndex].id;
  }
  let t = x / state.pxPerSec;
  if (state.snap && !e.shiftKey) {
    const beat = 60 / state.bpm;
    const gridSec = beat * (4 / state.grid);
    t = Math.round(t / gridSec) * gridSec;
  }
  setPlayhead(t);
});

trackArea.addEventListener("dblclick", (e) => {
  const rect = trackArea.getBoundingClientRect();
  const y = e.clientY - rect.top + trackArea.scrollTop;
  const trackIndex = Math.max(0, Math.floor(y / 90));
  if (state.tracks[trackIndex]) {
    state.selectedTrackId = state.tracks[trackIndex].id;
    render();
  }
});

addTrack();
render();
ghosthead.style.display = "none";
initParticles();

function applyFxSettings() {
  const intensity = (parseInt(fxIntensity.value, 10) || 0) / 100;
  document.documentElement.style.setProperty("--fx-intensity", String(intensity));
  document.documentElement.style.setProperty("--fx-glow-opacity", fxGlowToggle.checked ? "1" : "0");
  document.body.classList.toggle("fx-noise-off", !fxNoiseToggle.checked);
  document.body.classList.toggle("fx-glow-off", !fxGlowToggle.checked);
}

fxIntensity.addEventListener("input", applyFxSettings);
fxNoiseToggle.addEventListener("change", applyFxSettings);
fxGlowToggle.addEventListener("change", applyFxSettings);
applyFxSettings();

I18N = {
  en: {
    "app.tag": "sleek browser music editor",
    "btn.play": "Play",
    "btn.pause": "Pause",
    "btn.stop": "Stop",
    "btn.import": "Import Audio",
    "btn.export": "Export",
    "btn.addTrack": "Add Track",
    "btn.settings": "Settings",
    "btn.split": "Split",
    "btn.duplicate": "Duplicate",
    "btn.delete": "Delete",
    "btn.splitPlayhead": "Split at Playhead",
    "btn.duplicateClip": "Duplicate Clip",
    "btn.deleteClip": "Delete Clip",
    "btn.exportWav": "Export WAV",
    "btn.exportWebm": "Export WebM (Opus)",
    "btn.exportOgg": "Export OGG (Opus)",
    "btn.miniFollow": "Mini Follow",
    "btn.apply": "Apply",
    "btn.cancel": "Cancel",
    "btn.relink": "Relink",
    "btn.skipMissing": "Skip Missing",
    "hud.title": "M3 Settings",
    "hud.bpm": "BPM",
    "hud.snap": "Snap to Beat",
    "hud.follow": "Auto-Scroll",
    "hud.grid": "Beat Grid",
    "hud.metro": "Metronome",
    "hud.fxIntensity": "FX Intensity",
    "hud.fxNoise": "Screen Noise",
    "hud.fxGlow": "Frame Glow",
    "hud.zoom": "Zoom",
    "hud.lang": "Language",
    "hud.hint": "Hotkeys: Space Play/Pause · S Split · D Duplicate · Del Delete · +/- Zoom",
    "guide.desktop.title": "Desktop Guide",
    "guide.mobile.title": "Mobile Guide",
    "panel.tracks": "Tracks",
    "panel.selectedClip": "Selected Clip",
    "panel.eq": "Track EQ + Filters",
    "panel.project": "Project",
    "panel.actions": "Actions",
    "panel.effects": "Effects",
    "project.tempo": "Tempo",
    "project.key": "Key",
    "project.length": "Length",
    "project.saveFile": "Save Project File",
    "project.loadFile": "Load Project File",
    "project.saveAs": "Save Project As…",
    "prompt.saveAs": "Save project as:",
    "prompt.exportName": "Export file name:",
    "project.includeAudio": "Include audio in file",
    "project.saveLocal": "Save to Browser",
    "project.loadLocal": "Load from Browser",
    "project.clearLocal": "Clear Local",
    "project.status": "Project saves are local unless you export a file.",
    "actions.hint": "Select a clip to edit. Drag clips on the timeline.",
    "menu.title": "M3 Menu",
    "tab.audio": "Audio",
    "tab.tracks": "Tracks",
    "tab.mixer": "Mixer",
    "tab.project": "Project",
    "tab.actions": "Actions",
    "tab.effects": "Effects",
    "fx.fadeIn": "Fade In Selection…",
    "fx.fadeOut": "Fade Out Selection…",
    "fx.crossfade": "Crossfade Selection…",
    "fx.tip": "Tip: Alt + drag on the timeline to create a selection range.",
    "fx.clipTitle": "Clip FX (Selected Clip)",
    "fx.timeStretch": "Time Stretch",
    "fx.pitch": "Pitch",
    "fx.applyStretch": "Apply Stretch",
    "fx.resetClip": "Reset Clip FX",
    "fx.clipHint": "Time Stretch is granular and keeps pitch. Pitch shifts by resampling.",
    "fx.trackTitle": "Track FX (Selected Track)",
    "fx.delay": "Delay",
    "fx.reverb": "Reverb",
    "fx.saturation": "Saturation",
    "fx.compressor": "Compressor",
    "overlay.analyzeTitle": "Analyzing BPM + Key…",
    "overlay.analyzeSub": "This can take a few seconds on longer files.",
    "overlay.effectTitle": "Apply Effect",
    "overlay.effectSub": "Applies to the current selection range.",
    "overlay.effect": "Effect",
    "overlay.duration": "Duration (sec)",
    "overlay.curve": "Curve",
    "overlay.relinkTitle": "Relink Audio Files",
    "overlay.relinkSub": "Some clips are missing audio. Select the original files to relink.",
    "clip.none": "No clip selected",
    "status.savingProject": "Saving project file...",
    "status.projectSavedWithAudio": "Project file saved (with audio).",
    "status.projectSavedNoAudio": "Project file saved (no audio).",
    "status.saveFailed": "Save failed",
    "status.loadFailed": "Load failed",
    "status.savedLocal": "Project saved to browser storage.",
    "status.localSaveFailed": "Local save failed",
    "status.noLocalProject": "No local project found.",
    "status.localLoadFailed": "Local load failed",
    "status.localCleared": "Local project cleared.",
    "status.projectLoaded": "Project loaded.",
    "status.relinkComplete": "Relink complete.",
    "status.loadedWithoutAudio": "Loaded without missing audio.",
    "status.stretching": "Applying time stretch...",
    "status.stretchApplied": "Time stretch applied.",
    "alert.setAnalysisUrl": "Set the Analysis API URL in Settings first.",
    "alert.noOriginalFile": "No original file stored for this clip. Re-import it from disk.",
    "alert.analyzeFailed": "Analyze failed",
    "alert.selectRange": "Select a range first (Alt + drag).",
    "alert.setBackendUrl": "Set the Backend API URL in Settings first.",
    "alert.pasteUrl": "Paste a YouTube URL first.",
    "alert.ripFailed": "Rip failed",
    desktopGuide: [
      "Import audio, click a clip to select, drag to move. Right-click for split/duplicate/analyze or selection effects.",
      "Use the bottom tabs to switch panels. Scroll the timeline to add more space.",
      "",
      "Timeline + Selection",
      "Alt + drag: create a range selection",
      "/ : toggle range selector visibility",
      "Shift + click: place playhead without snapping",
      "Drag on empty timeline: pan view",
      "Space + drag: pan view (grab)",
      "Shift + mouse wheel: zoom timeline",
      "Ctrl + wheel: horizontal scroll (timeline) / scroll panels under cursor",
      "",
      "Transport",
      "Space: play/pause",
      ", : jump to start",
      "",
      "Clips",
      "S: split at playhead",
      "D: duplicate",
      "Delete / Backspace: delete",
      "Ctrl + X: cut",
      "Ctrl + V: paste at playhead",
      "Ctrl + ← / →: select previous/next clip on track",
      "Alt + ← / →: nudge clip by grid",
      "Alt + Shift + ← / →: fine nudge (0.01s)",
      "Alt + ↑ / ↓: move clip to track above/below",
      "",
      "Tracks",
      "↑ / ↓: select track",
      "",
      "Edit History",
      "Ctrl + Z: undo",
      "Ctrl + Shift + Z or Ctrl + Y: redo",
      "",
      "Project Save/Load",
      "Project tab → Save Project File (exports .m3proj)",
      "Project tab → Save to Browser (local)",
      "Load Project File prompts relink if audio is missing",
      "",
      "Effects",
      "Effects tab → fade selection / track FX",
      "Right‑click with range active shows selection effects",
      "",
      "Selection Effects",
      "Alt + drag to define a range, then use Effects tab or right‑click",
      "Fade In/Out affects only the selected range (clips auto‑split)",
      "Crossfade applies fade‑in + fade‑out on the selection boundaries",
      "",
      "Clip FX",
      "Time Stretch: granular, preserves pitch (Apply to bake)",
      "Pitch: semitone shift (resampling)",
      "Reset Clip FX restores original buffer",
      "",
      "Track FX",
      "Delay: time/feedback/mix",
      "Reverb: mix",
      "Saturation: drive",
      "Compressor: threshold/ratio",
      "Track FX apply in playback and export",
      "",
      "Relink Flow",
      "If a project loads without audio, the Relink window appears",
      "Select the original audio files to restore clips"
    ],
    mobileGuide: [
      "Pinch to zoom the timeline, drag to pan. Tap the M3 Menu bar to open/close the drawer.",
      "Use bottom tabs for Audio/Tracks/Mixer/Project/Actions/Effects.",
      "",
      "Gestures",
      "Pinch: zoom timeline",
      "Drag: pan timeline",
      "Tap clip: select",
      "Tap empty grid: move playhead"
    ]
  },
  zh: {
    "app.tag": "精致的浏览器音乐编辑器",
    "btn.play": "播放",
    "btn.pause": "暂停",
    "btn.stop": "停止",
    "btn.import": "导入音频",
    "btn.export": "导出",
    "btn.addTrack": "添加轨道",
    "btn.settings": "设置",
    "btn.split": "切分",
    "btn.duplicate": "复制",
    "btn.delete": "删除",
    "btn.splitPlayhead": "在播放头切分",
    "btn.duplicateClip": "复制片段",
    "btn.deleteClip": "删除片段",
    "btn.exportWav": "导出 WAV",
    "btn.exportWebm": "导出 WebM (Opus)",
    "btn.exportOgg": "导出 OGG (Opus)",
    "btn.miniFollow": "小窗跟随",
    "btn.apply": "应用",
    "btn.cancel": "取消",
    "btn.relink": "重新链接",
    "btn.skipMissing": "跳过缺失",
    "hud.title": "M3 设置",
    "hud.bpm": "BPM",
    "hud.snap": "对齐节拍",
    "hud.follow": "自动滚动",
    "hud.grid": "节拍网格",
    "hud.metro": "节拍器",
    "hud.fxIntensity": "特效强度",
    "hud.fxNoise": "屏幕噪点",
    "hud.fxGlow": "边框光晕",
    "hud.zoom": "缩放",
    "hud.lang": "语言",
    "hud.hint": "快捷键：空格 播放/暂停 · S 切分 · D 复制 · 删除 删除 · +/- 缩放",
    "guide.desktop.title": "桌面指南",
    "guide.mobile.title": "移动端指南",
    "panel.tracks": "轨道",
    "panel.selectedClip": "已选片段",
    "panel.eq": "轨道均衡 + 滤波",
    "panel.project": "项目",
    "panel.actions": "操作",
    "panel.effects": "效果",
    "project.tempo": "速度",
    "project.key": "调性",
    "project.length": "时长",
    "project.saveFile": "保存项目文件",
    "project.loadFile": "加载项目文件",
    "project.includeAudio": "在文件中包含音频",
    "project.saveLocal": "保存到浏览器",
    "project.loadLocal": "从浏览器加载",
    "project.clearLocal": "清除本地",
    "project.status": "项目默认保存在本地，导出文件可分享。",
    "project.saveAs": "另存项目文件…",
    "prompt.saveAs": "项目另存为：",
    "prompt.exportName": "导出文件名：",
    "actions.hint": "选择一个片段进行编辑。拖动片段到时间线上。",
    "menu.title": "M3 菜单",
    "tab.audio": "音频",
    "tab.tracks": "轨道",
    "tab.mixer": "混音",
    "tab.project": "项目",
    "tab.actions": "操作",
    "tab.effects": "效果",
    "fx.fadeIn": "淡入选区…",
    "fx.fadeOut": "淡出选区…",
    "fx.crossfade": "交叉淡化选区…",
    "fx.tip": "提示：按住 Alt 并拖动时间线创建选区。",
    "fx.clipTitle": "片段 FX（已选）",
    "fx.timeStretch": "时间拉伸",
    "fx.pitch": "音高",
    "fx.applyStretch": "应用拉伸",
    "fx.resetClip": "重置片段 FX",
    "fx.clipHint": "时间拉伸为颗粒算法并保持音高。音高改变为重采样。",
    "fx.trackTitle": "轨道 FX（已选）",
    "fx.delay": "延迟",
    "fx.reverb": "混响",
    "fx.saturation": "饱和",
    "fx.compressor": "压缩",
    "overlay.analyzeTitle": "正在分析 BPM + 调性…",
    "overlay.analyzeSub": "较长文件可能需要一些时间。",
    "overlay.effectTitle": "应用效果",
    "overlay.effectSub": "应用到当前选区。",
    "overlay.effect": "效果",
    "overlay.duration": "时长（秒）",
    "overlay.curve": "曲线",
    "overlay.relinkTitle": "重新链接音频文件",
    "overlay.relinkSub": "部分片段缺少音频，请选择原始文件重新链接。",
    "clip.none": "未选择片段",
    "status.savingProject": "正在保存项目文件…",
    "status.projectSavedWithAudio": "项目文件已保存（包含音频）。",
    "status.projectSavedNoAudio": "项目文件已保存（不含音频）。",
    "status.saveFailed": "保存失败",
    "status.loadFailed": "加载失败",
    "status.savedLocal": "项目已保存到浏览器。",
    "status.localSaveFailed": "本地保存失败",
    "status.noLocalProject": "未找到本地项目。",
    "status.localLoadFailed": "本地加载失败",
    "status.localCleared": "本地项目已清除。",
    "status.projectLoaded": "项目已加载。",
    "status.relinkComplete": "重新链接完成。",
    "status.loadedWithoutAudio": "已加载（缺失音频）。",
    "status.stretching": "正在应用时间拉伸…",
    "status.stretchApplied": "时间拉伸已应用。",
    "alert.setAnalysisUrl": "请在设置中填写分析接口地址。",
    "alert.noOriginalFile": "没有原始文件，请重新导入。",
    "alert.analyzeFailed": "分析失败",
    "alert.selectRange": "请先选择范围（Alt + 拖动）。",
    "alert.setBackendUrl": "请在设置中填写后端地址。",
    "alert.pasteUrl": "请先粘贴 YouTube 链接。",
    "alert.ripFailed": "抓取失败",
    desktopGuide: [
      "导入音频，点击片段选择，拖动移动。右键可切分/复制/分析或对选区应用效果。",
      "使用底部标签切换面板。滚动时间线可扩展空间。",
      "",
      "时间线 + 选区",
      "Alt + 拖动：创建选区",
      "/：切换选区显示",
      "Shift + 点击：不对齐地放置播放头",
      "在空白时间线上拖动：平移视图",
      "空格 + 拖动：抓取平移",
      "Shift + 滚轮：缩放时间线",
      "Ctrl + 滚轮：水平滚动/滚动当前面板",
      "",
      "传输",
      "空格：播放/暂停",
      ",：回到开头",
      "",
      "片段",
      "S：在播放头切分",
      "D：复制",
      "Delete / Backspace：删除",
      "Ctrl + X：剪切",
      "Ctrl + V：在播放头粘贴",
      "Ctrl + ← / →：选择上一/下一片段",
      "Alt + ← / →：按网格微移",
      "Alt + Shift + ← / →：精细微移(0.01s)",
      "Alt + ↑ / ↓：移动到上/下轨",
      "",
      "轨道",
      "↑ / ↓：选择轨道",
      "",
      "编辑历史",
      "Ctrl + Z：撤销",
      "Ctrl + Shift + Z 或 Ctrl + Y：重做",
      "",
      "项目保存/加载",
      "项目 → 保存项目文件（.m3proj）",
      "项目 → 保存到浏览器（本地）",
      "加载项目时若缺音频将提示重新链接",
      "",
      "效果",
      "效果面板 → 选区淡入/淡出 / 轨道FX",
      "有选区时右键会显示选区效果",
      "",
      "选区效果",
      "Alt + 拖动定义选区，然后在效果面板或右键应用",
      "淡入/淡出仅作用于选区（自动切分）",
      "交叉淡化在边界应用淡入+淡出",
      "",
      "片段FX",
      "时间拉伸：颗粒算法，保持音高（需应用）",
      "音高：按半音移动（重采样）",
      "重置片段FX恢复原始缓冲",
      "",
      "轨道FX",
      "延迟：时间/反馈/混合",
      "混响：混合",
      "饱和：驱动",
      "压缩：阈值/比率",
      "轨道FX用于播放与导出",
      "",
      "重新链接",
      "项目无音频时会出现重新链接窗口",
      "选择原始音频文件以恢复片段"
    ],
    mobileGuide: [
      "双指缩放时间线，拖动平移。点击 M3 Menu 打开/关闭抽屉。",
      "使用底部标签：Audio/Tracks/Mixer/Project/Actions/Effects。",
      "",
      "手势",
      "捏合：缩放时间线",
      "拖动：平移时间线",
      "点击片段：选择",
      "点击空白：移动播放头"
    ]
  },
  id: {
    "app.tag": "editor musik browser yang sleek",
    "btn.play": "Play",
    "btn.pause": "Pause",
    "btn.stop": "Stop",
    "btn.import": "Impor Audio",
    "btn.export": "Export",
    "btn.addTrack": "Tambah Track",
    "btn.settings": "Settings",
    "btn.split": "Split",
    "btn.duplicate": "Duplicate",
    "btn.delete": "Delete",
    "btn.splitPlayhead": "Split di Playhead",
    "btn.duplicateClip": "Duplicate Clip",
    "btn.deleteClip": "Delete Clip",
    "btn.exportWav": "Export WAV",
    "btn.exportWebm": "Export WebM (Opus)",
    "btn.exportOgg": "Export OGG (Opus)",
    "btn.miniFollow": "Mini Follow",
    "btn.apply": "Apply",
    "btn.cancel": "Cancel",
    "btn.relink": "Relink",
    "btn.skipMissing": "Lewati",
    "hud.title": "Pengaturan M3",
    "hud.bpm": "BPM",
    "hud.snap": "Snap ke Beat",
    "hud.follow": "Auto-Scroll",
    "hud.grid": "Grid Beat",
    "hud.metro": "Metronom",
    "hud.fxIntensity": "Intensitas FX",
    "hud.fxNoise": "Noise Layar",
    "hud.fxGlow": "Glow Frame",
    "hud.zoom": "Zoom",
    "hud.lang": "Bahasa",
    "hud.hint": "Hotkeys: Space Play/Pause · S Split · D Duplicate · Del Delete · +/- Zoom",
    "guide.desktop.title": "Panduan Desktop",
    "guide.mobile.title": "Panduan Mobile",
    "panel.tracks": "Tracks",
    "panel.selectedClip": "Klip Terpilih",
    "panel.eq": "EQ + Filter Track",
    "panel.project": "Project",
    "panel.actions": "Actions",
    "panel.effects": "Effects",
    "project.tempo": "Tempo",
    "project.key": "Key",
    "project.length": "Durasi",
    "project.saveFile": "Save Project File",
    "project.loadFile": "Load Project File",
    "project.saveAs": "Simpan Project Sebagai…",
    "prompt.saveAs": "Simpan project sebagai:",
    "prompt.exportName": "Nama file eksport:",
    "project.includeAudio": "Sertakan audio di file",
    "project.saveLocal": "Save ke Browser",
    "project.loadLocal": "Load dari Browser",
    "project.clearLocal": "Hapus Lokal",
    "project.status": "Project lokal kecuali kamu export file.",
    "actions.hint": "Pilih klip untuk edit. Drag klip di timeline.",
    "menu.title": "M3 Menu",
    "tab.audio": "Audio",
    "tab.tracks": "Tracks",
    "tab.mixer": "Mixer",
    "tab.project": "Project",
    "tab.actions": "Actions",
    "tab.effects": "Effects",
    "fx.fadeIn": "Fade In Selection…",
    "fx.fadeOut": "Fade Out Selection…",
    "fx.crossfade": "Crossfade Selection…",
    "fx.tip": "Tip: Alt + drag untuk membuat selection range.",
    "fx.clipTitle": "Clip FX (Terpilih)",
    "fx.timeStretch": "Time Stretch",
    "fx.pitch": "Pitch",
    "fx.applyStretch": "Apply Stretch",
    "fx.resetClip": "Reset Clip FX",
    "fx.clipHint": "Time Stretch granular dan pitch tetap. Pitch berubah via resampling.",
    "fx.trackTitle": "Track FX (Terpilih)",
    "fx.delay": "Delay",
    "fx.reverb": "Reverb",
    "fx.saturation": "Saturation",
    "fx.compressor": "Compressor",
    "overlay.analyzeTitle": "Menganalisis BPM + Key…",
    "overlay.analyzeSub": "Bisa butuh beberapa detik untuk file panjang.",
    "overlay.effectTitle": "Apply Effect",
    "overlay.effectSub": "Menerapkan ke selection range.",
    "overlay.effect": "Effect",
    "overlay.duration": "Durasi (detik)",
    "overlay.curve": "Curve",
    "overlay.relinkTitle": "Relink File Audio",
    "overlay.relinkSub": "Beberapa klip kehilangan audio. Pilih file asli untuk relink.",
    "clip.none": "Tidak ada klip dipilih",
    "status.savingProject": "Menyimpan project file...",
    "status.projectSavedWithAudio": "Project file tersimpan (dengan audio).",
    "status.projectSavedNoAudio": "Project file tersimpan (tanpa audio).",
    "status.saveFailed": "Save gagal",
    "status.loadFailed": "Load gagal",
    "status.savedLocal": "Project tersimpan di browser.",
    "status.localSaveFailed": "Save lokal gagal",
    "status.noLocalProject": "Tidak ada project lokal.",
    "status.localLoadFailed": "Load lokal gagal",
    "status.localCleared": "Project lokal dihapus.",
    "status.projectLoaded": "Project berhasil dimuat.",
    "status.relinkComplete": "Relink selesai.",
    "status.loadedWithoutAudio": "Dimuat tanpa audio.",
    "status.stretching": "Menerapkan time stretch...",
    "status.stretchApplied": "Time stretch diterapkan.",
    "alert.setAnalysisUrl": "Set Analysis API URL di Settings terlebih dahulu.",
    "alert.noOriginalFile": "Tidak ada file asli. Impor ulang dari disk.",
    "alert.analyzeFailed": "Analisis gagal",
    "alert.selectRange": "Pilih range dulu (Alt + drag).",
    "alert.setBackendUrl": "Set Backend API URL di Settings terlebih dahulu.",
    "alert.pasteUrl": "Tempel URL YouTube dulu.",
    "alert.ripFailed": "Rip gagal",
    desktopGuide: [
      "Impor audio, klik klip untuk memilih, seret untuk pindah. Klik kanan untuk split/duplicate/analyze atau efek seleksi.",
      "Pakai tab bawah untuk ganti panel. Scroll timeline untuk menambah ruang.",
      "",
      "Timeline + Seleksi",
      "Alt + drag: buat seleksi range",
      "/ : toggle range selector",
      "Shift + klik: taruh playhead tanpa snap",
      "Drag di area kosong: pan",
      "Space + drag: pan (grab)",
      "Shift + wheel: zoom timeline",
      "Ctrl + wheel: scroll horizontal / scroll panel di bawah kursor",
      "",
      "Transport",
      "Space: play/pause",
      ", : ke awal",
      "",
      "Klip",
      "S: split di playhead",
      "D: duplicate",
      "Delete / Backspace: hapus",
      "Ctrl + X: cut",
      "Ctrl + V: paste di playhead",
      "Ctrl + ← / →: pilih klip sebelumnya/berikutnya",
      "Alt + ← / →: geser klip per grid",
      "Alt + Shift + ← / →: geser halus (0.01s)",
      "Alt + ↑ / ↓: pindah klip ke track atas/bawah",
      "",
      "Track",
      "↑ / ↓: pilih track",
      "",
      "Riwayat",
      "Ctrl + Z: undo",
      "Ctrl + Shift + Z atau Ctrl + Y: redo",
      "",
      "Save/Load Proyek",
      "Project tab → Save Project File (.m3proj)",
      "Project tab → Save to Browser (local)",
      "Load Project File akan minta relink jika audio hilang",
      "",
      "Effects",
      "Effects tab → fade selection / track FX",
      "Klik kanan saat ada range untuk efek seleksi",
      "",
      "Efek Seleksi",
      "Alt + drag buat range, lalu pakai Effects tab/klik kanan",
      "Fade In/Out hanya di range (auto-split)",
      "Crossfade pakai fade-in + fade-out di batas",
      "",
      "Clip FX",
      "Time Stretch: granular, pitch tetap (Apply untuk bake)",
      "Pitch: geser semitone (resampling)",
      "Reset Clip FX mengembalikan buffer asli",
      "",
      "Track FX",
      "Delay: time/feedback/mix",
      "Reverb: mix",
      "Saturation: drive",
      "Compressor: threshold/ratio",
      "Track FX dipakai di playback dan export",
      "",
      "Relink",
      "Jika proyek tanpa audio, muncul dialog relink",
      "Pilih file audio asli untuk restore klip"
    ],
    mobileGuide: [
      "Pinch untuk zoom timeline, drag untuk pan. Tap M3 Menu untuk buka/tutup drawer.",
      "Gunakan tab bawah: Audio/Tracks/Mixer/Project/Actions/Effects.",
      "",
      "Gestur",
      "Pinch: zoom timeline",
      "Drag: pan timeline",
      "Tap klip: pilih",
      "Tap kosong: pindah playhead"
    ]
  },
  ms: {
    "app.tag": "editor muzik pelayar yang sleek",
    "btn.play": "Main",
    "btn.pause": "Jeda",
    "btn.stop": "Henti",
    "btn.import": "Import Audio",
    "btn.export": "Eksport",
    "btn.addTrack": "Tambah Track",
    "btn.settings": "Tetapan",
    "btn.split": "Belah",
    "btn.duplicate": "Duplikasi",
    "btn.delete": "Padam",
    "btn.splitPlayhead": "Belah di Playhead",
    "btn.duplicateClip": "Duplikasi Klip",
    "btn.deleteClip": "Padam Klip",
    "btn.exportWav": "Eksport WAV",
    "btn.exportWebm": "Eksport WebM (Opus)",
    "btn.exportOgg": "Eksport OGG (Opus)",
    "btn.miniFollow": "Mini Follow",
    "btn.apply": "Apply",
    "btn.cancel": "Batal",
    "btn.relink": "Relink",
    "btn.skipMissing": "Langkau",
    "hud.title": "Tetapan M3",
    "hud.bpm": "BPM",
    "hud.snap": "Snap ke Beat",
    "hud.follow": "Auto-Scroll",
    "hud.grid": "Grid Beat",
    "hud.metro": "Metronom",
    "hud.fxIntensity": "Keamatan FX",
    "hud.fxNoise": "Hingar Skrin",
    "hud.fxGlow": "Glow Bingkai",
    "hud.zoom": "Zum",
    "hud.lang": "Bahasa",
    "hud.hint": "Hotkey: Space Play/Pause · S Split · D Duplicate · Del Delete · +/- Zoom",
    "guide.desktop.title": "Panduan Desktop",
    "guide.mobile.title": "Panduan Mudah Alih",
    "panel.tracks": "Tracks",
    "panel.selectedClip": "Klip Dipilih",
    "panel.eq": "EQ + Penapis Track",
    "panel.project": "Projek",
    "panel.actions": "Aksi",
    "panel.effects": "Effects",
    "project.tempo": "Tempo",
    "project.key": "Key",
    "project.length": "Panjang",
    "project.saveFile": "Save Project File",
    "project.loadFile": "Load Project File",
    "project.saveAs": "Simpan Projek Sebagai…",
    "prompt.saveAs": "Simpan projek sebagai:",
    "prompt.exportName": "Nama fail eksport:",
    "project.includeAudio": "Sertakan audio dalam fail",
    "project.saveLocal": "Save ke Pelayar",
    "project.loadLocal": "Load dari Pelayar",
    "project.clearLocal": "Padam Lokal",
    "project.status": "Projek disimpan secara lokal kecuali eksport.",
    "actions.hint": "Pilih klip untuk edit. Seret klip pada timeline.",
    "menu.title": "M3 Menu",
    "tab.audio": "Audio",
    "tab.tracks": "Tracks",
    "tab.mixer": "Mixer",
    "tab.project": "Projek",
    "tab.actions": "Aksi",
    "tab.effects": "Effects",
    "fx.fadeIn": "Fade In Selection…",
    "fx.fadeOut": "Fade Out Selection…",
    "fx.crossfade": "Crossfade Selection…",
    "fx.tip": "Tip: Alt + drag untuk buat selection range.",
    "fx.clipTitle": "Clip FX (Dipilih)",
    "fx.timeStretch": "Time Stretch",
    "fx.pitch": "Pitch",
    "fx.applyStretch": "Apply Stretch",
    "fx.resetClip": "Reset Clip FX",
    "fx.clipHint": "Time Stretch granular dan pitch kekal. Pitch berubah melalui resampling.",
    "fx.trackTitle": "Track FX (Dipilih)",
    "fx.delay": "Delay",
    "fx.reverb": "Reverb",
    "fx.saturation": "Saturation",
    "fx.compressor": "Compressor",
    "overlay.analyzeTitle": "Menganalisis BPM + Key…",
    "overlay.analyzeSub": "Fail panjang boleh ambil sedikit masa.",
    "overlay.effectTitle": "Apply Effect",
    "overlay.effectSub": "Diterapkan pada selection range.",
    "overlay.effect": "Effect",
    "overlay.duration": "Durasi (saat)",
    "overlay.curve": "Curve",
    "overlay.relinkTitle": "Relink Fail Audio",
    "overlay.relinkSub": "Beberapa klip tiada audio. Pilih fail asal untuk relink.",
    "clip.none": "Tiada klip dipilih",
    "status.savingProject": "Menyimpan fail projek...",
    "status.projectSavedWithAudio": "Fail projek disimpan (dengan audio).",
    "status.projectSavedNoAudio": "Fail projek disimpan (tanpa audio).",
    "status.saveFailed": "Simpan gagal",
    "status.loadFailed": "Muat gagal",
    "status.savedLocal": "Projek disimpan ke pelayar.",
    "status.localSaveFailed": "Simpan lokal gagal",
    "status.noLocalProject": "Tiada projek lokal.",
    "status.localLoadFailed": "Muat lokal gagal",
    "status.localCleared": "Projek lokal dipadam.",
    "status.projectLoaded": "Projek dimuatkan.",
    "status.relinkComplete": "Relink selesai.",
    "status.loadedWithoutAudio": "Dimuat tanpa audio.",
    "status.stretching": "Menerapkan time stretch...",
    "status.stretchApplied": "Time stretch diterapkan.",
    "alert.setAnalysisUrl": "Set Analysis API URL di Settings terlebih dahulu.",
    "alert.noOriginalFile": "Tiada fail asal. Import semula dari disk.",
    "alert.analyzeFailed": "Analisis gagal",
    "alert.selectRange": "Pilih range dulu (Alt + drag).",
    "alert.setBackendUrl": "Set Backend API URL di Settings terlebih dahulu.",
    "alert.pasteUrl": "Tampal URL YouTube dulu.",
    "alert.ripFailed": "Rip gagal",
    desktopGuide: [
      "Import audio, klik klip untuk pilih, seret untuk pindah. Klik kanan untuk split/duplicate/analyze atau efek pilihan.",
      "Guna tab bawah untuk tukar panel. Skrol timeline untuk tambah ruang.",
      "",
      "Timeline + Pilihan",
      "Alt + drag: buat pilihan range",
      "/ : togol range selector",
      "Shift + klik: letak playhead tanpa snap",
      "Drag pada ruang kosong: pan",
      "Space + drag: pan (grab)",
      "Shift + roda tetikus: zum timeline",
      "Ctrl + roda tetikus: skrol horizontal / skrol panel di bawah kursor",
      "",
      "Transport",
      "Space: play/pause",
      ", : ke mula",
      "",
      "Klip",
      "S: split di playhead",
      "D: duplicate",
      "Delete / Backspace: padam",
      "Ctrl + X: potong",
      "Ctrl + V: tampal di playhead",
      "Ctrl + ← / →: pilih klip sebelumnya/berikutnya",
      "Alt + ← / →: alih klip mengikut grid",
      "Alt + Shift + ← / →: alih halus (0.01s)",
      "Alt + ↑ / ↓: pindah klip ke track atas/bawah",
      "",
      "Track",
      "↑ / ↓: pilih track",
      "",
      "Sejarah",
      "Ctrl + Z: undo",
      "Ctrl + Shift + Z atau Ctrl + Y: redo",
      "",
      "Simpan/Muat Projek",
      "Tab Project → Save Project File (.m3proj)",
      "Tab Project → Save to Browser (local)",
      "Load Project File akan minta relink jika audio hilang",
      "",
      "Effects",
      "Tab Effects → fade selection / track FX",
      "Klik kanan bila ada range untuk efek pilihan",
      "",
      "Efek Pilihan",
      "Alt + drag buat range, kemudian guna Effects tab/klik kanan",
      "Fade In/Out hanya pada range (auto-split)",
      "Crossfade gunakan fade-in + fade-out pada sempadan",
      "",
      "Clip FX",
      "Time Stretch: granular, kekalkan pitch (Apply untuk bake)",
      "Pitch: ubah semiton (resampling)",
      "Reset Clip FX pulihkan buffer asal",
      "",
      "Track FX",
      "Delay: time/feedback/mix",
      "Reverb: mix",
      "Saturation: drive",
      "Compressor: threshold/ratio",
      "Track FX digunakan untuk playback dan export",
      "",
      "Relink",
      "Jika projek tanpa audio, dialog relink akan muncul",
      "Pilih fail audio asal untuk pulihkan klip"
    ],
    mobileGuide: [
      "Pinch untuk zoom timeline, drag untuk pan. Tap M3 Menu untuk buka/tutup drawer.",
      "Guna tab bawah: Audio/Tracks/Mixer/Project/Actions/Effects.",
      "",
      "Gerak Isyarat",
      "Pinch: zoom timeline",
      "Drag: pan timeline",
      "Tap klip: pilih",
      "Tap ruang kosong: pindah playhead"
    ]
  },
  ko: {
    "app.tag": "세련된 브라우저 음악 편집기",
    "btn.play": "재생",
    "btn.pause": "일시정지",
    "btn.stop": "정지",
    "btn.import": "오디오 가져오기",
    "btn.export": "내보내기",
    "btn.addTrack": "트랙 추가",
    "btn.settings": "설정",
    "btn.split": "분할",
    "btn.duplicate": "복제",
    "btn.delete": "삭제",
    "btn.splitPlayhead": "플레이헤드에서 분할",
    "btn.duplicateClip": "클립 복제",
    "btn.deleteClip": "클립 삭제",
    "btn.exportWav": "WAV 내보내기",
    "btn.exportWebm": "WebM (Opus) 내보내기",
    "btn.exportOgg": "OGG (Opus) 내보내기",
    "btn.miniFollow": "미니 팔로우",
    "btn.apply": "적용",
    "btn.cancel": "취소",
    "btn.relink": "리링크",
    "btn.skipMissing": "건너뛰기",
    "hud.title": "M3 설정",
    "hud.bpm": "BPM",
    "hud.snap": "비트에 스냅",
    "hud.follow": "자동 스크롤",
    "hud.grid": "비트 그리드",
    "hud.metro": "메트로놈",
    "hud.fxIntensity": "FX 강도",
    "hud.fxNoise": "화면 노이즈",
    "hud.fxGlow": "프레임 글로우",
    "hud.zoom": "줌",
    "hud.lang": "언어",
    "hud.hint": "단축키: Space 재생/일시정지 · S 분할 · D 복제 · Del 삭제 · +/- 줌",
    "guide.desktop.title": "데스크톱 가이드",
    "guide.mobile.title": "모바일 가이드",
    "panel.tracks": "트랙",
    "panel.selectedClip": "선택된 클립",
    "panel.eq": "트랙 EQ + 필터",
    "panel.project": "프로젝트",
    "panel.actions": "액션",
    "panel.effects": "이펙트",
    "project.tempo": "템포",
    "project.key": "키",
    "project.length": "길이",
    "project.saveFile": "프로젝트 파일 저장",
    "project.loadFile": "프로젝트 파일 불러오기",
    "project.saveAs": "프로젝트 다른 이름으로 저장…",
    "prompt.saveAs": "프로젝트 이름으로 저장:",
    "prompt.exportName": "내보낼 파일 이름:",
    "project.includeAudio": "파일에 오디오 포함",
    "project.saveLocal": "브라우저에 저장",
    "project.loadLocal": "브라우저에서 불러오기",
    "project.clearLocal": "로컬 삭제",
    "project.status": "프로젝트는 로컬에 저장되며 파일로 내보내기 가능",
    "actions.hint": "클립을 선택해 편집하세요. 타임라인에서 드래그하세요.",
    "menu.title": "M3 메뉴",
    "tab.audio": "오디오",
    "tab.tracks": "트랙",
    "tab.mixer": "믹서",
    "tab.project": "프로젝트",
    "tab.actions": "액션",
    "tab.effects": "이펙트",
    "fx.fadeIn": "선택 구간 페이드 인…",
    "fx.fadeOut": "선택 구간 페이드 아웃…",
    "fx.crossfade": "선택 구간 크로스페이드…",
    "fx.tip": "팁: Alt + 드래그로 선택 범위를 만드세요.",
    "fx.clipTitle": "클립 FX (선택됨)",
    "fx.timeStretch": "타임 스트레치",
    "fx.pitch": "피치",
    "fx.applyStretch": "스트레치 적용",
    "fx.resetClip": "클립 FX 초기화",
    "fx.clipHint": "타임 스트레치는 피치를 유지합니다. 피치는 리샘플로 변경됩니다.",
    "fx.trackTitle": "트랙 FX (선택됨)",
    "fx.delay": "딜레이",
    "fx.reverb": "리버브",
    "fx.saturation": "새추레이션",
    "fx.compressor": "컴프레서",
    "overlay.analyzeTitle": "BPM + 키 분석 중…",
    "overlay.analyzeSub": "긴 파일은 시간이 걸릴 수 있습니다.",
    "overlay.effectTitle": "이펙트 적용",
    "overlay.effectSub": "현재 선택 범위에 적용됩니다.",
    "overlay.effect": "이펙트",
    "overlay.duration": "길이(초)",
    "overlay.curve": "커브",
    "overlay.relinkTitle": "오디오 파일 리링크",
    "overlay.relinkSub": "일부 클립에 오디오가 없습니다. 원본 파일을 선택하세요.",
    "clip.none": "선택된 클립 없음",
    "status.savingProject": "프로젝트 파일 저장 중...",
    "status.projectSavedWithAudio": "프로젝트 파일 저장됨(오디오 포함).",
    "status.projectSavedNoAudio": "프로젝트 파일 저장됨(오디오 미포함).",
    "status.saveFailed": "저장 실패",
    "status.loadFailed": "불러오기 실패",
    "status.savedLocal": "프로젝트가 브라우저에 저장되었습니다.",
    "status.localSaveFailed": "로컬 저장 실패",
    "status.noLocalProject": "로컬 프로젝트가 없습니다.",
    "status.localLoadFailed": "로컬 불러오기 실패",
    "status.localCleared": "로컬 프로젝트가 삭제되었습니다.",
    "status.projectLoaded": "프로젝트가 불러와졌습니다.",
    "status.relinkComplete": "리링크 완료.",
    "status.loadedWithoutAudio": "오디오 없이 불러왔습니다.",
    "status.stretching": "타임 스트레치 적용 중...",
    "status.stretchApplied": "타임 스트레치 적용됨.",
    "alert.setAnalysisUrl": "Settings에서 Analysis API URL을 먼저 설정하세요.",
    "alert.noOriginalFile": "원본 파일이 없습니다. 디스크에서 다시 가져오세요.",
    "alert.analyzeFailed": "분석 실패",
    "alert.selectRange": "범위를 먼저 선택하세요(Alt + 드래그).",
    "alert.setBackendUrl": "Settings에서 Backend API URL을 먼저 설정하세요.",
    "alert.pasteUrl": "YouTube URL을 먼저 붙여넣으세요.",
    "alert.ripFailed": "Rip 실패",
    desktopGuide: [
      "오디오를 가져온 뒤 클립을 클릭해 선택하고 드래그로 이동합니다. 우클릭으로 분할/복제/분석 또는 선택 효과.",
      "하단 탭으로 패널을 전환합니다. 타임라인을 스크롤해 공간을 늘릴 수 있습니다.",
      "",
      "타임라인 + 선택",
      "Alt + 드래그: 범위 선택",
      "/ : 범위 선택 표시 토글",
      "Shift + 클릭: 스냅 없이 플레이헤드 이동",
      "빈 타임라인 드래그: 패닝",
      "Space + 드래그: 그랩 패닝",
      "Shift + 마우스 휠: 타임라인 줌",
      "Ctrl + 휠: 수평 스크롤 / 커서 아래 패널 스크롤",
      "",
      "트랜스포트",
      "Space: 재생/일시정지",
      ", : 처음으로",
      "",
      "클립",
      "S: 플레이헤드에서 분할",
      "D: 복제",
      "Delete / Backspace: 삭제",
      "Ctrl + X: 잘라내기",
      "Ctrl + V: 플레이헤드에 붙여넣기",
      "Ctrl + ← / →: 이전/다음 클립 선택",
      "Alt + ← / →: 그리드 단위 이동",
      "Alt + Shift + ← / →: 미세 이동(0.01s)",
      "Alt + ↑ / ↓: 위/아래 트랙으로 이동",
      "",
      "트랙",
      "↑ / ↓: 트랙 선택",
      "",
      "히스토리",
      "Ctrl + Z: 되돌리기",
      "Ctrl + Shift + Z 또는 Ctrl + Y: 다시하기",
      "",
      "프로젝트 저장/불러오기",
      "Project 탭 → Save Project File (.m3proj)",
      "Project 탭 → Save to Browser (local)",
      "오디오가 없으면 리링크 창이 뜹니다",
      "",
      "이펙트",
      "Effects 탭 → 선택 페이드 / 트랙 FX",
      "범위 선택 시 우클릭 메뉴에 선택 효과 표시",
      "",
      "선택 효과",
      "Alt + 드래그로 범위 선택 후 Effects 탭/우클릭 사용",
      "Fade In/Out은 선택 구간만 적용(자동 분할)",
      "Crossfade는 경계에 페이드 인/아웃 적용",
      "",
      "클립 FX",
      "Time Stretch: 그레뉼러, 피치 유지(Apply로 적용)",
      "Pitch: 반음 이동(리샘플)",
      "Reset Clip FX로 원본 복원",
      "",
      "트랙 FX",
      "Delay: 시간/피드백/믹스",
      "Reverb: 믹스",
      "Saturation: 드라이브",
      "Compressor: 임계값/비율",
      "트랙 FX는 재생과 내보내기에 적용",
      "",
      "리링크",
      "오디오가 없으면 리링크 창이 표시됩니다",
      "원본 오디오 파일을 선택해 복원"
    ],
    mobileGuide: [
      "핀치로 타임라인 줌, 드래그로 패닝. M3 Menu를 눌러 드로어를 열고 닫습니다.",
      "하단 탭: Audio/Tracks/Mixer/Project/Actions/Effects.",
      "",
      "제스처",
      "핀치: 타임라인 줌",
      "드래그: 타임라인 패닝",
      "클립 탭: 선택",
      "빈 곳 탭: 플레이헤드 이동"
    ]
  }
};

function renderGuideLines(lines) {
  return lines.map(line => {
    if (!line) return "<br>";
    if (line.length <= 32 && !line.includes(":") && !line.includes("·")) {
      return `<div class="guide-section"><strong>${line}</strong></div>`;
    }
    return `<div>${line}</div>`;
  }).join("");
}

function applyLanguage(lang) {
  const dict = I18N[lang] || I18N.en;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
  if (desktopGuideText) desktopGuideText.innerHTML = renderGuideLines(dict.desktopGuide);
  if (mobileGuideText) mobileGuideText.innerHTML = renderGuideLines(dict.mobileGuide);
  localStorage.setItem("m3_language", lang);
  if (projectStatus && projectStatus.dataset.i18n) {
    projectStatus.textContent = dict[projectStatus.dataset.i18n] || projectStatus.textContent;
  }
  if (!findSelectedClip() && clipName) {
    clipName.textContent = dict["clip.none"] || "No clip selected";
  }
}

function initLanguage() {
  const stored = localStorage.getItem("m3_language") || "en";
  languageSelect.value = stored;
  applyLanguage(stored);
  languageSelect.addEventListener("change", () => applyLanguage(languageSelect.value));
}

initLanguage();
