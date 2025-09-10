import React, { useState } from 'react';
import { Badge, Button, Tooltip } from '../atoms';
import type { Patient } from '../../types';

interface MedicalHistoryProps {
  patient: Patient;
  className?: string;
}

const MedicalHistory: React.FC<MedicalHistoryProps> = ({
  patient,
  className = ''
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getPriorityLevel = (condition: string): 'high' | 'medium' | 'low' => {
    const highPriorityKeywords = ['diabetes', 'hypertension', 'heart', 'cancer', 'asthma', 'copd'];
    const mediumPriorityKeywords = ['arthritis', 'depression', 'anxiety', 'migraine'];
    
    const lowerCondition = condition.toLowerCase();
    
    if (highPriorityKeywords.some(keyword => lowerCondition.includes(keyword))) {
      return 'high';
    }
    if (mediumPriorityKeywords.some(keyword => lowerCondition.includes(keyword))) {
      return 'medium';
    }
    return 'low';
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low'): string => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const formatLastVisit = (lastVisit?: string): string => {
    if (!lastVisit) return 'No recent visits';
    
    const visitDate = new Date(lastVisit);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - visitDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays <= 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  const SectionHeader: React.FC<{
    title: string;
    count: number;
    isExpanded: boolean;
    onToggle: () => void;
    icon: React.ReactNode;
    priority?: 'high' | 'medium' | 'low';
  }> = ({ title, count, isExpanded, onToggle, icon, priority }) => (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <div className="flex items-center space-x-3">
        <div className={`p-1 rounded ${priority ? getPriorityColor(priority) : 'bg-blue-100 text-blue-600'}`}>
          {icon}
        </div>
        <div className="text-left">
          <div className="font-medium text-gray-900">{title}</div>
          <div className="text-sm text-gray-500">{count} item{count !== 1 ? 's' : ''}</div>
        </div>
      </div>
      <svg 
        className={`w-5 h-5 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      {/* Medical History Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Medical History</h3>
        <Button
          variant="outline"
          size="xs"
          className="text-xs"
        >
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add
        </Button>
      </div>

      {/* Last Visit Summary */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-1">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 8.25V18a2.25 2.25 0 002.25 2.25h4.5A2.25 2.25 0 0019.5 18v-6.75M8 21l4-7 4 7M3 7l3 4 3-4" />
          </svg>
          <span className="text-sm font-medium text-blue-900">Last Visit</span>
        </div>
        <div className="text-sm text-blue-700">
          {formatLastVisit(patient.medicalInfo.lastVisit)}
        </div>
      </div>

      <div className="space-y-3">
        {/* Medical Conditions */}
        <div>
          <SectionHeader
            title="Medical Conditions"
            count={patient.medicalInfo.conditions.length}
            isExpanded={expandedSection === 'conditions'}
            onToggle={() => toggleSection('conditions')}
            priority={patient.medicalInfo.conditions.some(c => getPriorityLevel(c) === 'high') ? 'high' : 'medium'}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          
          {expandedSection === 'conditions' && (
            <div className="mt-2 pl-6 space-y-2">
              {patient.medicalInfo.conditions.length > 0 ? (
                patient.medicalInfo.conditions.map((condition, index) => {
                  const priority = getPriorityLevel(condition);
                  return (
                    <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                      <span className="text-sm text-gray-800">{condition}</span>
                      <Badge
                        variant={priority === 'high' ? 'error' : priority === 'medium' ? 'warning' : 'success'}
                        size="sm"
                        className="text-xs"
                      >
                        {priority.toUpperCase()}
                      </Badge>
                    </div>
                  );
                })
              ) : (
                <div className="text-sm text-gray-500 italic">No conditions recorded</div>
              )}
            </div>
          )}
        </div>

        {/* Medications */}
        <div>
          <SectionHeader
            title="Current Medications"
            count={patient.medicalInfo.medications.length}
            isExpanded={expandedSection === 'medications'}
            onToggle={() => toggleSection('medications')}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            }
          />
          
          {expandedSection === 'medications' && (
            <div className="mt-2 pl-6 space-y-2">
              {patient.medicalInfo.medications.length > 0 ? (
                patient.medicalInfo.medications.map((medication, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                    <span className="text-sm text-gray-800">{medication}</span>
                    <Tooltip content="View medication details">
                      <Button
                        variant="ghost"
                        size="xs"
                        className="p-1"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </Button>
                    </Tooltip>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 italic">No medications recorded</div>
              )}
            </div>
          )}
        </div>

        {/* Allergies */}
        <div>
          <SectionHeader
            title="Known Allergies"
            count={patient.medicalInfo.allergies.length}
            isExpanded={expandedSection === 'allergies'}
            onToggle={() => toggleSection('allergies')}
            priority={patient.medicalInfo.allergies.length > 0 ? 'high' : 'low'}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
          />
          
          {expandedSection === 'allergies' && (
            <div className="mt-2 pl-6 space-y-2">
              {patient.medicalInfo.allergies.length > 0 ? (
                patient.medicalInfo.allergies.map((allergy, index) => (
                  <div key={index} className="flex items-center space-x-2 py-2 px-3 bg-red-50 border border-red-200 rounded">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-800 font-medium">{allergy}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 italic">No known allergies</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Emergency Contact Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          For complete medical records, consult the patient's electronic health record (EHR) system
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;
