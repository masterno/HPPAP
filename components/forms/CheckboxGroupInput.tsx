
import React from 'react';
import Input from '../ui/Input';

interface CheckboxGroupInputProps {
  label: string;
  options: string[];
  selectedOptions: string[];
  onChange: (option: string) => void;
  idPrefix: string;
  allowOther?: boolean;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
  otherLabel?: string;
  maxSelections?: number;
}

const CheckboxGroupInput: React.FC<CheckboxGroupInputProps> = ({
  label,
  options,
  selectedOptions,
  onChange,
  idPrefix,
  allowOther = false,
  otherValue = "",
  onOtherChange,
  otherLabel = "Other (please specify)",
  maxSelections
}) => {
  const handleCheckboxChange = (option: string) => {
    if (maxSelections && selectedOptions.length >= maxSelections && !selectedOptions.includes(option)) {
      // Optionally, provide feedback that max selections reached
      return;
    }
    onChange(option);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label} {maxSelections && `(Select up to ${maxSelections})`}</label>
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={`${idPrefix}-${index}`} className="flex items-center">
            <input
              id={`${idPrefix}-${index}`}
              name={`${idPrefix}-${option}`}
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={() => handleCheckboxChange(option)}
              disabled={maxSelections !== undefined && selectedOptions.length >= maxSelections && !selectedOptions.includes(option)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor={`${idPrefix}-${index}`} className="ml-2 block text-sm text-gray-900">
              {option}
            </label>
          </div>
        ))}
        {allowOther && onOtherChange && (
          <div className="mt-2">
            <Input
              id={`${idPrefix}-other`}
              type="text"
              label={otherLabel}
              value={otherValue}
              onChange={(e) => onOtherChange(e.target.value)}
              placeholder="Specify here"
              className="mt-1"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckboxGroupInput;
