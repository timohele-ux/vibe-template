import React, { useState } from 'react';
import { TopNavigation, SupportRequestsQueue, ActiveCasePanel } from '../organisms';
import { mockCases, mockMetrics, mockCurrentUser } from '../../mockData';
import type { Case, AIResponse } from '../../types';

const MediReplyPage: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string | undefined>();
  const [cases, setCases] = useState(mockCases);
  
  const selectedCase = selectedCaseId ? cases.find(c => c.id === selectedCaseId) : null;
  
  const handleNavigate = (section: string) => {
    console.log(`Navigating to: ${section}`);
  };

  const handleCaseSelect = (caseId: string) => {
    setSelectedCaseId(caseId);
    console.log(`Selected case: ${caseId}`);
  };

  const handleSendMessage = (caseId: string, content: string, isDraft?: boolean) => {
    console.log(`Sending ${isDraft ? 'draft' : 'message'} for case ${caseId}:`, content);
    // In a real implementation, this would send the message to the backend
  };

  const handleApproveAIResponse = (caseId: string, responseId: string, modifications?: string[]) => {
    console.log(`Approving AI response ${responseId} for case ${caseId}`, modifications);
    setCases(prevCases => 
      prevCases.map(c => 
        c.id === caseId 
          ? {
              ...c,
              aiResponses: c.aiResponses.map(response => 
                response.id === responseId 
                  ? { ...response, isApproved: true, approvedAt: new Date(), modifications }
                  : response
              )
            }
          : c
      )
    );
  };

  const handleRejectAIResponse = (caseId: string, responseId: string, reason: string) => {
    console.log(`Rejecting AI response ${responseId} for case ${caseId}:`, reason);
    setCases(prevCases => 
      prevCases.map(c => 
        c.id === caseId 
          ? {
              ...c,
              aiResponses: c.aiResponses.filter(response => response.id !== responseId)
            }
          : c
      )
    );
  };

  const handleEditAIResponse = (caseId: string, responseId: string, newContent: string) => {
    console.log(`Editing AI response ${responseId} for case ${caseId}:`, newContent);
    setCases(prevCases => 
      prevCases.map(c => 
        c.id === caseId 
          ? {
              ...c,
              aiResponses: c.aiResponses.map(response => 
                response.id === responseId 
                  ? { ...response, content: newContent, modifications: [newContent] }
                  : response
              )
            }
          : c
      )
    );
  };

  const handleRequestAISuggestion = (caseId: string) => {
    console.log(`Requesting AI suggestion for case ${caseId}`);
    // This would trigger AI suggestion generation in the parent component
  };

  const handleBatchAction = (caseId: string, action: string, responseIds: string[], reason?: string) => {
    console.log(`Batch action ${action} for case ${caseId}:`, responseIds, reason);
    
    if (action === 'approve-all') {
      setCases(prevCases => 
        prevCases.map(c => 
          c.id === caseId 
            ? {
                ...c,
                aiResponses: c.aiResponses.map(response => 
                  responseIds.includes(response.id)
                    ? { ...response, isApproved: true, approvedAt: new Date() }
                    : response
                )
              }
            : c
        )
      );
    } else if (action === 'reject-all') {
      setCases(prevCases => 
        prevCases.map(c => 
          c.id === caseId 
            ? {
                ...c,
                aiResponses: c.aiResponses.filter(response => !responseIds.includes(response.id))
              }
            : c
        )
      );
    }
  };

  const handleUpdateCaseStatus = (caseId: string, status: Case['status']) => {
    console.log(`Updating case ${caseId} status to:`, status);
    setCases(prevCases => 
      prevCases.map(c => 
        c.id === caseId 
          ? { ...c, status, updatedAt: new Date() }
          : c
      )
    );
  };

  const handleEscalateCase = (caseId: string, reason: string) => {
    console.log(`Escalating case ${caseId}:`, reason);
    setCases(prevCases => 
      prevCases.map(c => 
        c.id === caseId 
          ? { ...c, status: 'escalated', updatedAt: new Date() }
          : c
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation 
        currentUser={{
          name: `${mockCurrentUser.firstName} ${mockCurrentUser.lastName}`,
          role: mockCurrentUser.role,
          avatar: undefined
        }}
        onNavigate={handleNavigate}
        notificationCount={5}
      />
      
      {/* Three-column dashboard layout */}
      <div className="flex h-screen">
        {/* Left Panel - Support Queue */}
        <div className="w-80 flex-shrink-0">
          <SupportRequestsQueue
            cases={cases}
            selectedCaseId={selectedCaseId}
            onCaseSelect={handleCaseSelect}
            metrics={mockMetrics}
          />
        </div>

        {/* Center Panel - Active Case */}
        <div className="flex-1 bg-white border-r border-gray-200">
          <ActiveCasePanel
            activeCase={selectedCase}
            onSendMessage={handleSendMessage}
            onApproveAIResponse={handleApproveAIResponse}
            onRejectAIResponse={handleRejectAIResponse}
            onEditAIResponse={handleEditAIResponse}
            onRequestAISuggestion={handleRequestAISuggestion}
            onBatchAction={handleBatchAction}
            onUpdateCaseStatus={handleUpdateCaseStatus}
            onEscalateCase={handleEscalateCase}
          />
        </div>

        {/* Right Panel - Patient Context (Placeholder) */}
        <div className="w-80 flex-shrink-0 bg-white">
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-8">
              <div className="bg-purple-50 border-2 border-dashed border-purple-200 rounded-lg p-6">
                <h3 className="font-semibold text-purple-900 mb-2">Patient Context</h3>
                <p className="text-purple-700 text-sm mb-4">
                  Patient information, medical history, and context
                </p>
                <p className="text-purple-600 text-xs">Coming in Phase 5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediReplyPage;
