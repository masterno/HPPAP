
import React from 'react';
import { RatingScaleValue } from '../../types';

interface RatingScaleInputProps {
  label: string;
  value: RatingScaleValue;
  onChange: (value: RatingScaleValue) => void;
  id: string;
  minLabel?: string;
  maxLabel?: string;
}

const RatingScaleInput: React.FC<RatingScaleInputProps> = ({ 
  label, 
  value, 
  onChange, 
  id,
  minLabel = "0 (No Pain / No Interference)",
  maxLabel = "10 (Worst Pain / Complete Interference)" 
}) => {
  const ratings: RatingScaleValue[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2 items-center" id={id}>
        {ratings.map((rate) => (
          <button
            key={rate}
            type="button"
            onClick={() => onChange(rate)}
            className={`w-10 h-10 rounded-full border text-sm font-medium transition-colors
                        ${value === rate 
                          ? 'bg-blue-600 text-white border-blue-700' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'}`}
          >
            {rate}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
};

export default RatingScaleInput;
