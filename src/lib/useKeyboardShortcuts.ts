import { useEffect, useCallback, useRef } from 'react';

export interface KeyboardShortcut {
  key: string;
  action: () => void;
  description: string;
  enabled?: boolean;
  preventDefault?: boolean;
}

export interface UseKeyboardShortcutsOptions {
  shortcuts: Record<string, KeyboardShortcut>;
  enabled?: boolean;
  scope?: 'global' | 'local';
}

export interface ShortcutHelp {
  key: string;
  description: string;
  category: 'primary' | 'secondary' | 'navigation' | 'utility';
}

/**
 * Custom hook for managing keyboard shortcuts with context awareness
 * Supports global and local scoped shortcuts with conflict prevention
 */
export const useKeyboardShortcuts = (options: UseKeyboardShortcutsOptions) => {
  const { shortcuts, enabled = true, scope = 'local' } = options;
  const activeShortcutsRef = useRef<Record<string, KeyboardShortcut>>({});

  // Normalize keyboard event to shortcut string
  const getShortcutString = useCallback((event: KeyboardEvent): string => {
    const parts: string[] = [];
    
    if (event.ctrlKey || event.metaKey) parts.push('Ctrl');
    if (event.altKey) parts.push('Alt');
    if (event.shiftKey) parts.push('Shift');
    
    // Handle special keys
    const specialKeys: Record<string, string> = {
      'Enter': 'Enter',
      'Escape': 'Escape',
      'Tab': 'Tab',
      'Space': 'Space',
      'ArrowUp': 'ArrowUp',
      'ArrowDown': 'ArrowDown',
      'ArrowLeft': 'ArrowLeft',
      'ArrowRight': 'ArrowRight',
      '/': '/',
      '?': '?'
    };

    const keyName = specialKeys[event.key] || event.key.toUpperCase();
    parts.push(keyName);
    
    return parts.join('+');
  }, []);

  // Handle keyboard events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const shortcutString = getShortcutString(event);
    const shortcut = activeShortcutsRef.current[shortcutString];

    if (shortcut && shortcut.enabled !== false) {
      // Check if we should prevent default behavior
      if (shortcut.preventDefault !== false) {
        event.preventDefault();
        event.stopPropagation();
      }

      // Execute the shortcut action
      try {
        shortcut.action();
      } catch (error) {
        console.error('Error executing keyboard shortcut:', error);
      }
    }
  }, [enabled, getShortcutString]);

  // Update active shortcuts reference
  useEffect(() => {
    activeShortcutsRef.current = shortcuts;
  }, [shortcuts]);

  // Set up event listeners
  useEffect(() => {
    if (!enabled) return;

    const eventTarget = scope === 'global' ? document : document.activeElement;
    
    if (eventTarget) {
      eventTarget.addEventListener('keydown', handleKeyDown);
      
      return () => {
        eventTarget.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [enabled, scope, handleKeyDown]);

  // Get help information for current shortcuts
  const getShortcutHelp = useCallback((): ShortcutHelp[] => {
    return Object.entries(shortcuts).map(([key, shortcut]) => ({
      key,
      description: shortcut.description,
      category: categorizeShortcut(key)
    }));
  }, [shortcuts]);

  // Categorize shortcuts for help display
  const categorizeShortcut = (key: string): ShortcutHelp['category'] => {
    if (key.includes('Ctrl+Enter') || key.includes('Ctrl+S')) return 'primary';
    if (key.includes('Escape') || key.includes('Ctrl+E')) return 'secondary';
    if (key.includes('Arrow') || key.includes('Tab')) return 'navigation';
    return 'utility';
  };

  // Check if a specific shortcut is active
  const isShortcutActive = useCallback((key: string): boolean => {
    const shortcut = shortcuts[key];
    return shortcut?.enabled !== false;
  }, [shortcuts]);

  // Enable/disable specific shortcuts
  const toggleShortcut = useCallback((key: string, enabled: boolean) => {
    if (activeShortcutsRef.current[key]) {
      activeShortcutsRef.current[key] = {
        ...activeShortcutsRef.current[key],
        enabled
      };
    }
  }, []);

  return {
    getShortcutHelp,
    isShortcutActive,
    toggleShortcut,
    activeShortcuts: Object.keys(shortcuts)
  };
};

/**
 * Default keyboard shortcuts for AI response management
 */
export const defaultResponseShortcuts = {
  'Ctrl+Enter': {
    key: 'Ctrl+Enter',
    action: () => {},
    description: 'Approve and send response',
    preventDefault: true
  },
  'Ctrl+E': {
    key: 'Ctrl+E',
    action: () => {},
    description: 'Edit response',
    preventDefault: true
  },
  'Escape': {
    key: 'Escape',
    action: () => {},
    description: 'Cancel current action',
    preventDefault: true
  },
  'Ctrl+S': {
    key: 'Ctrl+S',
    action: () => {},
    description: 'Save draft',
    preventDefault: true
  },
  'Ctrl+/': {
    key: 'Ctrl+/',
    action: () => {},
    description: 'Show keyboard shortcuts',
    preventDefault: true
  }
};

/**
 * Hook specifically for AI response management shortcuts
 */
export const useResponseShortcuts = (actions: {
  onApprove?: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
  onSave?: () => void;
  onShowHelp?: () => void;
}) => {
  const shortcuts = {
    'Ctrl+Enter': {
      ...defaultResponseShortcuts['Ctrl+Enter'],
      action: actions.onApprove || (() => {}),
      enabled: !!actions.onApprove
    },
    'Ctrl+E': {
      ...defaultResponseShortcuts['Ctrl+E'],
      action: actions.onEdit || (() => {}),
      enabled: !!actions.onEdit
    },
    'Escape': {
      ...defaultResponseShortcuts['Escape'],
      action: actions.onCancel || (() => {}),
      enabled: !!actions.onCancel
    },
    'Ctrl+S': {
      ...defaultResponseShortcuts['Ctrl+S'],
      action: actions.onSave || (() => {}),
      enabled: !!actions.onSave
    },
    'Ctrl+/': {
      ...defaultResponseShortcuts['Ctrl+/'],
      action: actions.onShowHelp || (() => {}),
      enabled: !!actions.onShowHelp
    }
  };

  return useKeyboardShortcuts({
    shortcuts,
    enabled: true,
    scope: 'global'
  });
};
