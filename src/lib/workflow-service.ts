import { Form, FormSubmission, WorkflowStep } from '@/lib/types';

export interface SubmissionResponse {
  success: boolean;
  submissionId: string;
  message: string;
  errors?: string[];
  redirectUrl?: string;
}

export interface WorkflowTestResponse {
  success: boolean;
  errors: string[];
  logs: string[];
  redirectUrl?: string;
}

export class WorkflowService {
  private static instance: WorkflowService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  }

  static getInstance(): WorkflowService {
    if (!WorkflowService.instance) {
      WorkflowService.instance = new WorkflowService();
    }
    return WorkflowService.instance;
  }

  async submitForm(formId: string, formData: Record<string, any>): Promise<SubmissionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/forms/${formId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  }

  async testWorkflow(
    workflow: WorkflowStep[],
    formData: Record<string, any>,
    form: Form
  ): Promise<WorkflowTestResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/workflow/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflow,
          formData,
          form
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error testing workflow:', error);
      throw error;
    }
  }

  async getWorkflowStatus(submissionId: string): Promise<{ logs: any[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/workflow/status/${submissionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching workflow status:', error);
      throw error;
    }
  }

  async saveForm(form: Form): Promise<Form> {
    try {
      const isNew = !form.id || form.id.startsWith('temp_');
      const url = isNew ? `${this.baseUrl}/api/forms` : `${this.baseUrl}/api/forms/${form.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving form:', error);
      throw error;
    }
  }

  async loadForm(formId: string): Promise<Form> {
    try {
      const response = await fetch(`${this.baseUrl}/api/forms/${formId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error loading form:', error);
      throw error;
    }
  }

  async getFormSubmissions(formId: string): Promise<FormSubmission[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/forms/${formId}/submit`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching form submissions:', error);
      throw error;
    }
  }

  // Helper method to validate workflow configuration
  validateWorkflow(workflow: WorkflowStep[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    workflow.forEach((step, index) => {
      if (!step.title || step.title.trim() === '') {
        errors.push(`Step ${index + 1}: Title is required`);
      }
      
      switch (step.type) {
        case 'condition':
          if (!step.config.condition?.field) {
            errors.push(`Step ${index + 1}: Condition field is required`);
          }
          if (!step.config.condition?.operator) {
            errors.push(`Step ${index + 1}: Condition operator is required`);
          }
          break;
          
        case 'notification':
          if (!step.config.notification?.recipients?.length) {
            errors.push(`Step ${index + 1}: Email recipients are required`);
          }
          if (!step.config.notification?.subject) {
            errors.push(`Step ${index + 1}: Email subject is required`);
          }
          break;
          
        case 'action':
          if (step.config.action?.type === 'webhook' && !step.config.action?.endpoint) {
            errors.push(`Step ${index + 1}: Webhook endpoint is required`);
          }
          break;
          
        case 'integration':
          if (!step.config.integration?.endpoint) {
            errors.push(`Step ${index + 1}: Integration endpoint is required`);
          }
          break;
      }
    });
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Helper method to generate sample form data for testing
  generateSampleFormData(form: Form): Record<string, any> {
    const sampleData: Record<string, any> = {};
    
    form.pages.forEach(page => {
      page.elements.forEach(element => {
        switch (element.type) {
          case 'text':
          case 'email':
            sampleData[element.id] = 'Sample text';
            break;
          case 'textarea':
            sampleData[element.id] = 'Sample textarea content';
            break;
          case 'number':
            sampleData[element.id] = 42;
            break;
          case 'select':
          case 'radio':
            if (element.options && element.options.length > 0) {
              sampleData[element.id] = element.options[0];
            }
            break;
          case 'checkbox':
            if (element.options && element.options.length > 0) {
              sampleData[element.id] = [element.options[0]];
            } else {
              sampleData[element.id] = true;
            }
            break;
          case 'date':
            sampleData[element.id] = new Date().toISOString().split('T')[0];
            break;
        }
      });
    });
    
    return sampleData;
  }
}
