import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { FormElement } from '@/lib/types';

interface SubmitButtonProps {
  element: FormElement;
  onChange?: (value: any) => void;
  isPreview?: boolean;
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  element, 
  onChange, 
  isPreview = false, 
  onClick,
  isLoading = false,
  disabled = false 
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (!isPreview) {
      e.preventDefault();
      return;
    }
    
    if (onClick && !disabled && !isLoading) {
      onClick();
    }
  };

  const containerClasses = `
    relative w-full
    ${isPreview ? 'mb-4' : 'p-4 bg-white border border-gray-200 rounded-lg'}
  `;

  const buttonClasses = `
    inline-flex items-center justify-center gap-2 font-medium rounded-md
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500
    shadow-sm hover:shadow-md
    ${isPressed ? 'transform scale-95' : 'transform scale-100'}
  `;

  return (
    <div className={containerClasses}>
      {!isPreview && (
        <div className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-sm">
          SUBMIT
        </div>
      )}
      
      <div className={isPreview ? '' : 'flex items-center justify-center'}>
        <button
          type={isPreview ? 'submit' : 'button'}
          className={buttonClasses}
          onClick={handleClick}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          disabled={disabled || isLoading}
          style={{
            width: isPreview ? 'auto' : `${element.size.width}px`,
            height: `${element.size.height}px`,
            minWidth: isPreview ? '120px' : 'auto',
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {element.label}
            </>
          )}
        </button>
      </div>
    </div>
  );
};