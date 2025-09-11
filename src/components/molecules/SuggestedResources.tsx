import React from 'react';
import { Button, Badge, Text, Separator, Heading3, Caption } from '../atoms';
import { Card } from '../molecules';
import type { SuggestedResource } from '../../types';

interface SuggestedResourcesProps {
  resources: SuggestedResource[];
  onResourceClick?: (resource: SuggestedResource) => void;
  className?: string;
}

const SuggestedResources: React.FC<SuggestedResourcesProps> = ({
  resources,
  onResourceClick,
  className = ''
}) => {
  if (!resources || resources.length === 0) {
    return null;
  }

  const getResourceTypeVariant = (type: SuggestedResource['type']): 'default' | 'success' | 'warning' | 'error' | 'info' => {
    switch (type) {
      case 'policy':
        return 'info';
      case 'procedure':
        return 'success';
      case 'documentation':
        return 'default';
      case 'external':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getResourceTypeLabel = (type: SuggestedResource['type']): string => {
    switch (type) {
      case 'policy':
        return 'Policy';
      case 'procedure':
        return 'Procedure';
      case 'documentation':
        return 'Documentation';
      case 'external':
        return 'External Resource';
      default:
        return 'Resource';
    }
  };

  const getResourceIcon = (type: SuggestedResource['type']): React.ReactElement => {
    const iconClasses = 'w-4 h-4';
    
    switch (type) {
      case 'policy':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'procedure':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
      case 'documentation':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'external':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        );
      default:
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
    }
  };

  const handleResourceClick = (resource: SuggestedResource) => {
    if (onResourceClick) {
      onResourceClick(resource);
    } else {
      // Default behavior: open external links
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={`animate-fade-in ${className}`}>
      <Separator className="my-4" />
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <Heading3 className="text-blue-900">Suggested Resources</Heading3>
        </div>
        
        <Text size="sm" variant="muted" className="mb-3">
          These resources may help provide additional context or reference material for your response.
        </Text>

        <div className="space-y-2">
          {resources.map((resource) => (
            <Card key={resource.id} className="p-3 hover:bg-gray-50 state-transition cursor-pointer group">
              <div onClick={() => handleResourceClick(resource)}>
                <div className="flex items-start justify-between space-x-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 text-gray-600">
                        {getResourceIcon(resource.type)}
                      </div>
                      <Text size="sm" weight="medium" className="group-hover:text-blue-700 state-transition">
                        {resource.title}
                      </Text>
                      <Badge 
                        variant={getResourceTypeVariant(resource.type)} 
                        size="sm"
                        className="text-xs"
                      >
                        {getResourceTypeLabel(resource.type)}
                      </Badge>
                    </div>
                    
                    {resource.description && (
                      <Text size="sm" variant="muted" className="pl-5">
                        {resource.description}
                      </Text>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {resource.type === 'external' && (
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 state-transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    )}
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 state-transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <Caption variant="muted">
            {resources.length} resource{resources.length !== 1 ? 's' : ''} available
          </Caption>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Future implementation: show all resources or open resource modal
              console.log('View all resources clicked');
            }}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            View All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuggestedResources;
export type { SuggestedResourcesProps };
