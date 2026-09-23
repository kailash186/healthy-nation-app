/**
 * Domain model for Healthy Nation.
 *
 * Everything is keyed by `personId` so the same store can hold records for
 * the account owner and any family members they coordinate care for.
 * Replace `lib/data/store.ts` with an API-backed implementation to go live.
 */

export type ID = string;

export type Relationship = 'self' | 'child' | 'parent' | 'partner' | 'other';

export interface Person {
  id: ID;
  name: string;
  relationship: Relationship;
  dateOfBirth: string; // ISO date
  bloodType?: string;
  allergies: string[];
  conditions: string[];
  /** Two-letter monogram fallback when no photo */
  initials: string;
  color: string; // accent used for avatar/badges
}

export type ProviderKind = 'primary-care' | 'specialist' | 'dentist' | 'pharmacy' | 'therapist' | 'hospital';

export interface Provider {
  id: ID;
  name: string;
  kind: ProviderKind;
  specialty?: string;
  organisation?: string;
  phone?: string;
  address?: string;
  notes?: string;
  personIds: ID[]; // people this provider cares for
}

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';
export type AppointmentMode = 'in-person' | 'video' | 'phone';

export interface Appointment {
  id: ID;
  personId: ID;
  providerId: ID;
  title: string;
  startsAt: string; // ISO datetime
  durationMin: number;
  mode: AppointmentMode;
  status: AppointmentStatus;
  location?: string;
  prepNotes?: string;
  summary?: string; // post-visit summary
}

export type TaskPriority = 'high' | 'medium' | 'low';

export interface CareTask {
  id: ID;
  personId: ID;
  title: string;
  description?: string;
  dueAt?: string; // ISO datetime
  priority: TaskPriority;
  completedAt?: string;
  linkedAppointmentId?: ID;
  linkedProviderId?: ID;
}

export type ReminderCadence = 'once' | 'daily' | 'weekly' | 'monthly';

export interface Reminder {
  id: ID;
  personId: ID;
  title: string;
  cadence: ReminderCadence;
  timeOfDay: string; // "HH:MM"
  daysOfWeek?: number[]; // 0 = Sunday, for weekly
  medication?: { name: string; dose: string };
  enabled: boolean;
  lastAcknowledgedAt?: string;
}

export type UpdateSeverity = 'info' | 'attention' | 'urgent';

export interface HealthUpdate {
  id: ID;
  personId: ID;
  title: string;
  body: string;
  severity: UpdateSeverity;
  createdAt: string;
  readAt?: string;
  source?: string; // e.g. "Lab results", "Dr. Kumar"
  linkedRecordId?: ID;
}

export type RecordKind = 'lab' | 'imaging' | 'visit-note' | 'vaccination' | 'prescription' | 'document';

export interface HealthRecord {
  id: ID;
  personId: ID;
  kind: RecordKind;
  title: string;
  date: string; // ISO date
  providerId?: ID;
  summary?: string;
  /** Optional structured values, e.g. lab panel */
  values?: { label: string; value: string; unit?: string; flag?: 'normal' | 'high' | 'low' }[];
  attachmentUrl?: string;
}

export interface Vital {
  id: ID;
  personId: ID;
  kind: 'heart-rate' | 'blood-pressure' | 'spo2' | 'glucose' | 'weight' | 'temperature';
  value: string;
  unit: string;
  recordedAt: string;
  trend?: 'up' | 'down' | 'stable';
  status: 'normal' | 'watch' | 'alert';
}

export interface Note {
  id: ID;
  personId: ID;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface CarePlan {
  id: ID;
  personId: ID;
  title: string;
  goal: string;
  providerId?: ID;
  startedAt: string;
  reviewAt?: string;
  steps: { id: ID; label: string; done: boolean }[];
}

export interface HealthData {
  people: Person[];
  providers: Provider[];
  appointments: Appointment[];
  tasks: CareTask[];
  reminders: Reminder[];
  updates: HealthUpdate[];
  records: HealthRecord[];
  vitals: Vital[];
  notes: Note[];
  carePlans: CarePlan[];
}
