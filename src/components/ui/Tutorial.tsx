import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';

interface TutorialProps {
  id: string;
  title: string;
  content: string | React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  persistent?: boolean;
  delay?: number;
}

/**
 * A tutorial component for displaying tooltips and onboarding content
 */
export function Tutorial({
  id,
  title,
  content,
  position = 'bottom',
  className = '',
  persistent = false,
  delay = 0
}: TutorialProps) {
  const [dismissed, setDismissed] = useLocalStorage(`tutorial-${id}-dismissed`, false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // If the tutorial has been dismissed and is not persistent, don't show it
    if (dismissed && !persistent) return;

    // Show the tutorial after the specified delay
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [dismissed, persistent, delay]);

  if (!visible) return null;

  const positionClasses = {
    top: 'bottom-full mb-2',
    right: 'left-full ml-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
  };

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
  };

  return (
    <div
      className={`bg-indigo-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-xs ${positionClasses[position]} ${className}`}
    >
      <h4 className="font-medium mb-2">{title}</h4>
      <div className="text-sm mb-3">{content}</div>
      <button 
        onClick={handleDismiss}
        className="text-xs underline"
      >
        Got it, don't show again
      </button>
    </div>
  );
}

/**
 * A hook for creating a local storage-based key-value store
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error(error);
      return initialValue;
    }
  });
  
  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T) => {
    try {
      // Save state
      setStoredValue(value);
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(error);
    }
  };
  
  return [storedValue, setValue];
} 