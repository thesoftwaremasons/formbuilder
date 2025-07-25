import React, { useState } from 'react';
import { Form, FormSubmission } from '@/lib/types';
import { FormRenderer } from '@/components/FormElements/FormRenderer';
import { WorkflowService } from '@/lib/workflow-service';
import { CheckCircle, AlertCircle, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';

export interface FormSubmissionHandlerProps {
  form: Form;
  onSubmissionComplete?: (submission: FormSubmission) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const FormSubmissionHandler: React.FC<FormSubmissionHandlerProps> = ({
  form,
  onSubmissionComplete,
  onError,
  className = ''
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);

  const workflowService = WorkflowService.getInstance();
  const currentPage = form.pages[currentPageIndex];
  const isLastPage = currentPageIndex === form.pages.length - 1;
  const isFirstPage = currentPageIndex === 0;

  const validatePage = (pageIndex: number): boolean => {
    const page = form.pages[pageIndex];
    const errors: Record<string, string> = {};
    let isValid = true;

    page.elements.forEach(element => {
      const value = formData[element.id];
      
      // Check required fields
      if (element.required && (!value || value === '' || (Array.isArray(value) && value.length === 0))) {
        errors[element.id] = `${element.label} is required`;
        isValid = false;
      }

      // Check validation rules
      if (element.validation && value) {
        element.validation.forEach(rule => {
          switch (rule.type) {
            case 'email':
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errors[element.id] = rule.message || 'Invalid email format';
                isValid = false;
              }
              break;
            case 'minLength':
              if (value.length < (rule.value as number)) {
                errors[element.id] = rule.message || `Minimum length is ${rule.value}`;
                isValid = false;
              }
              break;
            case 'maxLength':
              if (value.length > (rule.value as number)) {
                errors[element.id] = rule.message || `Maximum length is ${rule.value}`;
                isValid = false;
              }
              break;
            case 'min':
              if (Number(value) < (rule.value as number)) {
                errors[element.id] = rule.message || `Minimum value is ${rule.value}`;
                isValid = false;
              }
              break;
            case 'max':
              if (Number(value) > (rule.value as number)) {
                errors[element.id] = rule.message || `Maximum value is ${rule.value}`;
                isValid = false;
              }
              break;
            case 'pattern':
              if (!new RegExp(rule.value as string).test(value)) {
                errors[element.id] = rule.message || 'Invalid format';
                isValid = false;
              }
              break;
          }
        });
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const handleDataChange = (newData: Record<string, any>) => {
    setFormData(newData);
    
    // Clear validation errors for changed fields
    const clearedErrors = { ...validationErrors };
    Object.keys(newData).forEach(key => {
      if (key in clearedErrors) {
        delete clearedErrors[key];
      }
    });
    setValidationErrors(clearedErrors);
  };

  const handleNextPage = () => {
    if (validatePage(currentPageIndex)) {
      setCurrentPageIndex(prev => Math.min(prev + 1, form.pages.length - 1));
    }
  };

  const handlePreviousPage = () => {
    setCurrentPageIndex(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (submissionData: Record<string, any>) => {
    // Validate all pages
    let allValid = true;
    for (let i = 0; i < form.pages.length; i++) {
      if (!validatePage(i)) {
        allValid = false;
        if (i < currentPageIndex) {
          setCurrentPageIndex(i);
        }
        break;
      }
    }

    if (!allValid) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await workflowService.submitForm(form.id, submissionData);
      setSubmissionResult(result);
      setShowResult(true);
      
      if (result.success && onSubmissionComplete) {
        // Create a mock submission object for the callback
        const submission: FormSubmission = {
          id: result.submissionId,
          formId: form.id,
          data: submissionData,
          submittedAt: new Date(),
          status: 'completed'
        };
        onSubmissionComplete(submission);
      }

      // Handle redirect if specified
      if (result.redirectUrl) {
        setTimeout(() => {
          window.location.href = result.redirectUrl!;
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setSubmissionResult({
        success: false,
        message: errorMessage,
        errors: [errorMessage]
      });
      setShowResult(true);
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({});
    setValidationErrors({});
    setCurrentPageIndex(0);
    setShowResult(false);
    setSubmissionResult(null);
  };

  if (showResult && submissionResult) {
    return (
      <div className={`max-w-2xl mx-auto p-6 ${className}`}>
        <div className="text-center">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            submissionResult.success ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {submissionResult.success ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <AlertCircle className="w-8 h-8 text-red-600" />
            )}
          </div>
          
          <h2 className={`text-2xl font-bold mb-2 ${
            submissionResult.success ? 'text-green-800' : 'text-red-800'
          }`}>
            {submissionResult.success ? 'Thank You!' : 'Submission Failed'}
          </h2>
          
          <p className={`text-lg mb-4 ${
            submissionResult.success ? 'text-green-700' : 'text-red-700'
          }`}>
            {submissionResult.message || (submissionResult.success ? 
              form.settings.confirmationMessage || 'Your form has been submitted successfully.' :
              'There was an error submitting your form.'
            )}
          </p>

          {submissionResult.errors && submissionResult.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-red-800 mb-2">Errors:</h3>
              <ul className="text-red-700 text-sm space-y-1">
                {submissionResult.errors.map((error: string, index: number) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {submissionResult.redirectUrl && (
            <p className="text-sm text-blue-600 mb-4">
              Redirecting to: {submissionResult.redirectUrl}
            </p>
          )}

          {form.settings.allowMultipleSubmissions && (
            <button
              onClick={resetForm}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Another Response
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto p-6 ${className}`}>
      {/* Progress Bar */}
      {form.pages.length > 1 && form.settings.showProgressBar && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Page {currentPageIndex + 1} of {form.pages.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentPageIndex + 1) / form.pages.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentPageIndex + 1) / form.pages.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Form Title and Description */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{form.title}</h1>
        {form.description && (
          <p className="text-gray-600">{form.description}</p>
        )}
      </div>

      {/* Current Page */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        {currentPage.title && (
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{currentPage.title}</h2>
        )}
        {currentPage.description && (
          <p className="text-gray-600 mb-6">{currentPage.description}</p>
        )}
        
        <FormRenderer
          page={currentPage}
          formData={formData}
          onDataChange={handleDataChange}
          onSubmit={isLastPage ? handleSubmit : undefined}
          validationErrors={validationErrors}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePreviousPage}
          disabled={isFirstPage}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isFirstPage 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        {isLastPage ? (
          <button
            onClick={() => handleSubmit(formData)}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                {form.settings.submitButtonText || 'Submit'}
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleNextPage}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
