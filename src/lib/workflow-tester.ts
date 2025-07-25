import { Form, FormSubmission, WorkflowStep } from './types';
import { WorkflowService } from './workflow-service';

export interface TestResult {
  success: boolean;
  message: string;
  errors: string[];
  logs: string[];
  executionTime: number;
  stepResults: StepResult[];
}

export interface StepResult {
  stepId: string;
  stepType: string;
  stepTitle: string;
  success: boolean;
  message: string;
  executionTime: number;
  error?: string;
}

export class WorkflowTester {
  private workflowService: WorkflowService;

  constructor() {
    this.workflowService = WorkflowService.getInstance();
  }

  async testWorkflow(form: Form, testData?: Record<string, any>): Promise<TestResult> {
    const startTime = Date.now();
    const logs: string[] = [];
    const errors: string[] = [];
    const stepResults: StepResult[] = [];

    try {
      // Generate test data if not provided
      const formData = testData || this.generateTestData(form);
      logs.push(`Generated test data: ${JSON.stringify(formData)}`);

      // Validate workflow
      const validation = this.workflowService.validateWorkflow(form.workflow);
      if (!validation.valid) {
        errors.push(...validation.errors);
        return {
          success: false,
          message: 'Workflow validation failed',
          errors,
          logs,
          executionTime: Date.now() - startTime,
          stepResults
        };
      }

      logs.push('Workflow validation passed');

      // Test each step
      for (const step of form.workflow) {
        const stepResult = await this.testStep(step, formData, form);
        stepResults.push(stepResult);
        logs.push(`Step ${step.title}: ${stepResult.success ? 'PASSED' : 'FAILED'}`);
        
        if (!stepResult.success) {
          errors.push(`Step "${step.title}" failed: ${stepResult.error}`);
        }
      }

      // Test complete workflow execution
      const workflowResult = await this.workflowService.testWorkflow(form.workflow, formData, form);
      
      const overallSuccess = stepResults.every(result => result.success) && workflowResult.success;
      const executionTime = Date.now() - startTime;

      return {
        success: overallSuccess,
        message: overallSuccess ? 'All tests passed successfully' : 'Some tests failed',
        errors: [...errors, ...(workflowResult.errors || [])],
        logs: [...logs, ...(workflowResult.logs || [])],
        executionTime,
        stepResults
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      errors.push(`Test execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      return {
        success: false,
        message: 'Test execution failed',
        errors,
        logs,
        executionTime,
        stepResults
      };
    }
  }

  private async testStep(step: WorkflowStep, formData: Record<string, any>, form: Form): Promise<StepResult> {
    const startTime = Date.now();

    try {
      switch (step.type) {
        case 'condition':
          return await this.testConditionStep(step, formData, form);
        case 'notification':
          return await this.testNotificationStep(step, formData, form);
        case 'action':
          return await this.testActionStep(step, formData, form);
        case 'integration':
          return await this.testIntegrationStep(step, formData, form);
        default:
          return {
            stepId: step.id,
            stepType: step.type,
            stepTitle: step.title,
            success: false,
            message: `Unknown step type: ${step.type}`,
            executionTime: Date.now() - startTime,
            error: `Unknown step type: ${step.type}`
          };
      }
    } catch (error) {
      return {
        stepId: step.id,
        stepType: step.type,
        stepTitle: step.title,
        success: false,
        message: 'Step execution failed',
        executionTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async testConditionStep(step: WorkflowStep, formData: Record<string, any>, form: Form): Promise<StepResult> {
    const startTime = Date.now();
    
    try {
      const condition = step.config.condition;
      if (!condition) {
        throw new Error('Condition configuration is missing');
      }

      const fieldValue = formData[condition.field];
      const result = this.evaluateCondition(fieldValue, condition.operator, condition.value);

      return {
        stepId: step.id,
        stepType: step.type,
        stepTitle: step.title,
        success: true,
        message: `Condition evaluated to: ${result}`,
        executionTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        stepId: step.id,
        stepType: step.type,
        stepTitle: step.title,
        success: false,
        message: 'Condition test failed',
        executionTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async testNotificationStep(step: WorkflowStep, formData: Record<string, any>, form: Form): Promise<StepResult> {
    const startTime = Date.now();
    
    try {
      const notification = step.config.notification;
      if (!notification) {
        throw new Error('Notification configuration is missing');
      }

      // Validate notification configuration
      if (!notification.recipients || notification.recipients.length === 0) {
        throw new Error('No recipients specified');
      }

      if (!notification.message) {
        throw new Error('No message specified');
      }

      // Check if required environment variables are set
      const requiredEnvVars = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
      const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
      
      if (missingEnvVars.length > 0) {
        throw new Error(`Missing environment variables: ${missingEnvVars.join(', ')}`);
      }

      return {
        stepId: step.id,
        stepType: step.type,
        stepTitle: step.title,
        success: true,
        message: `Notification configuration is valid (${notification.recipients.length} recipients)`,
        executionTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        stepId: step.id,
        stepType: step.type,
        stepTitle: step.title,
        success: false,
        message: 'Notification test failed',
        executionTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async testActionStep(step: WorkflowStep, formData: Record<string, any>, form: Form): Promise<StepResult> {
    const startTime = Date.now();
    
    try {
      const action = step.config.action;
      if (!action) {
        throw new Error('Action configuration is missing');
      }

      if (!action.endpoint) {
        throw new Error('No endpoint specified');
      }

      // Validate URL
      try {
        new URL(action.endpoint);
      } catch {
        throw new Error('Invalid endpoint URL');
      }

      return {
        stepId: step.id,
        stepType: step.type,
        stepTitle: step.title,
        success: true,
        message: `Action configuration is valid (${action.method || 'POST'} ${action.endpoint})`,
        executionTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        stepId: step.id,
        stepType: step.type,
        stepTitle: step.title,
        success: false,
        message: 'Action test failed',
        executionTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async testIntegrationStep(step: WorkflowStep, formData: Record<string, any>, form: Form): Promise<StepResult> {
    const startTime = Date.now();
    
    try {
      const integration = step.config.integration;
      if (!integration) {
        throw new Error('Integration configuration is missing');
      }

      if (!integration.endpoint) {
        throw new Error('No endpoint specified');
      }

      // Validate URL
      try {
        new URL(integration.endpoint);
      } catch {
        throw new Error('Invalid endpoint URL');
      }

      return {
        stepId: step.id,
        stepType: step.type,
        stepTitle: step.title,
        success: true,
        message: `Integration configuration is valid (${integration.service})`,
        executionTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        stepId: step.id,
        stepType: step.type,
        stepTitle: step.title,
        success: false,
        message: 'Integration test failed',
        executionTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private evaluateCondition(fieldValue: any, operator: string, expectedValue: any): boolean {
    switch (operator) {
      case 'equals':
        return fieldValue === expectedValue;
      case 'not_equals':
        return fieldValue !== expectedValue;
      case 'contains':
        return String(fieldValue).includes(String(expectedValue));
      case 'not_contains':
        return !String(fieldValue).includes(String(expectedValue));
      case 'greater_than':
        return Number(fieldValue) > Number(expectedValue);
      case 'less_than':
        return Number(fieldValue) < Number(expectedValue);
      case 'is_empty':
        return !fieldValue || fieldValue === '';
      case 'is_not_empty':
        return fieldValue && fieldValue !== '';
      default:
        return false;
    }
  }

  private generateTestData(form: Form): Record<string, any> {
    const testData: Record<string, any> = {};

    form.pages.forEach(page => {
      page.elements.forEach(element => {
        switch (element.type) {
          case 'text':
          case 'email':
          case 'textarea':
            testData[element.id] = this.generateSampleText(element.type);
            break;
          case 'number':
            testData[element.id] = Math.floor(Math.random() * 100);
            break;
          case 'date':
            testData[element.id] = new Date().toISOString().split('T')[0];
            break;
          case 'radio':
          case 'select':
            if (element.options && element.options.length > 0) {
              testData[element.id] = element.options[0];
            }
            break;
          case 'checkbox':
            if (element.options && element.options.length > 0) {
              testData[element.id] = [element.options[0]];
            }
            break;
          case 'rating':
            testData[element.id] = Math.floor(Math.random() * 5) + 1;
            break;
          case 'range':
            const min = element.properties?.min || 0;
            const max = element.properties?.max || 100;
            testData[element.id] = Math.floor(Math.random() * (max - min + 1)) + min;
            break;
          default:
            testData[element.id] = `Sample ${element.type} value`;
        }
      });
    });

    return testData;
  }

  private generateSampleText(type: string): string {
    switch (type) {
      case 'email':
        return 'test@example.com';
      case 'text':
        return 'Sample text input';
      case 'textarea':
        return 'Sample textarea content with multiple lines\nLine 2\nLine 3';
      case 'url':
        return 'https://example.com';
      case 'tel':
        return '+1234567890';
      default:
        return 'Sample value';
    }
  }

  async runPerformanceTest(form: Form, iterations: number = 10): Promise<{
    averageTime: number;
    minTime: number;
    maxTime: number;
    successRate: number;
    results: TestResult[];
  }> {
    const results: TestResult[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const result = await this.testWorkflow(form);
      results.push(result);
    }

    const times = results.map(r => r.executionTime);
    const successCount = results.filter(r => r.success).length;

    return {
      averageTime: times.reduce((sum, time) => sum + time, 0) / times.length,
      minTime: Math.min(...times),
      maxTime: Math.max(...times),
      successRate: (successCount / iterations) * 100,
      results
    };
  }
}

export default WorkflowTester;
