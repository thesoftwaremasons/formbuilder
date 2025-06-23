import React, { useState } from 'react';
import { FormElement } from '@/lib/types';
import { TextInput } from './TextInput';
import { Textarea } from './Textarea';
import { SelectDropdown } from './SelectDropdown';
import { Checkbox } from './Checkbox';
// import { RadioGroup } from './RadioGroup';
import { DateInput } from './DateInput';
import { FileUpload } from './FileUpload';
import { SubmitButton } from './SubmitButton';
import { Move, Trash2, Copy, Settings } from 'lucide-react';

interface FormElementRendererProps {
  element: FormElement;
  isSelected: boolean;
  onUpdate: (updates: Partial<FormElement>) => void;
  onDelete: () => void;
  isDragging?: boolean;
}

export const FormElementRenderer: React.FC<FormElementRendererProps> = ({
  element,
  isSelected,
  onUpdate,
  onDelete,
  isDragging = false
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleDuplicate = () => {
    // Create a duplicate element
    const duplicateElement = {
      ...element,
      id: `element_${Date.now()}`,
      position: {
        x: element.position.x + 20,
        y: element.position.y + 20
      },
      label: `${element.label} (Copy)`
    };
    console.log('Duplicate element:', duplicateElement);
  };

  const renderElement = () => {
    const commonProps = {
      element,
      onChange: (value: any) => console.log('Element value changed:', value),
      isPreview: false,
    };

    switch (element.type) {
      case 'text':
      case 'email':
      case 'number':
        return <TextInput {...commonProps} />;
      
      case 'textarea':
        return <Textarea {...commonProps} />;
      
      case 'select':
        return <SelectDropdown {...commonProps} />;
      
      case 'checkbox':
        return <Checkbox {...commonProps} />;
      
      // case 'radio':
      //   return <RadioGroup {...commonProps} />;
      
      case 'date':
        return <DateInput {...commonProps} />;
      
      case 'file':
        return <FileUpload {...commonProps} />;
      
      case 'submit':
        return <SubmitButton {...commonProps} />;
      
      default:
        return (
          <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg text-center">
            <p className="text-gray-600">Unsupported element type: {element.type}</p>
          </div>
        );
    }
  };

  return (
    <div
      className={`
        group relative transition-all duration-200 
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 z-10' : 'z-1'}
        ${isDragging ? 'opacity-50' : ''}
      `}
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
      style={{
        width: `${element.size.width}px`,
        minHeight: `${element.size.height}px`,
      }}
    >
      {/* Element Controls */}
      {(isSelected || showMenu) && (
        <div className="absolute -top-10 left-0 flex items-center gap-1 bg-white border border-gray-200 rounded-md shadow-lg px-2 py-1 z-20">
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

      {/* Element Content */}
      <div className="relative h-full">
        {renderElement()}
      </div>
    </div>
  );
};