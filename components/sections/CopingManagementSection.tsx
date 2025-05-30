
import React from 'react';
import { CopingManagementData, SectionProps, RatingScaleValue, StrategyHelpfulness } from '../../types';
import CheckboxGroupInput from '../forms/CheckboxGroupInput';
import RatingScaleInput from '../forms/RatingScaleInput';
import { COPING_STRATEGIES_OPTIONS } from '../../constants';

const CopingManagementSection: React.FC<SectionProps> = ({ data, updateData }) => {
  const sectionData = data as CopingManagementData;

  const handleStrategyChange = (option: string) => {
    const newStrategies = sectionData.currentStrategies.includes(option)
      ? sectionData.currentStrategies.filter(item => item !== option)
      : [...sectionData.currentStrategies, option];
    updateData('copingManagement', 'currentStrategies', newStrategies);

    // Reset dependent fields if strategy is removed
    if (!newStrategies.includes(option)) {
      const newStrategiesToRate = sectionData.mainStrategiesToRate.filter(s => s !== option);
      updateData('copingManagement', 'mainStrategiesToRate', newStrategiesToRate);
      const newHelpfulness = sectionData.mainStrategiesHelpfulness.filter(s => s.strategy !== option);
      updateData('copingManagement', 'mainStrategiesHelpfulness', newHelpfulness);
    }
  };

  const handleStrategyToRateChange = (strategy: string) => {
    let newStrategiesToRate = [...sectionData.mainStrategiesToRate];
    let newHelpfulness = [...sectionData.mainStrategiesHelpfulness];

    if (newStrategiesToRate.includes(strategy)) {
      newStrategiesToRate = newStrategiesToRate.filter(s => s !== strategy);
      newHelpfulness = newHelpfulness.filter(s => s.strategy !== strategy);
    } else if (newStrategiesToRate.length < 3) {
      newStrategiesToRate.push(strategy);
      newHelpfulness.push({ strategy, helpfulness: null });
    }
    updateData('copingManagement', 'mainStrategiesToRate', newStrategiesToRate);
    updateData('copingManagement', 'mainStrategiesHelpfulness', newHelpfulness);
  };
  
  const handleHelpfulnessChange = (strategy: string, helpfulness: RatingScaleValue) => {
    const newHelpfulness = sectionData.mainStrategiesHelpfulness.map(item => 
      item.strategy === strategy ? { ...item, helpfulness } : item
    );
    updateData('copingManagement', 'mainStrategiesHelpfulness', newHelpfulness);
  };

  const selectedCurrentStrategies = sectionData.currentStrategies.filter(s => s !== 'Other');

  return (
    <div className="space-y-6">
      <CheckboxGroupInput
        idPrefix="currentStrategies"
        label="CMS1: What have you used or done to manage your pain (over past 7 days)?"
        options={COPING_STRATEGIES_OPTIONS}
        selectedOptions={sectionData.currentStrategies}
        onChange={handleStrategyChange}
        allowOther
        otherValue={sectionData.otherStrategy}
        onOtherChange={(value) => updateData('copingManagement', 'otherStrategy', value)}
      />

      {selectedCurrentStrategies.length > 0 && (
        <fieldset className="space-y-4 p-4 border border-gray-200 rounded-md">
          <legend className="text-md font-medium text-gray-700 px-1">CMS2: Perceived Helpfulness of Main Strategies</legend>
          <p className="text-sm text-gray-600">Select up to 3 main strategies you used from the list above and rate their helpfulness.</p>
          <CheckboxGroupInput
            idPrefix="mainStrategiesToRate"
            label="Select strategies to rate (up to 3):"
            options={selectedCurrentStrategies}
            selectedOptions={sectionData.mainStrategiesToRate}
            onChange={handleStrategyToRateChange}
            maxSelections={3}
          />
          {sectionData.mainStrategiesToRate.map(strategy => {
            const helpfulnessEntry = sectionData.mainStrategiesHelpfulness.find(s => s.strategy === strategy);
            return (
              <RatingScaleInput
                key={strategy}
                id={`helpfulness-${strategy}`}
                label={`How helpful was "${strategy}"?`}
                value={helpfulnessEntry ? helpfulnessEntry.helpfulness : null}
                onChange={(value) => handleHelpfulnessChange(strategy, value as RatingScaleValue)}
                minLabel="0 (Not at all)"
                maxLabel="10 (Extremely)"
              />
            );
          })}
        </fieldset>
      )}

      <RatingScaleInput
        id="confidenceInManagement"
        label="CMS3: Overall, how confident do you feel in your ability to manage your pain effectively from day to day?"
        value={sectionData.confidenceInManagement}
        onChange={(value) => updateData('copingManagement', 'confidenceInManagement', value as RatingScaleValue)}
        minLabel="0 (Not at all confident)"
        maxLabel="10 (Completely confident)"
      />
    </div>
  );
};

export default CopingManagementSection;
