import React from 'react';
import { Avatar, Badge, Button, Heading3, BodyText, SmallText, Caption } from '../atoms';
import type { Patient } from '../../types';

interface PatientDemographicsProps {
  patient: Patient;
  className?: string;
}

const PatientDemographics: React.FC<PatientDemographicsProps> = ({
  patient,
  className = ''
}) => {
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  const getPreferredContactMethods = (): string[] => {
    const methods: string[] = [];
    if (patient.communicationPreferences.email) methods.push('Email');
    if (patient.communicationPreferences.sms) methods.push('SMS');
    if (patient.communicationPreferences.phone) methods.push('Phone');
    if (patient.communicationPreferences.portal) methods.push('Portal');
    return methods;
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      {/* Patient Header */}
      <div className="flex items-start space-x-4 mb-4">
        <Avatar
          fallback={`${patient.firstName[0]}${patient.lastName[0]}`}
          size="lg"
          userType="patient"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <Heading3 className="text-gray-900">
              {patient.firstName} {patient.lastName}
            </Heading3>
            <Button
              variant="outline"
              size="xs"
              className="text-xs"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Button>
          </div>
          <BodyText className="text-gray-600">
            Age {calculateAge(patient.dateOfBirth)} • DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
          </BodyText>
          {patient.preferredLanguage && (
            <Caption className="text-gray-500 mt-1">
              Preferred Language: {patient.preferredLanguage}
            </Caption>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <SmallText className="font-medium text-gray-700">Contact Information</SmallText>
        </div>
        
        <div className="space-y-2 pl-2">
          {patient.email && (
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <SmallText className="text-gray-600">{patient.email}</SmallText>
            </div>
          )}
          
          {patient.phone && (
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <SmallText className="text-gray-600">{formatPhoneNumber(patient.phone)}</SmallText>
            </div>
          )}
        </div>
      </div>

      {/* Insurance Information */}
      {patient.insuranceId && (
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">Insurance</span>
          </div>
          
          <div className="pl-2">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm text-gray-600">ID: {patient.insuranceId}</span>
            </div>
          </div>
        </div>
      )}

      {/* Communication Preferences */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">Communication Preferences</span>
        </div>
        
        <div className="pl-2">
          <div className="flex flex-wrap gap-1">
            {getPreferredContactMethods().map((method) => (
              <Badge
                key={method}
                variant="info"
                size="sm"
                className="text-xs"
              >
                {method}
              </Badge>
            ))}
            {getPreferredContactMethods().length === 0 && (
              <span className="text-xs text-gray-500">None specified</span>
            )}
          </div>
        </div>
      </div>

      {/* Risk Flags */}
      {patient.riskFlags.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">Risk Flags</span>
          </div>
          
          <div className="pl-2">
            <div className="space-y-2">
              {patient.riskFlags.map((flag, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-sm text-red-700 font-medium">{flag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Last Visit */}
      {patient.medicalInfo.lastVisit && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Last visit: {new Date(patient.medicalInfo.lastVisit).toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDemographics;
