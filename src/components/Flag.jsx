import { flagUrl } from '../data.js';

export default function Flag({ country, size = 14, style = {} }) {
  const url = flagUrl(country, size <= 20 ? 40 : 80);
  if (!url) return <span style={{ fontSize: size, lineHeight: 1, flexShrink: 0, ...style }}>🏳</span>;
  return (
    <img
      src={url}
      alt={country}
      style={{ height: size, width: 'auto', borderRadius: 2, verticalAlign: 'middle', flexShrink: 0, ...style }}
    />
  );
}
