import React, { useEffect } from 'react';
import { MediReplyDashboard } from '../templates';
import { DashboardProvider, useDashboard, dashboardActions } from '../../lib/DashboardContext';
import { ConversationStateProvider } from '../../lib/ConversationStateContext';
import { useDashboardDataService } from '../../lib/DashboardDataService';
import { useCases, useAIResponses, useNotifications } from '../../lib/hooks';
import { mockCases, mockUsers, mockMetrics } from '../../mockData';
import { healthcareScenarios } from '../../lib/enhancedMockData';
import type { Case, User, DashboardMetrics } from '../../types';

// Inner component that uses the dashboard context and enhanced data services
const MediReplyDashboardContainer: React.FC = () => {
  const { state, dispatch } = useDashboard();
  const dataService = useDashboardDataService();
  const { generateAIResponse, approveAIResponse, rejectAIResponse } = useAIResponses();
  const { addNotification } = useNotifications();

  // Initialize data on mount with enhanced scenarios
  useEffect(() => {
    dispatch(dashboardActions.setCases(mockCases));
    
    // Add a notification about system status
    addNotification({
      type: 'info',
      title: 'System Status',
      message: 'Real-time monitoring active. All systems operational.',
    });
  }, [dispatch, addNotification]);

  // Demonstrate enhanced data integration every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random healthcare scenarios
      const scenarios = Object.values(healthcareScenarios.appointment.routine);
      const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      
      if (Math.random() < 0.3) { // 30% chance
        addNotification({
          type: 'info',
          title: 'New Patient Inquiry',
          message: randomScenario.substring(0, 50) + '...',
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [addNotification]);

  // Event handlers with enhanced functionality
  const handleNavigate = (section: string) => {
    console.log('Navigating to:', section);
    addNotification({
      type: 'info',
      title: 'Navigation',
      message: `Navigated to ${section} section`,
    });
  };

  const handleCaseSelect = (caseId: string) => {
    dispatch(dashboardActions.selectCase(caseId));
    
    // Add contextual notification
    const selectedCase = state.cases.find(c => c.id === caseId);
    if (selectedCase) {
      addNotification({
        type: 'info',
        title: 'Case Selected',
        message: `Now viewing case for ${selectedCase.patient.firstName} ${selectedCase.patient.lastName}`,
      });
    }
  };

  const handleSendMessage = async (caseId: string, content: string, isDraft?: boolean) => {
    if (!state.currentUser) return;

    try {
      await dataService.sendMessage(caseId, content, 'staff');
      
      // Update case status if not draft
      if (!isDraft) {
        await dataService.updateCaseStatus(caseId, 'in-progress');
      }

      addNotification({
        type: 'success',
        title: 'Message Sent',
        message: `Message ${isDraft ? 'saved as draft' : 'sent successfully'}`,
        caseId,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Send Failed',
        message: 'Failed to send message. Please try again.',
        caseId,
      });
    }
  };

  const handleApproveAIResponse = async (caseId: string, responseId: string, modifications?: string[]) => {
    if (!state.currentUser) return;

    try {
      await approveAIResponse(responseId, modifications);
      dispatch(dashboardActions.approveAIResponse(caseId, responseId, state.currentUser.id));

      // Convert approved AI response to a staff message
      const case_ = state.cases.find(c => c.id === caseId);
      const aiResponse = case_?.aiResponses.find(r => r.id === responseId);

      if (aiResponse) {
        await dataService.sendMessage(caseId, aiResponse.content, 'staff');
        await dataService.updateCaseStatus(caseId, 'in-progress');
      }

      addNotification({
        type: 'success',
        title: 'AI Response Approved',
        message: 'AI response has been approved and sent to patient',
        caseId,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Approval Failed',
        message: 'Failed to approve AI response. Please try again.',
        caseId,
      });
    }
  };

  const handleRejectAIResponse = async (caseId: string, responseId: string, reason: string) => {
    try {
      await rejectAIResponse(responseId, reason);
      dispatch(dashboardActions.rejectAIResponse(caseId, responseId));

      addNotification({
        type: 'warning',
        title: 'AI Response Rejected',
        message: `Reason: ${reason}`,
        caseId,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Rejection Failed',
        message: 'Failed to reject AI response. Please try again.',
        caseId,
      });
    }
  };

  const handleEditAIResponse = async (caseId: string, responseId: string, newContent: string) => {
    // In a real app, this would update the AI response content
    console.log('Editing AI response:', { caseId, responseId, newContent });
    
    addNotification({
      type: 'info',
      title: 'AI Response Modified',
      message: 'AI response has been edited and is ready for review',
      caseId,
    });
  };

  const handleRequestAISuggestion = async (caseId: string) => {
    try {
      const case_ = state.cases.find(c => c.id === caseId);
      if (!case_) return;

      const context = case_.messages.map(m => m.content).join(' ');
      const aiResponse = await generateAIResponse(caseId, context);
      dispatch(dashboardActions.addAIResponse(caseId, aiResponse));

      // Show different notifications based on confidence level
      const notificationType = aiResponse.confidence === 'high' ? 'success' : 
                              aiResponse.confidence === 'medium' ? 'info' : 'warning';

      addNotification({
        type: notificationType,
        title: `AI Suggestion Generated (${aiResponse.confidence} confidence)`,
        message: `AI response ready for review - ${Math.round(aiResponse.confidenceScore)}% confidence`,
        caseId,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'AI Generation Failed',
        message: 'Failed to generate AI response. Please try again.',
        caseId,
      });
    }
  };

  const handleBatchAction = async (caseId: string, action: string, responseIds: string[], reason?: string) => {
    if (!state.currentUser) return;

    try {
      if (action === 'approve') {
        for (const responseId of responseIds) {
          await approveAIResponse(responseId);
          dispatch(dashboardActions.approveAIResponse(caseId, responseId, state.currentUser.id));
        }
      } else if (action === 'reject') {
        for (const responseId of responseIds) {
          await rejectAIResponse(responseId, reason || 'Batch rejection');
          dispatch(dashboardActions.rejectAIResponse(caseId, responseId));
        }
      }

      addNotification({
        type: 'success',
        title: 'Batch Action Completed',
        message: `${action} ${responseIds.length} AI response${responseIds.length !== 1 ? 's' : ''}`,
        caseId,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Batch Action Failed',
        message: `Failed to ${action} responses. Please try again.`,
        caseId,
      });
    }
  };

  const handleUpdateCaseStatus = async (caseId: string, status: Case['status']) => {
    try {
      await dataService.updateCaseStatus(caseId, status);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Status Update Failed',
        message: 'Failed to update case status. Please try again.',
        caseId,
      });
    }
  };

  const handleEscalateCase = async (caseId: string, reason: string) => {
    try {
      await dataService.updateCaseStatus(caseId, 'escalated', reason);

      // Add additional escalation notification
      addNotification({
        type: 'warning',
        title: 'Case Escalated',
        message: `Case escalated to clinical team. Reason: ${reason}`,
        caseId,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Escalation Failed',
        message: 'Failed to escalate case. Please try again.',
        caseId,
      });
    }
  };

  if (!state.currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading MediReply Dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Enhanced with realistic healthcare scenarios</p>
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

// Main component with context provider and enhanced data integration
const MediReplyApp: React.FC = () => {
  return (
    <ConversationStateProvider>
      <DashboardProvider
        initialCases={mockCases}
        initialUser={mockUsers[0]} // Use first mock user as current user
      >
        <MediReplyDashboardContainer />
      </DashboardProvider>
    </ConversationStateProvider>
  );
};

export default MediReplyApp;
