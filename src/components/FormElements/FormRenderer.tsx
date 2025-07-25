// components/FormRenderer.tsx
import { FormElement, FormRendererProps } from '@/lib/types';
import React, { useState, useEffect } from 'react';

export const FormRenderer: React.FC<FormRendererProps> = ({
  page,
  formData,
  onDataChange,
  onSubmit,
  validationErrors = {}
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
            <div className="relative">
              <input
                type="file"
                accept={element.properties?.acceptedFileTypes?.join(',') || '*'}
                multiple={element.properties?.allowMultiple}
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  handleFieldChange(element.id, element.properties?.allowMultiple ? files : files[0]);
                }}
                required={element.required}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              
              {value && (
                <div className="mt-2 space-y-2">
                  {Array.isArray(value) ? (
                    value.map((file: any, index: number) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-700">{file.name || file}</span>
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
                    ))
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

      case 'rating':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleFieldChange(element.id, rating)}
                  className={`w-8 h-8 rounded-full ${
                    (value >= rating) ? 'text-yellow-400' : 'text-gray-300'
                  } hover:text-yellow-400 transition-colors`}
                >
                  ★
                </button>
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

      case 'signature':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
              <div className="h-32 flex items-center justify-center text-gray-500">
                <span>Click to sign</span>
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
        );

      case 'range':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min={element.properties?.min || 0}
                max={element.properties?.max || 100}
                step={element.properties?.step || 1}
                value={value || (element.properties?.min || 0)}
                onChange={(e) => handleFieldChange(element.id, parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{element.properties?.min || 0}</span>
                <span className="font-medium">{value || (element.properties?.min || 0)}</span>
                <span>{element.properties?.max || 100}</span>
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
        );

      case 'progress':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {element.label}
            </label>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${value || 0}%` }}
              />
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {value || 0}% complete
            </div>
          </div>
        );

      case 'matrix':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left border-b"></th>
                    {element.properties?.columns?.map((column: string, index: number) => (
                      <th key={index} className="px-4 py-2 text-center border-b border-l">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {element.properties?.rows?.map((row: string, rowIndex: number) => (
                    <tr key={rowIndex}>
                      <td className="px-4 py-2 border-b font-medium">{row}</td>
                      {element.properties?.columns?.map((column: string, colIndex: number) => (
                        <td key={colIndex} className="px-4 py-2 text-center border-b border-l">
                          <input
                            type="radio"
                            name={`${element.id}_${rowIndex}`}
                            value={colIndex}
                            checked={value?.[rowIndex] === colIndex}
                            onChange={(e) => {
                              const newValue = { ...value };
                              newValue[rowIndex] = parseInt(e.target.value);
                              handleFieldChange(element.id, newValue);
                            }}
                            className="w-4 h-4 text-blue-600"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
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

      case 'likert':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-3">
              {element.properties?.statements?.map((statement: string, index: number) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-2">{statement}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{element.properties?.leftLabel || 'Strongly Disagree'}</span>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => {
                            const newValue = { ...value };
                            newValue[index] = rating;
                            handleFieldChange(element.id, newValue);
                          }}
                          className={`w-8 h-8 rounded-full border-2 ${
                            value?.[index] === rating
                              ? 'bg-blue-500 border-blue-500 text-white'
                              : 'border-gray-300 hover:border-blue-300'
                          } transition-colors`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{element.properties?.rightLabel || 'Strongly Agree'}</span>
                  </div>
                </div>
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

      case 'nps':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Not likely at all</span>
                <span className="text-sm text-gray-500">Extremely likely</span>
              </div>
              <div className="flex justify-between">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => handleFieldChange(element.id, score)}
                    className={`w-8 h-8 rounded-full border-2 text-sm font-medium ${
                      value === score
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'border-gray-300 hover:border-blue-300'
                    } transition-colors`}
                  >
                    {score}
                  </button>
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
        );

      case 'divider':
        return (
          <div className="mb-4">
            <hr className="border-gray-300" style={{ 
              borderColor: element.style?.borderColor || '#d1d5db',
              borderWidth: `${element.style?.borderWidth || 1}px 0 0 0`
            }} />
          </div>
        );

      case 'spacer':
        return (
          <div 
            className="mb-4" 
            style={{ 
              height: `${element.size.height}px`,
              backgroundColor: element.style?.backgroundColor || 'transparent'
            }}
          />
        );

      case 'heading':
        const HeadingTag = element.properties?.level === 'h1' ? 'h1' : 
                          element.properties?.level === 'h2' ? 'h2' : 
                          element.properties?.level === 'h3' ? 'h3' : 'h2';
        
        return (
          <div className="mb-4">
            <HeadingTag 
              className={`font-bold ${
                element.properties?.level === 'h1' ? 'text-3xl' :
                element.properties?.level === 'h2' ? 'text-2xl' :
                element.properties?.level === 'h3' ? 'text-xl' : 'text-2xl'
              }`}
              style={{ 
                color: element.style?.textColor || '#1f2937',
                textAlign: element.style?.textAlign || 'left'
              }}
            >
              {element.label}
            </HeadingTag>
          </div>
        );

      case 'paragraph':
        return (
          <div className="mb-4">
            <p 
              className="text-gray-700 leading-relaxed"
              style={{ 
                color: element.style?.textColor || '#374151',
                textAlign: element.style?.textAlign || 'left',
                fontSize: `${element.style?.fontSize || 14}px`
              }}
            >
              {element.properties?.content || element.label}
            </p>
          </div>
        );

      case 'image':
        return (
          <div className="mb-4">
            {element.properties?.src ? (
              <img 
                src={element.properties.src} 
                alt={element.properties?.alt || element.label}
                className="max-w-full h-auto rounded-lg"
                style={{
                  borderRadius: `${element.style?.borderRadius || 8}px`
                }}
              />
            ) : (
              <div className="w-full h-32 bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                No image selected
              </div>
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