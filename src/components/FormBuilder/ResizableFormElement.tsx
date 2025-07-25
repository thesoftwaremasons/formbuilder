// components/ResizableFormElement.tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Move, Trash2, Copy } from 'lucide-react';
import { SELECTION_BORDER_WIDTH, SELECTION_BORDER_COLOR, RESIZE_HANDLE_SIZE } from '@/lib/constants';
import { FormElement, DragState } from '@/lib/types';
import { snapToGrid, constrainPosition, constrainSize } from '@/lib/utils';

interface ResizableFormElementProps {
  element: FormElement;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<FormElement>) => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  showGrid?: boolean;
  gridSize?: number;
}

export const ResizableFormElement: React.FC<ResizableFormElementProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  showGrid = false,
  gridSize = 10
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    isResizing: false,
    dragStart: { x: 0, y: 0 },
    initialPos: { x: 0, y: 0 },
    initialSize: { width: 0, height: 0 },
  });

  const handleMouseDown = useCallback((e: React.MouseEvent, action: 'drag' | 'resize') => {
    e.preventDefault();
    e.stopPropagation();
    
    const newState: DragState = {
      isDragging: action === 'drag',
      isResizing: action === 'resize',
      dragStart: { x: e.clientX, y: e.clientY },
      initialPos: element.position,
      initialSize: element.size,
    };
    
    setDragState(newState);
  }, [element.position, element.size]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging && !dragState.isResizing) return;

    const deltaX = e.clientX - dragState.dragStart.x;
    const deltaY = e.clientY - dragState.dragStart.y;

    if (dragState.isDragging) {
      let newX = dragState.initialPos.x + deltaX;
      let newY = dragState.initialPos.y + deltaY;

      // Snap to grid if enabled
      if (showGrid) {
        newX = snapToGrid(newX, gridSize);
        newY = snapToGrid(newY, gridSize);
      }

      const newPosition = constrainPosition({ x: newX, y: newY });
      
      onUpdate({ position: newPosition });
    } else if (dragState.isResizing) {
      let newWidth = dragState.initialSize.width + deltaX;
      let newHeight = dragState.initialSize.height + deltaY;

      // Snap to grid if enabled
      if (showGrid) {
        newWidth = snapToGrid(newWidth, gridSize);
        newHeight = snapToGrid(newHeight, gridSize);
      }

      const newSize = constrainSize({ width: newWidth, height: newHeight });
      
      onUpdate({ size: newSize });
    }
  }, [dragState, onUpdate, showGrid, gridSize]);

  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      isResizing: false,
      dragStart: { x: 0, y: 0 },
      initialPos: { x: 0, y: 0 },
      initialSize: { width: 0, height: 0 },
    });
  }, []);

  useEffect(() => {
    if (dragState.isDragging || dragState.isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.isDragging, dragState.isResizing, handleMouseMove, handleMouseUp]);

  const renderElement = () => {
    const baseStyle = {
      backgroundColor: element.style?.backgroundColor || '#ffffff',
      color: element.style?.textColor || '#374151',
      borderColor: element.style?.borderColor || '#d1d5db',
      borderWidth: `${element.style?.borderWidth || 1}px`,
      borderRadius: `${element.style?.borderRadius || 4}px`,
      borderStyle: 'solid',
      fontSize: element.style?.fontSize ? `${element.style.fontSize}px` : undefined,
      fontWeight: element.style?.fontWeight || undefined,
      padding: element.style?.padding ? `${element.style.padding}px` : undefined,
    };

    switch (element.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <input
            type={element.type}
            placeholder={element.placeholder}
            className="w-full h-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={baseStyle}
            readOnly
          />
        );
      case 'textarea':
        return (
          <textarea
            placeholder={element.placeholder}
            className="w-full h-full px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={baseStyle}
            readOnly
          />
        );
      case 'select':
        return (
          <select
            className="w-full h-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={baseStyle}
            disabled
          >
            <option>{element.placeholder || 'Select option...'}</option>
            {element.options?.map((option, index) => (
              <option key={index}>{option}</option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="w-full h-full p-2 space-y-2" style={{ color: baseStyle.color }}>
            {element.options?.map((option, index) => (
              <label key={index} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name={element.id}
                  className="text-blue-600"
                  disabled
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="w-full h-full p-2 space-y-2" style={{ color: baseStyle.color }}>
            {element.options?.map((option, index) => (
              <label key={index} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="text-blue-600 rounded"
                  disabled
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      case 'date':
        return (
          <input
            type="date"
            className="w-full h-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={baseStyle}
            readOnly
          />
        );
      case 'file':
        return (
          <div 
            className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed"
            style={{
              ...baseStyle,
              borderStyle: 'dashed',
            }}
          >
            <div className="text-gray-500 text-sm text-center">
              <div className="mb-1">📁</div>
              <div>Click to upload</div>
            </div>
          </div>
        );
      case 'submit':
        return (
          <button
            className="w-full h-full font-medium rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              ...baseStyle,
              backgroundColor: element.style?.backgroundColor || '#3b82f6',
              color: element.style?.textColor || '#ffffff',
            }}
            disabled
          >
            {element.label}
          </button>
        );
      default:
        return (
          <div 
            className="w-full h-full flex items-center justify-center text-gray-500"
            style={baseStyle}
          >
            {element.label}
          </div>
        );
    }
  };

  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate();
    }
  };

  return (
    <div
      ref={elementRef}
      className={`
        absolute cursor-pointer group select-none
        ${isSelected ? 'z-20' : 'z-10'}
        ${dragState.isDragging ? 'cursor-move' : ''}
        ${dragState.isResizing ? 'cursor-se-resize' : ''}
      `}
      style={{
        left: `${element.position.x}px`,
        top: `${element.position.y}px`,
        width: `${element.size.width}px`,
        height: `${element.size.height}px`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Selection Border */}
      {isSelected && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            border: `${SELECTION_BORDER_WIDTH}px solid ${SELECTION_BORDER_COLOR}`,
            borderRadius: `${element.style?.borderRadius || 4}px`,
            marginTop: `-${SELECTION_BORDER_WIDTH}px`,
            marginLeft: `-${SELECTION_BORDER_WIDTH}px`,
            width: `${element.size.width + SELECTION_BORDER_WIDTH * 2}px`,
            height: `${element.size.height + SELECTION_BORDER_WIDTH * 2}px`,
          }}
        />
      )}

      {/* Element Controls */}
      {isSelected && (
        <div className="absolute -top-10 left-0 flex items-center gap-1 bg-white border border-gray-200 rounded-md shadow-lg px-2 py-1 z-30">
          <span className="text-xs text-gray-500 mr-2 uppercase font-medium">
            {element.type}
          </span>
          
          <button
            onMouseDown={(e) => handleMouseDown(e, 'drag')}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors cursor-move"
            title="Move element"
          >
            <Move className="w-3 h-3" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDuplicate();
            }}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Duplicate element"
          >
            <Copy className="w-3 h-3" />
          </button>
          
          <div className="w-px h-4 bg-gray-300" />
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
            title="Delete element"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Element Content */}
      <div className="w-full h-full relative">
        {renderElement()}
      </div>

      {/* Resize Handle */}
      {isSelected && (
        <div
          onMouseDown={(e) => handleMouseDown(e, 'resize')}
          className="absolute bg-blue-500 border-2 border-white rounded cursor-se-resize hover:bg-blue-600 transition-colors"
          style={{
            bottom: `-${RESIZE_HANDLE_SIZE / 2}px`,
            right: `-${RESIZE_HANDLE_SIZE / 2}px`,
            width: `${RESIZE_HANDLE_SIZE}px`,
            height: `${RESIZE_HANDLE_SIZE}px`,
          }}
          title="Resize element"
        />
      )}

      {/* Element Label */}
      {element.type !== 'submit' && (
        <div 
          className="absolute text-xs font-medium pointer-events-none"
          style={{
            top: '-24px',
            left: '0px',
            color: element.style?.textColor || '#374151',
          }}
        >
          {element.label}
          {element.required && <span className="text-red-500 ml-1">*</span>}
        </div>
      )}

      {/* Drag Ghost Effect */}
      {dragState.isDragging && (
        <div className="absolute inset-0 bg-blue-100 opacity-50 pointer-events-none rounded" />
      )}

      {/* Resize Preview */}
      {dragState.isResizing && (
        <div className="absolute inset-0 border-2 border-dashed border-blue-400 pointer-events-none rounded" />
      )}
    </div>
  );
};