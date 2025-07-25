import React from 'react';
import { FormElement } from '@/lib/types';
import { Move, Copy, Trash2 } from 'lucide-react';

export interface FormElementRendererProps {
  element: FormElement;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<FormElement>) => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  isPreview?: boolean;
}

export const FormElementRenderer: React.FC<FormElementRendererProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  isPreview = false
}) => {
  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate();
    }
  };

  const renderElement = () => {
    const baseStyle = {
      backgroundColor: element.style?.backgroundColor || '#ffffff',
      color: element.style?.textColor || '#374151',
      borderColor: element.style?.borderColor || '#d1d5db',
      borderWidth: `${element.style?.borderWidth || 1}px`,
      borderRadius: `${element.style?.borderRadius || 4}px`,
      fontSize: `${element.style?.fontSize || 14}px`,
      fontWeight: element.style?.fontWeight || 'normal',
      padding: `${element.style?.padding || 12}px`,
      textAlign: element.style?.textAlign || 'left',
      width: `${element.size.width}px`,
      height: `${element.size.height}px`
    };

    switch (element.type) {
      case 'text':
      case 'email':
      case 'url':
      case 'tel':
        return (
          <input
            type={element.type}
            placeholder={element.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={baseStyle}
            disabled={!isPreview}
          />
        );

      case 'textarea':
        return (
          <textarea
            placeholder={element.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            style={baseStyle}
            disabled={!isPreview}
          />
        );

      case 'select':
        return (
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={baseStyle}
            disabled={!isPreview}
          >
            <option value="">{element.placeholder || 'Select an option...'}</option>
            {element.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {element.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name={element.id}
                  value={option}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  disabled={!isPreview}
                />
                <span className="ml-2 text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {element.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  value={option}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={!isPreview}
                />
                <span className="ml-2 text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'submit':
        return (
          <button
            type="button"
            className="px-6 py-3 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={baseStyle}
            disabled={!isPreview}
          >
            {element.label}
          </button>
        );

      case 'heading':
        const HeadingTag = element.properties?.level === 'h1' ? 'h1' : 
                          element.properties?.level === 'h2' ? 'h2' : 
                          element.properties?.level === 'h3' ? 'h3' : 'h2';
        
        return (
          <HeadingTag 
            className={`font-bold ${
              element.properties?.level === 'h1' ? 'text-3xl' :
              element.properties?.level === 'h2' ? 'text-2xl' :
              element.properties?.level === 'h3' ? 'text-xl' : 'text-2xl'
            }`}
            style={baseStyle}
          >
            {element.label}
          </HeadingTag>
        );

      case 'paragraph':
        return (
          <p className="text-gray-700 leading-relaxed" style={baseStyle}>
            {element.properties?.content || element.label}
          </p>
        );

      case 'divider':
        return (
          <hr 
            className="border-gray-300" 
            style={{ 
              borderColor: element.style?.borderColor || '#d1d5db',
              borderWidth: `${element.style?.borderWidth || 1}px 0 0 0`
            }} 
          />
        );

      default:
        return (
          <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg text-center">
            <p className="text-gray-600">Element: {element.type}</p>
            <p className="text-sm text-gray-500">{element.label}</p>
          </div>
        );
    }
  };

  return (
    <div
      className={`relative cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={onSelect}
      style={{
        position: 'absolute',
        left: `${element.position.x}px`,
        top: `${element.position.y}px`,
        width: `${element.size.width}px`,
        height: `${element.size.height}px`,
      }}
    >
      {/* Element Label */}
      {!isPreview && (
        <div className="absolute -top-6 left-0 bg-white border border-gray-200 rounded px-2 py-1 text-xs text-gray-600 shadow-sm">
          {element.label}
        </div>
      )}

      {/* Element Content */}
      <div className="w-full h-full">
        {renderElement()}
      </div>

      {/* Toolbar */}
      {isSelected && !isPreview && (
        <div className="absolute -top-8 right-0 bg-white border border-gray-200 rounded shadow-lg px-2 py-1 flex items-center gap-1">
          <span className="text-xs text-gray-500 mr-2 uppercase font-medium">
            {element.type}
          </span>
          
          <button
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Move"
          >
            <Move className="w-3 h-3" />
          </button>
          
          <button
            onClick={handleDuplicate}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Duplicate"
          >
            <Copy className="w-3 h-3" />
          </button>
          
          <div className="w-px h-4 bg-gray-300" />
          
          <button
            onClick={onDelete}
            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <>
          <div className="absolute -inset-1 border-2 border-blue-500 rounded-lg pointer-events-none" />
          
          {/* Resize Handles */}
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded cursor-se-resize" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded cursor-ne-resize" />
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded cursor-nw-resize" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded cursor-sw-resize" />
          
          {/* Edge resize handles */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-blue-500 border border-white rounded cursor-n-resize" />
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-blue-500 border border-white rounded cursor-s-resize" />
          <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-3 bg-blue-500 border border-white rounded cursor-w-resize" />
          <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-3 bg-blue-500 border border-white rounded cursor-e-resize" />
        </>
      )}
    </div>
  );
};
