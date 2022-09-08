export function formateDate(date: string): string {
  let [month, day, year] = date.split('/');
  return `${padLeadingZeros(month, 2)}/${padLeadingZeros(day, 2)}/${year}`;
}

export function padLeadingZeros(
  content: number | string,
  length: number,
): string {
  return String(content).padStart(length, '0');
}

export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-z0-9]/gi, '_');
}
