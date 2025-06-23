import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { FormElement } from '@/lib/types';


interface SelectDropdownProps {
  element: FormElement;
  onChange: (value: string) => void;
  isPreview?: boolean;
  value?: string;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({ 
  element, 
  onChange, 
  isPreview = false, 
  value = '' 
}) => {
  const [selectedValue, setSelectedValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');

  const handleSelect = (option: string) => {
    setSelectedValue(option);
    onChange(option);
    setIsOpen(false);
    
    if (error) {
      setError('');
    }
  };

  const handleBlur = () => {
    if (element.required && !selectedValue) {
      setError(`${element.label} is required`);
    }
  };

  const containerClasses = `
    relative w-full
    ${isPreview ? 'mb-4' : 'p-4 bg-white border border-gray-200 rounded-lg'}
  `;

  const selectClasses = `
    relative w-full px-3 py-2 border rounded-md cursor-pointer transition-colors duration-200
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
    }
    ${isOpen ? 'border-blue-500 ring-1 ring-blue-500' : ''}
    focus:outline-none bg-white hover:border-gray-400
  `;

  const labelClasses = `
    block text-sm font-medium mb-2 transition-colors duration-200
    ${error ? 'text-red-700' : 'text-gray-700'}
    ${element.required ? "after:content-['*'] after:text-red-500 after:ml-1" : ''}
  `;

  const dropdownClasses = `
    absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg
    max-h-60 overflow-auto
    ${isOpen ? 'block' : 'hidden'}
  `;

  return (
    <div className={containerClasses}>
      {!isPreview && (
        <div className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-sm">
          SELECT
        </div>
      )}
      
      <div className="space-y-1">
        <label className={labelClasses}>
          {element.label}
        </label>
        
        <div className="relative">
          <div
            className={selectClasses}
            onClick={() => setIsOpen(!isOpen)}
            onBlur={handleBlur}
            tabIndex={0}
            style={{
              width: isPreview ? '100%' : `${element.size.width}px`,
              height: `${element.size.height}px`,
            }}
          >
            <div className="flex items-center justify-between h-full">
              <span className={`truncate ${selectedValue ? 'text-gray-900' : 'text-gray-500'}`}>
                {selectedValue || element.placeholder || 'Select an option'}
              </span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`} />
            </div>
          </div>
          
          <div className={dropdownClasses}>
            {element.options?.map((option, index) => (
              <div
                key={index}
                className={`
                  px-3 py-2 cursor-pointer transition-colors duration-150
                  hover:bg-blue-50 hover:text-blue-900
                  ${selectedValue === option ? 'bg-blue-100 text-blue-900' : 'text-gray-900'}
                  flex items-center justify-between
                `}
                onClick={() => handleSelect(option)}
              >
                <span>{option}</span>
                {selectedValue === option && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {error && (
          <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    </div>
  );
};