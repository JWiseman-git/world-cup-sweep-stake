export const PLAYERS = [
  'Alex', 'Bea', 'Cai', 'Dani',
];

export const TIERS = [
  { id: 1, label: 'Tier 1', sub: 'Favourites', countries: [
    'Argentina','France','Brazil','Spain','England','Germany',
    'Portugal','Netherlands','Italy','Colombia','Morocco','USA',
  ]},
  { id: 2, label: 'Tier 2', sub: 'Contenders', countries: [
    'Uruguay','Croatia','Belgium','Turkey','Denmark','Japan',
    'Mexico','Ecuador','S. Korea','Austria','Senegal','Serbia',
  ]},
  { id: 3, label: 'Tier 3', sub: 'Outsiders', countries: [
    'Paraguay','Switzerland','Poland','Nigeria','Iran','Australia',
    'Egypt','S. Africa','Saudi Arabia','Canada','Ivory Coast','DR Congo',
  ]},
  { id: 4, label: 'Tier 4', sub: 'Long shots', countries: [
    'Tunisia','Iraq','Jordan','Mali','Costa Rica','Panama',
    'Honduras','New Zealand','Venezuela','Scotland','Hungary','Uzbekistan',
  ]},
];

export const FLAGS = {
  'Argentina':    '🇦🇷',
  'France':       '🇫🇷',
  'Brazil':       '🇧🇷',
  'Spain':        '🇪🇸',
  'England':      '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Germany':      '🇩🇪',
  'Portugal':     '🇵🇹',
  'Netherlands':  '🇳🇱',
  'Italy':        '🇮🇹',
  'Colombia':     '🇨🇴',
  'Morocco':      '🇲🇦',
  'USA':          '🇺🇸',
  'Uruguay':      '🇺🇾',
  'Croatia':      '🇭🇷',
  'Belgium':      '🇧🇪',
  'Turkey':       '🇹🇷',
  'Denmark':      '🇩🇰',
  'Japan':        '🇯🇵',
  'Mexico':       '🇲🇽',
  'Ecuador':      '🇪🇨',
  'S. Korea':     '🇰🇷',
  'Austria':      '🇦🇹',
  'Senegal':      '🇸🇳',
  'Serbia':       '🇷🇸',
  'Paraguay':     '🇵🇾',
  'Switzerland':  '🇨🇭',
  'Poland':       '🇵🇱',
  'Nigeria':      '🇳🇬',
  'Iran':         '🇮🇷',
  'Australia':    '🇦🇺',
  'Egypt':        '🇪🇬',
  'S. Africa':    '🇿🇦',
  'Saudi Arabia': '🇸🇦',
  'Canada':       '🇨🇦',
  'Ivory Coast':  '🇨🇮',
  'DR Congo':     '🇨🇩',
  'Tunisia':      '🇹🇳',
  'Iraq':         '🇮🇶',
  'Jordan':       '🇯🇴',
  'Mali':         '🇲🇱',
  'Costa Rica':   '🇨🇷',
  'Panama':       '🇵🇦',
  'Honduras':     '🇭🇳',
  'New Zealand':  '🇳🇿',
  'Venezuela':    '🇻🇪',
  'Scotland':     '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'Hungary':      '🇭🇺',
  'Uzbekistan':   '🇺🇿',
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
  if (remaining === 3) return C.stockOk;
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

export const COUNTRY_CODES = {
  'Argentina': 'ar', 'France': 'fr', 'Brazil': 'br', 'Spain': 'es',
  'England': 'gb-eng', 'Germany': 'de', 'Portugal': 'pt', 'Netherlands': 'nl',
  'Italy': 'it', 'Colombia': 'co', 'Morocco': 'ma', 'USA': 'us',
  'Uruguay': 'uy', 'Croatia': 'hr', 'Belgium': 'be', 'Turkey': 'tr',
  'Denmark': 'dk', 'Japan': 'jp', 'Mexico': 'mx', 'Ecuador': 'ec',
  'S. Korea': 'kr', 'Austria': 'at', 'Senegal': 'sn', 'Serbia': 'rs',
  'Paraguay': 'py', 'Switzerland': 'ch', 'Poland': 'pl', 'Nigeria': 'ng',
  'Iran': 'ir', 'Australia': 'au', 'Egypt': 'eg', 'S. Africa': 'za',
  'Saudi Arabia': 'sa', 'Canada': 'ca', 'Ivory Coast': 'ci', 'DR Congo': 'cd',
  'Tunisia': 'tn', 'Iraq': 'iq', 'Jordan': 'jo', 'Mali': 'ml',
  'Costa Rica': 'cr', 'Panama': 'pa', 'Honduras': 'hn', 'New Zealand': 'nz',
  'Venezuela': 've', 'Scotland': 'gb-sct', 'Hungary': 'hu', 'Uzbekistan': 'uz',
};

export function flagUrl(country, width = 40) {
  const code = COUNTRY_CODES[country];
  return code ? `https://flagcdn.com/w${width}/${code}.png` : null;
}

export const MAX_PICKS_PER_COUNTRY = 3;
export const NUM_PLAYERS = PLAYERS.length; // 16
export const TOTAL_PICKS = NUM_PLAYERS * TIERS.length; // 64
