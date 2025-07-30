export function formatLastSaved(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}