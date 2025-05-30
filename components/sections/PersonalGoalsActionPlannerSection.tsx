
import React from 'react';
import { PersonalGoalsActionPlannerData, SectionProps, HPPAPData } from '../../types';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import CheckboxGroupInput from '../forms/CheckboxGroupInput';
import { IMPACT_DOMAINS_LABELS, SUPPORT_NEEDED_OPTIONS } from '../../constants';
import Input from '../ui/Input';

const PersonalGoalsActionPlannerSection: React.FC<SectionProps> = ({ data, updateData, allData }) => {
  const sectionData = data as PersonalGoalsActionPlannerData;
  const { impactDailyLife } = allData as HPPAPData;

  const limitationOptions = [
    { value: 'generalInterference', label: 'General Interference with Daily Life' },
    ...IMPACT_DOMAINS_LABELS.map(domain => ({
      value: domain.key,
      label: domain.label
    }))
  ];

  const handleSupportNeededChange = (option: string) => {
    const newSupportOptions = sectionData.supportNeeded.includes(option)
      ? sectionData.supportNeeded.filter(item => item !== option)
      : [...sectionData.supportNeeded, option];
    updateData('personalGoalsActionPlanner', 'supportNeeded', newSupportOptions);
  };

  return (
    <div className="space-y-6">
      <Select
        id="mostImpactfulLimitation"
        label="PPGA1: Thinking about Section 3 (Impact on Daily Life), which one area is pain impacting the most that you'd like to see improve?"
        options={limitationOptions}
        value={sectionData.mostImpactfulLimitation}
        onChange={(e) => updateData('personalGoalsActionPlanner', 'mostImpactfulLimitation', e.target.value)}
      />

      <Textarea
        id="smallAchievableGoal"
        label="PPGA2: What is one small, specific thing you could try to do in the next week related to managing your pain or improving an activity limited by pain? (This is for your own reflection and planning)"
        value={sectionData.smallAchievableGoal}
        onChange={(e) => updateData('personalGoalsActionPlanner', 'smallAchievableGoal', e.target.value)}
        placeholder="e.g., Try a 5-minute mindfulness exercise daily, Walk for 10 minutes 3 times"
      />
      
      <CheckboxGroupInput
        idPrefix="supportNeeded"
        label="PPGA3: What kind of support, if any, would help you achieve this goal or manage your pain better?"
        options={SUPPORT_NEEDED_OPTIONS}
        selectedOptions={sectionData.supportNeeded}
        onChange={handleSupportNeededChange}
        allowOther
        otherValue={sectionData.otherSupportNeeded}
        onOtherChange={(value) => updateData('personalGoalsActionPlanner', 'otherSupportNeeded', value)}
        otherLabel="Other support (please specify)"
      />
    </div>
  );
};

export default PersonalGoalsActionPlannerSection;
