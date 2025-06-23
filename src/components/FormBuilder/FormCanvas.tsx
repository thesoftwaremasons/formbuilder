// components/FormCanvas.tsx
import React, { useRef, useState, useCallback } from 'react';
import { MousePointer, Grid, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

import { ResizableFormElement } from './ResizableFormElement';
import { FormCanvasProps } from '@/lib/types';
import { cloneFormElement, sortElementsByZIndex } from '@/lib/utils';
import { CANVAS_CONFIG } from '@/lib/constants';


export const FormCanvas: React.FC<FormCanvasProps> = ({
  elements,
  selectedElement,
  onElementSelect,
  onElementUpdate,
  onElementDelete,
  onElementAdd
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    // Only deselect if clicking directly on canvas (not on elements)
    if (e.target === canvasRef.current) {
      onElementSelect(null);
    }
  }, [onElementSelect]);

  const handleElementDuplicate = useCallback((element: any) => {
    const duplicatedElement = cloneFormElement(element);
    onElementAdd(duplicatedElement);
  }, [onElementAdd]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(200, prev + 25));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(50, prev - 25));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  const sortedElements = sortElementsByZIndex(elements, selectedElement);

  const canvasStyle = {
    transform: `scale(${zoom / 100})`,
    transformOrigin: 'top left',
    width: `${canvasSize.width}px`,
    height: `${canvasSize.height}px`,
    minWidth: `${CANVAS_CONFIG.minWidth}px`,
    minHeight: `${CANVAS_CONFIG.minHeight}px`,
    backgroundColor: CANVAS_CONFIG.backgroundColor,
  };

  const gridStyle = showGrid ? {
    backgroundImage: `
      linear-gradient(to right, ${CANVAS_CONFIG.gridColor} 1px, transparent 1px),
      linear-gradient(to bottom, ${CANVAS_CONFIG.gridColor} 1px, transparent 1px)
    `,
    backgroundSize: '20px 20px'
  } : {};

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      {/* Canvas Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <MousePointer className="w-5 h-5 text-gray-500" />
            <div>
              <h3 className="font-medium text-gray-900">Form Canvas</h3>
              <p className="text-sm text-gray-500">
                {elements.length} element{elements.length !== 1 ? 's' : ''}
                {selectedElement && ` • ${selectedElement.type} selected`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-lg transition-colors ${
              showGrid 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            title="Toggle grid"
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={handleZoomOut}
              className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
              title="Zoom out"
              disabled={zoom <= 50}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleResetZoom}
              className="px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded transition-colors min-w-[3rem]"
              title="Reset zoom"
            >
              {zoom}%
            </button>
            
            <button
              onClick={handleZoomIn}
              className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
              title="Zoom in"
              disabled={zoom >= 200}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Reset Canvas */}
          <button
            onClick={() => {
              setZoom(100);
              setShowGrid(false);
              onElementSelect(null);
            }}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Reset canvas"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="flex-1 overflow-auto p-6" style={{ backgroundColor: '#f8fafc' }}>
        <div className="flex justify-center">
          <div
            ref={canvasRef}
            className="relative bg-white rounded-lg shadow-lg border border-gray-200 cursor-default"
            style={{ ...canvasStyle, ...gridStyle }}
            onClick={handleCanvasClick}
          >
            {/* Canvas Content */}
            {elements.length === 0 ? (
              <div 
                className="flex flex-col items-center justify-center text-gray-500"
                style={{ 
                  height: '100%',
                  minHeight: '400px',
                  transform: `scale(${100 / zoom})`, // Counter the zoom for this content
                  transformOrigin: 'center'
                }}
              >
                <MousePointer className="w-12 h-12 mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Start building your form</h3>
                <p className="text-sm text-center max-w-sm">
                  Click on components from the left panel to add them to your form.
                  Select elements to customize their properties.
                </p>
              </div>
            ) : (
              <>
                {sortedElements.map((element) => (
                  <ResizableFormElement
                    key={element.id}
                    element={element}
                    isSelected={selectedElement?.id === element.id}
                    onSelect={() => onElementSelect(element)}
                    onUpdate={(updates) => onElementUpdate(element.id, updates)}
                    onDelete={() => onElementDelete(element.id)}
                    onDuplicate={() => handleElementDuplicate(element)}
                    showGrid={showGrid}
                    gridSize={20}
                  />
                ))}
              </>
            )}

            {/* Canvas Info */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm border border-gray-200">
              <div className="text-xs text-gray-600">
                <div>Canvas: {canvasSize.width} × {canvasSize.height}px</div>
                <div>Zoom: {zoom}% • Grid: {showGrid ? 'On' : 'Off'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-t border-gray-200 text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <span>Elements: {elements.length}</span>
          {selectedElement && (
            <span>
              Selected: {selectedElement.type} ({selectedElement.position.x}, {selectedElement.position.y})
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <span>Canvas Size: {canvasSize.width} × {canvasSize.height}</span>
          <span>Zoom: {zoom}%</span>
        </div>
      </div>
    </div>
  );
};