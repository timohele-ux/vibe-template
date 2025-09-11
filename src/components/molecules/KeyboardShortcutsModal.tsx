import React from 'react';
import { Button, Text, Badge, Heading3, Caption } from '../atoms';
import type { ShortcutHelp } from '../../lib/useKeyboardShortcuts';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: ShortcutHelp[];
  title?: string;
}

const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  shortcuts,
  title = 'Keyboard Shortcuts'
}) => {
  if (!isOpen) return null;

  // Group shortcuts by category
  const groupedShortcuts = shortcuts.reduce((groups, shortcut) => {
    const category = shortcut.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(shortcut);
    return groups;
  }, {} as Record<string, ShortcutHelp[]>);

  // Get category display names and order
  const categoryInfo = {
    primary: { name: 'Primary Actions', order: 1, variant: 'success' as const },
    secondary: { name: 'Secondary Actions', order: 2, variant: 'info' as const },
    navigation: { name: 'Navigation', order: 3, variant: 'default' as const },
    utility: { name: 'Utility', order: 4, variant: 'warning' as const }
  };

  const sortedCategories = Object.keys(groupedShortcuts).sort(
    (a, b) => (categoryInfo[a as keyof typeof categoryInfo]?.order || 99) - 
              (categoryInfo[b as keyof typeof categoryInfo]?.order || 99)
  );

  // Format keyboard shortcut for display
  const formatShortcutKey = (key: string) => {
    return key.split('+').map((part, index, array) => (
      <React.Fragment key={part}>
        <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
          {part === 'Ctrl' ? '⌘' : part}
        </kbd>
        {index < array.length - 1 && <span className="mx-1 text-gray-400">+</span>}
      </React.Fragment>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <Heading3 className="text-gray-900">{title}</Heading3>
              <Caption variant="muted">Accelerate your workflow with keyboard shortcuts</Caption>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="state-transition hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {shortcuts.length === 0 ? (
            <div className="text-center py-8">
              <div className="p-3 bg-gray-100 rounded-full inline-block mb-3">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <Text variant="muted">No keyboard shortcuts available for this context.</Text>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedCategories.map(category => {
                const categoryShortcuts = groupedShortcuts[category];
                const info = categoryInfo[category as keyof typeof categoryInfo];
                
                return (
                  <div key={category} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={info?.variant || 'default'} 
                        size="sm"
                        className="text-xs"
                      >
                        {info?.name || category}
                      </Badge>
                      <div className="flex-1 h-px bg-gray-200"></div>
                    </div>
                    
                    <div className="grid gap-3">
                      {categoryShortcuts.map(shortcut => (
                        <div 
                          key={shortcut.key} 
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 state-transition"
                        >
                          <div className="flex-1">
                            <Text size="sm" weight="medium" className="text-gray-900">
                              {shortcut.description}
                            </Text>
                          </div>
                          <div className="flex items-center space-x-1 ml-4">
                            {formatShortcutKey(shortcut.key)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Press <kbd className="px-1.5 py-0.5 text-xs bg-gray-200 rounded">Ctrl+/</kbd> anytime to view shortcuts</span>
          </div>
          
          <Button
            variant="primary"
            size="sm"
            onClick={onClose}
            className="state-transition"
          >
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
