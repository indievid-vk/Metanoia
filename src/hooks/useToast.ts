import { useState, useCallback, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

// Simple event-based toast manager
class ToastManager extends EventTarget {
  private static instance: ToastManager;
  private toasts: Toast[] = [];

  private constructor() {
    super();
  }

  public static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  public add(message: string, type: ToastType = 'info') {
    const id = Math.random().toString(36).substring(2, 9);
    const toast = { id, message, type };
    this.toasts.push(toast);
    this.dispatchEvent(new CustomEvent('update', { detail: [...this.toasts] }));
    
    setTimeout(() => this.remove(id), 4000);
  }

  public remove(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.dispatchEvent(new CustomEvent('update', { detail: [...this.toasts] }));
  }

  public getToasts() {
    return this.toasts;
  }
}

export const toast = {
  success: (msg: string) => ToastManager.getInstance().add(msg, 'success'),
  error: (msg: string) => ToastManager.getInstance().add(msg, 'error'),
  info: (msg: string) => ToastManager.getInstance().add(msg, 'info'),
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const manager = ToastManager.getInstance();
    const handleUpdate = (e: any) => setToasts(e.detail);
    
    manager.addEventListener('update', handleUpdate);
    setToasts(manager.getToasts());
    
    return () => manager.removeEventListener('update', handleUpdate);
  }, []);

  return { toasts, remove: (id: string) => ToastManager.getInstance().remove(id) };
}
