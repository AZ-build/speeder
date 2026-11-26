"""Sunset Drive I-V: five songs (one per loop), each in five world parts (seamless 8-bar loops),
plus a two-bar handoff after each Warden. Same theme throughout; each song is a step up in key and
tempo and adds one new colour."""
import sys, os, json
import numpy as np
from multiprocessing import Pool
from scipy.io import wavfile
from engine import *

CHORDS = [([55, 59, 62, 66], 43), ([54, 57, 61, 64], 42), ([52, 55, 59, 62, 66], 40), ([57, 61, 64, 71], 45)]
MEL_A = [[(0, 1.5, 71), (1.5, 0.5, 69), (2, 2, 66)],
         [(0, 1, 69), (1, 1, 73), (2, 2, 76)],
         [(0, 1.5, 74), (1.5, 0.5, 71), (2, 1, 67), (3, 1, 69)],
         [(0, 2, 69), (2, 0.5, 71), (2.5, 1.5, 73)]]
MEL_B = [[(0, 1.5, 71), (1.5, 0.5, 69), (2, 2, 66)],
         [(0, 1, 69), (1, 1, 73), (2, 1, 76), (3, 1, 78)],
         [(0, 1.5, 79), (1.5, 0.5, 78), (2, 2, 74)],
         [(0, 2, 76), (2, 1, 73), (3, 1, 69)]]
MEL_C = [[(0, 1, 71), (1, 0.5, 73), (1.5, 0.5, 74), (2, 2, 76)],
         [(0, 1.5, 76), (1.5, 0.5, 73), (2, 1, 69), (3, 1, 73)],
         [(0, 1, 74), (1, 1, 71), (2, 1.5, 67), (3.5, 0.5, 69)],
         [(0, 3, 69), (3, 1, 64)]]
MOTIF = {0: 69, 3: 71, 6: 74, 8: 71, 10: 69, 12: 66, 14: 64}
GUIDE = [66, 64, 62, 61]
SONGS = [
    dict(id='sunset1', title='Sunset Drive', bpm=96, key=0, colors=[], mel=MEL_A + MEL_B, arp=[0, 1, 2, 3, 2, 1, 2, 3]),
    dict(id='sunset2', title='Sunset Drive II', bpm=100, key=2, colors=['mar'], mel=MEL_A + MEL_C, arp=[0, 2, 1, 3, 2, 0, 3, 1]),
    dict(id='sunset3', title='Sunset Drive III', bpm=104, key=4, colors=['ep'], mel=MEL_A + MEL_B, arp=[0, 1, 2, 3, 2, 1, 2, 3]),
    dict(id='sunset4', title='Sunset Drive IV', bpm=108, key=5, colors=['str'], mel=MEL_A + MEL_C, arp=[0, 2, 1, 3, 2, 0, 3, 1]),
    dict(id='sunset5', title='Sunset Drive V', bpm=112, key=7, colors=['mar', 'ep', 'str'], mel=MEL_A + MEL_B, arp=[0, 1, 2, 3, 2, 1, 2, 3]),
]
PAD_FC = {1: 1500, 2: 2300, 3: 3200, 4: 3800, 5: 5200}
ARP_FC = {2: 1100, 3: 1700, 4: 2400, 5: 4200}
ARP_VOL = {2: 0.2, 3: 0.26, 4: 0.26, 5: 0.34}
COL_VOL = {2: 0.75, 3: 0.9, 4: 0.95, 5: 1.0}
BARS = 8


def lo(m, k, hi_limit):
    return m + k - (12 if m + k > hi_limit else 0)


def arrange(tr, s, part, bars):
    k = s['key']
    mk = k if k <= 4 else k - 12
    for b in range(bars):
        lb = b % BARS
        notes, root = CHORDS[lb % 4]
        notes = [n + k for n in notes]
        root = lo(root, k, 47)
        second = lb >= 4
        t0 = tr.at(b)
        for m in notes:
            tr.add('pad', pad_note(m, tr.bar_s, wobble=9, att=0.3, rel=1.4), t0, gain=0.5)
        top = notes[-1] + 12 - (12 if notes[-1] + 12 > 88 else 0)
        if part == 1:
            if lb % 2 == 0:
                tr.add('bell', bell(top, 0.5), t0, pan=0.3)
        else:
            tr.add('bell', bell(top, 0.5), t0, pan=0.3)
            tr.add('bell', bell(lo(notes[1], 12, 86), 0.35), tr.at(b, 2.5), pan=-0.3)
            if second and part >= 3:
                tr.add('bell', bell(lo(notes[2], 12, 86), 0.28), tr.at(b, 3.25), pan=0.1)
        for beat in (1, 3):
            tr.add('perc', shaker(0.5 if part < 3 else 0.6), tr.at(b, beat), pan=-0.4)
        if part >= 3:
            for beat in (0.5, 1.5, 2.5, 3.5):
                tr.add('perc', shaker(0.3), tr.at(b, beat + 0.06), pan=-0.5)
        if part >= 2:
            for i in range(8):
                beat = i * 0.5 + (0.06 if i % 2 else 0)
                tr.add('hats', hat(False, 0.42 if i % 2 == 0 else 0.7), tr.at(b, beat), pan=0.2)
        if part == 5:
            for beat in (1.5, 3.5):
                tr.add('hats', hat(True, 0.5), tr.at(b, beat + 0.06), pan=-0.2)
        if part == 1:
            tr.add('bass', sub_bass(root, tr.bar_s * 0.95, 0.8), t0)
        else:
            for beat, ln, iv in [(0, 1.4, 0), (1.5, 0.4, 0), (2.5, 0.9, 12), (3.5, 0.4, 7)]:
                tr.add('bass', sub_bass(root + iv, ln * tr.spb, 0.9), tr.at(b, beat))
        if part >= 2:
            tones = [n + 12 - (12 if k >= 5 else 0) for n in notes[:4]]
            for i, idx in enumerate(s['arp']):
                tr.add('arp', pluck(tones[idx], 0.55 + 0.15 * (i % 2 == 0), decay=0.28, bright=3000, dark=600),
                       tr.at(b, i * 0.5), pan=0.25 * (1 if i % 2 else -1))
        # the song's new colour
        if part >= 2:
            cv = COL_VOL[part]
            if 'mar' in s['colors']:
                for st, m in MOTIF.items():
                    tr.add('mar', marimba(lo(m, k, 81), (0.75 if st in (0, 6) else 0.55) * cv), tr.at(b, st / 4), pan=0.35 if st % 4 else -0.2)
            if 'ep' in s['colors']:
                for beat in ((1.5, 3) if part < 4 else (0.5, 1.5, 3)):
                    for m in notes[:4]:
                        tr.add('ep', epiano(m, 0.55 * tr.spb, 0.5 * cv), tr.at(b, beat))
            if 'str' in s['colors'] and part >= 3:
                g = lo(GUIDE[lb % 4], k, 74)
                tr.add('str', string_note(g, tr.bar_s, cv), t0)
                if part == 5:
                    tr.add('str', string_note(g + 12, tr.bar_s, 0.6 * cv), t0)
        if part >= 3:
            if part < 5:
                kb = [0, 2.5]
            else:
                kb = [0, 1, 2, 3] if s['id'] == 'sunset5' else [0, 1.75, 2.5]
            for beat in kb:
                tk = tr.at(b, beat)
                tr.add('kick', kick(f0=130, f1=46, dec=0.5, click=0.12), tk)
                tr.kicks.append(tk)
            for beat in ([2] if part < 5 else [1, 3]):
                tr.add('snare', snare(tone=200, dec=0.16), tr.at(b, beat))
                tr.add('snare', clap(), tr.at(b, beat), gain=0.5 if part < 5 else 0.7)
        if part == 5 and lb == 0:
            tr.add('fx', crash(0.4), t0)
        if part >= 4:
            for beat, ln, m in s['mel'][lb]:
                tr.add('lead', lead_note(m + mk, ln * tr.spb * 0.95, 'chill', 0.9), tr.at(b, beat))
                if part == 5:
                    tr.add('lead', lead_note(m + mk + 12, ln * tr.spb * 0.95, 'chill', 0.5), tr.at(b, beat))


def settings(part):
    return {
        'pad': dict(sweep=[(0, PAD_FC[part]), (99, PAD_FC[part])], sc=0.35, vol=0.55, rev=0.35),
        'bell': dict(vol=0.3, rev=0.5, delay=(0.75, 0.45, 0.5)),
        'bass': dict(vol=0.62 if part > 1 else 0.55, rev=0.02),
        'kick': dict(vol=0.9, rev=0.04),
        'snare': dict(vol=0.5, rev=0.65),
        'hats': dict(vol=0.6, rev=0.1),
        'perc': dict(vol=0.4, rev=0.2),
        'mar': dict(vol=0.34, rev=0.22, delay=(0.75, 0.45, 0.4)),
        'ep': dict(vol=0.42, rev=0.3, sc=0.25),
        'str': dict(vol=0.5, rev=0.45, sc=0.2),
        'lead': dict(vol=0.5, rev=0.4, delay=(0.75, 0.4, 0.35)),
        'arp': dict(vol=ARP_VOL.get(part, 0), rev=0.3, delay=(0.75, 0.5, 0.45),
                    sweep=[(0, ARP_FC.get(part, 1000)), (99, ARP_FC.get(part, 1000))]),
        'fx': dict(vol=0.45, rev=0.4),
    }


def render_part(s, part, gain):
    tr = Track(s['bpm'], BARS * 3, tail=4)
    arrange(tr, s, part, BARS * 3)
    m = tr.mix(settings(part), make_ir(3.2), gain=gain, fade=False)
    a, b = int(round(tr.at(BARS) * SR)), int(round(tr.at(2 * BARS) * SR))
    loop = m[:, a:b].copy()
    kx = int(0.02 * SR)
    w = np.linspace(0, 1, kx)
    loop[:, :kx] = m[:, b:b + kx] * (1 - w) + loop[:, :kx] * w
    return loop, tr.gain


def render_gate(s, gain):
    tr = Track(s['bpm'], 2, tail=4)
    k = s['key']
    notes, root = CHORDS[3]
    for m in notes:
        tr.add('pad', pad_note(m + k, 2 * tr.bar_s, wobble=9, att=0.2, rel=1.0), 0, gain=0.5)
    tr.add('bass', sub_bass(lo(root, k, 47), tr.bar_s, 0.7), 0)
    tr.add('fx', riser(2 * tr.bar_s, 250, 6000), 0)
    rc = crash(0.55, 2.4)[::-1]
    tr.add('fx', rc, tr.at(2) - len(rc) / SR)
    for i in range(16):
        tr.add('snare', snare(tone=200, dec=0.1), tr.at(1, i / 4), gain=0.15 + 0.6 * (i / 15) ** 2)
    tr.add('fx', crash(0.6), tr.at(2))
    tr.add('kick', kick(f0=130, f1=46, dec=0.5, click=0.12), tr.at(2))
    st = settings(5)
    st['pad'] = dict(sweep=[(0, 2000), (2, 7000)], vol=0.55, rev=0.4)
    return tr.mix(st, make_ir(3.2), gain=gain, fade=False)


def do_song(i):
    s = SONGS[i]
    np.random.seed(i)
    loops = {}
    loops[5], gain = render_part(s, 5, None)
    for p in (1, 2, 3, 4):
        loops[p], _ = render_part(s, p, gain)
    gate = render_gate(s, gain)
    os.makedirs('out/s5', exist_ok=True)
    for p, l in loops.items():
        wavfile.write(f'out/s5/{s["id"]}-w{p}.wav', SR, (l.T * 32767).astype(np.int16))
    wavfile.write(f'out/s5/{s["id"]}-gate.wav', SR, (gate.T * 32767).astype(np.int16))
    return s['id'], gain


if __name__ == '__main__':
    ids = [int(a) for a in sys.argv[1:]] or list(range(5))
    with Pool(2) as pool:
        for sid, g in pool.imap_unordered(do_song, ids):
            print('done', sid, round(g, 3), flush=True)
