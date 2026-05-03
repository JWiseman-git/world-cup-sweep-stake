export const PLAYERS = [
  'Alex', 'Bea', 'Cai', 'Dani', 'Eli', 'Fran', 'Gus', 'Hana',
  'Ines', 'Jo', 'Kim', 'Leo', 'Mae', 'Nik', 'Owe', 'Pat',
];

export const TIERS = [
  { id: 1, label: 'Tier 1', sub: 'Favourites',  countries: ['Brazil','Argentina','France','England','Spain','Germany','Portugal','Netherlands'] },
  { id: 2, label: 'Tier 2', sub: 'Contenders',  countries: ['Italy','Belgium','Croatia','Uruguay','Denmark','Switzerland','Mexico','USA'] },
  { id: 3, label: 'Tier 3', sub: 'Outsiders',   countries: ['Japan','S. Korea','Senegal','Morocco','Poland','Serbia','Ecuador','Australia'] },
  { id: 4, label: 'Tier 4', sub: 'Long shots',  countries: ['Iran','Tunisia','Cameroon','Ghana','Saudi Arabia','Qatar','Costa Rica','Canada'] },
];

export const FLAGS = {
  'Brazil':       '🇧🇷',
  'Argentina':    '🇦🇷',
  'France':       '🇫🇷',
  'England':      '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Spain':        '🇪🇸',
  'Germany':      '🇩🇪',
  'Portugal':     '🇵🇹',
  'Netherlands':  '🇳🇱',
  'Italy':        '🇮🇹',
  'Belgium':      '🇧🇪',
  'Croatia':      '🇭🇷',
  'Uruguay':      '🇺🇾',
  'Denmark':      '🇩🇰',
  'Switzerland':  '🇨🇭',
  'Mexico':       '🇲🇽',
  'USA':          '🇺🇸',
  'Japan':        '🇯🇵',
  'S. Korea':     '🇰🇷',
  'Senegal':      '🇸🇳',
  'Morocco':      '🇲🇦',
  'Poland':       '🇵🇱',
  'Serbia':       '🇷🇸',
  'Ecuador':      '🇪🇨',
  'Australia':    '🇦🇺',
  'Iran':         '🇮🇷',
  'Tunisia':      '🇹🇳',
  'Cameroon':     '🇨🇲',
  'Ghana':        '🇬🇭',
  'Saudi Arabia': '🇸🇦',
  'Qatar':        '🇶🇦',
  'Costa Rica':   '🇨🇷',
  'Canada':       '🇨🇦',
};

export const POINT_RULES = [
  { label: 'Goal Scored',              value: '+1', kind: 'pos' },
  { label: 'Clean Sheet',              value: '+1', kind: 'pos' },
  { label: 'Progressing (round)',      value: '+3', kind: 'pos' },
  { label: 'Penalty Save (open)',      value: '+1', kind: 'pos' },
  { label: 'Winning ET goal',          value: '+1', kind: 'pos' },
  { label: 'Goal Conceded',            value: '−1', kind: 'neg' },
  { label: 'Red Card',                 value: '−1', kind: 'neg' },
  { label: 'Own Goal',                 value: '−1', kind: 'neg' },
  { label: 'Bottling it (lose final)', value: '−3', kind: 'neg' },
  { label: 'Underdog bonus',           value: '×2', kind: 'special' },
  { label: 'Player Pick',              value: '*',  kind: 'special' },
];

export const C = {
  paper:      '#fafafa',
  paper2:     '#f1f1f1',
  bg:         '#ececec',
  ink:        '#1a1a1a',
  ink2:       '#4a4a4a',
  ink3:       '#8a8a8a',
  line:       '#c4c4c4',
  line2:      '#e4e4e4',
  accent:     '#d8d8d8',
  accentSoft: '#ededed',
  stockOk:   { fg: '#1f6b3a', bg: '#e3f1e8', line: '#bcdcc7' },
  stockMid:  { fg: '#8a5a00', bg: '#fbf1d9', line: '#e9d39a' },
  stockLow:  { fg: '#a83232', bg: '#fbe3e3', line: '#e9b5b5' },
  stockGone: { fg: '#8a8a8a', bg: '#ececec', line: '#d4d4d4' },
};

export function stockTone(remaining) {
  if (remaining >= 3) return C.stockOk;
  if (remaining === 2) return C.stockMid;
  if (remaining === 1) return C.stockLow;
  return C.stockGone;
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const MAX_PICKS_PER_COUNTRY = 4;
export const NUM_PLAYERS = PLAYERS.length; // 16
export const TOTAL_PICKS = NUM_PLAYERS * TIERS.length; // 64
