import { useState, useEffect } from 'react';

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

// Custom hook for LocalStorage
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

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

export function useSinsStore() {
  // p_sins: Record<sinId, boolean> - whether sin is selected
  const [selectedSins, setSelectedSins] = useLocalStorage<Record<string, boolean>>('p_sins', {});
  
  // p_notes: Record<sinId, string> - user notes for sins
  const [sinNotes, setSinNotes] = useLocalStorage<Record<string, string>>('p_notes', {});
  
  // p_user_sins: Sin[] - custom user sins
  const [customSins, setCustomSins] = useLocalStorage<Sin[]>('p_user_sins', []);

  const toggleSin = (id: string) => {
    setSelectedSins(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const updateNote = (id: string, note: string) => {
    setSinNotes(prev => ({ ...prev, [id]: note }));
  };

  const addCustomSin = (passion: Passion, title: string, description: string, severity: SinSeverity) => {
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
  };

  const deleteCustomSin = (id: string) => {
    setCustomSins(prev => prev.filter(s => s.id !== id));
    // Also clean up selection and notes
    const newSelected = { ...selectedSins };
    delete newSelected[id];
    setSelectedSins(newSelected);
    
    const newNotes = { ...sinNotes };
    delete newNotes[id];
    setSinNotes(newNotes);
  };

  const clearConfession = () => {
    setSelectedSins({});
    setSinNotes({});
    // We might want to keep custom sins, just unselect them
  };

  return {
    selectedSins,
    sinNotes,
    customSins,
    toggleSin,
    updateNote,
    addCustomSin,
    deleteCustomSin,
    clearConfession
  };
}
