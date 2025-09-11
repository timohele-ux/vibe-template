import React from 'react';

type Priority = 'critical' | 'urgent' | 'routine' | 'low';

interface PriorityTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  priority: Priority;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const PriorityTag = React.forwardRef<HTMLSpanElement, PriorityTagProps>(
  ({ 
    className = '',
    priority,
    size = 'md',
    interactive = false,
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center font-medium rounded-full border transition-colors duration-200 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2';
    
    const priorityClasses = {
      critical: 'text-red-800 bg-red-100 border-red-300',
      urgent: 'text-orange-800 bg-orange-100 border-orange-300',
      routine: 'text-blue-800 bg-blue-100 border-blue-300',
      low: 'text-gray-600 bg-gray-100 border-gray-300',
    };
    
    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    };

    const getPriorityLabel = (priorityLevel: Priority): string => {
      switch (priorityLevel) {
        case 'critical':
          return 'Critical';
        case 'urgent':
          return 'Urgent';
        case 'routine':
          return 'Routine';
        case 'low':
          return 'Low';
      }
    };

    const getPriorityIcon = (priorityLevel: Priority): string => {
      switch (priorityLevel) {
        case 'critical':
          return '🔴';
        case 'urgent':
          return '🟠';
        case 'routine':
          return '🔵';
        case 'low':
          return '⚪';
      }
    };

    return (
      <span
        className={`${baseClasses} ${priorityClasses[priority]} ${sizeClasses[size]} ${className}`}
        ref={ref}
        tabIndex={interactive ? 0 : undefined}
        {...props}
      >
        <span className="mr-1">{getPriorityIcon(priority)}</span>
        {getPriorityLabel(priority)}
      </span>
    );
  }
);

PriorityTag.displayName = 'PriorityTag';

export default PriorityTag;
