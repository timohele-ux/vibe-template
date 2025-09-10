import React, { useState } from 'react';
import { Tabs } from '../atoms';
import { PatientDemographics, MedicalHistory, ChatHistoryTab } from '../molecules';
import type { Patient, Case } from '../../types';

interface PatientContextPanelProps {
  patient: Patient | null;
  previousCases?: Case[];
  className?: string;
}

const PatientContextPanel: React.FC<PatientContextPanelProps> = ({
  patient,
  previousCases = [],
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'chat'>('info');

  if (!patient) {
    return (
      <div className={`flex flex-col items-center justify-center h-full bg-gray-50 ${className}`}>
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Patient Selected</h3>
          <p className="text-sm text-gray-500">
            Select an active case to view patient information, medical history, and conversation patterns
          </p>
        </div>
      </div>
    );
  }

  const tabItems = [
    {
      id: 'info' as const,
      label: 'Patient Info',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      count: undefined
    },
    {
      id: 'history' as const,
      label: 'Medical History',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      count: patient.medicalInfo.conditions.length + patient.medicalInfo.medications.length + patient.medicalInfo.allergies.length
    },
    {
      id: 'chat' as const,
      label: 'Chat History',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      count: previousCases.length
    }
  ];

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Patient Context Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded"></div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Patient Context</h2>
            <p className="text-sm text-gray-600">
              {patient.firstName} {patient.lastName}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'info' && (
          <div className="space-y-4">
            <PatientDemographics patient={patient} />
            
            {/* Quick Actions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-700 mb-3">Quick Actions</div>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center space-x-2 p-2 bg-white rounded border border-gray-200 hover:bg-gray-50 text-sm">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Send Email</span>
                </button>
                <button className="flex items-center space-x-2 p-2 bg-white rounded border border-gray-200 hover:bg-gray-50 text-sm">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Call Patient</span>
                </button>
                <button className="flex items-center space-x-2 p-2 bg-white rounded border border-gray-200 hover:bg-gray-50 text-sm">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 8.25V18a2.25 2.25 0 002.25 2.25h4.5A2.25 2.25 0 0019.5 18v-6.75M8 21l4-7 4 7M3 7l3 4 3-4" />
                  </svg>
                  <span>Schedule</span>
                </button>
                <button className="flex items-center space-x-2 p-2 bg-white rounded border border-gray-200 hover:bg-gray-50 text-sm">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>View Records</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <MedicalHistory patient={patient} />
        )}

        {activeTab === 'chat' && (
          <ChatHistoryTab 
            patientId={patient.id} 
            previousCases={previousCases}
          />
        )}
      </div>

      {/* Footer Info */}
      <div className="flex-shrink-0 bg-gray-50 border-t border-gray-200 p-3">
        <div className="text-xs text-gray-500 text-center">
          Last updated: {new Date().toLocaleString()} • Patient ID: {patient.id}
        </div>
      </div>
    </div>
  );
};

export default PatientContextPanel;
