const fileInput = document.getElementById("fileInput");
const trackArea = document.getElementById("trackArea");
const ruler = document.getElementById("ruler");
const playhead = document.getElementById("playhead");
const ghosthead = document.getElementById("ghosthead");
const timeReadout = document.getElementById("timeReadout");
const barBeatReadout = document.getElementById("barBeatReadout");
const projectLen = document.getElementById("projectLen");
const tempoValue = document.getElementById("tempoValue");
const mixer = document.getElementById("mixer");
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

let clipboardClip = null;
let undoStack = [];
let redoStack = [];
let rangeDrag = null;

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
  return clip.buffer.duration / rate;
}

function render() {
  trackArea.innerHTML = "";
  mixer.innerHTML = "";
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
      drawWaveform(canvas, clip.buffer);

      clipEl.appendChild(nameEl);
      clipEl.appendChild(canvas);

      clipEl.addEventListener("mousedown", (e) => startDrag(e, track, clip, clipEl));
      clipEl.addEventListener("click", (e) => {
        state.selectedClipId = clip.id;
        state.selectedTrackId = track.id;
        const bpmText = clip.bpm ? `${clip.bpm} BPM` : "-- BPM";
        const keyText = clip.key ? clip.key : "--";
        const camText = clip.camelot ? clip.camelot : "--";
        clipName.textContent = `${clip.name} · ${bpmText} · ${camText} ${keyText}`;
        drawFullWaveform(clipPreview, clip.buffer);
        render();
      });

      row.appendChild(clipEl);
    });

    trackArea.appendChild(row);

    // Mixer
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

    mixer.appendChild(mix);
  });

  const selected = findSelectedClip();
  if (selected) {
    const bpmText = selected.bpm ? `${selected.bpm} BPM` : "-- BPM";
    const keyText = selected.key ? selected.key : "--";
    const camText = selected.camelot ? selected.camelot : "--";
    clipName.textContent = `${selected.name} · ${bpmText} · ${camText} ${keyText}`;
    drawFullWaveform(clipPreview, selected.buffer);
    updatePreviewPlayhead();
  } else {
    clipName.textContent = "No clip selected";
    const ctx = clipPreview.getContext("2d");
    ctx.clearRect(0, 0, clipPreview.width, clipPreview.height);
    updatePreviewPlayhead();
  }

  renderRuler(maxEnd);

  if (tabMixer.classList.contains("active")) {
    const track = getSelectedTrack();
    if (track) renderEqControls(track);
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

function drawWaveform(canvas, buffer) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(0,229,255,0.8)";
  ctx.lineWidth = 1;

  const data = buffer.getChannelData(0);
  const step = Math.ceil(data.length / canvas.width);
  const amp = canvas.height / 2;
  ctx.beginPath();
  for (let i = 0; i < canvas.width; i++) {
    let min = 1.0;
    let max = -1.0;
    for (let j = 0; j < step; j++) {
      const datum = data[(i * step) + j] || 0;
      if (datum < min) min = datum;
      if (datum > max) max = datum;
    }
    ctx.moveTo(i, (1 + min) * amp);
    ctx.lineTo(i, (1 + max) * amp);
  }
  ctx.stroke();
}

function drawFullWaveform(canvas, buffer) {
  if (!buffer) return;
  const previewPxPerSec = Math.max(120, state.pxPerSec * 1.2);
  canvas.width = Math.max(1, Math.floor(buffer.duration * previewPxPerSec));
  canvas.height = 120;
  canvas.dataset.pxPerSec = String(previewPxPerSec);
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(107,255,184,0.8)";
  ctx.lineWidth = 1;
  const data = buffer.getChannelData(0);
  const step = Math.ceil(data.length / canvas.width);
  const amp = canvas.height / 2;
  ctx.beginPath();
  for (let i = 0; i < canvas.width; i++) {
    let min = 1.0;
    let max = -1.0;
    for (let j = 0; j < step; j++) {
      const datum = data[(i * step) + j] || 0;
      if (datum < min) min = datum;
      if (datum > max) max = datum;
    }
    ctx.moveTo(i, (1 + min) * amp);
    ctx.lineTo(i, (1 + max) * amp);
  }
  ctx.stroke();
}

function startDrag(e, track, clip, clipEl) {
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
      highCut.connect(gain).connect(audioCtx.destination);
      state.activeSources.push(source);

      const startAt = Math.max(0, clipStart - state.playStartOffset);
      const offsetTimeline = Math.max(0, state.playStartOffset - clipStart);
      const offsetBuf = offsetTimeline * (clip.playbackRate || 1);
      const durationBuf = clip.buffer.duration - offsetBuf;
      source.start(audioCtx.currentTime + startAt, offsetBuf, durationBuf);
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

  const leftBuffer = sliceBuffer(clip.buffer, 0, leftDur * rate);
  const rightBuffer = sliceBuffer(clip.buffer, leftDur * rate, rightDur * rate);

  clip.buffer = leftBuffer;
  clip.duration = leftBuffer.duration;

  const rightClip = {
    id: crypto.randomUUID(),
    name: clip.name + " (B)",
    buffer: rightBuffer,
    duration: rightBuffer.duration,
    bpm: clip.bpm,
    playbackRate: clip.playbackRate,
    start: cut
  };

  const track = findTrackByClip(clip.id);
  track.clips.push(rightClip);
  render();
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
  clip.playbackRate = state.bpm / next;
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
    alert("Set the Analysis API URL in Settings first.");
    return;
  }
  if (!clip.sourceFile) {
    alert("No original file stored for this clip. Re-import it from disk.");
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
      clip.playbackRate = state.bpm / clip.bpm;
    }
    clip.key = data.key || clip.key;
    clip.camelot = data.camelot || clip.camelot;
    render();
  } catch (err) {
    alert(`Analyze failed: ${err.message}`);
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

fileInput.addEventListener("change", (e) => handleFiles(e.target.files));
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

timeline.addEventListener("mousedown", (e) => {
  if (!spaceDown) return;
  isPanning = true;
  panStart = {
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
  if (!isPanning) return;
  timeline.scrollLeft = panStart.scrollLeft - (e.clientX - panStart.x);
  timeline.scrollTop = panStart.scrollTop - (e.clientY - panStart.y);
});

document.addEventListener("mouseup", () => {
  isPanning = false;
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
  rangeDrag = null;
});

let resizing = false;
let resizeStart = 0;
let resizeHeight = 240;
let panelCollapsed = false;
let menuCollapsed = false;

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

menuToggle.addEventListener("click", () => {
  menuCollapsed = !menuCollapsed;
  document.body.classList.toggle("menu-collapsed", menuCollapsed);
  bottomDrawer.classList.toggle("collapsed", menuCollapsed);
});

exportBtn.addEventListener("click", async () => {
  const format = exportFormat.value;
  if (format === "wav") {
    await exportWavMix();
    return;
  }
  await exportCompressed(format);
});

async function exportWavMix() {
  const maxEnd = Math.max(0, ...state.tracks.flatMap(t => t.clips.map(c => c.start + getClipDuration(c))));
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

    track.clips.forEach((clip) => {
      const clipDuration = getClipDuration(clip);
      const clipStart = clip.start;
      const clipEnd = clip.start + clipDuration;
      if (clipEnd <= exportStart || clipStart >= exportEnd) return;
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
      highCut.connect(gain).connect(off.destination);

      const localStart = Math.max(0, clipStart - exportStart);
      const offsetTimeline = Math.max(0, exportStart - clipStart);
      const offsetBuf = offsetTimeline * (clip.playbackRate || 1);
      const durationTimeline = Math.min(clipDuration - offsetTimeline, exportEnd - clipStart);
      if (durationTimeline <= 0) return;
      source.start(localStart, offsetBuf, durationTimeline * (clip.playbackRate || 1));
    });
  });

  const rendered = await off.startRendering();
  const wav = encodeWav(rendered);
  const blob = new Blob([wav], { type: "audio/wav" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = useRange ? "m3-export-range.wav" : "m3-export.wav";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function exportCompressed(format) {
  const maxEnd = Math.max(0, ...state.tracks.flatMap(t => t.clips.map(c => c.start + getClipDuration(c))));
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

    track.clips.forEach((clip) => {
      const clipDuration = getClipDuration(clip);
      const clipStart = clip.start;
      const clipEnd = clip.start + clipDuration;
      if (clipEnd <= exportStart || clipStart >= exportEnd) return;
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
      highCut.connect(gain).connect(dest);

      const localStart = Math.max(0, clipStart - exportStart);
      const offsetTimeline = Math.max(0, exportStart - clipStart);
      const offsetBuf = offsetTimeline * (clip.playbackRate || 1);
      const durationTimeline = Math.min(clipDuration - offsetTimeline, exportEnd - clipStart);
      if (durationTimeline <= 0) return;
      source.start(ctx.currentTime + localStart, offsetBuf, durationTimeline * (clip.playbackRate || 1));
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
  a.download = useRange ? `m3-export-range.${format === "ogg" ? "ogg" : "webm"}` : `m3-export.${format === "ogg" ? "ogg" : "webm"}`;
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
    alert("Set the Backend API URL in Settings first.");
    return;
  }
  if (!url) {
    alert("Paste a YouTube URL first.");
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
    alert(`Rip failed: ${err.message}`);
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
        start
      };
      state.tracks[trackIndex].clips.push(clip);
      render();
    });
  }
});

trackArea.addEventListener("click", (e) => {
  if (document.body.classList.contains("dragging")) return;
  if (e.target.closest(".clip")) return;
  const rect = trackArea.getBoundingClientRect();
  const x = e.clientX - rect.left + trackArea.scrollLeft;
  const y = e.clientY - rect.top + trackArea.scrollTop;
  const trackIndex = Math.max(0, Math.floor(y / 90));
  if (state.tracks[trackIndex]) {
    state.selectedTrackId = state.tracks[trackIndex].id;
  }
  let t = x / state.pxPerSec;
  if (state.snap) {
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
