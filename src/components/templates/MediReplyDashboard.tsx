import React, { useState, useEffect } from 'react';
import { TopNavigation, SupportRequestsQueue, ActiveCasePanel, PatientContextPanel } from '../organisms';
import type { Case, User, DashboardMetrics } from '../../types';

interface MediReplyDashboardProps {
  currentUser: User;
  cases: Case[];
  metrics: DashboardMetrics;
  onNavigate?: (section: string) => void;
  onCaseSelect?: (caseId: string) => void;
  onSendMessage?: (caseId: string, content: string, isDraft?: boolean) => void;
  onApproveAIResponse?: (caseId: string, responseId: string, modifications?: string[]) => void;
  onRejectAIResponse?: (caseId: string, responseId: string, reason: string) => void;
  onEditAIResponse?: (caseId: string, responseId: string, newContent: string) => void;
  onRequestAISuggestion?: (caseId: string) => void;
  onBatchAction?: (caseId: string, action: string, responseIds: string[], reason?: string) => void;
  onUpdateCaseStatus?: (caseId: string, status: Case['status']) => void;
  onEscalateCase?: (caseId: string, reason: string) => void;
  className?: string;
}

const MediReplyDashboard: React.FC<MediReplyDashboardProps> = ({
  currentUser,
  cases,
  metrics,
  onNavigate,
  onCaseSelect,
  onSendMessage,
  onApproveAIResponse,
  onRejectAIResponse,
  onEditAIResponse,
  onRequestAISuggestion,
  onBatchAction,
  onUpdateCaseStatus,
  onEscalateCase,
  className = ''
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string | undefined>();
  const [panelSizes, setPanelSizes] = useState({
    left: 320,
    right: 320
  });
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeMobilePanel, setActiveMobilePanel] = useState<'queue' | 'case' | 'patient'>('queue');
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'urgent' | 'info' | 'success' | 'warning';
    message: string;
    timestamp: Date;
  }>>([]);

  const selectedCase = selectedCaseId ? cases.find(c => c.id === selectedCaseId) : null;

  // Handle responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobileView(isMobile);
      
      if (isMobile && selectedCaseId) {
        setActiveMobilePanel('case');
      } else if (isMobile && !selectedCaseId) {
        setActiveMobilePanel('queue');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedCaseId]);

  // Mock real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate urgent case notifications
      const urgentCases = cases.filter(c => c.priority === 'critical' && c.status === 'new');
      if (urgentCases.length > 0 && Math.random() < 0.3) {
        const case_ = urgentCases[Math.floor(Math.random() * urgentCases.length)];
        setNotifications(prev => [{
          id: `notif-${Date.now()}`,
          type: 'urgent',
          message: `Critical case: ${case_.patient.firstName} ${case_.patient.lastName} - ${case_.subject}`,
          timestamp: new Date()
        }, ...prev.slice(0, 4)]); // Keep only last 5 notifications
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [cases]);

  // Handle case selection
  const handleCaseSelect = (caseId: string) => {
    setSelectedCaseId(caseId);
    if (onCaseSelect) {
      onCaseSelect(caseId);
    }
    if (isMobileView) {
      setActiveMobilePanel('case');
    }
  };

  // Handle navigation
  const handleNavigate = (section: string) => {
    if (onNavigate) {
      onNavigate(section);
    }
  };

  // Handle panel resizing
  const handleMouseDown = (panel: 'left' | 'right') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(panel);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const containerWidth = window.innerWidth;
      const minPanelSize = 280;
      const maxPanelSize = Math.min(400, containerWidth * 0.3);

      if (isResizing === 'left') {
        const newSize = Math.max(minPanelSize, Math.min(maxPanelSize, e.clientX));
        setPanelSizes(prev => ({ ...prev, left: newSize }));
      } else if (isResizing === 'right') {
        const newSize = Math.max(minPanelSize, Math.min(maxPanelSize, containerWidth - e.clientX));
        setPanelSizes(prev => ({ ...prev, right: newSize }));
      }
    };

    const handleMouseUp = () => {
      setIsResizing(null);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Mobile panel navigation
  const MobilePanelSelector = () => (
    <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
      {([
        { key: 'queue' as const, label: 'Queue', icon: '📋' },
        { key: 'case' as const, label: 'Case', icon: '💬' },
        { key: 'patient' as const, label: 'Patient', icon: '👤' }
      ] as const).map((panel) => (
        <button
          key={panel.key}
          onClick={() => setActiveMobilePanel(panel.key)}
          disabled={panel.key === 'case' && !selectedCaseId}
          className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeMobilePanel === panel.key
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          } ${panel.key === 'case' && !selectedCaseId ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span>{panel.icon}</span>
          <span>{panel.label}</span>
        </button>
      ))}
    </div>
  );

  // Activity indicators
  const ActivityIndicator: React.FC<{ isActive: boolean }> = ({ isActive }) => (
    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
  );

  if (isMobileView) {
    return (
      <div className={`min-h-screen bg-gray-50 ${className}`}>
        <TopNavigation 
          currentUser={{
            name: `${currentUser.firstName} ${currentUser.lastName}`,
            role: currentUser.role,
            avatar: undefined
          }}
          onNavigate={handleNavigate}
          notificationCount={notifications.length}
        />
        
        <div className="p-4">
          <MobilePanelSelector />
          
          {activeMobilePanel === 'queue' && (
            <div className="h-[calc(100vh-140px)]">
              <SupportRequestsQueue
                cases={cases}
                selectedCaseId={selectedCaseId}
                onCaseSelect={handleCaseSelect}
                metrics={metrics}
              />
            </div>
          )}
          
          {activeMobilePanel === 'case' && (
            <div className="h-[calc(100vh-140px)]">
              <ActiveCasePanel
                activeCase={selectedCase}
                onSendMessage={onSendMessage}
                onApproveAIResponse={onApproveAIResponse}
                onRejectAIResponse={onRejectAIResponse}
                onEditAIResponse={onEditAIResponse}
                onRequestAISuggestion={onRequestAISuggestion}
                onBatchAction={onBatchAction}
                onUpdateCaseStatus={onUpdateCaseStatus}
                onEscalateCase={onEscalateCase}
              />
            </div>
          )}
          
          {activeMobilePanel === 'patient' && (
            <div className="h-[calc(100vh-140px)]">
              <PatientContextPanel
                patient={selectedCase?.patient || null}
                previousCases={cases.filter(c => c.patientId === selectedCase?.patientId && c.id !== selectedCase?.id)}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Top Navigation */}
      <TopNavigation 
        currentUser={{
          name: `${currentUser.firstName} ${currentUser.lastName}`,
          role: currentUser.role,
          avatar: undefined
        }}
        onNavigate={handleNavigate}
        notificationCount={notifications.length}
      />
      
      {/* Real-time Notifications Bar */}
      {notifications.length > 0 && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <div>
                <div className="text-sm font-medium text-red-800">
                  {notifications[0].message}
                </div>
                <div className="text-xs text-red-600">
                  {notifications[0].timestamp.toLocaleTimeString()}
                  {notifications.length > 1 && ` • ${notifications.length - 1} more`}
                </div>
              </div>
            </div>
            <button
              onClick={() => setNotifications([])}
              className="text-red-600 hover:text-red-800 p-1 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label="Dismiss notification"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Three-column Dashboard Layout */}
      <div className="flex h-screen overflow-hidden">
        {/* Left Panel - Support Queue */}
        <div 
          className="flex-shrink-0 bg-white border-r border-gray-200 relative"
          style={{ width: panelSizes.left }}
        >
          <SupportRequestsQueue
            cases={cases}
            selectedCaseId={selectedCaseId}
            onCaseSelect={handleCaseSelect}
            metrics={metrics}
          />
          
          {/* Left Resize Handle */}
          <div
            className="absolute top-0 right-0 w-1 h-full bg-transparent hover:bg-primary-400 cursor-col-resize transition-colors duration-200"
            onMouseDown={handleMouseDown('left')}
          />
        </div>

        {/* Center Panel - Active Case */}
        <div className="flex-1 bg-white">
          <ActiveCasePanel
            activeCase={selectedCase}
            onSendMessage={onSendMessage}
            onApproveAIResponse={onApproveAIResponse}
            onRejectAIResponse={onRejectAIResponse}
            onEditAIResponse={onEditAIResponse}
            onRequestAISuggestion={onRequestAISuggestion}
            onBatchAction={onBatchAction}
            onUpdateCaseStatus={onUpdateCaseStatus}
            onEscalateCase={onEscalateCase}
          />
        </div>

        {/* Right Panel - Patient Context */}
        <div 
          className="flex-shrink-0 bg-white border-l border-gray-200 relative"
          style={{ width: panelSizes.right }}
        >
          <PatientContextPanel
            patient={selectedCase?.patient || null}
            previousCases={cases.filter(c => c.patientId === selectedCase?.patientId && c.id !== selectedCase?.id)}
          />
          
          {/* Right Resize Handle */}
          <div
            className="absolute top-0 left-0 w-1 h-full bg-transparent hover:bg-primary-400 cursor-col-resize transition-colors duration-200"
            onMouseDown={handleMouseDown('right')}
          />
        </div>
      </div>
      
      {/* Resize Overlay */}
      {isResizing && (
        <div className="fixed inset-0 bg-black bg-opacity-10 z-50 cursor-col-resize" />
      )}
    </div>
  );
};

export default MediReplyDashboard;
