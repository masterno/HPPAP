
import React from 'react';
import { ImpactDailyLifeData, SpecificLifeDomainImpact, SectionProps, RatingScaleValue } from '../../types';
import RatingScaleInput from '../forms/RatingScaleInput';
import { IMPACT_DOMAINS_LABELS } from '../../constants';

const ImpactDailyLifeSection: React.FC<SectionProps> = ({ data, updateData, updateNestedData }) => {
  const sectionData = data as ImpactDailyLifeData;

  return (
    <div className="space-y-6">
      <RatingScaleInput
        id="generalInterference"
        label="IDL1: Overall, how much has pain interfered with your daily life (over past 7 days)?"
        value={sectionData.generalInterference}
        onChange={(value) => updateData('impactDailyLife', 'generalInterference', value as RatingScaleValue)}
        minLabel="0 (No interference)"
        maxLabel="10 (Completely interfered)"
      />
      
      <fieldset className="space-y-4 p-4 border border-gray-200 rounded-md">
        <legend className="text-md font-medium text-gray-700 px-1">IDL2: Specific Life Domains Affected (over past 7 days)</legend>
        <p className="text-sm text-gray-600 mb-2">To what extent has pain interfered with your:</p>
        {IMPACT_DOMAINS_LABELS.map(domain => (
          <RatingScaleInput
            key={domain.key}
            id={`idl-${domain.key}`}
            label={domain.label}
            value={sectionData.specificLifeDomains[domain.key as keyof SpecificLifeDomainImpact]}
            onChange={(value) => 
              updateNestedData && updateNestedData(
                'impactDailyLife', 
                'specificLifeDomains', 
                domain.key as keyof SpecificLifeDomainImpact, 
                value as RatingScaleValue
              )
            }
             minLabel="0 (No interference)"
            maxLabel="10 (Complete interference)"
          />
        ))}
      </fieldset>
    </div>
  );
};

export default ImpactDailyLifeSection;
