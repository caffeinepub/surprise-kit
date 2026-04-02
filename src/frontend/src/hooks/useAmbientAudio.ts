import { useCallback, useEffect, useRef, useState } from "react";

// ─── Rain: gentle rain droplets only, no noise floor ───────────────────────
function startRain(ctx: AudioContext, dest: AudioNode): () => void {
  const master = ctx.createGain();
  master.gain.value = 0.5;
  master.connect(dest);

  const stopFns: (() => void)[] = [];

  // Very tightly bandpassed noise — rain hiss (narrow Q keeps it from sounding harsh)
  const buf = ctx.createBuffer(1, 2 * ctx.sampleRate, ctx.sampleRate);
  const d = buf.getChannelData(0);
  // Pink-ish noise: average adjacent samples to soften
  let b = 0;
  for (let i = 0; i < d.length; i++) {
    const white = Math.random() * 2 - 1;
    b = 0.98 * b + 0.02 * white;
    d[i] = (white + b) * 0.5;
  }
  const ns = ctx.createBufferSource();
  ns.buffer = buf;
  ns.loop = true;
  const hiss = ctx.createBiquadFilter();
  hiss.type = "bandpass";
  hiss.frequency.value = 3500;
  hiss.Q.value = 2.5;
  const hissGain = ctx.createGain();
  hissGain.gain.value = 0.08;
  ns.connect(hiss);
  hiss.connect(hissGain);
  hissGain.connect(master);
  ns.start();
  stopFns.push(() => {
    try {
      ns.stop();
    } catch (_) {}
  });

  // Random raindrop taps — short sine pops
  let dropActive = true;
  const scheduleDrop = () => {
    if (!dropActive) return;
    const delay = 80 + Math.random() * 300;
    setTimeout(() => {
      if (!dropActive) return;
      const freq = 1200 + Math.random() * 1800;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const g = ctx.createGain();
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0.06 + Math.random() * 0.06, t);
      g.gain.exponentialRampToValueAtTime(
        0.001,
        t + 0.04 + Math.random() * 0.06,
      );
      osc.connect(g);
      g.connect(master);
      osc.start(t);
      osc.stop(t + 0.12);
      scheduleDrop();
    }, delay);
  };
  scheduleDrop();
  stopFns.push(() => {
    dropActive = false;
  });

  return () => {
    for (const fn of stopFns) fn();
  };
}

// ─── Ocean/Waves: pure swell oscillators, no noise ─────────────────────────
function startOcean(ctx: AudioContext, dest: AudioNode): () => void {
  const master = ctx.createGain();
  master.gain.value = 0.5;
  master.connect(dest);

  const stopFns: (() => void)[] = [];

  // Multi-layered sine wave swells — each at a slightly different LFO phase
  const swellFreqs = [0.07, 0.11, 0.17];
  const toneFreqs = [120, 180, 90];
  for (let i = 0; i < swellFreqs.length; i++) {
    const tone = ctx.createOscillator();
    tone.type = "sine";
    tone.frequency.value = toneFreqs[i];
    const toneGain = ctx.createGain();
    toneGain.gain.value = 0.0;

    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = swellFreqs[i];
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.12;

    lfo.connect(lfoGain);
    lfoGain.connect(toneGain.gain);
    tone.connect(toneGain);
    toneGain.connect(master);

    tone.start();
    lfo.start();
    stopFns.push(() => {
      try {
        tone.stop();
        lfo.stop();
      } catch (_) {}
    });
  }

  // Gentle shore foam: very tight highpass bandpass, ultra-low gain
  const fb = ctx.createBuffer(1, 2 * ctx.sampleRate, ctx.sampleRate);
  const fd = fb.getChannelData(0);
  for (let i = 0; i < fd.length; i++) fd[i] = Math.random() * 2 - 1;
  const foamNs = ctx.createBufferSource();
  foamNs.buffer = fb;
  foamNs.loop = true;
  const foamF = ctx.createBiquadFilter();
  foamF.type = "bandpass";
  foamF.frequency.value = 4000;
  foamF.Q.value = 4;
  const foamG = ctx.createGain();
  foamG.gain.value = 0.04;
  foamNs.connect(foamF);
  foamF.connect(foamG);
  foamG.connect(master);
  foamNs.start();
  stopFns.push(() => {
    try {
      foamNs.stop();
    } catch (_) {}
  });

  return () => {
    for (const fn of stopFns) fn();
  };
}

// ─── Lofi beats: clean melodic loop, zero noise ────────────────────────────
function startLofi(ctx: AudioContext, dest: AudioNode): () => void {
  const master = ctx.createGain();
  master.gain.value = 0.5;
  master.connect(dest);

  const stopFns: (() => void)[] = [];

  // Lofi chord pad — detuned triangle oscillators
  const chordFreqs = [130.81, 164.81, 196, 246.94, 329.63];
  for (const freq of chordFreqs) {
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = freq + (Math.random() - 0.5) * 2; // slight detune
    const g = ctx.createGain();
    g.gain.value = 0.045;
    osc.connect(g);
    g.connect(master);
    osc.start();
    stopFns.push(() => {
      try {
        osc.stop();
      } catch (_) {}
    });
  }

  // Kick drum: short low sine thump
  let beatActive = true;
  const bpm = 85;
  const beatInterval = (60 / bpm) * 1000;
  const scheduleKick = () => {
    if (!beatActive) return;
    const t = ctx.currentTime;
    const kick = ctx.createOscillator();
    kick.type = "sine";
    kick.frequency.setValueAtTime(180, t);
    kick.frequency.exponentialRampToValueAtTime(40, t + 0.15);
    const kg = ctx.createGain();
    kg.gain.setValueAtTime(0.35, t);
    kg.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    kick.connect(kg);
    kg.connect(master);
    kick.start(t);
    kick.stop(t + 0.25);
  };
  const scheduleSnare = () => {
    if (!beatActive) return;
    // Snare = short filtered noise burst
    const snb = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
    const snd = snb.getChannelData(0);
    for (let i = 0; i < snd.length; i++) snd[i] = Math.random() * 2 - 1;
    const snSrc = ctx.createBufferSource();
    snSrc.buffer = snb;
    const snF = ctx.createBiquadFilter();
    snF.type = "bandpass";
    snF.frequency.value = 2000;
    snF.Q.value = 1.2;
    const snG = ctx.createGain();
    const t = ctx.currentTime;
    snG.gain.setValueAtTime(0.15, t);
    snG.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    snSrc.connect(snF);
    snF.connect(snG);
    snG.connect(master);
    snSrc.start(t);
  };

  // Pattern: kick on 1 & 3, snare on 2 & 4 (4/4 at 85bpm)
  let step = 0;
  const tick = () => {
    if (!beatActive) return;
    if (step % 2 === 0) scheduleKick();
    else scheduleSnare();
    step++;
    setTimeout(tick, beatInterval / 2);
  };
  setTimeout(tick, 200);
  stopFns.push(() => {
    beatActive = false;
  });

  // Hi-hat: very quiet tick
  let hatActive = true;
  const hatTick = () => {
    if (!hatActive) return;
    const hb = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
    const hd = hb.getChannelData(0);
    for (let i = 0; i < hd.length; i++) hd[i] = Math.random() * 2 - 1;
    const hs = ctx.createBufferSource();
    hs.buffer = hb;
    const hf = ctx.createBiquadFilter();
    hf.type = "highpass";
    hf.frequency.value = 8000;
    const hg = ctx.createGain();
    const t = ctx.currentTime;
    hg.gain.setValueAtTime(0.06, t);
    hg.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    hs.connect(hf);
    hf.connect(hg);
    hg.connect(master);
    hs.start(t);
    setTimeout(hatTick, beatInterval / 4);
  };
  setTimeout(hatTick, 200);
  stopFns.push(() => {
    hatActive = false;
  });

  return () => {
    for (const fn of stopFns) fn();
  };
}

// ─── Forest: birds + gentle leaf rustle ────────────────────────────────────
function startForest(ctx: AudioContext, dest: AudioNode): () => void {
  const master = ctx.createGain();
  master.gain.value = 0.5;
  master.connect(dest);

  const stopFns: (() => void)[] = [];

  // Ultra-soft leaf rustle — narrow bandpass, very low gain
  const buf = ctx.createBuffer(1, 2 * ctx.sampleRate, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let prev = 0;
  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1;
    prev = 0.97 * prev + 0.03 * w;
    d[i] = prev;
  }
  const ns = ctx.createBufferSource();
  ns.buffer = buf;
  ns.loop = true;
  const f = ctx.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = 2200;
  f.Q.value = 3;
  const g = ctx.createGain();
  g.gain.value = 0.04;
  ns.connect(f);
  f.connect(g);
  g.connect(master);
  ns.start();
  stopFns.push(() => {
    try {
      ns.stop();
    } catch (_) {}
  });

  // Bird chirps
  let chirpActive = true;
  const birdFreqs = [2800, 3200, 3800, 4200, 2400];
  const scheduleChirp = () => {
    if (!chirpActive) return;
    const delay = 800 + Math.random() * 3500;
    setTimeout(() => {
      if (!chirpActive) return;
      const freq = birdFreqs[Math.floor(Math.random() * birdFreqs.length)];
      const count = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        const t = ctx.currentTime + i * 0.15;
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.linearRampToValueAtTime(freq * 1.2, t + 0.08);
        osc.frequency.linearRampToValueAtTime(freq, t + 0.12);
        const cg = ctx.createGain();
        cg.gain.setValueAtTime(0, t);
        cg.gain.linearRampToValueAtTime(0.18, t + 0.02);
        cg.gain.linearRampToValueAtTime(0, t + 0.13);
        osc.connect(cg);
        cg.connect(master);
        osc.start(t);
        osc.stop(t + 0.16);
      }
      scheduleChirp();
    }, delay);
  };
  scheduleChirp();
  stopFns.push(() => {
    chirpActive = false;
  });

  return () => {
    for (const fn of stopFns) fn();
  };
}

// ─── Cafe ambiance: coffee shop sounds, zero noise floor ───────────────────
function startCafe(ctx: AudioContext, dest: AudioNode): () => void {
  const master = ctx.createGain();
  master.gain.value = 0.5;
  master.connect(dest);

  const stopFns: (() => void)[] = [];

  // Soft background chatter simulation: many detuned sine waves at low volume
  const chatterFreqs = [220, 233, 246, 261, 277, 293, 311, 329, 349, 370];
  for (const freq of chatterFreqs) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq + (Math.random() - 0.5) * 8;
    const g = ctx.createGain();
    g.gain.value = 0.018;
    osc.connect(g);
    g.connect(master);
    osc.start();
    stopFns.push(() => {
      try {
        osc.stop();
      } catch (_) {}
    });
  }

  // Cup clinks
  let clinkActive = true;
  const scheduleClink = () => {
    if (!clinkActive) return;
    const delay = 3000 + Math.random() * 6000;
    setTimeout(() => {
      if (!clinkActive) return;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 1800 + Math.random() * 600;
      const g = ctx.createGain();
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0.14, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(g);
      g.connect(master);
      osc.start(t);
      osc.stop(t + 0.4);
      scheduleClink();
    }, delay);
  };
  scheduleClink();
  stopFns.push(() => {
    clinkActive = false;
  });

  // Occasional spoon stir: quick descending tone
  let stirActive = true;
  const scheduleStir = () => {
    if (!stirActive) return;
    const delay = 7000 + Math.random() * 12000;
    setTimeout(() => {
      if (!stirActive) return;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(2400, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1600, ctx.currentTime + 0.2);
      const g = ctx.createGain();
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0.08, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(g);
      g.connect(master);
      osc.start(t);
      osc.stop(t + 0.3);
      scheduleStir();
    }, delay);
  };
  scheduleStir();
  stopFns.push(() => {
    stirActive = false;
  });

  return () => {
    for (const fn of stopFns) fn();
  };
}

// ─── Lullaby/Piano: gentle melodic lullaby, no noise ──────────────────────
function startPiano(ctx: AudioContext, dest: AudioNode): () => void {
  const master = ctx.createGain();
  master.gain.value = 0.5;
  master.connect(dest);

  const stopFns: (() => void)[] = [];

  // Lullaby melody — Brahms-inspired simple descending phrase
  // Notes: G4, E4, C4, D4, G3 repeating gently
  const lullabyPattern = [
    { freq: 392, dur: 1.0 }, // G4
    { freq: 329.63, dur: 0.8 }, // E4
    { freq: 261.63, dur: 0.8 }, // C4
    { freq: 293.66, dur: 1.2 }, // D4
    { freq: 392, dur: 0.6 }, // G4
    { freq: 349.23, dur: 0.8 }, // F4
    { freq: 329.63, dur: 1.4 }, // E4
    { freq: 261.63, dur: 1.8 }, // C4
  ];

  const playNote = (freq: number, time: number, duration: number) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    // Add slight harmonic for piano warmth
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = freq * 2;
    const osc3 = ctx.createOscillator();
    osc3.type = "triangle";
    osc3.frequency.value = freq * 3;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(0.18, time + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, time + duration + 0.5);

    const g2 = ctx.createGain();
    g2.gain.value = 0.05;
    const g3 = ctx.createGain();
    g3.gain.value = 0.02;

    osc.connect(g);
    osc2.connect(g2);
    g2.connect(g);
    osc3.connect(g3);
    g3.connect(g);
    g.connect(master);

    osc.start(time);
    osc.stop(time + duration + 0.6);
    osc2.start(time);
    osc2.stop(time + duration + 0.6);
    osc3.start(time);
    osc3.stop(time + duration + 0.6);
  };

  let noteActive = true;
  const schedulePhrase = () => {
    if (!noteActive) return;
    let t = ctx.currentTime + 0.3;
    for (const note of lullabyPattern) {
      playNote(note.freq, t, note.dur);
      t += note.dur + 0.25;
    }
    const totalDuration = lullabyPattern.reduce((s, n) => s + n.dur + 0.25, 0);
    setTimeout(schedulePhrase, (totalDuration + 2.5) * 1000);
  };
  setTimeout(schedulePhrase, 200);
  stopFns.push(() => {
    noteActive = false;
  });

  return () => {
    for (const fn of stopFns) fn();
  };
}

// ─── Summer wind: pure oscillator gusts, no noise ─────────────────────────
function startWind(ctx: AudioContext, dest: AudioNode): () => void {
  const master = ctx.createGain();
  master.gain.value = 0.5;
  master.connect(dest);

  const stopFns: (() => void)[] = [];

  // Layered sine waves at low frequencies — sounds like a warm breeze
  const windLayers = [
    { freq: 60, lfoRate: 0.08, lfoDepth: 0.1, base: 0.08 },
    { freq: 90, lfoRate: 0.13, lfoDepth: 0.08, base: 0.06 },
    { freq: 140, lfoRate: 0.2, lfoDepth: 0.06, base: 0.04 },
    { freq: 220, lfoRate: 0.07, lfoDepth: 0.04, base: 0.03 },
  ];

  for (const layer of windLayers) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = layer.freq;
    const g = ctx.createGain();
    g.gain.value = layer.base;

    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = layer.lfoRate;
    const lg = ctx.createGain();
    lg.gain.value = layer.lfoDepth;
    lfo.connect(lg);
    lg.connect(g.gain);

    osc.connect(g);
    g.connect(master);
    osc.start();
    lfo.start();
    stopFns.push(() => {
      try {
        osc.stop();
        lfo.stop();
      } catch (_) {}
    });
  }

  // Occasional summer bird tweet
  let tweetActive = true;
  const scheduleTweet = () => {
    if (!tweetActive) return;
    const delay = 4000 + Math.random() * 8000;
    setTimeout(() => {
      if (!tweetActive) return;
      const freq = 3000 + Math.random() * 1200;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(freq * 0.85, ctx.currentTime + 0.3);
      const g = ctx.createGain();
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.1, t + 0.05);
      g.gain.linearRampToValueAtTime(0, t + 0.3);
      osc.connect(g);
      g.connect(master);
      osc.start(t);
      osc.stop(t + 0.35);
      scheduleTweet();
    }, delay);
  };
  scheduleTweet();
  stopFns.push(() => {
    tweetActive = false;
  });

  return () => {
    for (const fn of stopFns) fn();
  };
}

// ─── Fire: crackle via oscillator pops only, no noise floor ───────────────
function startFire(ctx: AudioContext, dest: AudioNode): () => void {
  const master = ctx.createGain();
  master.gain.value = 0.5;
  master.connect(dest);

  const stopFns: (() => void)[] = [];

  // Deep fire rumble: very low sine drone, barely audible
  const rumble = ctx.createOscillator();
  rumble.type = "sine";
  rumble.frequency.value = 55;
  const rumbleG = ctx.createGain();
  rumbleG.gain.value = 0.06;
  const rLfo = ctx.createOscillator();
  rLfo.type = "sine";
  rLfo.frequency.value = 0.5;
  const rLg = ctx.createGain();
  rLg.gain.value = 0.04;
  rLfo.connect(rLg);
  rLg.connect(rumbleG.gain);
  rumble.connect(rumbleG);
  rumbleG.connect(master);
  rumble.start();
  rLfo.start();
  stopFns.push(() => {
    try {
      rumble.stop();
      rLfo.stop();
    } catch (_) {}
  });

  // Wood crackle pops — random sine bursts
  let popActive = true;
  const schedulePop = () => {
    if (!popActive) return;
    const delay = 150 + Math.random() * 1200;
    setTimeout(() => {
      if (!popActive) return;
      const freq = 200 + Math.random() * 400;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        freq * 0.4,
        ctx.currentTime + 0.06,
      );
      const g = ctx.createGain();
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0.22, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
      osc.connect(g);
      g.connect(master);
      osc.start(t);
      osc.stop(t + 0.1);
      schedulePop();
    }, delay);
  };
  schedulePop();
  stopFns.push(() => {
    popActive = false;
  });

  // Occasional hiss: a 2nd pop layer at higher pitch for texture
  let hissActive = true;
  const scheduleHiss = () => {
    if (!hissActive) return;
    const delay = 500 + Math.random() * 2000;
    setTimeout(() => {
      if (!hissActive) return;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200 + Math.random() * 600, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.12);
      const g = ctx.createGain();
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0.08, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
      osc.connect(g);
      g.connect(master);
      osc.start(t);
      osc.stop(t + 0.16);
      scheduleHiss();
    }, delay);
  };
  scheduleHiss();
  stopFns.push(() => {
    hissActive = false;
  });

  return () => {
    for (const fn of stopFns) fn();
  };
}

const SYNTH_MAP: Record<
  string,
  (ctx: AudioContext, dest: AudioNode) => () => void
> = {
  rain: startRain,
  ocean: startOcean,
  lofi: startLofi,
  forest: startForest,
  cafe: startCafe,
  piano: startPiano,
  wind: startWind,
  fire: startFire,
};

const ID_TO_SYNTH: Record<string, string> = {
  rain: "rain",
  lofi: "lofi",
  forest: "forest",
  ocean: "ocean",
  cafe: "cafe",
  piano: "piano",
  wind: "wind",
  fire: "fire",
};

export function useAmbientAudio(
  bgMusicId: string,
  enabled: boolean,
): {
  isPlaying: boolean;
  toggle: () => void;
  volume: number;
  setVolume: (v: number) => void;
  mute: () => void;
  unmute: () => void;
} {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const stopCurrentRef = useRef<(() => void) | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.9);
  const enabledRef = useRef(enabled);
  const bgMusicIdRef = useRef(bgMusicId);
  enabledRef.current = enabled;
  bgMusicIdRef.current = bgMusicId;

  const ensureContext = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();
      const mg = ctxRef.current.createGain();
      mg.gain.value = 0.9;
      mg.connect(ctxRef.current.destination);
      masterGainRef.current = mg;
    }
    return ctxRef.current;
  }, []);

  const startPlaying = useCallback(() => {
    const synthType = ID_TO_SYNTH[bgMusicIdRef.current];
    if (!synthType) return;
    const startFn = SYNTH_MAP[synthType];
    if (!startFn) return;
    const ctx = ensureContext();
    if (ctx.state === "suspended") ctx.resume();
    if (stopCurrentRef.current) {
      stopCurrentRef.current();
      stopCurrentRef.current = null;
    }
    const stop = startFn(ctx, masterGainRef.current!);
    stopCurrentRef.current = stop;
    setIsPlaying(true);
  }, [ensureContext]);

  const stopPlaying = useCallback(() => {
    if (stopCurrentRef.current) {
      stopCurrentRef.current();
      stopCurrentRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) stopPlaying();
    else startPlaying();
  }, [isPlaying, startPlaying, stopPlaying]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (masterGainRef.current) masterGainRef.current.gain.value = v;
  }, []);

  const mute = useCallback(() => {
    if (masterGainRef.current) masterGainRef.current.gain.value = 0;
  }, []);

  const unmute = useCallback(() => {
    if (masterGainRef.current) masterGainRef.current.gain.value = volume;
  }, [volume]);

  useEffect(() => {
    if (enabled && bgMusicId) startPlaying();
    else stopPlaying();
    return () => {
      stopPlaying();
    };
  }, [enabled, bgMusicId, startPlaying, stopPlaying]);

  return { isPlaying, toggle, volume, setVolume, mute, unmute };
}
