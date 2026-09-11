export function releaseYear(dateString) {
  if (!dateString) return '—';
  const year = dateString.split('-')[0];
  return year || '—';
}

export function formatRating(value) {
  if (!value && value !== 0) return '—';
  return value.toFixed(1);
}

export function formatRuntime(minutes) {
  if (!minutes) return null;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins}m`;
}
