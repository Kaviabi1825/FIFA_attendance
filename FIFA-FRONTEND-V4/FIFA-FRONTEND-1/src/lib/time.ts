// Time utilities with IST (Asia/Kolkata) support

export const toYmd = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${da}`;
};

export const toHms = (d: Date): string => {
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
};

export const toIsoLocalSeconds = (d: Date): string => `${toYmd(d)}T${toHms(d)}`;

// Returns a Date that represents the current time in IST by translating wall-clock components
export const nowInISTDate = (): Date => {
  try {
    // Use Intl to get parts for Asia/Kolkata reliably
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
    });
    const parts = fmt.formatToParts(new Date());
    const get = (t: Intl.DateTimeFormatPartTypes) => Number(parts.find(p => p.type === t)?.value || '0');
    const year = get('year');
    const month = get('month');
    const day = get('day');
    const hour = get('hour');
    const minute = get('minute');
    const second = get('second');
    return new Date(year, month - 1, day, hour, minute, second, 0);
  } catch {
    // Fallback: add fixed offset 5:30 from UTC
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utc + (5.5 * 3600000));
  }
};

export const nowISTYmd = (): string => toYmd(nowInISTDate());
export const nowISTIsoSeconds = (): string => toIsoLocalSeconds(nowInISTDate());
