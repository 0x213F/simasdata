// Helper function to format timestamp for vertical display
export function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const month = date.toLocaleDateString(undefined, { month: 'short' }).toUpperCase();
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month} ${day} ${year}`;
}