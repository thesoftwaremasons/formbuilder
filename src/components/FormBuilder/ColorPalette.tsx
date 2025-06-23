// components/ColorPalette.tsx
import React, { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { ColorPaletteProps } from '@/lib/types';
import { DEFAULT_COLORS } from '@/lib/constants';
import { isValidHexColor } from '@/lib/utils';


export const ColorPalette: React.FC<ColorPaletteProps> = ({ 
  onColorSelect, 
  selectedColor,
  colors = DEFAULT_COLORS 
}) => {
  const [customColor, setCustomColor] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleCustomColorSubmit = () => {
    if (isValidHexColor(customColor)) {
      onColorSelect(customColor);
      setCustomColor('');
      setShowCustomInput(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomColorSubmit();
    } else if (e.key === 'Escape') {
      setShowCustomInput(false);
      setCustomColor('');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[240px]">
      {/* Predefined Colors */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onColorSelect(color)}
            className={`
              w-12 h-12 rounded border-2 transition-all hover:scale-105 relative
              ${selectedColor === color 
                ? 'border-gray-800 ring-2 ring-gray-800 ring-offset-1' 
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
            style={{ backgroundColor: color }}
            title={color}
          >
            {selectedColor === color && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check 
                  className="w-4 h-4" 
                  style={{ 
                    color: color === '#ffffff' || color === '#f3f4f6' ? '#000000' : '#ffffff' 
                  }} 
                />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-3" />

      {/* Custom Color Section */}
      <div className="space-y-2">
        {!showCustomInput ? (
          <button
            onClick={() => setShowCustomInput(true)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Palette className="w-4 h-4" />
            Custom Color
          </button>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="#ffffff"
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={handleCustomColorSubmit}
                disabled={!isValidHexColor(customColor)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>
            <button
              onClick={() => {
                setShowCustomInput(false);
                setCustomColor('');
              }}
              className="w-full px-2 py-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Color Input Type (HTML5) */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <label className="block text-xs text-gray-600 mb-1">Or use color picker:</label>
        <input
          type="color"
          value={selectedColor || '#ffffff'}
          onChange={(e) => onColorSelect(e.target.value)}
          className="w-full h-8 border border-gray-300 rounded cursor-pointer"
        />
      </div>
    </div>
  );
};

// Color Picker Button Component
interface ColorPickerButtonProps {
  color?: string;
  onColorChange: (color: string) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ColorPickerButton: React.FC<ColorPickerButtonProps> = ({
  color = '#ffffff',
  onColorChange,
  label,
  size = 'md'
}) => {
  const [showPalette, setShowPalette] = useState(false);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const handleColorSelect = (newColor: string) => {
    onColorChange(newColor);
    setShowPalette(false);
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowPalette(!showPalette)}
          className={`
            ${sizeClasses[size]} rounded border-2 border-gray-300 cursor-pointer 
            hover:border-gray-400 transition-colors relative overflow-hidden
          `}
          style={{ backgroundColor: color }}
          title={`Current color: ${color}`}
        >
          {/* Checkerboard pattern for transparency */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 8px 8px`,
            }}
          />
        </button>
        
        <input
          type="text"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="#ffffff"
        />
      </div>

      {showPalette && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowPalette(false)} 
          />
          
          {/* Palette */}
          <div className="absolute top-full left-0 mt-2 z-50">
            <ColorPalette
              selectedColor={color}
              onColorSelect={handleColorSelect}
            />
          </div>
        </>
      )}
    </div>
  );
};