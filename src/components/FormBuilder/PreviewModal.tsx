// components/PreviewModal.tsx
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  Tablet, 
  Monitor, 
  ChevronLeft, 
  ChevronRight,
  RotateCcw,
  Send
} from 'lucide-react';
import { PreviewModalProps, PreviewState } from '@/lib/types';
import { FormRenderer } from '../FormElements/FormRenderer';
// import { PreviewModalProps, PreviewState, FormElement } from '../types';
// import { FormRenderer } from './FormRenderer';

export const PreviewModal: React.FC<PreviewModalProps> = ({
  form,
  isOpen,
  onClose,
  initialPage = 0
}) => {
  const [previewState, setPreviewState] = useState<PreviewState>({
    currentPageIndex: initialPage,
    formData: {},
    validationErrors: {},
    isSubmitting: false,
    device: 'desktop'
  });

  useEffect(() => {
    if (isOpen) {
      setPreviewState(prev => ({
        ...prev,
        currentPageIndex: initialPage,
        formData: {},
        validationErrors: {},
        isSubmitting: false
      }));
    }
  }, [isOpen, initialPage]);

  if (!isOpen || !form) return null;

  const currentPage = form.pages[previewState.currentPageIndex];
  const isFirstPage = previewState.currentPageIndex === 0;
  const isLastPage = previewState.currentPageIndex === form.pages.length - 1;
  const progress = ((previewState.currentPageIndex + 1) / form.pages.length) * 100;

  const deviceStyles = {
    desktop: 'max-w-4xl',
    tablet: 'max-w-2xl',
    mobile: 'max-w-sm'
  };

  const validateCurrentPage = (): boolean => {
    const errors: Record<string, string> = {};
    
    currentPage.elements.forEach(element => {
      if (element.type === 'submit') return;
      
      const value = previewState.formData[element.id];
      
      // Required validation
      if (element.required) {
        if (!value || (Array.isArray(value) && value.length === 0) || value.toString().trim() === '') {
          errors[element.id] = `${element.label} is required`;
        }
      }
      
      // Type-specific validation
      if (value && element.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors[element.id] = 'Please enter a valid email address';
        }
      }
      
      // Custom validation rules
      if (value && element.validation) {
        element.validation.forEach(rule => {
          switch (rule.type) {
            case 'minLength':
              if (value.length < (rule.value as number)) {
                errors[element.id] = rule.message;
              }
              break;
            case 'maxLength':
              if (value.length > (rule.value as number)) {
                errors[element.id] = rule.message;
              }
              break;
            case 'min':
              if (parseFloat(value) < (rule.value as number)) {
                errors[element.id] = rule.message;
              }
              break;
            case 'max':
              if (parseFloat(value) > (rule.value as number)) {
                errors[element.id] = rule.message;
              }
              break;
          }
        });
      }
    });
    
    setPreviewState(prev => ({ ...prev, validationErrors: errors }));
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentPage() && !isLastPage) {
      setPreviewState(prev => ({
        ...prev,
        currentPageIndex: prev.currentPageIndex + 1,
        validationErrors: {}
      }));
    }
  };

  const handlePrevious = () => {
    if (!isFirstPage) {
      setPreviewState(prev => ({
        ...prev,
        currentPageIndex: prev.currentPageIndex - 1,
        validationErrors: {}
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentPage()) return;
    
    setPreviewState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Form submitted successfully!\n\nData: ${JSON.stringify(previewState.formData, null, 2)}`);
      onClose();
    } catch (error) {
      alert('Form submission failed. Please try again.');
    } finally {
      setPreviewState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleDataChange = (data: Record<string, any>) => {
    setPreviewState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...data },
      validationErrors: {}
    }));
  };

  const handleReset = () => {
    setPreviewState({
      currentPageIndex: 0,
      formData: {},
      validationErrors: {},
      isSubmitting: false,
      device: previewState.device
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Form Preview</h2>
            <div className="text-sm text-gray-500">
              Page {previewState.currentPageIndex + 1} of {form.pages.length}
            </div>
            {form.pages.length > 1 && (
              <div className="text-sm text-gray-500">
                • {currentPage.title}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Device Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setPreviewState(prev => ({ ...prev, device: 'desktop' }))}
                className={`p-2 rounded-md transition-colors ${
                  previewState.device === 'desktop' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
                title="Desktop view"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewState(prev => ({ ...prev, device: 'tablet' }))}
                className={`p-2 rounded-md transition-colors ${
                  previewState.device === 'tablet' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
                title="Tablet view"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewState(prev => ({ ...prev, device: 'mobile' }))}
                className={`p-2 rounded-md transition-colors ${
                  previewState.device === 'mobile' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
                title="Mobile view"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Reset form"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50 p-8">
          <div className={`mx-auto transition-all duration-300 ${deviceStyles[previewState.device]}`}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Form Header */}
              <div className="p-8 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {form.title}
                </h1>
                {form.description && (
                  <p className="text-gray-600">{form.description}</p>
                )}
              </div>

              {/* Progress Bar */}
              {form.settings.showProgressBar && form.pages.length > 1 && (
                <div className="px-8 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Page Content */}
              <div className="p-8">
                {currentPage.description && (
                  <div className="mb-6">
                    <p className="text-gray-600">{currentPage.description}</p>
                  </div>
                )}

                <FormRenderer
                  page={currentPage}
                  formData={previewState.formData}
                  onDataChange={handleDataChange}
                  validationErrors={previewState.validationErrors}
                  isPreview={true}
                />
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between p-8 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={handlePrevious}
                  disabled={isFirstPage}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isFirstPage
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {form.pages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setPreviewState(prev => ({ 
                        ...prev, 
                        currentPageIndex: index,
                        validationErrors: {}
                      }))}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === previewState.currentPageIndex
                          ? 'bg-blue-600'
                          : index < previewState.currentPageIndex
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                      title={`Go to page ${index + 1}`}
                    />
                  ))}
                </div>

                {isLastPage ? (
                  <button
                    onClick={handleSubmit}
                    disabled={previewState.isSubmitting}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {previewState.isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {form.settings.submitButtonText || 'Submit Form'}
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Data Debug Panel (only in preview) */}
        <div className="p-4 bg-gray-100 border-t border-gray-200">
          <details className="text-sm">
            <summary className="font-medium text-gray-700 cursor-pointer">
              Form Data (Debug)
            </summary>
            <pre className="mt-2 p-3 bg-white rounded border text-xs overflow-auto max-h-32">
              {JSON.stringify(previewState.formData, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
};