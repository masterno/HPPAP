import React from 'react';
import { BODY_PARTS_DEFINITIONS } from '../../constants';

interface BodyDiagramInputProps {
  selectedParts: string[]; // Array of body part IDs
  onChange: (partId: string) => void;
  id: string;
}

const BodyDiagramInput: React.FC<BodyDiagramInputProps> = ({ selectedParts, onChange, id }) => {
  const handlePartClick = (partId: string) => {
    onChange(partId);
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        Primary Pain Location(s): Shade the area(s) where you are currently feeling pain.
      </label>
      <svg id={id} viewBox="0 0 100 380" className="w-full max-w-xs mx-auto border border-gray-300 rounded">
        {BODY_PARTS_DEFINITIONS.map((part) => (
          <path
            key={part.id}
            d={part.path}
            data-name={part.name}
            onClick={() => handlePartClick(part.id)}
            className={`stroke-gray-700 stroke-1 hover:opacity-70 cursor-pointer transition-all ${
              selectedParts.includes(part.id) ? 'fill-red-500' : 'fill-gray-300'
            }`}
            aria-label={`Select ${part.name}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handlePartClick(part.id);}}
          />
        ))}
      </svg>
      {selectedParts.length > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          Selected: {selectedParts.map(partId => BODY_PARTS_DEFINITIONS.find(p => p.id === partId)?.name || partId).join(', ')}
        </div>
      )}
    </div>
  );
};

export default BodyDiagramInput;