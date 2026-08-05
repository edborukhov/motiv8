import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SECTIONS, TRANSFORMATION_LENGTH } from "../constants/sections";

const STORAGE_KEY = "motif8_state_v1";

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function emptySectionsState() {
  const s = {};
  SECTIONS.forEach((sec) => (s[sec.key] = false));
  return s;
}

function defaultReminders() {
  const r = {};
  SECTIONS.forEach((sec) => {
    r[sec.key] = { enabled: !!sec.defaultTime, time: sec.defaultTime || "09:00" };
  });
  return r;
}

function defaultState() {
  return {
    lastOpenedDate: null,
    currentDay: 1,
    sections: emptySectionsState(),
    dietSub: { water: false, protein: false, vitamins: false, calories: false },
    dayLocked: false,
    pendingFailure: null, // { day, missedSections }
    pendingDay90: null, // { stats }
    history: [], // { day, date, completed, sectionsSnapshot }
    bestStreak: 0,
    totalResets: 0,
    notes: [], // { id, day, date, text }
    photos: [], // { id, day, date, uri }
    reminders: defaultReminders(),
  };
}

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [state, setState] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      let loaded = raw ? JSON.parse(raw) : defaultState();
      loaded = applyRollover(loaded);
      setState(loaded);
      setReady(true);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(loaded));
    })();
  }, []);

  const persist = useCallback(async (next) => {
    setState(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  // ---- Rollover: run once per app open. Decides if yesterday succeeded,
  // failed, or if this is the very first launch.
  function applyRollover(prev) {
    const today = todayString();
    const next = { ...prev };

    if (!next.lastOpenedDate) {
      // First ever launch: Day 1 begins now.
      next.lastOpenedDate = today;
      return next;
    }

    if (next.lastOpenedDate === today) {
      // Same calendar day as last open, nothing to roll over.
      return next;
    }

    // A new calendar day has started since we last opened the app.
    if (next.pendingFailure) {
      // Already showing a failure the user hasn't acknowledged yet.
      // Leave it exactly as is until they tap "start day 1 again".
      return next;
    }

    if (next.dayLocked) {
      // Yesterday was fully completed and locked. Advance to the next day.
      next.history.push({
        day: next.currentDay,
        date: next.lastOpenedDate,
        completed: true,
        sectionsSnapshot: next.sections,
      });

      if (next.currentDay >= TRANSFORMATION_LENGTH) {
        // Day 90 already handled at completion time in the UI, but as a
        // safety net if the app was closed before they saw it:
        next.pendingDay90 = buildDay90Stats(next);
      } else {
        next.currentDay = next.currentDay + 1;
        next.sections = emptySectionsState();
        next.dietSub = { water: false, protein: false, vitamins: false, calories: false };
        next.dayLocked = false;
      }
      next.lastOpenedDate = today;
      return next;
    }

    // Yesterday was NOT completed and NOT locked -> failure.
    const missed = SECTIONS.filter((s) => !next.sections[s.key]).map((s) => s.label);
    next.history.push({
      day: next.currentDay,
      date: next.lastOpenedDate,
      completed: false,
      sectionsSnapshot: next.sections,
    });
    next.bestStreak = Math.max(next.bestStreak, next.currentDay - 1);
    next.pendingFailure = { day: next.currentDay, missedSections: missed };
    next.lastOpenedDate = today;
    return next;
  }

  function buildDay90Stats(s) {
    const sectionsCompleted = s.history.reduce(
      (sum, h) => sum + Object.values(h.sectionsSnapshot).filter(Boolean).length,
      0
    );
    return {
      daysCompleted: TRANSFORMATION_LENGTH,
      totalResets: s.totalResets,
      sectionsCompleted,
      photosLogged: s.photos.length,
    };
  }

  // ---- Actions ----

  const toggleSection = useCallback(
    (key) => {
      if (!state || state.dayLocked || state.pendingFailure || state.pendingDay90) return;
      const nextSections = { ...state.sections, [key]: !state.sections[key] };
      persist({ ...state, sections: nextSections });
    },
    [state, persist]
  );

  const setDietSub = useCallback(
    (key, value) => {
      if (!state || state.dayLocked) return;
      const nextDietSub = { ...state.dietSub, [key]: value };
      const anyLogged = Object.values(nextDietSub).some(Boolean);
      const nextSections = { ...state.sections, diet: anyLogged };
      persist({ ...state, dietSub: nextDietSub, sections: nextSections });
    },
    [state, persist]
  );

  const addPhoto = useCallback(
    async (uri) => {
      if (!state || state.dayLocked) return;
      const photo = { id: `${Date.now()}`, day: state.currentDay, date: todayString(), uri };
      const nextPhotos = [...state.photos, photo];
      const nextSections = { ...state.sections, progress: true };
      persist({ ...state, photos: nextPhotos, sections: nextSections });
    },
    [state, persist]
  );

  const addNote = useCallback(
    (text) => {
      if (!state || !text.trim()) return;
      const note = { id: `${Date.now()}`, day: state.currentDay, date: todayString(), text: text.trim() };
      persist({ ...state, notes: [note, ...state.notes] });
    },
    [state, persist]
  );

  // Called when the UI detects all 8 sections are checked in the current
  // session (not on rollover). Locks the day and returns whether Day 90
  // was reached, so the screen can navigate accordingly.
  const closeOutDay = useCallback(async () => {
    if (!state) return { isDay90: false };
    const allDone = Object.values(state.sections).every(Boolean);
    if (!allDone) return { isDay90: false };

    if (state.currentDay >= TRANSFORMATION_LENGTH) {
      const historyWithToday = [
        ...state.history,
        { day: state.currentDay, date: todayString(), completed: true, sectionsSnapshot: state.sections },
      ];
      const stats = buildDay90Stats({ ...state, history: historyWithToday });
      const next = {
        ...state,
        dayLocked: true,
        history: historyWithToday,
        pendingDay90: stats,
        bestStreak: Math.max(state.bestStreak, TRANSFORMATION_LENGTH),
      };
      await persist(next);
      return { isDay90: true };
    }

    await persist({ ...state, dayLocked: true });
    return { isDay90: false };
  }, [state, persist]);

  const acknowledgeFailureAndRestart = useCallback(async () => {
    if (!state) return;
    const next = {
      ...state,
      currentDay: 1,
      sections: emptySectionsState(),
      dietSub: { water: false, protein: false, vitamins: false, calories: false },
      dayLocked: false,
      pendingFailure: null,
      totalResets: state.totalResets + 1,
      lastOpenedDate: todayString(),
    };
    await persist(next);
  }, [state, persist]);

  const startNewCycle = useCallback(async () => {
    if (!state) return;
    const next = {
      ...state,
      currentDay: 1,
      sections: emptySectionsState(),
      dietSub: { water: false, protein: false, vitamins: false, calories: false },
      dayLocked: false,
      pendingDay90: null,
      bestStreak: Math.max(state.bestStreak, TRANSFORMATION_LENGTH),
      lastOpenedDate: todayString(),
    };
    await persist(next);
  }, [state, persist]);

  const setReminder = useCallback(
    (key, patch) => {
      if (!state) return;
      const nextReminders = { ...state.reminders, [key]: { ...state.reminders[key], ...patch } };
      persist({ ...state, reminders: nextReminders });
    },
    [state, persist]
  );

  const value = {
    ready,
    state,
    toggleSection,
    setDietSub,
    addPhoto,
    addNote,
    closeOutDay,
    acknowledgeFailureAndRestart,
    startNewCycle,
    setReminder,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
