import { useReducer, useMemo } from 'react';
import { PLAYERS, TIERS, shuffle, MAX_PICKS_PER_COUNTRY, NUM_PLAYERS, TOTAL_PICKS } from './data.js';
import DrawPage from './components/DrawPage.jsx';
import ScoreboardPage from './components/ScoreboardPage.jsx';

function makeInitialState() {
  return {
    page: 'draw',
    playerOrder: shuffle([...PLAYERS]),
    // picks[player][tierId] = countryName
    picks: Object.fromEntries(PLAYERS.map(p => [p, {}])),
    // countryPicks[country] = times picked so far
    countryPicks: {},
    currentPickIdx: 0, // 0–63
    wheelRotation: 0,
    wheelSpinning: false,
    currentResult: null, // country name
    drawComplete: false,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, page: action.page };

    case 'SPIN_START':
      return {
        ...state,
        wheelSpinning: true,
        wheelRotation: action.rotation,
        currentResult: null,
      };

    case 'SPIN_END':
      return {
        ...state,
        wheelSpinning: false,
        currentResult: action.country,
      };

    case 'CONFIRM': {
      if (!state.currentResult) return state;
      const idx = state.currentPickIdx;
      const tierIdx = Math.floor(idx / NUM_PLAYERS);
      const tierId = TIERS[tierIdx].id;
      const player = state.playerOrder[idx % NUM_PLAYERS];
      const country = state.currentResult;

      const newPicks = {
        ...state.picks,
        [player]: { ...state.picks[player], [tierId]: country },
      };
      const prevCount = state.countryPicks[country] || 0;
      const newCountryPicks = { ...state.countryPicks, [country]: prevCount + 1 };
      const newPickIdx = idx + 1;
      const done = newPickIdx >= TOTAL_PICKS;

      return {
        ...state,
        picks: newPicks,
        countryPicks: newCountryPicks,
        currentPickIdx: newPickIdx,
        currentResult: null,
        wheelSpinning: false,
        drawComplete: done,
        page: done ? 'scoreboard' : 'draw',
      };
    }

    case 'RESET':
      return makeInitialState();

    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, null, makeInitialState);

  const derived = useMemo(() => {
    const idx = state.currentPickIdx;
    const tierIdx = Math.min(Math.floor(idx / NUM_PLAYERS), TIERS.length - 1);
    const playerIdx = idx % NUM_PLAYERS;
    const currentPlayer = state.playerOrder[playerIdx];
    const currentTier = TIERS[tierIdx];
    const totalDone = idx;
    return { tierIdx, playerIdx, currentPlayer, currentTier, totalDone };
  }, [state.currentPickIdx, state.playerOrder]);

  return (
    <div style={{ minHeight: '100vh', background: '#ececec' }}>
      {state.page === 'draw' ? (
        <DrawPage state={state} dispatch={dispatch} derived={derived} />
      ) : (
        <ScoreboardPage state={state} dispatch={dispatch} derived={derived} />
      )}
    </div>
  );
}
