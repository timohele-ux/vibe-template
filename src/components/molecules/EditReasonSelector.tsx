import React, { useState } from 'react';
import { Label, Select, Input, Text } from '../atoms';

export type EditReason = 
  | 'content-correction'
  | 'tone-adjustment' 
  | 'personal-information'
  | 'policy-clarification'
  | 'other';

interface EditReasonSelectorProps {
  value?: EditReason;
  customReason?: string;
  onReasonChange: (reason: EditReason, customText?: string) => void;
  required?: boolean;
  error?: string;
  className?: string;
}

const EDIT_REASON_OPTIONS = [
  { value: 'content-correction', label: 'Content correction' },
  { value: 'tone-adjustment', label: 'Tone adjustment' },
  { value: 'personal-information', label: 'Personal information handling' },
  { value: 'policy-clarification', label: 'Policy clarification' },
  { value: 'other', label: 'Other' }
] as const;

const EditReasonSelector: React.FC<EditReasonSelectorProps> = ({
  value,
  customReason = '',
  onReasonChange,
  required = true,
  error,
  className = ''
}) => {
  const [localCustomReason, setLocalCustomReason] = useState(customReason);

  const handleReasonChange = (selectedReason: string) => {
    const reason = selectedReason as EditReason;
    if (reason === 'other') {
      onReasonChange(reason, localCustomReason);
    } else {
      onReasonChange(reason);
      setLocalCustomReason('');
    }
  };

  const handleCustomReasonChange = (text: string) => {
    setLocalCustomReason(text);
    if (value === 'other') {
      onReasonChange('other', text);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div>
        <Label htmlFor="edit-reason">
          Edit Reason {required && <span className="text-red-500">*</span>}
        </Label>
        <Select
          value={value || ''}
          onValueChange={handleReasonChange}
        >
          <Select.Trigger>
            <Select.Value placeholder="Select reason for edit..." />
          </Select.Trigger>
          <Select.Content>
            {EDIT_REASON_OPTIONS.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </div>

      {value === 'other' && (
        <div>
          <Label htmlFor="custom-reason">
            Custom Reason {required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id="custom-reason"
            type="text"
            value={localCustomReason}
            onChange={(e) => handleCustomReasonChange(e.target.value)}
            placeholder="Please specify the reason for this edit..."
            className="w-full"
          />
        </div>
      )}

      {error && (
        <Text size="sm" className="text-red-600">
          {error}
        </Text>
      )}
      
      {required && !value && (
        <Text size="sm" className="text-amber-600">
          Please select a reason before saving changes
        </Text>
      )}
    </div>
  );
};

export default EditReasonSelector;
export type { EditReasonSelectorProps };
