import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface SizeSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  label: string;
}

const SizeSlider: React.FC<SizeSliderProps> = ({
  value,
  onChange,
  min,
  max,
  label
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">{value}px</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="p-1 rounded-md hover:bg-gray-100"
        >
          <Minus className="w-4 h-4" />
        </button>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="p-1 rounded-md hover:bg-gray-100"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SizeSlider;