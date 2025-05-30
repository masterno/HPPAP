
import React from 'react';
import { PainSnapshotData, SectionProps, RatingScaleValue } from '../../types';
import RatingScaleInput from '../forms/RatingScaleInput';
import BodyDiagramInput from '../forms/BodyDiagramInput';
import CheckboxGroupInput from '../forms/CheckboxGroupInput';
import Input from '../ui/Input';
import { PAIN_DESCRIPTORS_OPTIONS } from '../../constants';

const PainSnapshotSection: React.FC<SectionProps> = ({ data, updateData }) => {
  const sectionData = data as PainSnapshotData;

  const handlePainDescriptorChange = (option: string) => {
    const newDescriptors = sectionData.painDescriptors.includes(option)
      ? sectionData.painDescriptors.filter(item => item !== option)
      : [...sectionData.painDescriptors, option];
    updateData('painSnapshot', 'painDescriptors', newDescriptors);
  };

  const handleBodyPartChange = (partId: string) => {
    const newLocations = sectionData.primaryPainLocation.includes(partId)
      ? sectionData.primaryPainLocation.filter(item => item !== partId)
      : [...sectionData.primaryPainLocation, partId];
    updateData('painSnapshot', 'primaryPainLocation', newLocations);
  };

  return (
    <div className="space-y-6">
      <RatingScaleInput
        id="currentPainIntensity"
        label="PS1: Right now, how would you rate your pain?"
        value={sectionData.currentPainIntensity}
        onChange={(value) => updateData('painSnapshot', 'currentPainIntensity', value as RatingScaleValue)}
        minLabel="0 (No pain)"
        maxLabel="10 (Pain as bad as you can imagine)"
      />
      <BodyDiagramInput
        id="primaryPainLocation"
        selectedParts={sectionData.primaryPainLocation}
        onChange={handleBodyPartChange}
      />
      <CheckboxGroupInput
        idPrefix="painDescriptors"
        label="PS3: Which of the following words best describe your main pain? (Select all that apply)"
        options={PAIN_DESCRIPTORS_OPTIONS}
        selectedOptions={sectionData.painDescriptors}
        onChange={handlePainDescriptorChange}
        allowOther
        otherValue={sectionData.otherPainDescriptor}
        onOtherChange={(value) => updateData('painSnapshot', 'otherPainDescriptor', value)}
      />
    </div>
  );
};

export default PainSnapshotSection;
