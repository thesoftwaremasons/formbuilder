import React, { useState } from 'react';
import { FormElement } from '@/lib/types';

interface TextInputProps {
  element: FormElement;
  onChange: (value: string) => void;
  isPreview?: boolean;
  value?: string;
}

export const TextInput: React.FC<TextInputProps> = ({ 
  element, 
  onChange, 
  isPreview = false, 
  value = '' 
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    
    if (error) {
      setError('');
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    
    if (element.required && !inputValue.trim()) {
      setError(`${element.label} is required`);
    }
    
    if (element.type === 'email' && inputValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue)) {
      setError('Please enter a valid email address');
    }
  };

  const getInputType = () => {
    switch (element.type) {
      case 'email': return 'email';
      case 'number': return 'number';
      default: return 'text';
    }
  };

  const containerClasses = `
    relative w-full
    ${isPreview ? 'mb-4' : 'p-4 bg-white border border-gray-200 rounded-lg'}
    ${!isPreview && isFocused ? 'ring-2 ring-blue-500 border-transparent' : ''}
  `;

  const inputClasses = `
    w-full px-3 py-2 border rounded-md transition-colors duration-200
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
    }
    focus:outline-none focus:ring-1
    ${element.required ? 'required' : ''}
    disabled:bg-gray-50 disabled:text-gray-500
  `;

  const labelClasses = `
    block text-sm font-medium mb-2 transition-colors duration-200
    ${error ? 'text-red-700' : 'text-gray-700'}
    ${element.required ? "after:content-['*'] after:text-red-500 after:ml-1" : ''}
  `;

  return (
    <div className={containerClasses}>
      {!isPreview && (
        <div className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-sm">
          {element.type.toUpperCase()}
        </div>
      )}
      
      <div className="space-y-1">
        <label className={labelClasses}>
          {element.label}
        </label>
        
        <input
          type={getInputType()}
          value={inputValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholder={element.placeholder}
          className={inputClasses}
          required={element.required}
          style={{
            width: isPreview ? '100%' : `${element.size.width}px`,
            height: `${element.size.height}px`,
          }}
        />
        
        {error && (
          <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        
        {!error && element.placeholder && isPreview && (
          <p className="text-xs text-gray-500 mt-1">
            {element.type === 'email' ? 'Enter a valid email address' : 
             element.type === 'number' ? 'Enter a number' : 
             'Enter text'}
          </p>
        )}
      </div>
    </div>
  );
};