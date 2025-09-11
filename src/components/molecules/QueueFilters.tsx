import React, { useState } from 'react';
import { Button, SmallText, Caption, Badge } from '../atoms';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { Case, Priority, CaseStatus, QueueFilters } from '../../types';

interface QueueFiltersProps {
  filters: QueueFilters;
  onFiltersChange: (filters: QueueFilters) => void;
  activeFilterCount?: number;
}

const QueueFiltersComponent: React.FC<QueueFiltersProps> = ({
  filters,
  onFiltersChange,
  activeFilterCount = 0
}) => {
  const priorityOptions = [
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-orange-100 text-orange-800' },
    { value: 'routine', label: 'Routine', color: 'bg-blue-100 text-blue-800' },
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' }
  ];

  const statusOptions = [
    { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-800' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'awaiting-approval', label: 'Awaiting Approval', color: 'bg-purple-100 text-purple-800' },
    { value: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-800' },
    { value: 'escalated', label: 'Escalated', color: 'bg-red-100 text-red-800' }
  ];

  const departmentOptions = [
    { value: 'emergency', label: 'Emergency' },
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'orthopedics', label: 'Orthopedics' },
    { value: 'general', label: 'General Medicine' },
    { value: 'billing', label: 'Billing' },
    { value: 'appointments', label: 'Appointments' }
  ];

  const timeRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handlePriorityToggle = (priority: Priority) => {
    const currentPriorities = filters.priority || [];
    const newPriorities = currentPriorities.includes(priority)
      ? currentPriorities.filter(p => p !== priority)
      : [...currentPriorities, priority];
    
    onFiltersChange({
      ...filters,
      priority: newPriorities.length > 0 ? newPriorities : undefined
    });
  };

  const handleStatusToggle = (status: CaseStatus) => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    
    onFiltersChange({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined
    });
  };

  const handleDepartmentToggle = (department: string) => {
    const currentDepartments = filters.department || [];
    const newDepartments = currentDepartments.includes(department)
      ? currentDepartments.filter(d => d !== department)
      : [...currentDepartments, department];
    
    onFiltersChange({
      ...filters,
      department: newDepartments.length > 0 ? newDepartments : undefined
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const getActiveFiltersText = (): string => {
    const parts: string[] = [];
    if (filters.priority?.length) parts.push(`${filters.priority.length} priority`);
    if (filters.status?.length) parts.push(`${filters.status.length} status`);
    if (filters.department?.length) parts.push(`${filters.department.length} dept`);
    if (filters.timeRange) parts.push('time range');
    return parts.join(', ');
  };

  return (
    <div className="flex items-center space-x-2 p-3 border-b border-gray-200 bg-gray-50">
      {/* Filter Dropdown */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="relative"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="info" size="sm" className="ml-2 min-w-5 h-5">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content 
            className="min-w-96 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50"
            align="start"
            sideOffset={4}
          >
            {/* Priority Filters */}
            <div className="mb-4">
              <SmallText weight="medium" className="text-gray-900 mb-2">Priority</SmallText>
              <div className="flex flex-wrap gap-2">
                {priorityOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handlePriorityToggle(option.value as Priority)}
                    className={`
                      px-2 py-1 text-xs rounded-md border transition-colors
                      ${filters.priority?.includes(option.value as Priority)
                        ? `${option.color} border-current`
                        : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filters */}
            <div className="mb-4">
              <SmallText weight="medium" className="text-gray-900 mb-2">Status</SmallText>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusToggle(option.value as CaseStatus)}
                    className={`
                      px-2 py-1 text-xs rounded-md border transition-colors
                      ${filters.status?.includes(option.value as CaseStatus)
                        ? `${option.color} border-current`
                        : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Department Filters */}
            <div className="mb-4">
              <SmallText weight="medium" className="text-gray-900 mb-2">Department</SmallText>
              <div className="flex flex-wrap gap-2">
                {departmentOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleDepartmentToggle(option.value)}
                    className={`
                      px-2 py-1 text-xs rounded-md border transition-colors
                      ${filters.department?.includes(option.value)
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-red-600 hover:text-red-700"
              >
                Clear All
              </Button>
              <Caption variant="muted">
                {activeFilterCount > 0 && `${activeFilterCount} filters active`}
              </Caption>
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex items-center space-x-2">
          <Caption variant="muted">Active:</Caption>
          <Caption variant="primary">{getActiveFiltersText()}</Caption>
        </div>
      )}

      {/* Sort Options */}
      <div className="ml-auto flex items-center space-x-2">
        <Caption variant="muted">Sort by:</Caption>
        <select className="text-xs text-gray-600 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-1 py-0.5 transition-all duration-200">
          <option value="updated">Most Recent</option>
          <option value="priority">Priority</option>
          <option value="patient">Patient Name</option>
          <option value="department">Department</option>
        </select>
      </div>
    </div>
  );
};

export default QueueFiltersComponent;
