/**
 * Demo: How to use the Form Builder Workflow System
 * 
 * This file demonstrates the complete workflow system functionality
 * including form creation, workflow configuration, and submission handling.
 */

import { Form, WorkflowStep, FormSubmission } from '@/lib/types';
import { WorkflowService } from '@/lib/workflow-service';
import { WorkflowEngine } from '@/lib/workflow-engine';

// Sample form configuration
const sampleForm: Form = {
  id: 'demo-contact-form',
  title: 'Contact Us',
  description: 'Get in touch with our team',
  pages: [
    {
      id: 'page1',
      title: 'Contact Information',
      description: 'Please fill out your contact details',
      elements: [
        {
          id: 'name',
          type: 'text',
          label: 'Full Name',
          placeholder: 'Enter your full name',
          required: true,
          properties: {},
          position: { x: 0, y: 0 },
          size: { width: 400, height: 50 },
          pageId: 'page1'
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email Address',
          placeholder: 'Enter your email',
          required: true,
          properties: {},
          position: { x: 0, y: 60 },
          size: { width: 400, height: 50 },
          pageId: 'page1',
          validation: [
            { type: 'email', message: 'Please enter a valid email address' }
          ]
        },
        {
          id: 'company',
          type: 'text',
          label: 'Company',
          placeholder: 'Enter your company name',
          required: false,
          properties: {},
          position: { x: 0, y: 120 },
          size: { width: 400, height: 50 },
          pageId: 'page1'
        },
        {
          id: 'interest',
          type: 'select',
          label: 'Area of Interest',
          placeholder: 'Select your area of interest',
          required: true,
          options: ['General Inquiry', 'Technical Support', 'Sales', 'Partnership'],
          properties: {},
          position: { x: 0, y: 180 },
          size: { width: 400, height: 50 },
          pageId: 'page1'
        },
        {
          id: 'message',
          type: 'textarea',
          label: 'Message',
          placeholder: 'Tell us about your inquiry',
          required: true,
          properties: {},
          position: { x: 0, y: 240 },
          size: { width: 400, height: 120 },
          pageId: 'page1'
        },
        {
          id: 'submit',
          type: 'submit',
          label: 'Send Message',
          placeholder: '',
          required: false,
          properties: {},
          position: { x: 0, y: 380 },
          size: { width: 200, height: 50 },
          pageId: 'page1'
        }
      ],
      order: 0
    }
  ],
  settings: {
    allowMultipleSubmissions: true,
    requireLogin: false,
    showProgressBar: false,
    enableAutoSave: true,
    confirmationMessage: 'Thank you for contacting us! We will get back to you soon.',
    emailNotifications: {
      enabled: true,
      recipients: ['admin@example.com'],
      template: 'default',
      subject: 'New Contact Form Submission',
      includeSubmissionData: true
    },
    submitButtonText: 'Send Message'
  },
  theme: {
    primaryColor: '#3b82f6',
    backgroundColor: '#ffffff',
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    borderRadius: '8px'
  },
  workflow: [], // We'll configure this below
  createdAt: new Date(),
  updatedAt: new Date(),
  isTemplate: false
};

// Configure workflow steps
const workflowSteps: WorkflowStep[] = [
  // Step 1: Conditional Logic - Show special message for sales inquiries
  {
    id: 'sales-check',
    type: 'condition',
    title: 'Sales Inquiry Check',
    description: 'Check if this is a sales inquiry',
    order: 0,
    enabled: true,
    config: {
      condition: {
        field: 'interest',
        operator: 'equals',
        value: 'Sales',
        actions: [
          { type: 'setValue', targetId: 'priority', value: 'high' }
        ]
      }
    }
  },
  
  // Step 2: Send admin notification
  {
    id: 'admin-notification',
    type: 'notification',
    title: 'Admin Email Notification',
    description: 'Send email to admin team',
    order: 1,
    enabled: true,
    config: {
      notification: {
        type: 'email',
        recipients: ['admin@example.com', 'sales@example.com'],
        template: 'admin-notification',
        subject: 'New Contact Form Submission - {{interest}}',
        message: `
          Hello Admin Team,
          
          A new contact form has been submitted with the following details:
          
          Name: {{name}}
          Email: {{email}}
          Company: {{company}}
          Interest: {{interest}}
          Message: {{message}}
          
          Submitted at: {{timestamp}}
          
          Please follow up accordingly.
          
          Best regards,
          Form Builder System
        `
      }
    }
  },
  
  // Step 3: Send confirmation to user
  {
    id: 'user-confirmation',
    type: 'notification',
    title: 'User Confirmation Email',
    description: 'Send confirmation email to user',
    order: 2,
    enabled: true,
    config: {
      notification: {
        type: 'email',
        recipients: ['{{email}}'], // Dynamic recipient
        template: 'user-confirmation',
        subject: 'Thank you for contacting us!',
        message: `
          Dear {{name}},
          
          Thank you for reaching out to us regarding {{interest}}.
          
          We have received your message and will get back to you within 24 hours.
          
          Your message:
          {{message}}
          
          Best regards,
          The Team
        `
      }
    }
  },
  
  // Step 4: Send data to CRM via webhook
  {
    id: 'crm-integration',
    type: 'action',
    title: 'CRM Integration',
    description: 'Send contact data to CRM system',
    order: 3,
    enabled: true,
    config: {
      action: {
        type: 'webhook',
        endpoint: 'https://api.example-crm.com/contacts',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_TOKEN'
        },
        body: JSON.stringify({
          name: '{{name}}',
          email: '{{email}}',
          company: '{{company}}',
          source: 'contact-form',
          interest: '{{interest}}',
          message: '{{message}}',
          created_at: '{{timestamp}}'
        })
      }
    }
  }
];

// Add workflow to form
sampleForm.workflow = workflowSteps;

// Example usage functions
export class WorkflowDemo {
  private workflowService: WorkflowService;
  private workflowEngine: WorkflowEngine;

  constructor() {
    this.workflowService = WorkflowService.getInstance();
    this.workflowEngine = new WorkflowEngine();
  }

  /**
   * Demo 1: Test workflow configuration
   */
  async testWorkflow() {
    console.log('🧪 Testing workflow configuration...');
    
    // Generate sample form data
    const sampleData = {
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Acme Corp',
      interest: 'Sales',
      message: 'I am interested in your premium features.'
    };

    try {
      const result = await this.workflowService.testWorkflow(
        sampleForm.workflow,
        sampleData,
        sampleForm
      );
      
      console.log('✅ Workflow test result:', result);
      return result;
    } catch (error) {
      console.error('❌ Workflow test failed:', error);
      throw error;
    }
  }

  /**
   * Demo 2: Submit form with workflow execution
   */
  async submitForm(formData: Record<string, any>) {
    console.log('📝 Submitting form with workflow...');
    
    try {
      const result = await this.workflowService.submitForm(sampleForm.id, formData);
      console.log('✅ Form submission result:', result);
      return result;
    } catch (error) {
      console.error('❌ Form submission failed:', error);
      throw error;
    }
  }

  /**
   * Demo 3: Validate workflow configuration
   */
  validateWorkflow() {
    console.log('🔍 Validating workflow configuration...');
    
    const validation = this.workflowService.validateWorkflow(sampleForm.workflow);
    
    if (validation.valid) {
      console.log('✅ Workflow configuration is valid');
    } else {
      console.log('❌ Workflow configuration errors:', validation.errors);
    }
    
    return validation;
  }

  /**
   * Demo 4: Execute workflow manually
   */
  async executeWorkflow(submission: FormSubmission) {
    console.log('⚙️ Executing workflow manually...');
    
    try {
      const result = await this.workflowEngine.executeWorkflow(
        sampleForm.workflow,
        submission,
        sampleForm
      );
      
      console.log('✅ Workflow execution result:', result);
      return result;
    } catch (error) {
      console.error('❌ Workflow execution failed:', error);
      throw error;
    }
  }

  /**
   * Demo 5: Get sample form configuration
   */
  getSampleForm(): Form {
    return sampleForm;
  }

  /**
   * Demo 6: Run complete workflow demo
   */
  async runCompleteDemo() {
    console.log('🚀 Running complete workflow demo...\n');
    
    try {
      // Step 1: Validate workflow
      console.log('Step 1: Validating workflow...');
      const validation = this.validateWorkflow();
      console.log('');
      
      if (!validation.valid) {
        throw new Error('Workflow validation failed');
      }
      
      // Step 2: Test workflow
      console.log('Step 2: Testing workflow...');
      const testResult = await this.testWorkflow();
      console.log('');
      
      // Step 3: Submit form
      console.log('Step 3: Submitting form...');
      const sampleData = this.workflowService.generateSampleFormData(sampleForm);
      const submitResult = await this.submitForm(sampleData);
      console.log('');
      
      // Step 4: Summary
      console.log('📊 Demo Summary:');
      console.log('─'.repeat(50));
      console.log(`✅ Workflow Validation: ${validation.valid ? 'PASSED' : 'FAILED'}`);
      console.log(`✅ Workflow Test: ${testResult.success ? 'PASSED' : 'FAILED'}`);
      console.log(`✅ Form Submission: ${submitResult.success ? 'PASSED' : 'FAILED'}`);
      console.log('');
      
      const allPassed = validation.valid && testResult.success && submitResult.success;
      console.log(`🎉 Overall Result: ${allPassed ? 'ALL DEMOS PASSED' : 'SOME DEMOS FAILED'}`);
      
      return {
        validation,
        testResult,
        submitResult,
        success: allPassed
      };
    } catch (error) {
      console.error('❌ Demo failed:', error);
      throw error;
    }
  }
}

// Export the demo class and sample form
export { sampleForm, workflowSteps };
export default WorkflowDemo;
