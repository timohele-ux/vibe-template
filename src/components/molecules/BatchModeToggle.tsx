import React from 'react';
import { Switch, Tooltip } from '../atoms';

interface BatchModeToggleProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  className?: string;
  disabled?: boolean;
}

const BatchModeToggle: React.FC<BatchModeToggleProps> = ({
  isEnabled,
  onToggle,
  className = '',
  disabled = false
}) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Tooltip content={isEnabled ? 
        "Batch mode is ON - Review multiple AI responses efficiently" : 
        "Enable batch mode to review multiple AI responses at once"
      }>
        <div className="flex items-center space-x-2">
          <Switch
            checked={isEnabled}
            onCheckedChange={onToggle}
            disabled={disabled}
            aria-label="Toggle batch mode"
          />
          <div className="flex flex-col">
            <span className={`text-sm font-medium ${isEnabled ? 'text-purple-700' : 'text-gray-700'}`}>
              Batch Mode
            </span>
            <span className="text-xs text-gray-500">
              {isEnabled ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>
      </Tooltip>
      
      {isEnabled && (
        <div className="flex items-center space-x-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          <span>AI Assistance Active</span>
        </div>
      )}
    </div>
  );
};

export default BatchModeToggle;
