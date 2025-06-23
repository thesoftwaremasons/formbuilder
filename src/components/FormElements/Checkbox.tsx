'use client';

import React, { useState } from 'react';
import { FormElement } from '@/lib/types';
import { Check } from 'lucide-react';

interface CheckboxProps {
  element: FormElement;
  onChange: (value: string[]) => void;
  isPreview?: boolean;
  value?: string[];
}

export function Checkbox({ element, onChange, isPreview = false, value = [] }: CheckboxProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>(value);
  const [error, setError] = useState<string>('');

  const handleOptionChange = (option: string, isChecked: boolean) => {
    let newValues: string[];
    
    if (isChecked) {
      newValues = [...selectedValues, option];
    } else {
      newValues = selectedValues.filter(val => val !== option);
    }
    
    setSelectedValues(newValues);
    onChange(newValues);
    
    // Clear error when user makes a selection
    if (error && newValues.length > 0) {
      setError('');
    }
    
    // Validate if required
    if (element.required && newValues.length === 0) {
      setError(`${element.label} is required`);
    }
  };

  const handleBlur = () => {
    // Validate on blur
    if (element.required && selectedValues.length === 0) {
      setError(`${element.label} is required`);
    }
  };

  const containerClasses = `
    relative w-full
    ${isPreview ? 'mb-4' : 'p-4 bg-white border border-gray-200 rounded-lg'}
  `;

  const labelClasses = `
    block text-sm font-medium mb-3 transition-colors duration-200
    ${error ? 'text-red-700' : 'text-gray-700'}
    ${element.required ? "after:content-['*'] after:text-red-500 after:ml-1" : ''}
  `;

  const optionClasses = `
    flex items-center space-x-3 p-2 rounded-md transition-colors duration-150
    hover:bg-gray-50 cursor-pointer
  `;

  const checkboxClasses = `
    relative w-5 h-5 border-2 rounded transition-all duration-200 cursor-pointer
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
  `;

  const getCheckboxStyles = (isChecked: boolean) => {
    if (isChecked) {
      return 'bg-primary-600 border-primary-600 text-white';
    }
    return error 
      ? 'border-red-300 hover:border-red-400' 
      : 'border-gray-300 hover:border-gray-400 bg-white';
  };

  return (
    <div className={containerClasses}>
      {!isPreview && (
        <div className="absolute -top-2 -left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded shadow-sm">
          CHECKBOX
        </div>
      )}
      
      <div className="space-y-1">
        <label className={labelClasses}>
          {element.label}
        </label>
        
        <div 
          className="space-y-2"
          onBlur={handleBlur}
          style={{
            width: isPreview ? '100%' : `${element.size.width}px`,
          }}
        >
          {element.options?.map((option, index) => {
            const isChecked = selectedValues.includes(option);
            const optionId = `${element.id}-option-${index}`;
            
            return (
              <div key={index} className={optionClasses}>
                <div className="relative">
                  <input
                    type="checkbox"
                    id={optionId}
                    checked={isChecked}
                    onChange={(e) => handleOptionChange(option, e.target.checked)}
                    className="sr-only"
                  />
                  <label 
                    htmlFor={optionId}
                    className={`${checkboxClasses} ${getCheckboxStyles(isChecked)}`}
                  >
                    {isChecked && (
                      <Check className="w-3 h-3 absolute top-0.5 left-0.5" />
                    )}
                  </label>
                </div>
                
                <label 
                  htmlFor={optionId}
                  className="text-sm text-gray-700 cursor-pointer select-none flex-1"
                >
                  {option}
                </label>
              </div>
            );
          })}
          
          {(!element.options || element.options.length === 0) && (
            <div className="text-sm text-gray-500 py-2">
              No options configured
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        
        {!error && isPreview && selectedValues.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            {selectedValues.length} selected: {selectedValues.join(', ')}
          </p>
        )}
        
        {!error && isPreview && element.options && element.options.length > 0 && selectedValues.length === 0 && (
          <p className="text-xs text-gray-500 mt-2">
            Select one or more options
          </p>
        )}
      </div>
    </div>
  );
}