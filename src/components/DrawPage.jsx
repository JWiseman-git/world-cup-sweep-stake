import { useRef, useCallback, useEffect } from 'react';
import { TIERS, C, stockTone, MAX_PICKS_PER_COUNTRY, NUM_PLAYERS, TOTAL_PICKS } from '../data.js';
import Flag from './Flag.jsx';

function mono(extra = {}) {
  return { fontFamily: "'JetBrains Mono', ui-monospace, monospace", ...extra };
}

// ─── PieWheel ────────────────────────────────────────────────────────────────

function PieWheel({ countries, countryPicks, rotation, isSpinning, resultCountry }) {
  const n = countries.length;
  const size = 340;
  const r = size / 2;
  const cx = r, cy = r;

  const segments = countries.map((country, i) => {
    const a0 = (i / n) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const remaining = MAX_PICKS_PER_COUNTRY - (countryPicks[country] || 0);
    const tone = stockTone(remaining);
    const isResult = country === resultCountry && !isSpinning;
    const aMid = (i + 0.5) / n * Math.PI * 2 - Math.PI / 2;
    const tx = cx + r * 0.62 * Math.cos(aMid);
    const ty = cy + r * 0.62 * Math.sin(aMid);
    const rotate = (aMid * 180) / Math.PI;
    return (
      <g key={country}>
        <path
          d={`M${cx},${cy} L${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1} Z`}
          fill={isResult ? C.accent : tone.bg}
          stroke={C.ink}
          strokeWidth="1"
        />
        <text
          x={tx} y={ty}
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(${rotate}, ${tx}, ${ty})`}
          fontSize={10}
          fontFamily="JetBrains Mono, monospace"
          fill={remaining === 0 ? C.ink3 : C.ink}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {country}
        </text>
      </g>
    );
  });

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? 'transform 3.5s cubic-bezier(0.05, 0.7, 0.3, 1)' : 'none',
          display: 'block',
        }}
      >
        {segments}
        <circle cx={cx} cy={cy} r={14} fill={C.paper} stroke={C.ink} strokeWidth="1.5" />
      </svg>
      {/* pointer */}
      <div style={{
        position: 'absolute', left: '50%', top: -8,
        transform: 'translateX(-50%)',
        width: 0, height: 0,
        borderLeft: '8px solid transparent',
        borderRight: '8px solid transparent',
        borderTop: '16px solid ' + C.ink,
      }} />
    </div>
  );
}

// ─── DrawPage ────────────────────────────────────────────────────────────────

export default function DrawPage({ state, dispatch, derived }) {
  const spinTimeoutRef = useRef(null);
  const activePlayerRef = useRef(null);
  const { currentPlayer, currentTier, totalDone } = derived;
  const { picks, countryPicks, wheelRotation, wheelSpinning, currentResult, drawComplete, playerOrder } = state;

  const availableCountries = currentTier.countries.filter(
    c => (countryPicks[c] || 0) < MAX_PICKS_PER_COUNTRY
  );

  const handleSpin = useCallback(() => {
    if (wheelSpinning || drawComplete) return;
    if (availableCountries.length === 0) return;

    const targetCountry = availableCountries[Math.floor(Math.random() * availableCountries.length)];
    const targetIdx = currentTier.countries.indexOf(targetCountry);
    const n = currentTier.countries.length;

    // Compute rotation so targetIdx ends up at the pointer (12 o'clock)
    const targetCenterAngle = (targetIdx + 0.5) / n * 360;
    const neededMod = (360 - targetCenterAngle % 360 + 360) % 360;
    const currentMod = ((wheelRotation % 360) + 360) % 360;
    let delta = neededMod - currentMod;
    if (delta <= 0) delta += 360;
    const newRotation = wheelRotation + delta + 360 * 7;

    dispatch({ type: 'SPIN_START', rotation: newRotation });

    if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    spinTimeoutRef.current = setTimeout(() => {
      dispatch({ type: 'SPIN_END', country: targetCountry });
    }, 3500);
  }, [wheelSpinning, drawComplete, availableCountries, currentTier, wheelRotation, dispatch]);

  const handleConfirm = useCallback(() => {
    if (!currentResult || wheelSpinning) return;
    dispatch({ type: 'CONFIRM' });
  }, [currentResult, wheelSpinning, dispatch]);

  useEffect(() => {
    activePlayerRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [state.currentPickIdx]);

  const tierPicksDone = Math.min(totalDone, (derived.tierIdx + 1) * NUM_PLAYERS);

  return (
    <div style={{ padding: 16, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 12, boxSizing: 'border-box' }}>

      {/* top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: C.paper, border: '1px solid ' + C.ink }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 22, height: 22, border: '1.5px solid ' + C.ink, borderRadius: '50%' }} />
          <div style={{ ...mono(), fontWeight: 600, letterSpacing: '0.06em', fontSize: 13 }}>WC DRAW MACHINE</div>
          <div style={{ ...mono(), color: C.ink3, fontSize: 11 }}>· page 1 of 2 · team draw</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ ...mono(), padding: '6px 10px', fontSize: 11, background: C.paper2, border: '1px solid ' + C.ink }}>1 · DRAW</div>
          <div
            style={{ ...mono(), padding: '6px 10px', fontSize: 11, background: C.paper, color: state.drawComplete ? C.ink : '#b8b8b8', border: '1px solid ' + C.line, cursor: state.drawComplete ? 'pointer' : 'default' }}
            onClick={() => state.drawComplete && dispatch({ type: 'SET_PAGE', page: 'scoreboard' })}
          >
            2 · SCOREBOARD {!state.drawComplete && '(locked)'}
          </div>
        </div>
      </div>

      {/* progress strip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 16px', background: C.paper, border: '1px solid ' + C.ink }}>
        <div style={{ ...mono(), fontSize: 11, color: C.ink2 }}>DRAW PROGRESS</div>
        <div style={{ flex: 1, height: 10, border: '1px solid ' + C.ink, display: 'flex', overflow: 'hidden' }}>
          {Array.from({ length: TOTAL_PICKS }).map((_, i) => (
            <div key={i} style={{
              flex: 1,
              background: i < totalDone ? C.ink : 'transparent',
              borderRight: i < TOTAL_PICKS - 1 ? '1px solid ' + C.line2 : 'none',
            }} />
          ))}
        </div>
        <div style={{ ...mono(), fontSize: 11 }}>{totalDone} / {TOTAL_PICKS} picks</div>
      </div>

      {/* main 3-panel */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '570px 1fr 440px', gap: 12, minHeight: 0 }}>

        {/* LEFT — players */}
        <div style={{ background: C.paper, border: '1px solid ' + C.ink, padding: 12, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ ...mono(), fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.ink2 }}>Players · {playerOrder.length}</div>
            <div style={{ ...mono(), fontSize: 10, color: C.ink3 }}>random order</div>
          </div>
          <hr style={{ border: 0, borderTop: '1px dashed ' + C.line2 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto', flex: 1, minHeight: 0 }}>
            {playerOrder.map((player, i) => {
              const isCurrent = player === currentPlayer && !drawComplete;
              const playerPicks = picks[player] || {};
              return (
                <div key={player} ref={isCurrent ? activePlayerRef : null} style={{
                  border: isCurrent ? '1.5px solid ' + C.ink : '1px solid ' + C.line,
                  padding: '8px 10px',
                  background: isCurrent ? C.accentSoft : C.paper,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 18, height: 18, border: '1px solid ' + C.ink, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 10, ...mono() }}>
                        {player[0]}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{player}</div>
                      {isCurrent && (
                        <span style={{ ...mono(), fontSize: 9, padding: '1px 5px', background: C.ink, color: C.paper }}>UP NEXT</span>
                      )}
                    </div>
                    <div style={{ ...mono(), fontSize: 10, color: C.ink3 }}>{Object.keys(playerPicks).length}/4</div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                    {TIERS.map((tier) => {
                      const assigned = playerPicks[tier.id];
                      if (assigned) {
                        return (
                          <span key={tier.id} style={{ fontSize: 11, border: '1px solid ' + C.line, padding: '2px 6px', background: '#fff', display: 'inline-flex', alignItems: 'center' }}>
                            <Flag country={assigned} size={11} style={{ marginRight: 4 }} />{assigned}
                          </span>
                        );
                      }
                      return (
                        <span key={tier.id} style={{ fontSize: 11, border: '1px dashed ' + C.line, padding: '2px 6px', color: '#b8b8b8', ...mono() }}>—</span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MIDDLE — tier list */}
        <div style={{ background: C.paper, border: '1px solid ' + C.ink, padding: 12, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 6 }}>
            <div style={{ ...mono(), fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.ink2 }}>Available countries · by tier</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
              {[['×4–3', C.stockOk], ['×2', C.stockMid], ['×1 last!', C.stockLow], ['×0 gone', C.stockGone]].map(([label, t]) => (
                <span key={label} style={{ ...mono(), fontSize: 9, padding: '2px 5px', background: t.bg, color: t.fg, border: '1px solid ' + t.line }}>{label}</span>
              ))}
            </div>
          </div>
          <hr style={{ border: 0, borderTop: '1px dashed ' + C.line2 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, overflowY: 'auto' }}>
            {TIERS.map((tier, ti) => {
              const isCurrent = ti === derived.tierIdx && !drawComplete;
              const isDone = ti < derived.tierIdx;
              return (
                <div key={tier.id} style={{
                  border: isCurrent ? '1.5px solid ' + C.ink : '1px solid ' + C.line,
                  padding: 10,
                  background: isCurrent ? C.paper : C.paper2,
                  opacity: isDone ? 0.55 : 1,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8, gap: 6, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', minWidth: 0 }}>
                      <div style={{ ...mono(), fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>{tier.label}</div>
                      <div style={{ ...mono(), fontSize: 10, color: C.ink3, whiteSpace: 'nowrap' }}>{tier.sub}</div>
                      {isCurrent && <span style={{ ...mono(), fontSize: 9, padding: '1px 5px', background: C.ink, color: C.paper, whiteSpace: 'nowrap' }}>NOW</span>}
                      {isDone && <span style={{ ...mono(), fontSize: 9, padding: '1px 5px', background: C.stockOk.bg, color: C.stockOk.fg, border: '1px solid ' + C.stockOk.line, whiteSpace: 'nowrap' }}>DONE</span>}
                    </div>
                    <div style={{ ...mono(), fontSize: 10, color: C.ink3 }}>
                      {tier.countries.reduce((acc, c) => acc + Math.max(0, MAX_PICKS_PER_COUNTRY - (countryPicks[c] || 0)), 0)} picks left
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {tier.countries.map((country) => {
                      const picked = countryPicks[country] || 0;
                      const remaining = MAX_PICKS_PER_COUNTRY - picked;
                      const tone = stockTone(remaining);
                      return (
                        <div key={country} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '4px 6px', fontSize: 12,
                          background: tone.bg, border: '1px solid ' + tone.line,
                        }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', color: remaining === 0 ? C.ink3 : C.ink, textDecoration: remaining === 0 ? 'line-through' : 'none' }}>
                            <Flag country={country} size={12} style={{ marginRight: 4 }} />{country}
                          </span>
                          <span style={{ ...mono(), fontSize: 10, color: tone.fg, fontWeight: 600 }}>
                            ×{remaining}{remaining === 1 ? ' · last' : remaining === 0 ? '' : ' left'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — wheel */}
        <div style={{ background: C.paper, border: '1px solid ' + C.ink, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ ...mono(), fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.ink2 }}>
              {drawComplete ? 'Draw Complete!' : `Spinner · ${currentPlayer}'s turn`}
            </div>
            <div style={{ ...mono(), fontSize: 10, color: C.ink3 }}>
              {!drawComplete && `${currentTier.label} · pick ${(totalDone % NUM_PLAYERS) + 1} of ${NUM_PLAYERS}`}
            </div>
          </div>
          <hr style={{ border: 0, borderTop: '1px dashed ' + C.line2 }} />

          {/* tier cycle indicator */}
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
            {TIERS.map((t, ti) => {
              const isCurr = ti === derived.tierIdx && !drawComplete;
              const isDone = ti < derived.tierIdx;
              return (
                <div key={t.id} style={{
                  ...mono(), fontSize: 10, padding: '4px 8px',
                  border: isCurr ? '1.5px solid ' + C.ink : '1px solid ' + C.line,
                  background: isCurr ? C.paper : C.paper2,
                  color: isCurr ? C.ink : isDone ? C.stockOk.fg : C.ink3,
                }}>
                  T{t.id}{isCurr ? ' · now' : isDone ? ' ✓' : ''}
                </div>
              );
            })}
          </div>

          {/* result card */}
          <div style={{ border: '1.5px solid ' + C.ink, background: C.paper, padding: 12, display: 'flex', alignItems: 'center', gap: 14, minHeight: 80 }}>
            {currentResult ? (
              <>
                <Flag country={currentResult} size={52} style={{ borderRadius: 4 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...mono(), fontSize: 10, color: C.ink3, letterSpacing: '0.12em' }}>RESULT</div>
                  <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.1 }}>{currentResult}</div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4, flexWrap: 'wrap' }}>
                    {(() => {
                      const tier = TIERS.find(t => t.countries.includes(currentResult));
                      const remaining = MAX_PICKS_PER_COUNTRY - ((countryPicks[currentResult] || 0) + 1);
                      const tone = stockTone(remaining);
                      return (
                        <>
                          <span style={{ ...mono(), fontSize: 10, color: C.ink2 }}>{tier?.label} · {tier?.sub}</span>
                          <span style={{ ...mono(), fontSize: 9, padding: '1px 5px', background: tone.bg, color: tone.fg, border: '1px solid ' + tone.line }}>
                            ×{remaining} LEFT AFTER
                          </span>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </>
            ) : wheelSpinning ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ ...mono(), fontSize: 11, color: C.ink3, letterSpacing: '0.1em' }}>SPINNING…</div>
              </div>
            ) : drawComplete ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ ...mono(), fontSize: 11, color: C.ink2, letterSpacing: '0.1em' }}>ALL PICKS ASSIGNED</div>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ ...mono(), fontSize: 11, color: C.ink3, letterSpacing: '0.1em' }}>SPIN TO PICK</div>
              </div>
            )}
          </div>

          {/* wheel */}
          <div style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
            <PieWheel
              countries={currentTier.countries}
              countryPicks={countryPicks}
              rotation={wheelRotation}
              isSpinning={wheelSpinning}
              resultCountry={currentResult}
            />
          </div>

          {/* action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleSpin}
                disabled={wheelSpinning || drawComplete}
                style={{
                  flex: 1, padding: '12px', textAlign: 'center',
                  ...mono(), fontSize: 13, letterSpacing: '0.1em',
                  background: (wheelSpinning || drawComplete) ? C.paper2 : C.ink,
                  color: (wheelSpinning || drawComplete) ? C.ink3 : C.paper,
                  border: '1px solid ' + ((wheelSpinning || drawComplete) ? C.line : C.ink),
                  cursor: (wheelSpinning || drawComplete) ? 'default' : 'pointer',
                }}
              >
                SPIN
              </button>
              <button
                onClick={handleConfirm}
                disabled={!currentResult || wheelSpinning}
                style={{
                  flex: 1, padding: '12px', textAlign: 'center',
                  ...mono(), fontSize: 13, letterSpacing: '0.1em',
                  background: C.paper2,
                  color: (!currentResult || wheelSpinning) ? C.ink3 : C.ink,
                  border: '1px solid ' + ((!currentResult || wheelSpinning) ? C.line : C.ink),
                  cursor: (!currentResult || wheelSpinning) ? 'default' : 'pointer',
                }}
              >
                CONFIRM →
              </button>
            </div>
            <div style={{ ...mono(), fontSize: 10, color: C.ink3, textAlign: 'center' }}>
              spin to lock a country · confirm to assign and pass to next player
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
