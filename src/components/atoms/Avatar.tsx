import React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  userType?: 'patient' | 'staff' | 'ai' | 'system';
  isOnline?: boolean;
  interactive?: boolean;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  fallback,
  size = 'md',
  className = '',
  userType = 'staff',
  isOnline = false,
  interactive = false,
  onClick
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const getUserTypeBorder = (type: string) => {
    switch (type) {
      case 'patient':
        return 'ring-2 ring-blue-300';
      case 'staff':
        return 'ring-2 ring-green-300';
      case 'ai':
        return 'ring-2 ring-purple-300';
      case 'system':
        return 'ring-2 ring-gray-300';
      default:
        return '';
    }
  };


  return (
    <div className="relative">
      <AvatarPrimitive.Root 
        className={`
          inline-flex items-center justify-center overflow-hidden rounded-full
          bg-gray-100 select-none align-middle transition-colors duration-200
          ${interactive ? 'cursor-pointer hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2' : ''}
          ${sizeClasses[size]} ${getUserTypeBorder(userType)} ${className}
        `}
        tabIndex={interactive ? 0 : undefined}
        role={interactive ? 'button' : undefined}
        onClick={onClick}
      >
        <AvatarPrimitive.Image
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
        <AvatarPrimitive.Fallback
          className="
            w-full h-full flex items-center justify-center
            bg-gray-200 text-gray-600 font-medium
          "
          delayMs={600}
        >
          {fallback ? (
            <span>{fallback}</span>
          ) : (
            <svg 
              className="w-1/2 h-1/2" 
              viewBox="0 0 24 24" 
              fill="none"
            >
              <path 
                d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          )}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
      {/* Online status indicator */}
      {isOnline && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
      )}
    </div>
  );
};

export default Avatar;