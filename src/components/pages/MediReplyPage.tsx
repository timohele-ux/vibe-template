import React, { useState } from 'react';
import { TopNavigation, SupportRequestsQueue } from '../organisms';
import { mockCases, mockMetrics, mockCurrentUser } from '../../mockData';

const MediReplyPage: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string | undefined>();
  
  const handleNavigate = (section: string) => {
    console.log(`Navigating to: ${section}`);
  };

  const handleCaseSelect = (caseId: string) => {
    setSelectedCaseId(caseId);
    console.log(`Selected case: ${caseId}`);
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
            cases={mockCases}
            selectedCaseId={selectedCaseId}
            onCaseSelect={handleCaseSelect}
            metrics={mockMetrics}
          />
        </div>

        {/* Center Panel - Active Case (Placeholder) */}
        <div className="flex-1 bg-white border-r border-gray-200">
          <div className="h-full flex items-center justify-center">
            {selectedCaseId ? (
              <div className="text-center">
                <div className="bg-green-50 border-2 border-dashed border-green-200 rounded-lg p-8">
                  <h3 className="font-semibold text-green-900 mb-2">Active Case Panel</h3>
                  <p className="text-green-700 text-sm mb-4">Selected Case ID: {selectedCaseId}</p>
                  <p className="text-green-600 text-xs">
                    Center panel with conversation thread and AI interaction will be implemented in Phase 4
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-8">
                  <h3 className="font-semibold text-gray-600 mb-2">Select a Case</h3>
                  <p className="text-gray-500 text-sm">
                    Choose a case from the queue to view details and AI interactions
                  </p>
                </div>
              </div>
            )}
          </div>
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
