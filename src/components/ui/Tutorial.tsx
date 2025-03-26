import React, { useState, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';

interface TutorialProps {
  id: string;
  title: string;
  content: ReactNode;
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