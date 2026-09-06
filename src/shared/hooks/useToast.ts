import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

let counter = 0;
const nextId = () => `toast-${++counter}`;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: Toast['type'] = 'info') => {
      const id = nextId();
      setToasts((prev) => [
        ...prev,
        {
          id,
          message,
          type,
          onClose: () => dismissToast(id),
        },
      ]);
    },
    [dismissToast]
  );

  return { toasts, showToast, dismissToast };
}
