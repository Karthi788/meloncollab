import React, { useState } from 'react';
import { Palette } from 'lucide-react';

const COLORS = [
  '#000000', '#ffffff', '#808080', '#ff0000', '#ff8000', 
  '#ffff00', '#80ff00', '#00ff00', '#00ff80', '#00ffff',
  '#0080ff', '#0000ff', '#8000ff', '#ff00ff', '#ff0080'
];

interface ColorPickerProps {
  currentColor: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ currentColor, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 w-full"
      >
        <Palette className="w-5 h-5" />
        <div
          className="w-6 h-6 rounded-full border border-gray-300"
          style={{ backgroundColor: currentColor }}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-white rounded-lg shadow-lg grid grid-cols-5 gap-1 z-50">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => {
                onChange(color);
                setIsOpen(false);
              }}
              className="w-6 h-6 rounded-full border border-gray-300 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;