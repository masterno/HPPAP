
import React from 'react';
import { EmotionalWellbeingData, EmotionalResponseData, SectionProps, LikertScaleOptions } from '../../types';
import LikertScaleInput from '../forms/LikertScaleInput';

const EmotionalWellbeingSection: React.FC<SectionProps> = ({ data, updateData, updateNestedData }) => {
  const sectionData = data as EmotionalWellbeingData;
  const emotionalResponses: { key: keyof EmotionalResponseData; label: string }[] = [
    { key: 'frustrated', label: 'Frustrated' },
    { key: 'anxious', label: 'Anxious or worried about the pain' },
    { key: 'hopeless', label: 'Hopeless or helpless' },
    { key: 'angry', label: 'Angry' },
  ];

  return (
    <div className="space-y-6">
      <fieldset className="space-y-4 p-4 border border-gray-200 rounded-md">
        <legend className="text-md font-medium text-gray-700 px-1">EWP1: Emotional Response to Pain (over past 7 days)</legend>
        <p className="text-sm text-gray-600 mb-2">When your pain has been bad, how often have you felt:</p>
        {emotionalResponses.map(resp => (
          <LikertScaleInput
            key={resp.key}
            id={`ewp-${resp.key}`}
            label={resp.label}
            value={sectionData.emotionalResponse[resp.key as keyof EmotionalResponseData]}
            onChange={(value) => 
              updateNestedData && updateNestedData(
                'emotionalWellbeing', 
                'emotionalResponse', 
                resp.key as keyof EmotionalResponseData, 
                value as LikertScaleOptions
              )
            }
          />
        ))}
      </fieldset>

      <LikertScaleInput
        id="positiveOutlook"
        label="EWP2: Positive Outlook (over past 7 days): Despite the pain, how often have you been able to find moments of enjoyment or maintain a sense of hope?"
        value={sectionData.positiveOutlook}
        onChange={(value) => updateData('emotionalWellbeing', 'positiveOutlook', value as LikertScaleOptions)}
      />
    </div>
  );
};

export default EmotionalWellbeingSection;
