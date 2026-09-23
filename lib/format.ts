const DAY = 24 * 60 * 60 * 1000;

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }) {
  return new Date(iso).toLocaleDateString(undefined, opts);
}

export function formatLongDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export function formatTimeOfDay(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return formatTime(d.toISOString());
}

/** "Today, 10:30", "Tomorrow, 4:00 PM", "Fri 12 Sep, 11:00" */
export function formatWhen(iso: string, now = new Date()) {
  const d = new Date(iso);
  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((d.getTime() - startToday.getTime()) / DAY);
  const time = formatTime(iso);
  if (diffDays === 0) return `Today, ${time}`;
  if (diffDays === 1) return `Tomorrow, ${time}`;
  if (diffDays === -1) return `Yesterday, ${time}`;
  if (diffDays > 1 && diffDays < 7) return `${d.toLocaleDateString(undefined, { weekday: 'long' })}, ${time}`;
  return `${formatDate(iso, { weekday: 'short', day: 'numeric', month: 'short' })}, ${time}`;
}

/** "in 2 days", "3 days ago", "today" */
export function formatRelativeDays(iso: string, now = new Date()) {
  const d = new Date(iso);
  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);
  const target = new Date(d);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - startToday.getTime()) / DAY);
  if (diff === 0) return 'today';
  if (diff === 1) return 'tomorrow';
  if (diff === -1) return 'yesterday';
  if (diff > 0) return `in ${diff} days`;
  return `${Math.abs(diff)} days ago`;
}

export function formatAge(dob: string, now = new Date()) {
  const b = new Date(dob);
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age;
}

export function greeting(now = new Date()) {
  const h = now.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export const RELATIONSHIP_LABEL: Record<string, string> = {
  self: 'You',
  child: 'Child',
  parent: 'Parent',
  partner: 'Partner',
  other: 'Family',
};

export const PROVIDER_KIND_LABEL: Record<string, string> = {
  'primary-care': 'Primary care',
  specialist: 'Specialist',
  dentist: 'Dentist',
  pharmacy: 'Pharmacy',
  therapist: 'Therapist',
  hospital: 'Hospital',
};

export const RECORD_KIND_LABEL: Record<string, string> = {
  lab: 'Lab result',
  imaging: 'Imaging',
  'visit-note': 'Visit note',
  vaccination: 'Vaccination',
  prescription: 'Prescription',
  document: 'Document',
};

export const VITAL_LABEL: Record<string, string> = {
  'heart-rate': 'Heart rate',
  'blood-pressure': 'Blood pressure',
  spo2: 'SpO\u2082',
  glucose: 'Glucose',
  weight: 'Weight',
  temperature: 'Temperature',
};
