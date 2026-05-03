import { useMemo } from 'react';
import { C, POINT_RULES, FLAGS } from '../data.js';

// ─── design tokens ───────────────────────────────────────────────────────────

function mono(extra = {}) {
  return { fontFamily: "'JetBrains Mono', ui-monospace, monospace", ...extra };
}

const ROUNDS = ['GS-1', 'GS-2', 'GS-3', 'R16', 'QF', 'SF', 'F'];

// ─── mock standings (used until real scoring is wired up) ────────────────────

const MOCK_STANDINGS = [
  { name: 'Bea',  pts: 28, gf: 14, ga: 6,  alive: 4, trend: '+5', out: false },
  { name: 'Cai',  pts: 24, gf: 12, ga: 8,  alive: 3, trend: '+2', out: false },
  { name: 'Dani', pts: 21, gf: 10, ga: 5,  alive: 3, trend: '+3', out: false },
  { name: 'Alex', pts: 19, gf: 11, ga: 9,  alive: 2, trend: '+1', out: false },
  { name: 'Hana', pts: 17, gf:  9, ga: 7,  alive: 2, trend:  '0', out: false },
  { name: 'Eli',  pts: 14, gf:  8, ga: 10, alive: 2, trend: '+2', out: false },
  { name: 'Jo',   pts: 13, gf:  7, ga: 8,  alive: 2, trend: '+1', out: false },
  { name: 'Mae',  pts: 11, gf:  6, ga: 9,  alive: 1, trend:  '0', out: false },
  { name: 'Fran', pts: 10, gf:  5, ga: 7,  alive: 1, trend: '+1', out: false },
  { name: 'Gus',  pts:  9, gf:  6, ga: 11, alive: 1, trend: '−1', out: false },
  { name: 'Ines', pts:  8, gf:  4, ga: 9,  alive: 1, trend:  '0', out: false },
  { name: 'Kim',  pts:  7, gf:  5, ga: 10, alive: 1, trend:  '0', out: false },
  { name: 'Leo',  pts:  5, gf:  3, ga: 8,  alive: 1, trend: '−1', out: false },
  { name: 'Nik',  pts:  3, gf:  2, ga: 11, alive: 0, trend: '−2', out: true  },
  { name: 'Owe',  pts:  2, gf:  2, ga: 12, alive: 0, trend: '−1', out: true  },
  { name: 'Pat',  pts:  1, gf:  1, ga: 13, alive: 0, trend: '−2', out: true  },
];

function makeTrajectories(standings) {
  const out = {};
  standings.forEach((s, i) => {
    const stops = ROUNDS.length;
    const aliveAt = s.out ? Math.min(stops - 2, 3) : stops - 1;
    const path = [0];
    let acc = 0;
    for (let k = 1; k < stops; k++) {
      if (k > aliveAt) { path.push(acc); continue; }
      const remainSteps = aliveAt - k + 1;
      const remainPts = s.pts - acc;
      const gain = Math.max(0, Math.round(remainPts / remainSteps + ((i + k) % 3 - 1)));
      acc += gain;
      path.push(acc);
    }
    path[path.length - 1] = s.out ? path[aliveAt] : s.pts;
    out[s.name] = path;
  });
  return out;
}

// ─── Sparkline ───────────────────────────────────────────────────────────────

function Sparkline({ data, max, w = 70, h = 22, color = C.ink }) {
  if (!data || data.length < 2) return <svg width={w} height={h} />;
  const stepX = w / (data.length - 1);
  const pts = data.map((v, i) => `${(i * stepX).toFixed(1)},${(h - (v / Math.max(max, 1)) * h).toFixed(1)}`).join(' ');
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

// ─── PointsChart ─────────────────────────────────────────────────────────────

function PointsChart({ trajectories, w, h }) {
  const padL = 36, padR = 20, padT = 14, padB = 28;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const allPts = Object.values(trajectories).flat();
  const maxPts = Math.max(...allPts, 1);
  const yTicks = [0, 5, 10, 15, 20, 25, 30].filter(t => t <= maxPts + 5);
  const stepX = innerW / (ROUNDS.length - 1);

  const highlight = ['Bea', 'Cai', 'Dani'];
  const dim = Object.keys(trajectories).filter(n => !highlight.includes(n));

  const lineFor = (name, color, width = 1) => {
    const data = trajectories[name];
    if (!data) return null;
    const pts = data.map((v, i) =>
      `${(padL + i * stepX).toFixed(1)},${(padT + innerH - (v / maxPts) * innerH).toFixed(1)}`
    ).join(' ');
    return <polyline key={name} points={pts} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" strokeLinecap="round" />;
  };

  return (
    <svg width={w} height={h} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map(t => {
        const y = padT + innerH - (t / maxPts) * innerH;
        return (
          <g key={t}>
            <line x1={padL} y1={y} x2={padL + innerW} y2={y} stroke={C.line2} strokeDasharray="2 3" />
            <text x={padL - 6} y={y + 3} textAnchor="end" fontFamily="JetBrains Mono" fontSize="9" fill={C.ink3}>{t}</text>
          </g>
        );
      })}
      {ROUNDS.map((r, i) => (
        <text key={r} x={padL + i * stepX} y={h - 10} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill={C.ink2}>{r}</text>
      ))}
      <line x1={padL} y1={padT + innerH} x2={padL + innerW} y2={padT + innerH} stroke={C.ink} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + innerH} stroke={C.ink} />
      {dim.map(n => lineFor(n, C.line, 1))}
      {lineFor('Dani', '#8a8a8a', 2)}
      {lineFor('Cai',  '#4a4a4a', 2.25)}
      {lineFor('Bea',  '#1a1a1a', 2.5)}
      {highlight.map((n, idx) => {
        const data = trajectories[n];
        if (!data) return null;
        const x = padL + (data.length - 1) * stepX;
        const y = padT + innerH - (data[data.length - 1] / maxPts) * innerH;
        const color = idx === 0 ? '#1a1a1a' : idx === 1 ? '#4a4a4a' : '#8a8a8a';
        return (
          <g key={n}>
            <circle cx={x} cy={y} r={3.5} fill={color} />
            <text x={x + 6} y={y + 3} fontFamily="JetBrains Mono" fontSize="10" fill={color} fontWeight="600">
              {n} {data[data.length - 1]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── ScoreboardPage ──────────────────────────────────────────────────────────

export default function ScoreboardPage({ state, dispatch }) {
  const trajectories = useMemo(() => makeTrajectories(MOCK_STANDINGS), []);
  const sorted = [...MOCK_STANDINGS].sort((a, b) => b.pts - a.pts);
  const maxSpark = useMemo(() => Math.max(...Object.values(trajectories).flat(), 1), [trajectories]);

  return (
    <div style={{ padding: 16, minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: C.paper, border: '1px solid ' + C.ink }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 22, height: 22, border: '1.5px solid ' + C.ink, borderRadius: '50%' }} />
          <div style={{ ...mono(), fontWeight: 600, letterSpacing: '0.06em', fontSize: 13 }}>WC DRAW MACHINE</div>
          <div style={{ ...mono(), color: C.ink3, fontSize: 11 }}>· page 2 of 2 · scoreboard</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ ...mono(), fontSize: 11, color: C.ink2 }}>round in play: <strong>QF</strong> · 4 of 7</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div
              style={{ ...mono(), padding: '6px 10px', fontSize: 11, background: C.paper, border: '1px solid ' + C.line, cursor: 'pointer' }}
              onClick={() => dispatch({ type: 'SET_PAGE', page: 'draw' })}
            >
              1 · DRAW ✓
            </div>
            <div style={{ ...mono(), padding: '6px 10px', fontSize: 11, background: C.paper2, border: '1px solid ' + C.ink }}>2 · SCOREBOARD</div>
          </div>
        </div>
      </div>

      {/* main grid: rules (L) — leaderboard + chart (R, stacked) */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '280px 1fr', gap: 12, minHeight: 0 }}>

        {/* LEFT — points reference */}
        <div style={{ background: C.paper, border: '1px solid ' + C.ink, padding: 12, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
          <div style={{ ...mono(), fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.ink2 }}>Points · how scoring works</div>
          <hr style={{ border: 0, borderTop: '1px dashed ' + C.line2 }} />
          <div style={{ ...mono(), fontSize: 10, color: C.ink3, lineHeight: 1.5 }}>
            Each of your 4 countries scores points every round. When a country is eliminated it stops scoring.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, border: '1px solid ' + C.ink, marginTop: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: C.ink, color: C.paper }}>
              <span style={{ ...mono(), fontSize: 10, letterSpacing: '0.1em' }}>EVENT</span>
              <span style={{ ...mono(), fontSize: 10, letterSpacing: '0.1em' }}>PTS</span>
            </div>
            {POINT_RULES.map(rule => {
              const tone = rule.kind === 'pos' ? C.stockOk : rule.kind === 'neg' ? C.stockLow : C.stockMid;
              return (
                <div key={rule.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: C.paper, borderBottom: '1px solid ' + C.line2, fontSize: 12 }}>
                  <span>{rule.label}</span>
                  <span style={{ ...mono(), fontSize: 11, padding: '1px 6px', background: tone.bg, color: tone.fg, border: '1px solid ' + tone.line, fontWeight: 600 }}>{rule.value}</span>
                </div>
              );
            })}
          </div>
          <div style={{ ...mono(), fontSize: 10, color: C.ink3, marginTop: 'auto', lineHeight: 1.5 }}>
            <strong style={{ color: C.ink2 }}>Underdog</strong>: a Tier 3/4 country doubles all points.<br />
            <strong style={{ color: C.ink2 }}>Player Pick</strong>: bonus you nominate at draw time (TBD).
          </div>
        </div>

        {/* RIGHT — leaderboard + chart */}
        <div style={{ display: 'grid', gridTemplateRows: '1fr 300px', gap: 12, minHeight: 0 }}>

          {/* LEADERBOARD */}
          <div style={{ background: C.paper, border: '1px solid ' + C.ink, padding: 12, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 6 }}>
              <div style={{ ...mono(), fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.ink2 }}>Leaderboard · {sorted.length} players</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={{ ...mono(), fontSize: 9, padding: '2px 5px', background: C.stockOk.bg, color: C.stockOk.fg, border: '1px solid ' + C.stockOk.line }}>● alive</span>
                <span style={{ ...mono(), fontSize: 9, padding: '2px 5px', background: C.stockGone.bg, color: C.stockGone.fg, border: '1px solid ' + C.stockGone.line }}>● OUT (all teams eliminated)</span>
              </div>
            </div>
            <hr style={{ border: 0, borderTop: '1px dashed ' + C.line2 }} />
            <div style={{ display: 'grid', gridTemplateColumns: '34px 1fr 80px 55px 70px 55px 60px 80px', gap: 0, ...mono(), fontSize: 10, color: C.ink3, padding: '0 6px', letterSpacing: '0.05em' }}>
              <div>#</div>
              <div>PLAYER</div>
              <div style={{ textAlign: 'center' }}>STATUS</div>
              <div style={{ textAlign: 'right' }}>PTS</div>
              <div style={{ textAlign: 'right' }}>GF / GA</div>
              <div style={{ textAlign: 'right' }}>ALIVE</div>
              <div style={{ textAlign: 'right' }}>Δ ROUND</div>
              <div style={{ textAlign: 'right' }}>TREND</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
              {sorted.map((s, i) => {
                const rank = i + 1;
                const top = rank <= 3;
                const trendColor = s.trend.startsWith('−') ? C.stockLow.fg : s.trend === '0' ? C.ink3 : C.stockOk.fg;
                return (
                  <div key={s.name} style={{
                    display: 'grid',
                    gridTemplateColumns: '34px 1fr 80px 55px 70px 55px 60px 80px',
                    alignItems: 'center',
                    padding: '8px 6px',
                    background: s.out ? C.stockGone.bg : C.paper,
                    border: top ? '1.5px solid ' + C.ink : '1px solid ' + C.line,
                    fontSize: 13,
                    opacity: s.out ? 0.7 : 1,
                  }}>
                    <div style={{ ...mono(), fontWeight: 700, fontSize: 14 }}>{String(rank).padStart(2, '0')}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <div style={{
                        width: 22, height: 22, border: '1px solid ' + C.ink, borderRadius: '50%',
                        display: 'grid', placeItems: 'center', fontSize: 11, ...mono(),
                        background: top ? C.ink : C.paper2, color: top ? C.paper : C.ink, flexShrink: 0,
                      }}>{s.name[0]}</div>
                      <div style={{ fontWeight: 600, textDecoration: s.out ? 'line-through' : 'none' }}>{s.name}</div>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {Array.from({ length: 4 }).map((_, k) => (
                          <div key={k} style={{ width: 7, height: 10, border: '1px solid ' + C.line, background: k < s.alive ? C.ink : 'transparent' }} />
                        ))}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      {s.out
                        ? <span style={{ ...mono(), fontSize: 9, padding: '2px 6px', background: C.stockLow.bg, color: C.stockLow.fg, border: '1px solid ' + C.stockLow.line, fontWeight: 600 }}>OUT</span>
                        : <span style={{ ...mono(), fontSize: 9, padding: '2px 6px', background: C.stockOk.bg, color: C.stockOk.fg, border: '1px solid ' + C.stockOk.line }}>ALIVE</span>}
                    </div>
                    <div style={{ ...mono(), textAlign: 'right', fontWeight: 700, fontSize: 15 }}>{s.pts}</div>
                    <div style={{ ...mono(), textAlign: 'right', fontSize: 11, color: C.ink2 }}>{s.gf} <span style={{ color: C.ink3 }}>/</span> {s.ga}</div>
                    <div style={{ ...mono(), textAlign: 'right', fontSize: 11 }}>{s.alive}/4</div>
                    <div style={{ ...mono(), textAlign: 'right', fontSize: 11, color: trendColor, fontWeight: 600 }}>{s.trend}</div>
                    <div style={{ textAlign: 'right' }}>
                      <Sparkline data={trajectories[s.name]} max={maxSpark} w={70} h={22} color={s.out ? C.ink3 : C.ink} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CHART */}
          <div style={{ background: C.paper, border: '1px solid ' + C.ink, padding: 12, display: 'flex', flexDirection: 'column', gap: 6, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 6 }}>
              <div style={{ ...mono(), fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.ink2 }}>Cumulative points · by round</div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                {[['Bea', '#1a1a1a'], ['Cai', '#4a4a4a'], ['Dani', '#8a8a8a']].map(([n, col]) => (
                  <span key={n} style={{ ...mono(), fontSize: 10, color: C.ink3, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 14, height: 2, background: col, display: 'inline-block' }} />{n}
                  </span>
                ))}
                <span style={{ ...mono(), fontSize: 10, color: C.ink3, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 14, height: 1, background: C.line, display: 'inline-block' }} />others
                </span>
              </div>
            </div>
            <hr style={{ border: 0, borderTop: '1px dashed ' + C.line2 }} />
            <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <PointsChart trajectories={trajectories} w={920} h={210} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
