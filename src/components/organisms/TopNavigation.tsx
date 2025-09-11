import React, { useState } from 'react';
import { Button, Avatar, Badge, Input, Heading3, BodyText, SmallText, Caption } from '../atoms';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';

interface TopNavigationProps {
  currentUser?: {
    name: string;
    avatar?: string;
    role: string;
  };
  onNavigate?: (section: string) => void;
  notificationCount?: number;
}

const TopNavigation: React.FC<TopNavigationProps> = ({
  currentUser = { name: 'Dr. Smith', role: 'Clinician' },
  onNavigate,
  notificationCount = 3
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', isActive: true },
    { id: 'knowledge-gaps', label: 'Knowledge Gaps', isActive: false },
    { id: 'metrics', label: 'Metrics', isActive: false },
    { id: 'live', label: 'Live', isActive: false, hasIndicator: true }
  ];

  const handleNavigation = (itemId: string) => {
    onNavigate?.(itemId);
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section - Logo & Navigation */}
        <div className="flex items-center space-x-8">
          {/* MediReply Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              MediReply
            </span>
          </div>

          {/* Main Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <div key={item.id} className="relative">
                <Button
                  variant={item.isActive ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => handleNavigation(item.id)}
                  className={`
                    relative px-4 py-2 rounded-full font-medium text-sm transition-all
                    ${item.isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  {item.label}
                  {item.hasIndicator && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Search, Utilities, Profile */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <Dialog.Root open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <Dialog.Trigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Search"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Button>
            </Dialog.Trigger>
            
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
              <Dialog.Content className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white rounded-lg shadow-xl z-50 p-4">
                <div className="mb-4">
                  <Input
                    placeholder="Search patients, cases, or messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                    autoFocus
                  />
                </div>
                <div className="text-sm text-gray-500">
                  {searchQuery ? (
                    <div>Searching for: "{searchQuery}"</div>
                  ) : (
                    <div>Start typing to search across all cases and patients</div>
                  )}
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          {/* Notifications */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative p-2 rounded-full hover:bg-gray-100"
                aria-label="Notifications"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notificationCount > 0 && (
                  <Badge 
                    variant="error" 
                    size="sm" 
                    className="absolute -top-1 -right-1 min-w-5 h-5 text-xs flex items-center justify-center"
                  >
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content 
                className="min-w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50"
                align="end"
                sideOffset={8}
              >
                <div className="p-3 border-b border-gray-100">
                  <Heading3 className="text-gray-900">Notifications</Heading3>
                </div>
                
                <div className="py-2">
                  <DropdownMenu.Item className="flex items-start space-x-3 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <SmallText className="font-medium text-gray-900">Critical case requires attention</SmallText>
                      <Caption className="text-gray-500">Patient J. Smith - chest pain inquiry</Caption>
                      <Caption className="text-gray-400">2 minutes ago</Caption>
                    </div>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item className="flex items-start space-x-3 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <SmallText className="font-medium text-gray-900">AI confidence low</SmallText>
                      <Caption className="text-gray-500">Case #1234 - medication dosage question</Caption>
                      <Caption className="text-gray-400">5 minutes ago</Caption>
                    </div>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item className="flex items-start space-x-3 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <SmallText className="font-medium text-gray-900">New message received</SmallText>
                      <Caption className="text-gray-500">Patient follow-up on appointment</Caption>
                      <Caption className="text-gray-400">10 minutes ago</Caption>
                    </div>
                  </DropdownMenu.Item>
                </div>

                <div className="border-t border-gray-100 p-2">
                  <Button variant="ghost" size="sm" className="w-full text-center text-sm text-blue-600">
                    View all notifications
                  </Button>
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {/* Help */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Help"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-2 transition-colors">
                <Avatar
                  src={currentUser.avatar}
                  fallback={currentUser.name.split(' ').map(n => n[0]).join('')}
                  size="sm"
                  userType="staff"
                  isOnline={true}
                />
                <div className="hidden md:block text-left">
                  <SmallText className="font-medium text-gray-900">{currentUser.name}</SmallText>
                  <Caption className="text-gray-500">{currentUser.role}</Caption>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content 
                className="min-w-56 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50"
                align="end"
                sideOffset={8}
              >
                <div className="px-3 py-2 border-b border-gray-100">
                  <SmallText className="font-medium text-gray-900">{currentUser.name}</SmallText>
                  <Caption className="text-gray-500">{currentUser.role}</Caption>
                </div>

                <div className="py-1">
                  <DropdownMenu.Item className="flex items-center space-x-2 px-3 py-2 text-sm rounded-md hover:bg-gray-50 cursor-pointer">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Profile Settings</span>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item className="flex items-center space-x-2 px-3 py-2 text-sm rounded-md hover:bg-gray-50 cursor-pointer">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Preferences</span>
                  </DropdownMenu.Item>

                  <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />

                  <DropdownMenu.Item className="flex items-center space-x-2 px-3 py-2 text-sm rounded-md hover:bg-gray-50 cursor-pointer text-red-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign Out</span>
                  </DropdownMenu.Item>
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="sm" className="p-2">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu (hidden by default) */}
      <div className="md:hidden mt-4 border-t border-gray-200 pt-4">
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={item.isActive ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handleNavigation(item.id)}
              className="w-full justify-start"
            >
              {item.label}
              {item.hasIndicator && (
                <span className="ml-auto w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation;
