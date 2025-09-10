import React from 'react';
import { TopNavigation } from '../organisms';

const MediReplyPage: React.FC = () => {
  const handleNavigate = (section: string) => {
    console.log(`Navigating to: ${section}`);
  };

  const currentUser = {
    name: 'Dr. Sarah Johnson',
    role: 'Senior Clinician',
    avatar: undefined // Will show initials fallback
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation 
        currentUser={currentUser}
        onNavigate={handleNavigate}
        notificationCount={5}
      />
      
      {/* Placeholder content area */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              MediReply Dashboard
            </h1>
            <p className="text-gray-600 mb-8">
              AI-powered healthcare communication platform with Human-in-the-Loop oversight
            </p>
            
            {/* Three-column layout preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              <div className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Left Panel</h3>
                <p className="text-blue-700 text-sm">Support Requests Queue</p>
                <p className="text-blue-600 text-xs mt-2">Coming in Phase 3</p>
              </div>
              
              <div className="bg-green-50 border-2 border-dashed border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 mb-2">Center Panel</h3>
                <p className="text-green-700 text-sm">Active Case & AI Interaction</p>
                <p className="text-green-600 text-xs mt-2">Coming in Phase 4</p>
              </div>
              
              <div className="bg-purple-50 border-2 border-dashed border-purple-200 rounded-lg p-6">
                <h3 className="font-semibold text-purple-900 mb-2">Right Panel</h3>
                <p className="text-purple-700 text-sm">Patient Context</p>
                <p className="text-purple-600 text-xs mt-2">Coming in Phase 5</p>
              </div>
            </div>

            {/* Navigation feedback */}
            <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Top Navigation Features:</strong>
              </p>
              <ul className="text-yellow-700 text-sm mt-2 space-y-1">
                <li>✓ MediReply logo and branding</li>
                <li>✓ Navigation links: Dashboard, Knowledge Gaps, Metrics, Live</li>
                <li>✓ Search functionality with medical context</li>
                <li>✓ Notifications with healthcare-specific alerts</li>
                <li>✓ Help and profile dropdown menus</li>
                <li>✓ Mobile-responsive design</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediReplyPage;
