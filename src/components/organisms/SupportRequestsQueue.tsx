import React, { useState, useMemo } from 'react';
import { Input, Button, Tabs } from '../atoms';
import { CaseListItem, QueueFilters, QueueStats } from '../molecules';
import type { Case, QueueFilters as QueueFiltersType, DashboardMetrics } from '../../types';

interface SupportRequestsQueueProps {
  cases: Case[];
  selectedCaseId?: string;
  onCaseSelect?: (caseId: string) => void;
  metrics: DashboardMetrics;
  className?: string;
}

const SupportRequestsQueue: React.FC<SupportRequestsQueueProps> = ({
  cases,
  selectedCaseId,
  onCaseSelect,
  metrics,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'archive'>('queue');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<QueueFiltersType>({});

  // Filter and search logic
  const filteredCases = useMemo(() => {
    let filtered = cases.filter(caseItem => {
      // Tab filtering
      if (activeTab === 'archive') {
        return caseItem.status === 'resolved';
      } else {
        return caseItem.status !== 'resolved';
      }
    });

    // Search filtering
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(caseItem => 
        `${caseItem.patient.firstName} ${caseItem.patient.lastName}`.toLowerCase().includes(query) ||
        caseItem.subject.toLowerCase().includes(query) ||
        caseItem.summary.toLowerCase().includes(query) ||
        caseItem.category.toLowerCase().includes(query) ||
        caseItem.messages.some(message => 
          message.content.toLowerCase().includes(query)
        )
      );
    }

    // Priority filtering
    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter(caseItem => 
        filters.priority!.includes(caseItem.priority)
      );
    }

    // Status filtering
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(caseItem => 
        filters.status!.includes(caseItem.status)
      );
    }

    // Department filtering
    if (filters.department && filters.department.length > 0) {
      filtered = filtered.filter(caseItem => 
        filters.department!.some(dept => 
          caseItem.category.toLowerCase().includes(dept.toLowerCase())
        )
      );
    }

    // Sort by priority and update time
    return filtered.sort((a, b) => {
      const priorityOrder = { critical: 0, urgent: 1, routine: 2, low: 3 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [cases, activeTab, searchQuery, filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.priority?.length) count++;
    if (filters.status?.length) count++;
    if (filters.department?.length) count++;
    if (filters.timeRange) count++;
    return count;
  }, [filters]);

  const getUnreadCount = (caseItem: Case): boolean => {
    return caseItem.messages.some(message => !message.isRead);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Support Queue</h2>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-1">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </Button>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live updates active"></div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <Input
            type="text"
            placeholder="Search patients, cases..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Queue Stats */}
      <QueueStats metrics={metrics} />

      {/* Tabs */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('queue')}
            className={`
              px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
              ${activeTab === 'queue' 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            Queue ({cases.filter(c => c.status !== 'resolved').length})
          </button>
          <button
            onClick={() => setActiveTab('archive')}
            className={`
              px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
              ${activeTab === 'archive' 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            Archive ({cases.filter(c => c.status === 'resolved').length})
          </button>
        </div>
      </div>

      {/* Filters */}
      <QueueFilters
        filters={filters}
        onFiltersChange={setFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Case List */}
      <div className="flex-1 overflow-y-auto">
        {filteredCases.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              {searchQuery ? 'No matching cases' : `No ${activeTab === 'queue' ? 'active' : 'archived'} cases`}
            </h3>
            <p className="text-sm text-gray-500">
              {searchQuery 
                ? 'Try adjusting your search or filters.' 
                : activeTab === 'queue' 
                  ? 'All caught up! New cases will appear here.' 
                  : 'Resolved cases will appear here.'
              }
            </p>
            {(searchQuery || activeFilterCount > 0) && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({});
                  }}
                >
                  Clear search and filters
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div>
            {filteredCases.map((caseItem, index) => (
              <CaseListItem
                key={caseItem.id}
                case={caseItem}
                isSelected={selectedCaseId === caseItem.id}
                isUnread={getUnreadCount(caseItem)}
                onClick={onCaseSelect}
              />
            ))}
            
            {/* Load more placeholder */}
            {filteredCases.length >= 20 && (
              <div className="p-4 text-center border-t border-gray-100">
                <Button variant="ghost" size="sm" className="text-blue-600">
                  Load more cases
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {filteredCases.length} of {cases.length} cases
          </span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Auto-refresh</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportRequestsQueue;
