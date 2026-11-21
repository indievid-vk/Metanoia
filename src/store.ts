import { useState, useCallback } from 'react';

export type Passion = 'Чревоугодие' | 'Блуд' | 'Сребролюбие' | 'Гнев' | 'Печаль' | 'Уныние' | 'Тщеславие' | 'Гордость';
export type SinSeverity = 'Смертный' | 'Тяжкий' | 'Простительный';

export interface Sin {
  id: string;
  passion: Passion;
  title: string;
  description: string;
  severity: SinSeverity;
  isCustom?: boolean;
}

export interface UserSinData {
  selected: boolean;
  note: string;
}

// Custom hook for LocalStorage with functional updater to avoid stale closures
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue(prev => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      try {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(error);
      }
      return valueToStore;
    });
  }, [key]);

  return [storedValue, setValue] as const;
}

export function useSinsStore() {
  // p_sins: Record<sinId, boolean> - whether sin is selected
  const [selectedSins, setSelectedSins] = useLocalStorage<Record<string, boolean>>('p_sins', {});
  
  // p_notes: Record<sinId, string> - user notes for sins
  const [sinNotes, setSinNotes] = useLocalStorage<Record<string, string>>('p_notes', {});
  
  // p_user_sins: Sin[] - custom user sins
  const [customSins, setCustomSins] = useLocalStorage<Sin[]>('p_user_sins', []);

  const toggleSin = useCallback((id: string) => {
    setSelectedSins(prev => ({ ...prev, [id]: !prev[id] }));
  }, [setSelectedSins]);

  const removeSelectedSin = useCallback((id: string) => {
    setSelectedSins(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, [setSelectedSins]);

  const updateNote = useCallback((id: string, note: string) => {
    setSinNotes(prev => ({ ...prev, [id]: note }));
  }, [setSinNotes]);

  const addCustomSin = useCallback((passion: Passion, title: string, description: string, severity: SinSeverity) => {
    const newSin: Sin = {
      id: `custom_${Date.now()}`,
      passion,
      title,
      description,
      severity,
      isCustom: true
    };
    setCustomSins(prev => [...prev, newSin]);
    return newSin.id;
  }, [setCustomSins]);

  const deleteCustomSin = useCallback((id: string) => {
    setCustomSins(prev => prev.filter(s => s.id !== id));
    setSelectedSins(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setSinNotes(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, [setCustomSins, setSelectedSins, setSinNotes]);

  const clearConfession = useCallback(() => {
    setSelectedSins({});
    setSinNotes({});
  }, [setSelectedSins, setSinNotes]);

  return {
    selectedSins,
    sinNotes,
    customSins,
    toggleSin,
    removeSelectedSin,
    updateNote,
    addCustomSin,
    deleteCustomSin,
    clearConfession
  };
}

export function useBookmarksStore() {
  const [bookmarks, setBookmarks] = useLocalStorage<Record<string, string>>('p_bookmarks', {});

  const setBookmark = (pageKey: string, elementId: string) => {
    setBookmarks(prev => ({ ...prev, [pageKey]: elementId }));
  };

  const getBookmark = (pageKey: string) => {
    return bookmarks[pageKey] || null;
  };

  const clearBookmark = (pageKey: string) => {
    setBookmarks(prev => {
      const next = { ...prev };
      delete next[pageKey];
      return next;
    });
  };

  return {
    bookmarks,
    setBookmark,
    getBookmark,
    clearBookmark
  };
}
