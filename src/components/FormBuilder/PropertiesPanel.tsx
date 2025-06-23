// components/PropertiesPanel.tsx
import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Type, 
  Plus, 
  Trash2, 
  Palette,
  Eye,
  EyeOff,
  Copy,
  AlertCircle
} from 'lucide-react';
import { FormElement, PropertiesPanelProps } from '@/lib/types';
import { validateFormElement } from '@/lib/utils';
import { ColorPickerButton } from './ColorPalette';

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  onUpdate,
  onDelete,
  onDuplicate
}) => {
  const [localState, setLocalState] = useState<Partial<FormElement>>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    size: true,
    style: true,
    options: true,
    validation: false,
  });

  // Sync local state with selected element
  useEffect(() => {
    if (selectedElement) {
      setLocalState({
        label: selectedElement.label,
        placeholder: selectedElement.placeholder,
        required: selectedElement.required,
        options: selectedElement.options ? [...selectedElement.options] : undefined,
        position: { ...selectedElement.position },
        size: { ...selectedElement.size },
        style: { ...selectedElement.style },
        properties: { ...selectedElement.properties },
      });
      
      // Validate element
      const errors = validateFormElement(selectedElement);
      setValidationErrors(errors);
    } else {
      setLocalState({});
      setValidationErrors([]);
    }
  }, [selectedElement]);

  const handlePropertyChange = (property: string, value: any) => {
    if (!selectedElement) return;

    const updates = { [property]: value };
    setLocalState(prev => ({ ...prev, ...updates }));
    onUpdate(updates);
  };

  const handleStyleChange = (property: string, value: any) => {
    if (!selectedElement) return;

    const newStyle = { ...selectedElement.style, [property]: value };
    setLocalState(prev => ({ ...prev, style: newStyle }));
    onUpdate({ style: newStyle });
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    if (!selectedElement) return;

    const newSize = { ...selectedElement.size, [dimension]: value };
    setLocalState(prev => ({ ...prev, size: newSize }));
    onUpdate({ size: newSize });
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    if (!selectedElement) return;

    const newPosition = { ...selectedElement.position, [axis]: value };
    setLocalState(prev => ({ ...prev, position: newPosition }));
    onUpdate({ position: newPosition });
  };

  const handleOptionChange = (index: number, value: string) => {
    if (!selectedElement?.options) return;

    const newOptions = [...selectedElement.options];
    newOptions[index] = value;
    setLocalState(prev => ({ ...prev, options: newOptions }));
    onUpdate({ options: newOptions });
  };

  const addOption = () => {
    if (!selectedElement) return;

    const currentOptions = selectedElement.options || [];
    const newOptions = [...currentOptions, `Option ${currentOptions.length + 1}`];
    setLocalState(prev => ({ ...prev, options: newOptions }));
    onUpdate({ options: newOptions });
  };

  const removeOption = (index: number) => {
    if (!selectedElement?.options) return;

    const newOptions = selectedElement.options.filter((_, i) => i !== index);
    setLocalState(prev => ({ ...prev, options: newOptions }));
    onUpdate({ options: newOptions });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!selectedElement) {
    return (
      <div className="p-4 text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <Settings className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Element Selected</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            Select an element from the canvas to view and edit its properties.
          </p>
        </div>
      </div>
    );
  }

  const needsOptions = ['select', 'radio', 'checkbox'].includes(selectedElement.type);

  const SectionHeader = ({ 
    title, 
    icon: Icon, 
    sectionKey 
  }: { 
    title: string; 
    icon: any; 
    sectionKey: keyof typeof expandedSections 
  }) => (
    <button
      onClick={() => toggleSection(sectionKey)}
      className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors"
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-gray-600" />
        <h4 className="font-medium text-gray-900 text-sm">{title}</h4>
      </div>
      {expandedSections[sectionKey] ? (
        <EyeOff className="w-4 h-4 text-gray-400" />
      ) : (
        <Eye className="w-4 h-4 text-gray-400" />
      )}
    </button>
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Element Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Type className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)} Element
              </h3>
              <p className="text-xs text-gray-500">ID: {selectedElement.id}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {onDuplicate && (
              <button
                onClick={onDuplicate}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                title="Duplicate element"
              >
                <Copy className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                title="Delete element"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800 mb-2">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium text-sm">Validation Issues</span>
            </div>
            <ul className="text-xs text-red-700 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Basic Properties */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <SectionHeader title="Basic Properties" icon={Settings} sectionKey="basic" />
          
          {expandedSections.basic && (
            <div className="p-4 space-y-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label {selectedElement.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  value={localState.label || ''}
                  onChange={(e) => handlePropertyChange('label', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter label"
                />
              </div>

              {selectedElement.type !== 'submit' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Placeholder
                  </label>
                  <input
                    type="text"
                    value={localState.placeholder || ''}
                    onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter placeholder"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Required Field
                </label>
                <input
                  type="checkbox"
                  checked={localState.required || false}
                  onChange={(e) => handlePropertyChange('required', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Size & Position */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <SectionHeader title="Size & Position" icon={Type} sectionKey="size" />
          
          {expandedSections.size && (
            <div className="p-4 space-y-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    value={localState.size?.width || 0}
                    onChange={(e) => handleSizeChange('width', parseInt(e.target.value) || 50)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="50"
                    max="800"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    value={localState.size?.height || 0}
                    onChange={(e) => handleSizeChange('height', parseInt(e.target.value) || 30)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="30"
                    max="600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    X Position
                  </label>
                  <input
                    type="number"
                    value={localState.position?.x || 0}
                    onChange={(e) => handlePositionChange('x', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Y Position
                  </label>
                  <input
                    type="number"
                    value={localState.position?.y || 0}
                    onChange={(e) => handlePositionChange('y', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Styling */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <SectionHeader title="Styling" icon={Palette} sectionKey="style" />
          
          {expandedSections.style && (
            <div className="p-4 space-y-4 border-t border-gray-200">
              <ColorPickerButton
                label="Background Color"
                color={localState.style?.backgroundColor || '#ffffff'}
                onColorChange={(color) => handleStyleChange('backgroundColor', color)}
              />

              <ColorPickerButton
                label="Text Color"
                color={localState.style?.textColor || '#374151'}
                onColorChange={(color) => handleStyleChange('textColor', color)}
              />

              <ColorPickerButton
                label="Border Color"
                color={localState.style?.borderColor || '#d1d5db'}
                onColorChange={(color) => handleStyleChange('borderColor', color)}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Border Width
                  </label>
                  <input
                    type="number"
                    value={localState.style?.borderWidth || 1}
                    onChange={(e) => handleStyleChange('borderWidth', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="10"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Border Radius
                  </label>
                  <input
                    type="number"
                    value={localState.style?.borderRadius || 4}
                    onChange={(e) => handleStyleChange('borderRadius', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="50"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Options */}
        {needsOptions && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-2">
              <SectionHeader title="Options" icon={Type} sectionKey="options" />
              {expandedSections.options && (
                <button
                  onClick={addOption}
                  className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </button>
              )}
            </div>
            
            {expandedSections.options && (
              <div className="p-4 border-t border-gray-200">
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(localState.options || []).map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder={`Option ${index + 1}`}
                      />
                      <button
                        onClick={() => removeOption(index)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Remove option"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  
                  {(!localState.options || localState.options.length === 0) && (
                    <div className="text-sm text-gray-500 text-center py-4 border-2 border-dashed border-gray-200 rounded">
                      No options added yet
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};