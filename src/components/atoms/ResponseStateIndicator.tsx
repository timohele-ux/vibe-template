import React from 'react';
import type { ResponseMode } from '../../types';

interface ResponseStateIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  state: ResponseMode;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

const ResponseStateIndicator = React.forwardRef<HTMLDivElement, ResponseStateIndicatorProps>(
  ({ 
    className = '',
    state,
    size = 'md',
    showLabel = true,
    animated = true,
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center gap-2 state-transition';
    
    const stateClasses = {
      pending: 'text-gray-700',
      editing: 'text-blue-700',
      resolved: 'text-green-700',
    };
    
    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    };

    const getStateDot = (stateType: ResponseMode): string => {
      const baseDotClasses = animated ? 'rounded-full state-transition' : 'rounded-full';
      const sizeMap = {
        sm: 'w-2 h-2',
        md: 'w-2.5 h-2.5',
        lg: 'w-3 h-3'
      };
      
      const dotClasses = {
        pending: `${sizeMap[size]} bg-gray-400 ${baseDotClasses}`,
        editing: `${sizeMap[size]} bg-blue-500 ${baseDotClasses} ${animated ? 'animate-pulse-subtle' : ''}`,
        resolved: `${sizeMap[size]} bg-green-500 ${baseDotClasses} ${animated ? 'animate-bounce-gentle' : ''}`,
      };
      
      return dotClasses[stateType];
    };

    const getStateLabel = (stateType: ResponseMode): string => {
      switch (stateType) {
        case 'pending':
          return 'Draft';
        case 'editing':
          return 'Editing';
        case 'resolved':
          return 'Sent';
      }
    };

    const getStateIcon = (stateType: ResponseMode): React.ReactElement | null => {
      const iconClasses = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
      
      switch (stateType) {
        case 'pending':
          return (
            <svg className={`${iconClasses} text-gray-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
        case 'editing':
          return (
            <svg className={`${iconClasses} text-blue-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          );
        case 'resolved':
          return (
            <svg className={`${iconClasses} text-green-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          );
        default:
          return null;
      }
    };

    return (
      <div
        className={`${baseClasses} ${stateClasses[state]} ${sizeClasses[size]} ${className}`}
        ref={ref}
        {...props}
      >
        <div className="relative flex items-center">
          <div className={getStateDot(state)} />
          {animated && state === 'editing' && (
            <div className="absolute inset-0 w-2.5 h-2.5 bg-blue-300 rounded-full animate-ping opacity-75" />
          )}
        </div>
        
        {showLabel && (
          <span className="font-medium flex items-center gap-1">
            {getStateIcon(state)}
            {getStateLabel(state)}
          </span>
        )}
      </div>
    );
  }
);

ResponseStateIndicator.displayName = 'ResponseStateIndicator';

export default ResponseStateIndicator;
