import { format } from 'date-fns';

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return format(date, 'dd-MM-yyyy');
  } catch {
    return dateString;
  }
}

export function heightToMeters(height: string): string {
  const num = parseFloat(height);
  if (isNaN(num)) return 'Unknown';
  return (num / 100).toFixed(2) + 'm';
}

export function massToKg(mass: string): string {
  if (mass === 'unknown' || mass === 'n/a') return 'Unknown';
  return mass + ' kg';
}
