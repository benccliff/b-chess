let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
  }
  if (ctx.state === "suspended") {
    ctx.resume();
  }
  return ctx;
}

function playTone(
  frequency: number,
  type: OscillatorType,
  startTime: number,
  duration: number,
  peakGain = 0.4,
): void {
  const audio = getCtx();
  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, startTime);

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.01);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);

  osc.connect(gain);
  gain.connect(audio.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

export function playMove(): void {
  const audio = getCtx();
  const t = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.type = "square";
  osc.frequency.setValueAtTime(200, t);

  gain.gain.setValueAtTime(0.15, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(t);
  osc.stop(t + 0.025);
}

export function playCapture(): void {
  const audio = getCtx();
  const t = audio.currentTime;

  const thud = audio.createOscillator();
  const thudGain = audio.createGain();
  thud.type = "sawtooth";
  thud.frequency.setValueAtTime(120, t);
  thud.frequency.exponentialRampToValueAtTime(40, t + 0.06);
  thudGain.gain.setValueAtTime(0.45, t);
  thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
  thud.connect(thudGain);
  thudGain.connect(audio.destination);
  thud.start(t);
  thud.stop(t + 0.06);

  const click = audio.createOscillator();
  const clickGain = audio.createGain();
  click.type = "square";
  click.frequency.setValueAtTime(280, t);
  clickGain.gain.setValueAtTime(0.2, t);
  clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
  click.connect(clickGain);
  clickGain.connect(audio.destination);
  click.start(t);
  click.stop(t + 0.02);
}

export function playCheck(): void {
  const audio = getCtx();
  const t = audio.currentTime;
  playTone(440, "sine", t, 0.15);
  playTone(880, "sine", t + 0.15, 0.15);
}

export function playNewGame(): void {
  const audio = getCtx();
  const t = audio.currentTime;
  playTone(330, "sine", t, 0.12);
  playTone(440, "sine", t + 0.13, 0.12);
  playTone(550, "sine", t + 0.26, 0.14);
}

export function playGameEnd(): void {
  const audio = getCtx();
  const t = audio.currentTime;
  playTone(550, "sine", t, 0.18);
  playTone(440, "sine", t + 0.2, 0.18);
  playTone(330, "sine", t + 0.4, 0.22);
}

export function useSound() {
  return { playNewGame, playMove, playCapture, playCheck, playGameEnd };
}
