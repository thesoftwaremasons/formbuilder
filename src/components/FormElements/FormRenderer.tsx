// components/FormRenderer.tsx
import { FormElement, FormRendererProps } from '@/lib/types';
import React, { useState, useEffect } from 'react';

export const FormRenderer: React.FC<FormRendererProps> = ({
  page,
  formData,
  onDataChange,
  onSubmit,
  validationErrors = {},
  isPreview = false
}) => {
  const [localData, setLocalData] = useState<Record<string, any>>({});

  useEffect(() => {
    setLocalData(formData);
  }, [formData]);

  const handleFieldChange = (elementId: string, value: any) => {
    const newData = { ...localData, [elementId]: value };
    setLocalData(newData);
    onDataChange(newData);
  };

  const renderFormElement = (element: FormElement) => {
    const value = localData[element.id] || (element.type === 'checkbox' ? [] : '');
    const error = validationErrors[element.id];
    
    const baseStyle = {
      backgroundColor: element.style?.backgroundColor || '#ffffff',
      color: element.style?.textColor || '#374151',
      borderColor: error ? '#ef4444' : (element.style?.borderColor || '#d1d5db'),
      borderWidth: `${element.style?.borderWidth || 1}px`,
      borderRadius: `${element.style?.borderRadius || 4}px`,
      borderStyle: 'solid',
      fontSize: element.style?.fontSize ? `${element.style.fontSize}px` : undefined,
      fontWeight: element.style?.fontWeight || undefined,
      textAlign: element.style?.textAlign || 'left',
    };

    const inputClass = `
      w-full px-3 py-2 border rounded-md transition-all duration-200 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
      ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
    `;

    switch (element.type) {
      case 'heading':
        return (
          <div style={baseStyle} className="mb-4">
            <h2 className="text-2xl font-bold">{element.label}</h2>
          </div>
        );

      case 'paragraph':
        return (
          <div style={baseStyle} className="mb-4">
            <p className="text-gray-700">{element.label}</p>
          </div>
        );

      case 'divider':
        return (
          <div className="my-6">
            <hr style={{ borderColor: element.style?.borderColor || '#e5e7eb' }} />
          </div>
        );

      case 'text':
      case 'email':
      case 'number':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={element.type}
              value={value}
              onChange={(e) => handleFieldChange(element.id, e.target.value)}
              placeholder={element.placeholder}
              required={element.required}
              className={inputClass}
              style={baseStyle}
              min={element.type === 'number' ? element.validation?.find(v => v.type === 'min')?.value : undefined}
              max={element.type === 'number' ? element.validation?.find(v => v.type === 'max')?.value : undefined}
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
        );

      case 'textarea':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(element.id, e.target.value)}
              placeholder={element.placeholder}
              required={element.required}
              rows={4}
              className={`${inputClass} resize-none`}
              style={baseStyle}
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
        );

      case 'select':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => handleFieldChange(element.id, e.target.value)}
              required={element.required}
              className={inputClass}
              style={baseStyle}
            >
              <option value="">{element.placeholder || 'Select an option...'}</option>
              {element.options?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {error && (
              <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}
          </div>
        );

      case 'radio':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {element.options?.map((option, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="radio"
                    name={element.id}
                    value={option}
                    checked={value === option}
                    onChange={(e) => handleFieldChange(element.id, e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    required={element.required}
                  />
                  <span className="ml-2 text-sm text-gray-700" style={{ color: element.style?.textColor }}>
                    {option}
                  </span>
                </label>
              ))}
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
        );

      case 'checkbox':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {element.options?.map((option, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    value={option}
                    checked={Array.isArray(value) && value.includes(option)}
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      if (e.target.checked) {
                        handleFieldChange(element.id, [...currentValues, option]);
                      } else {
                        handleFieldChange(element.id, currentValues.filter(v => v !== option));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700" style={{ color: element.style?.textColor }}>
                    {option}
                  </span>
                </label>
              ))}
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
        );

      case 'date':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="date"
              value={value}
              onChange={(e) => handleFieldChange(element.id, e.target.value)}
              required={element.required}
              className={inputClass}
              style={baseStyle}
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
        );

      case 'file':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ 
                borderColor: error ? '#ef4444' : (element.style?.borderColor || '#d1d5db'),
                backgroundColor: element.style?.backgroundColor || '#f9fafb'
              }}
            >
              <input
                type="file"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    const fileArray = Array.from(files).map(file => ({
                      name: file.name,
                      size: file.size,
                      type: file.type
                    }));
                    handleFieldChange(element.id, element.properties?.allowMultiple ? fileArray : fileArray[0]);
                  }
                }}
                multiple={element.properties?.allowMultiple}
                required={element.required}
                className="hidden"
                id={`file-${element.id}`}
                accept={element.properties?.allowedTypes?.join(',')}
              />
              <label htmlFor={`file-${element.id}`} className="cursor-pointer">
                <div className="text-gray-600">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm">
                    <span className="font-medium text-blue-600 hover:text-blue-500">
                      Click to upload
                    </span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {element.properties?.allowedTypes?.join(', ') || 'Any file type'} 
                    {element.properties?.maxSize && ` • Max ${Math.round(element.properties.maxSize / 1024 / 1024)}MB`}
                  </p>
                </div>
              </label>
              
              {value && (
                <div className="mt-3 text-sm text-gray-600">
                  {Array.isArray(value) ? (
                    <div className="space-y-1">
                      {value.map((file: any, index: number) => (
                        <div key={index} className="flex items-center justify-between bg-white p-2 rounded">
                          <span>{file.name || file}</span>
                          <button
                            onClick={() => {
                              const newFiles = value.filter((_: any, i: number) => i !== index);
                              handleFieldChange(element.id, newFiles.length ? newFiles : null);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-white p-2 rounded">
                      <span>{value.name || value}</span>
                      <button
                        onClick={() => handleFieldChange(element.id, null)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              )}
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
        );

      case 'submit':
        return (
          <div className="mb-4">
            <button
              type="button"
              onClick={() => onSubmit && onSubmit(localData)}
              className="px-6 py-3 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: element.style?.backgroundColor || '#3b82f6',
                color: element.style?.textColor || '#ffffff',
                borderRadius: `${element.style?.borderRadius || 6}px`,
              }}
            >
              {element.label}
            </button>
          </div>
        );

      default:
        return (
          <div className="mb-4 p-4 bg-gray-100 border border-gray-300 rounded-lg text-center">
            <p className="text-gray-600">Unsupported element type: {element.type}</p>
          </div>
        );
    }
  };

  // Sort elements by position for proper rendering order
  const sortedElements = [...page.elements].sort((a, b) => {
    if (a.position.y !== b.position.y) {
      return a.position.y - b.position.y;
    }
    return a.position.x - b.position.x;
  });

  return (
    <div className="space-y-4">
      {sortedElements.map((element) => (
        <div key={element.id}>
          {renderFormElement(element)}
        </div>
      ))}
      
      {sortedElements.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg font-medium mb-2">This page is empty</p>
          <p className="text-sm">No form elements have been added to this page</p>
        </div>
      )}
    </div>
  );
};