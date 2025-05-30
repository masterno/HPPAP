
import React from 'react';
import { PainPatternsTriggersData, SectionProps, PainWorstTimeOption, RatingScaleValue } from '../../types';
import RatingScaleInput from '../forms/RatingScaleInput';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import { PAIN_WORST_TIME_OPTIONS_MAP } from '../../constants';

const PainPatternsTriggersSection: React.FC<SectionProps> = ({ data, updateData }) => {
  const sectionData = data as PainPatternsTriggersData;

  return (
    <div className="space-y-6">
      <fieldset className="space-y-4 p-4 border border-gray-200 rounded-md">
        <legend className="text-md font-medium text-gray-700 px-1">PPT1: Pain Intensity - Over Past 7 Days</legend>
        <RatingScaleInput
          id="avgPainLast7Days"
          label="What was your average pain level?"
          value={sectionData.avgPainLast7Days}
          onChange={(value) => updateData('painPatternsTriggers', 'avgPainLast7Days', value as RatingScaleValue)}
        />
        <RatingScaleInput
          id="worstPainLast7Days"
          label="What was your worst pain level?"
          value={sectionData.worstPainLast7Days}
          onChange={(value) => updateData('painPatternsTriggers', 'worstPainLast7Days', value as RatingScaleValue)}
        />
        <RatingScaleInput
          id="leastPainLast7Days"
          label="What was your least pain level (when pain was present)?"
          value={sectionData.leastPainLast7Days}
          onChange={(value) => updateData('painPatternsTriggers', 'leastPainLast7Days', value as RatingScaleValue)}
        />
      </fieldset>
      
      <fieldset className="space-y-4 p-4 border border-gray-200 rounded-md">
        <legend className="text-md font-medium text-gray-700 px-1">PPT2: Pain Fluctuation (over past 7 days)</legend>
        <Select
          id="painWorstTime"
          label="My pain tended to be worst:"
          options={PAIN_WORST_TIME_OPTIONS_MAP}
          value={sectionData.painWorstTime || ""}
          onChange={(e) => updateData('painPatternsTriggers', 'painWorstTime', e.target.value as PainWorstTimeOption)}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Did specific activities consistently make your pain worse?</label>
          <div className="flex gap-4">
            <button type="button" onClick={() => updateData('painPatternsTriggers', 'activitiesWorstPain', true)} className={`px-4 py-2 rounded ${sectionData.activitiesWorstPain === true ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Yes</button>
            <button type="button" onClick={() => updateData('painPatternsTriggers', 'activitiesWorstPain', false)} className={`px-4 py-2 rounded ${sectionData.activitiesWorstPain === false ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>No</button>
          </div>
          {sectionData.activitiesWorstPain === true && (
            <Textarea
              id="activitiesWorstPainDesc"
              label="Briefly describe 1-2 activities:"
              value={sectionData.activitiesWorstPainDesc}
              onChange={(e) => updateData('painPatternsTriggers', 'activitiesWorstPainDesc', e.target.value)}
              className="mt-2"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Did specific activities or situations consistently make your pain better?</label>
           <div className="flex gap-4">
            <button type="button" onClick={() => updateData('painPatternsTriggers', 'activitiesBetterPain', true)} className={`px-4 py-2 rounded ${sectionData.activitiesBetterPain === true ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Yes</button>
            <button type="button" onClick={() => updateData('painPatternsTriggers', 'activitiesBetterPain', false)} className={`px-4 py-2 rounded ${sectionData.activitiesBetterPain === false ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>No</button>
          </div>
          {sectionData.activitiesBetterPain === true && (
            <Textarea
              id="activitiesBetterPainDesc"
              label="Briefly describe 1-2:"
              value={sectionData.activitiesBetterPainDesc}
              onChange={(e) => updateData('painPatternsTriggers', 'activitiesBetterPainDesc', e.target.value)}
              className="mt-2"
            />
          )}
        </div>
      </fieldset>
    </div>
  );
};

export default PainPatternsTriggersSection;
