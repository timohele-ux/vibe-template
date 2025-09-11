import React from 'react';
import { Heading1, BodyText } from '../atoms';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Heading1>{title}</Heading1>
        {subtitle && (
          <BodyText variant="muted" className="mt-2">{subtitle}</BodyText>
        )}
      </div>
    </header>
  );
};

export default Header;