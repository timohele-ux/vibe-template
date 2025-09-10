import React from 'react';
import { MediReplyDashboard } from '../templates';
import { DashboardProvider, useDashboard, dashboardActions } from '../../lib/DashboardContext';
import { mockCases, mockUsers, mockMetrics } from '../../mockData';
import type { Case, User, DashboardMetrics } from '../../types';

// Inner component that uses the dashboard context
const MediReplyDashboardContainer: React.FC = () => {
  const { state, dispatch } = useDashboard();

  // Initialize data on mount
  React.useEffect(() => {
    dispatch(dashboardActions.setCases(mockCases));
  }, [dispatch]);

  // Event handlers
  const handleNavigate = (section: string) => {
    console.log('Navigating to:', section);
    // In a real app, this would handle routing
  };

  const handleCaseSelect = (caseId: string) => {
    dispatch(dashboardActions.selectCase(caseId));
  };

  const handleSendMessage = async (caseId: string, content: string, isDraft?: boolean) => {
    if (!state.currentUser) return;

    const message = {
      id: `msg-${Date.now()}`,
      content,
      timestamp: new Date(),
      senderType: 'staff' as const,
      senderId: state.currentUser.id,
      senderName: `${state.currentUser.firstName} ${state.currentUser.lastName}`,
      isRead: true,
    };

    dispatch(dashboardActions.sendMessage(caseId, message));

    // Update case status if not draft
    if (!isDraft) {
      dispatch(dashboardActions.updateCaseStatus(caseId, 'in-progress'));
    }

    // Add success notification
    dispatch(dashboardActions.addNotification({
      id: `notif-${Date.now()}`,
      type: 'success',
      title: 'Message Sent',
      message: `Message ${isDraft ? 'saved as draft' : 'sent successfully'}`,
      timestamp: new Date(),
      isRead: false,
      caseId,
    }));
  };

  const handleApproveAIResponse = async (caseId: string, responseId: string, modifications?: string[]) => {
    if (!state.currentUser) return;

    dispatch(dashboardActions.approveAIResponse(caseId, responseId, state.currentUser.id));

    // Convert approved AI response to a staff message
    const case_ = state.cases.find(c => c.id === caseId);
    const aiResponse = case_?.aiResponses.find(r => r.id === responseId);

    if (aiResponse) {
      const message = {
        id: `msg-${Date.now()}`,
        content: aiResponse.content,
        timestamp: new Date(),
        senderType: 'staff' as const,
        senderId: state.currentUser.id,
        senderName: `${state.currentUser.firstName} ${state.currentUser.lastName}`,
        isRead: true,
      };

      dispatch(dashboardActions.sendMessage(caseId, message));
      dispatch(dashboardActions.updateCaseStatus(caseId, 'in-progress'));
    }

    // Add success notification
    dispatch(dashboardActions.addNotification({
      id: `notif-${Date.now()}`,
      type: 'success',
      title: 'AI Response Approved',
      message: 'AI response has been approved and sent to patient',
      timestamp: new Date(),
      isRead: false,
      caseId,
    }));
  };

  const handleRejectAIResponse = async (caseId: string, responseId: string, reason: string) => {
    dispatch(dashboardActions.rejectAIResponse(caseId, responseId));

    // Add info notification
    dispatch(dashboardActions.addNotification({
      id: `notif-${Date.now()}`,
      type: 'info',
      title: 'AI Response Rejected',
      message: `Reason: ${reason}`,
      timestamp: new Date(),
      isRead: false,
      caseId,
    }));
  };

  const handleEditAIResponse = async (caseId: string, responseId: string, newContent: string) => {
    // In a real app, this would update the AI response content
    console.log('Editing AI response:', { caseId, responseId, newContent });
  };

  const handleRequestAISuggestion = async (caseId: string) => {
    // Mock AI response generation
    const mockAIResponse = {
      id: `ai-${Date.now()}`,
      caseId,
      content: "Based on the patient's inquiry, I recommend scheduling a follow-up appointment within 2 weeks. Please ensure to review their recent lab results and adjust medication dosage if necessary.",
      confidence: 'high' as const,
      confidenceScore: 92,
      clinicalReasoning: "Patient shows consistent symptoms that align with their medical history. Recent vitals are stable, and current medication appears effective with minor adjustment needed.",
      suggestedActions: [
        "Schedule follow-up appointment",
        "Review recent lab results",
        "Consider medication dosage adjustment"
      ],
      riskAssessment: {
        level: 'low' as const,
        factors: ["Stable vital signs", "Consistent medication compliance"]
      },
      generatedAt: new Date(),
      isApproved: false,
    };

    dispatch(dashboardActions.addAIResponse(caseId, mockAIResponse));

    // Add info notification
    dispatch(dashboardActions.addNotification({
      id: `notif-${Date.now()}`,
      type: 'info',
      title: 'AI Suggestion Generated',
      message: 'New AI response ready for review',
      timestamp: new Date(),
      isRead: false,
      caseId,
    }));
  };

  const handleBatchAction = async (caseId: string, action: string, responseIds: string[], reason?: string) => {
    if (!state.currentUser) return;

    if (action === 'approve') {
      responseIds.forEach(responseId => {
        dispatch(dashboardActions.approveAIResponse(caseId, responseId, state.currentUser!.id));
      });
    } else if (action === 'reject') {
      responseIds.forEach(responseId => {
        dispatch(dashboardActions.rejectAIResponse(caseId, responseId));
      });
    }

    // Add notification
    dispatch(dashboardActions.addNotification({
      id: `notif-${Date.now()}`,
      type: 'success',
      title: 'Batch Action Completed',
      message: `${action} ${responseIds.length} AI response${responseIds.length !== 1 ? 's' : ''}`,
      timestamp: new Date(),
      isRead: false,
      caseId,
    }));
  };

  const handleUpdateCaseStatus = async (caseId: string, status: Case['status']) => {
    dispatch(dashboardActions.updateCaseStatus(caseId, status));

    // Add notification
    dispatch(dashboardActions.addNotification({
      id: `notif-${Date.now()}`,
      type: 'info',
      title: 'Case Status Updated',
      message: `Case status changed to ${status}`,
      timestamp: new Date(),
      isRead: false,
      caseId,
    }));
  };

  const handleEscalateCase = async (caseId: string, reason: string) => {
    dispatch(dashboardActions.updateCaseStatus(caseId, 'escalated'));

    // Add warning notification
    dispatch(dashboardActions.addNotification({
      id: `notif-${Date.now()}`,
      type: 'warning',
      title: 'Case Escalated',
      message: `Reason: ${reason}`,
      timestamp: new Date(),
      isRead: false,
      caseId,
    }));
  };

  if (!state.currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading MediReply Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <MediReplyDashboard
      currentUser={state.currentUser}
      cases={state.cases}
      metrics={state.metrics}
      onNavigate={handleNavigate}
      onCaseSelect={handleCaseSelect}
      onSendMessage={handleSendMessage}
      onApproveAIResponse={handleApproveAIResponse}
      onRejectAIResponse={handleRejectAIResponse}
      onEditAIResponse={handleEditAIResponse}
      onRequestAISuggestion={handleRequestAISuggestion}
      onBatchAction={handleBatchAction}
      onUpdateCaseStatus={handleUpdateCaseStatus}
      onEscalateCase={handleEscalateCase}
    />
  );
};

// Main component with context provider
const MediReplyApp: React.FC = () => {
  return (
    <DashboardProvider
      initialCases={mockCases}
      initialUser={mockUsers[0]} // Use first mock user as current user
    >
      <MediReplyDashboardContainer />
    </DashboardProvider>
  );
};

export default MediReplyApp;
