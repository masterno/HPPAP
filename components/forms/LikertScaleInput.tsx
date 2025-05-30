
import React from 'react';
import { LikertScaleOptions } from '../../types';
import { LIKERT_OPTIONS_MAP } from '../../constants';

interface LikertScaleInputProps {
  label: string;
  value: LikertScaleOptions | null;
  onChange: (value: LikertScaleOptions) => void;
  id: string;
}

const LikertScaleInput: React.FC<LikertScaleInputProps> = ({ label, value, onChange, id }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2" id={id}>
        {LIKERT_OPTIONS_MAP.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value as LikertScaleOptions)}
            className={`px-3 py-2 rounded-md border text-sm font-medium transition-colors
                        ${value === option.value 
                          ? 'bg-blue-600 text-white border-blue-700' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LikertScaleInput;
