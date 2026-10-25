"""Trilha original gerada por síntese (sem samples de terceiros): uso livre neste anúncio.
Progressão I–V–vi–IV em Ré maior, 100 BPM, com introdução, desenvolvimento e final.
Uso: python3 producao/gerar-trilha.py  ->  public/trilha/trilha.wav
"""
import wave
import numpy as np

SR = 44100
BPM = 100
BEAT = 60 / BPM
BAR = BEAT * 4
DUR = 62.0
n_total = int(SR * DUR)
L = np.zeros(n_total)
R = np.zeros(n_total)
rng = np.random.default_rng(7)


def midi(m):
    return 440 * 2 ** ((m - 69) / 12)


def add(sig, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i >= n_total:
        return
    sig = sig[: n_total - i] * gain
    L[i : i + len(sig)] += sig * np.sqrt(0.5 * (1 - pan))
    R[i : i + len(sig)] += sig * np.sqrt(0.5 * (1 + pan))


def env(n, a, r):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4))
    rel = np.clip((n / SR - t) / max(r, 1e-4), 0, 1)
    return e * rel


def pad(freqs, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for f in freqs:
        for det in (-0.12, 0.0, 0.12):
            ff = f * 2 ** (det / 12)
            s += np.sin(2 * np.pi * ff * t) + 0.3 * np.sin(4 * np.pi * ff * t) + 0.12 * np.sin(6 * np.pi * ff * t)
    s *= 0.5 + 0.5 * np.sin(2 * np.pi * 0.25 * t) * 0.3
    return s * env(n, 0.8, 0.9) / (len(freqs) * 3)


def pluck(f, dur=1.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = (np.sin(2 * np.pi * f * t) + 0.45 * np.sin(4 * np.pi * f * t) * np.exp(-t * 6)
         + 0.2 * np.sin(6 * np.pi * f * t) * np.exp(-t * 9))
    return s * np.exp(-t * 3.2) * env(n, 0.004, 0.05)


def bass(f, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)
    return s * env(n, 0.01, 0.15) * np.exp(-t * 0.6)


def kick():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 50 + 90 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)


def shaker():
    n = int(0.08 * SR)
    t = np.arange(n) / SR
    s = rng.standard_normal(n)
    s = np.diff(s, prepend=0)  # brilho (passa-altas simples)
    return s * np.exp(-t * 60) * env(n, 0.005, 0.01)


# acordes (MIDI): D, A, Bm, G
chords = [[62, 66, 69], [61, 64, 69], [62, 66, 71], [62, 67, 71]]
roots = [38, 33, 35, 31]
n_bars = int(DUR // BAR)
for b in range(n_bars):
    t0 = b * BAR
    c = chords[b % 4]
    last = b == n_bars - 1
    add(pad([midi(m) for m in c] + [midi(c[0] - 12)], BAR + (2.5 if last else 0.6)), t0, gain=0.55)
    if last:
        add(pluck(midi(74), 3.0), t0, 0.2, 0.25)
        add(bass(midi(roots[b % 4]), 3.0), t0, gain=0.5)
        add(kick(), t0, gain=0.5)
        break
    # arpejo em colcheias
    arp = [c[0] + 12, c[1] + 12, c[2] + 12, c[1] + 12]
    density = 1 if b < 2 else 2
    for k in range(8 if density == 2 else 4):
        step = BEAT / 2 if density == 2 else BEAT
        m = arp[k % 4] + (12 if b >= 12 and k % 4 == 2 else 0)
        add(pluck(midi(m)), t0 + k * step, pan=0.35 if k % 2 else -0.35, gain=0.16)
    if b >= 2:
        for k in range(4):
            add(bass(midi(roots[b % 4]), BEAT * 0.95), t0 + k * BEAT, gain=0.45)
    if b >= 4:
        for k in range(4):
            add(kick(), t0 + k * BEAT, gain=0.55 if k % 2 == 0 else 0.35)
    if b >= 6:
        for k in range(8):
            add(shaker(), t0 + k * BEAT / 2 + BEAT / 4, pan=0.5, gain=0.06 if k % 2 else 0.04)

# reverberação simples (convolução com cauda de ruído decaindo)
ir_n = int(1.6 * SR)
ir = rng.standard_normal(ir_n) * np.exp(-np.arange(ir_n) / SR * 3.5)
ir[0] = 0
ir /= np.sqrt(np.sum(ir ** 2)) * 6


def conv(x):
    n = len(x) + ir_n
    nfft = 1 << (n - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, nfft) * np.fft.rfft(ir, nfft), nfft)[: len(x)]
    return x + y


L, R = conv(L), conv(R)
fade = int(2.5 * SR)
for ch in (L, R):
    ch[:int(0.05 * SR)] *= np.linspace(0, 1, int(0.05 * SR))
    ch[-fade:] *= np.linspace(1, 0, fade) ** 2
peak = max(np.abs(L).max(), np.abs(R).max())
st = np.stack([L, R], 1) / peak * 0.89
with wave.open("public/trilha/trilha.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((st * 32767).astype("<i2").tobytes())
print("ok", DUR, "s")
