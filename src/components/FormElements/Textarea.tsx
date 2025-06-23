import { FormElement } from '@/lib/types';
import React, { useState } from 'react';


interface TextareaProps {
  element: FormElement;
  onChange: (value: string) => void;
  isPreview?: boolean;
  value?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ 
  element, 
  onChange, 
  isPreview = false, 
  value = '' 
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
  };

  const containerClasses = `
    relative w-full
    ${isPreview ? 'mb-4' : 'p-4 bg-white border border-gray-200 rounded-lg'}
    ${!isPreview && isFocused ? 'ring-2 ring-blue-500 border-transparent' : ''}
  `;

  const textareaClasses = `
    w-full px-3 py-2 border rounded-md transition-colors duration-200 resize-y
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
    }
    focus:outline-none focus:ring-1
    disabled:bg-gray-50 disabled:text-gray-500
    ${isPreview ? 'resize-none overflow-hidden' : ''}
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
          TEXTAREA
        </div>
      )}
      
      <div className="space-y-1">
        <label className={labelClasses}>
          {element.label}
        </label>
        
        <textarea
          value={inputValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholder={element.placeholder}
          className={textareaClasses}
          required={element.required}
          rows={isPreview ? 3 : Math.max(3, Math.floor(element.size.height / 24))}
          style={{
            width: isPreview ? '100%' : `${element.size.width}px`,
            minHeight: isPreview ? 'auto' : `${element.size.height}px`,
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
      </div>
    </div>
  );
};