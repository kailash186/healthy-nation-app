/**
 * Local-first store for Healthy Nation.
 *
 * Holds the whole `HealthData` graph in React state and persists it to
 * AsyncStorage (localStorage on web). Every mutation goes through a small,
 * explicit API so swapping in a remote backend later means re-implementing
 * this file, not touching screens.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { seedData } from './seed';
import type { CareTask, HealthData, HealthUpdate, ID, Note, Reminder } from './types';

const STORAGE_KEY = 'healthy-nation:data:v1';
const SELECTED_PERSON_KEY = 'healthy-nation:selected-person';

interface StoreValue {
  data: HealthData;
  ready: boolean;
  /** `null` means "everyone" */
  selectedPersonId: ID | null;
  setSelectedPersonId: (id: ID | null) => void;

  toggleTask: (id: ID) => void;
  addTask: (task: Omit<CareTask, 'id'>) => CareTask;
  toggleReminder: (id: ID) => void;
  acknowledgeReminder: (id: ID) => void;
  markUpdateRead: (id: ID) => void;
  markAllUpdatesRead: () => void;
  toggleCarePlanStep: (planId: ID, stepId: ID) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Note;
  resetToSeed: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export function HealthDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<HealthData>(seedData);
  const [selectedPersonId, setSelectedPersonIdState] = useState<ID | null>(null);
  const [ready, setReady] = useState(false);

  // Hydrate
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [raw, person] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(SELECTED_PERSON_KEY),
        ]);
        if (cancelled) return;
        if (raw) setData(JSON.parse(raw) as HealthData);
        if (person) setSelectedPersonIdState(person === 'all' ? null : person);
      } catch {
        // fall back to seed silently
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist
  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {});
  }, [data, ready]);

  const setSelectedPersonId = useCallback((id: ID | null) => {
    setSelectedPersonIdState(id);
    AsyncStorage.setItem(SELECTED_PERSON_KEY, id ?? 'all').catch(() => {});
  }, []);

  const update = useCallback((fn: (d: HealthData) => HealthData) => setData((d) => fn(d)), []);

  const toggleTask = useCallback(
    (id: ID) =>
      update((d) => ({
        ...d,
        tasks: d.tasks.map((t) =>
          t.id === id ? { ...t, completedAt: t.completedAt ? undefined : new Date().toISOString() } : t,
        ),
      })),
    [update],
  );

  const addTask = useCallback(
    (task: Omit<CareTask, 'id'>) => {
      const created: CareTask = { ...task, id: newId('t') };
      update((d) => ({ ...d, tasks: [created, ...d.tasks] }));
      return created;
    },
    [update],
  );

  const toggleReminder = useCallback(
    (id: ID) =>
      update((d) => ({
        ...d,
        reminders: d.reminders.map((r): Reminder => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
      })),
    [update],
  );

  const acknowledgeReminder = useCallback(
    (id: ID) =>
      update((d) => ({
        ...d,
        reminders: d.reminders.map((r) => (r.id === id ? { ...r, lastAcknowledgedAt: new Date().toISOString() } : r)),
      })),
    [update],
  );

  const markUpdateRead = useCallback(
    (id: ID) =>
      update((d) => ({
        ...d,
        updates: d.updates.map((u): HealthUpdate => (u.id === id && !u.readAt ? { ...u, readAt: new Date().toISOString() } : u)),
      })),
    [update],
  );

  const markAllUpdatesRead = useCallback(
    () =>
      update((d) => {
        const ts = new Date().toISOString();
        return { ...d, updates: d.updates.map((u) => (u.readAt ? u : { ...u, readAt: ts })) };
      }),
    [update],
  );

  const toggleCarePlanStep = useCallback(
    (planId: ID, stepId: ID) =>
      update((d) => ({
        ...d,
        carePlans: d.carePlans.map((p) =>
          p.id === planId ? { ...p, steps: p.steps.map((s) => (s.id === stepId ? { ...s, done: !s.done } : s)) } : p,
        ),
      })),
    [update],
  );

  const addNote = useCallback(
    (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
      const ts = new Date().toISOString();
      const created: Note = { ...note, id: newId('n'), createdAt: ts, updatedAt: ts };
      update((d) => ({ ...d, notes: [created, ...d.notes] }));
      return created;
    },
    [update],
  );

  const resetToSeed = useCallback(() => setData(seedData), []);

  const value = useMemo<StoreValue>(
    () => ({
      data,
      ready,
      selectedPersonId,
      setSelectedPersonId,
      toggleTask,
      addTask,
      toggleReminder,
      acknowledgeReminder,
      markUpdateRead,
      markAllUpdatesRead,
      toggleCarePlanStep,
      addNote,
      resetToSeed,
    }),
    [
      data,
      ready,
      selectedPersonId,
      setSelectedPersonId,
      toggleTask,
      addTask,
      toggleReminder,
      acknowledgeReminder,
      markUpdateRead,
      markAllUpdatesRead,
      toggleCarePlanStep,
      addNote,
      resetToSeed,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useHealthData(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useHealthData must be used inside <HealthDataProvider>');
  return ctx;
}
