import React from 'react';

type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
type TextVariant = 'default' | 'muted' | 'danger' | 'success' | 'warning' | 'primary';
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
type TextAlign = 'left' | 'center' | 'right';

interface TextProps {
  size?: TextSize;
  variant?: TextVariant;
  weight?: TextWeight;
  align?: TextAlign;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  lineHeight?: 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
}

const Text: React.FC<TextProps> = ({ 
  size = 'base',
  variant = 'default',
  weight = 'normal',
  align = 'left',
  lineHeight = 'normal',
  children, 
  className = '',
  as: Component = 'p'
}) => {
  // Typography scales following design system hierarchy
  const sizeClasses = {
    'xs': 'text-xs',
    'sm': 'text-sm',
    'base': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl'
  };

  const variantClasses = {
    'default': 'text-gray-900',
    'muted': 'text-gray-500',
    'danger': 'text-red-600',
    'success': 'text-green-600',
    'warning': 'text-yellow-600',
    'primary': 'text-primary-600'
  };

  const weightClasses = {
    'normal': 'font-normal',
    'medium': 'font-medium',
    'semibold': 'font-semibold',
    'bold': 'font-bold'
  };

  const alignClasses = {
    'left': 'text-left',
    'center': 'text-center',
    'right': 'text-right'
  };

  const lineHeightClasses = {
    'tight': 'leading-tight',
    'snug': 'leading-snug',
    'normal': 'leading-normal',
    'relaxed': 'leading-relaxed',
    'loose': 'leading-loose'
  };

  return (
    <Component 
      className={`${sizeClasses[size]} ${variantClasses[variant]} ${weightClasses[weight]} ${alignClasses[align]} ${lineHeightClasses[lineHeight]} ${className}`.trim()}
    >
      {children}
    </Component>
  );
};

// Predefined heading components for consistent hierarchy
export const Heading1: React.FC<Omit<TextProps, 'size' | 'weight' | 'as'>> = (props) => (
  <Text {...props} size="3xl" weight="bold" as="h1" lineHeight="tight" />
);

export const Heading2: React.FC<Omit<TextProps, 'size' | 'weight' | 'as'>> = (props) => (
  <Text {...props} size="2xl" weight="semibold" as="h2" lineHeight="tight" />
);

export const Heading3: React.FC<Omit<TextProps, 'size' | 'weight' | 'as'>> = (props) => (
  <Text {...props} size="xl" weight="semibold" as="h3" lineHeight="snug" />
);

export const Heading4: React.FC<Omit<TextProps, 'size' | 'weight' | 'as'>> = (props) => (
  <Text {...props} size="lg" weight="medium" as="h4" lineHeight="snug" />
);

export const Heading5: React.FC<Omit<TextProps, 'size' | 'weight' | 'as'>> = (props) => (
  <Text {...props} size="base" weight="medium" as="h5" lineHeight="normal" />
);

export const Heading6: React.FC<Omit<TextProps, 'size' | 'weight' | 'as'>> = (props) => (
  <Text {...props} size="sm" weight="medium" as="h6" lineHeight="normal" />
);

// Body text components
export const BodyText: React.FC<Omit<TextProps, 'size' | 'as'>> = (props) => (
  <Text {...props} size="base" as="p" lineHeight="relaxed" />
);

export const SmallText: React.FC<Omit<TextProps, 'size' | 'as'>> = (props) => (
  <Text {...props} size="sm" as="span" lineHeight="normal" />
);

export const Caption: React.FC<Omit<TextProps, 'size' | 'as'>> = (props) => (
  <Text {...props} size="xs" as="span" lineHeight="normal" variant="muted" />
);

export default Text;