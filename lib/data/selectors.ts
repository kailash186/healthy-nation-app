import type { Appointment, CareTask, HealthData, HealthUpdate, ID, Reminder } from './types';

const DAY = 24 * 60 * 60 * 1000;

export const byPerson = <T extends { personId: ID }>(items: T[], personId: ID | null) =>
  personId ? items.filter((i) => i.personId === personId) : items;

export const isOverdue = (task: CareTask, now = new Date()) =>
  !task.completedAt && !!task.dueAt && new Date(task.dueAt).getTime() < now.getTime();

export const isDueToday = (iso: string | undefined, now = new Date()) => {
  if (!iso) return false;
  const d = new Date(iso);
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
};

export function upcomingAppointments(data: HealthData, personId: ID | null, now = new Date()): Appointment[] {
  return byPerson(data.appointments, personId)
    .filter((a) => a.status === 'scheduled' && new Date(a.startsAt).getTime() >= now.getTime() - 60 * 60 * 1000)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

export function pastAppointments(data: HealthData, personId: ID | null, now = new Date()): Appointment[] {
  return byPerson(data.appointments, personId)
    .filter((a) => a.status !== 'scheduled' || new Date(a.startsAt).getTime() < now.getTime() - 60 * 60 * 1000)
    .sort((a, b) => b.startsAt.localeCompare(a.startsAt));
}

export function openTasks(data: HealthData, personId: ID | null): CareTask[] {
  const rank = { high: 0, medium: 1, low: 2 } as const;
  return byPerson(data.tasks, personId)
    .filter((t) => !t.completedAt)
    .sort((a, b) => {
      const ao = isOverdue(a) ? 0 : 1;
      const bo = isOverdue(b) ? 0 : 1;
      if (ao !== bo) return ao - bo;
      if (rank[a.priority] !== rank[b.priority]) return rank[a.priority] - rank[b.priority];
      return (a.dueAt ?? '9').localeCompare(b.dueAt ?? '9');
    });
}

export function completedTasks(data: HealthData, personId: ID | null): CareTask[] {
  return byPerson(data.tasks, personId)
    .filter((t) => !!t.completedAt)
    .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''));
}

export function unreadUpdates(data: HealthData, personId: ID | null): HealthUpdate[] {
  const rank = { urgent: 0, attention: 1, info: 2 } as const;
  return byPerson(data.updates, personId)
    .filter((u) => !u.readAt)
    .sort((a, b) => rank[a.severity] - rank[b.severity] || b.createdAt.localeCompare(a.createdAt));
}

export function allUpdates(data: HealthData, personId: ID | null): HealthUpdate[] {
  return byPerson(data.updates, personId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Reminders that fire today, sorted by time; includes whether already acknowledged today. */
export function todaysReminders(data: HealthData, personId: ID | null, now = new Date()) {
  const dow = now.getDay();
  return byPerson(data.reminders, personId)
    .filter((r) => r.enabled && (r.cadence !== 'weekly' || (r.daysOfWeek ?? []).includes(dow)))
    .map((r) => ({ reminder: r, done: isDueToday(r.lastAcknowledgedAt, now) }))
    .sort((a, b) => a.reminder.timeOfDay.localeCompare(b.reminder.timeOfDay));
}

export type AttentionItem =
  | { kind: 'update'; id: ID; personId: ID; title: string; detail: string; urgency: 0 | 1 | 2; href: string }
  | { kind: 'task'; id: ID; personId: ID; title: string; detail: string; urgency: 0 | 1 | 2; href: string }
  | { kind: 'appointment'; id: ID; personId: ID; title: string; detail: string; urgency: 0 | 1 | 2; href: string }
  | { kind: 'reminder'; id: ID; personId: ID; title: string; detail: string; urgency: 0 | 1 | 2; href: string };

/**
 * The single ranked list the dashboard leads with.
 * Urgency 0 = act now, 1 = today, 2 = soon.
 */
export function needsAttention(data: HealthData, personId: ID | null, now = new Date()): AttentionItem[] {
  const items: AttentionItem[] = [];

  for (const u of unreadUpdates(data, personId)) {
    if (u.severity === 'info') continue;
    items.push({
      kind: 'update',
      id: u.id,
      personId: u.personId,
      title: u.title,
      detail: u.source ?? 'Update',
      urgency: u.severity === 'urgent' ? 0 : 1,
      href: `/updates/${u.id}`,
    });
  }

  for (const t of openTasks(data, personId)) {
    const overdue = isOverdue(t, now);
    const today = isDueToday(t.dueAt, now);
    if (!overdue && !today && t.priority !== 'high') continue;
    items.push({
      kind: 'task',
      id: t.id,
      personId: t.personId,
      title: t.title,
      detail: overdue ? 'Overdue' : today ? 'Due today' : 'High priority',
      urgency: overdue ? 0 : today ? 1 : 2,
      href: `/tasks/${t.id}`,
    });
  }

  for (const a of upcomingAppointments(data, personId, now)) {
    const hours = (new Date(a.startsAt).getTime() - now.getTime()) / (60 * 60 * 1000);
    if (hours > 48) continue;
    items.push({
      kind: 'appointment',
      id: a.id,
      personId: a.personId,
      title: a.title,
      detail: hours < 24 ? 'Within 24 hours' : 'Tomorrow',
      urgency: hours < 24 ? 1 : 2,
      href: `/appointments/${a.id}`,
    });
  }

  for (const { reminder, done } of todaysReminders(data, personId, now)) {
    if (done) continue;
    const [h, m] = reminder.timeOfDay.split(':').map(Number);
    const due = new Date(now);
    due.setHours(h, m, 0, 0);
    if (due.getTime() > now.getTime()) continue; // not yet due
    items.push({
      kind: 'reminder',
      id: reminder.id,
      personId: reminder.personId,
      title: reminder.medication ? `${reminder.medication.name} ${reminder.medication.dose}` : reminder.title,
      detail: `Reminder \u00b7 ${reminder.timeOfDay}`,
      urgency: 1,
      href: '/reminders',
    });
  }

  return items.sort((a, b) => a.urgency - b.urgency);
}

export function nextAppointment(data: HealthData, personId: ID | null, now = new Date()) {
  return upcomingAppointments(data, personId, now)[0];
}

export function personById(data: HealthData, id: ID) {
  return data.people.find((p) => p.id === id);
}

export function providerById(data: HealthData, id: ID | undefined) {
  return id ? data.providers.find((p) => p.id === id) : undefined;
}

export function daysUntil(iso: string, now = new Date()) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const target = new Date(iso);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - start.getTime()) / DAY);
}

export function latestVitals(data: HealthData, personId: ID | null) {
  const seen = new Map<string, (typeof data.vitals)[number]>();
  for (const v of byPerson(data.vitals, personId).sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))) {
    const key = `${v.personId}:${v.kind}`;
    if (!seen.has(key)) seen.set(key, v);
  }
  return [...seen.values()];
}

export function reminderCountForPerson(reminders: Reminder[], personId: ID) {
  return reminders.filter((r) => r.personId === personId && r.enabled).length;
}
