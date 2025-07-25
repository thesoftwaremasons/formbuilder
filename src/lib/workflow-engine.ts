import { Form, FormSubmission, WorkflowStep, WorkflowConfig } from '@/lib/types';
import nodemailer from 'nodemailer';

export interface WorkflowResult {
  success: boolean;
  errors: string[];
  redirectUrl?: string;
  logs: string[];
}

export interface WorkflowContext {
  formData: Record<string, any>;
  form: Form;
  submission: FormSubmission;
  environment: Record<string, any>;
}

export class WorkflowEngine {
  private emailTransporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeEmailTransporter();
  }

  private initializeEmailTransporter() {
    // Initialize email transporter - in production, use environment variables
    try {
      this.emailTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } catch (error) {
      console.warn('Email transporter not configured:', error);
    }
  }

  async executeWorkflow(
    workflow: WorkflowStep[], 
    submission: FormSubmission, 
    form: Form
  ): Promise<WorkflowResult> {
    const result: WorkflowResult = {
      success: true,
      errors: [],
      logs: []
    };

    const context: WorkflowContext = {
      formData: submission.data,
      form,
      submission,
      environment: process.env
    };

    // Sort workflow steps by order
    const sortedSteps = [...workflow].sort((a, b) => a.order - b.order);

    for (const step of sortedSteps) {
      if (!step.enabled) {
        result.logs.push(`Skipping disabled step: ${step.title}`);
        continue;
      }

      try {
        result.logs.push(`Executing step: ${step.title}`);
        const stepResult = await this.executeStep(step, context);
        
        if (!stepResult.success) {
          result.success = false;
          result.errors.push(`Step "${step.title}" failed: ${stepResult.error}`);
        }

        if (stepResult.redirectUrl) {
          result.redirectUrl = stepResult.redirectUrl;
        }

        result.logs.push(`Step "${step.title}" completed: ${stepResult.success}`);
      } catch (error) {
        result.success = false;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        result.errors.push(`Step "${step.title}" threw error: ${errorMessage}`);
        result.logs.push(`Step "${step.title}" error: ${errorMessage}`);
      }
    }

    return result;
  }

  private async executeStep(
    step: WorkflowStep, 
    context: WorkflowContext
  ): Promise<{ success: boolean; error?: string; redirectUrl?: string }> {
    switch (step.type) {
      case 'condition':
        return this.executeConditionStep(step, context);
      case 'notification':
        return this.executeNotificationStep(step, context);
      case 'action':
        return this.executeActionStep(step, context);
      case 'integration':
        return this.executeIntegrationStep(step, context);
      default:
        return { success: false, error: `Unknown step type: ${step.type}` };
    }
  }

  private async executeConditionStep(
    step: WorkflowStep, 
    context: WorkflowContext
  ): Promise<{ success: boolean; error?: string }> {
    const config = step.config.condition;
    if (!config) {
      return { success: false, error: 'No condition configuration found' };
    }

    const fieldValue = context.formData[config.field];
    const conditionMet = this.evaluateCondition(fieldValue, config.operator, config.value);

    if (conditionMet) {
      // Execute actions if condition is met
      for (const action of config.actions) {
        // In a real implementation, you'd apply these actions to the form state
        // For now, we'll just log them
        console.log(`Condition met, executing action: ${action.type}`);
      }
    }

    return { success: true };
  }

  private async executeNotificationStep(
    step: WorkflowStep, 
    context: WorkflowContext
  ): Promise<{ success: boolean; error?: string }> {
    const config = step.config.notification;
    if (!config) {
      return { success: false, error: 'No notification configuration found' };
    }

    switch (config.type) {
      case 'email':
        return this.sendEmail(config, context);
      case 'sms':
        return this.sendSMS(config, context);
      case 'slack':
        return this.sendSlackNotification(config, context);
      default:
        return { success: false, error: `Unsupported notification type: ${config.type}` };
    }
  }

  private async executeActionStep(
    step: WorkflowStep, 
    context: WorkflowContext
  ): Promise<{ success: boolean; error?: string; redirectUrl?: string }> {
    const config = step.config.action;
    if (!config) {
      return { success: false, error: 'No action configuration found' };
    }

    switch (config.type) {
      case 'webhook':
        return this.executeWebhook(config, context);
      case 'redirect':
        return { success: true, redirectUrl: config.endpoint };
      case 'database':
        return this.saveToDB(config, context);
      default:
        return { success: false, error: `Unsupported action type: ${config.type}` };
    }
  }

  private async executeIntegrationStep(
    step: WorkflowStep, 
    context: WorkflowContext
  ): Promise<{ success: boolean; error?: string }> {
    const config = step.config.integration;
    if (!config) {
      return { success: false, error: 'No integration configuration found' };
    }

    switch (config.service) {
      case 'zapier':
        return this.executeZapierIntegration(config, context);
      case 'custom':
        return this.executeCustomIntegration(config, context);
      default:
        return { success: false, error: `Unsupported integration service: ${config.service}` };
    }
  }

  private evaluateCondition(
    fieldValue: any, 
    operator: string, 
    compareValue: string
  ): boolean {
    switch (operator) {
      case 'equals':
        return fieldValue === compareValue;
      case 'notEquals':
        return fieldValue !== compareValue;
      case 'contains':
        return String(fieldValue).includes(compareValue);
      case 'greaterThan':
        return Number(fieldValue) > Number(compareValue);
      case 'lessThan':
        return Number(fieldValue) < Number(compareValue);
      case 'isEmpty':
        return !fieldValue || fieldValue === '';
      case 'isNotEmpty':
        return fieldValue && fieldValue !== '';
      default:
        return false;
    }
  }

  private async sendEmail(
    config: any, 
    context: WorkflowContext
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.emailTransporter) {
      return { success: false, error: 'Email transporter not configured' };
    }

    try {
      const processedSubject = this.processTemplate(config.subject, context);
      const processedMessage = this.processTemplate(config.message, context);

      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: config.recipients.join(', '),
        subject: processedSubject,
        html: processedMessage,
        attachments: this.generateAttachments(context)
      };

      await this.emailTransporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      return { success: false, error: `Email failed: ${error}` };
    }
  }

  private async sendSMS(
    config: any, 
    context: WorkflowContext
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // SMS implementation using Twilio (example)
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const fromNumber = process.env.TWILIO_FROM_NUMBER;
      
      if (!accountSid || !authToken || !fromNumber) {
        return { success: false, error: 'SMS configuration missing' };
      }
      
      const message = this.processTemplate(config.message, context);
      
      // In a real implementation, you would use Twilio SDK here
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: config.to,
          From: fromNumber,
          Body: message
        })
      });
      
      if (!response.ok) {
        return { success: false, error: `SMS failed: ${response.status}` };
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: `SMS error: ${error}` };
    }
  }

  private async sendSlackNotification(
    config: any, 
    context: WorkflowContext
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const webhookUrl = config.webhookUrl || process.env.SLACK_WEBHOOK_URL;
      
      if (!webhookUrl) {
        return { success: false, error: 'Slack webhook URL not configured' };
      }
      
      const message = this.processTemplate(config.message, context);
      
      const payload = {
        text: message,
        channel: config.channel || '#general',
        username: config.username || 'Form Builder',
        icon_emoji: config.icon || ':robot_face:'
      };
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        return { success: false, error: `Slack notification failed: ${response.status}` };
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: `Slack notification error: ${error}` };
    }
  }

  private async executeWebhook(
    config: any, 
    context: WorkflowContext
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const processedBody = this.processTemplate(config.body, context);
      
      const response = await fetch(config.endpoint, {
        method: config.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...config.headers
        },
        body: processedBody
      });

      if (!response.ok) {
        return { success: false, error: `Webhook failed: ${response.status} ${response.statusText}` };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: `Webhook error: ${error}` };
    }
  }

  private async saveToDB(
    config: any, 
    context: WorkflowContext
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Database save implementation
      const connectionString = process.env.DATABASE_URL;
      
      if (!connectionString) {
        return { success: false, error: 'Database connection not configured' };
      }
      
      // Example for PostgreSQL/MySQL
      const tableName = config.tableName || 'form_submissions';
      const data = {
        form_id: context.form.id,
        submission_id: context.submission.id,
        form_data: JSON.stringify(context.formData),
        submitted_at: new Date().toISOString(),
        ...config.additionalFields
      };
      
      // In a real implementation, you would use a database client here
      // Example SQL query:
      const query = `
        INSERT INTO ${tableName} (form_id, submission_id, form_data, submitted_at)
        VALUES ($1, $2, $3, $4)
      `;
      
      // This is a placeholder - in real implementation:
      // await dbClient.query(query, [data.form_id, data.submission_id, data.form_data, data.submitted_at]);
      
      console.log('Database save would execute:', { query, data });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: `Database save error: ${error}` };
    }
  }

  private async executeZapierIntegration(
    config: any, 
    context: WorkflowContext
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const zapierWebhookUrl = config.webhookUrl;
      
      if (!zapierWebhookUrl) {
        return { success: false, error: 'Zapier webhook URL not configured' };
      }
      
      const payload = {
        formId: context.form.id,
        formTitle: context.form.title,
        submissionId: context.submission.id,
        submittedAt: context.submission.submittedAt,
        formData: context.formData,
        ...config.additionalData
      };
      
      const response = await fetch(zapierWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...config.headers
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        return { success: false, error: `Zapier integration failed: ${response.status}` };
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: `Zapier integration error: ${error}` };
    }
  }

  private async executeCustomIntegration(
    config: any, 
    context: WorkflowContext
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const endpoint = config.endpoint;
      const method = config.method || 'POST';
      const headers = config.headers || {};
      
      if (!endpoint) {
        return { success: false, error: 'Custom integration endpoint not configured' };
      }
      
      const payload = {
        formId: context.form.id,
        formTitle: context.form.title,
        submissionId: context.submission.id,
        submittedAt: context.submission.submittedAt,
        formData: context.formData,
        ...config.additionalData
      };
      
      // Process any template variables in the payload
      const processedPayload = this.processTemplateObject(payload, context);
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(processedPayload)
      });
      
      if (!response.ok) {
        return { success: false, error: `Custom integration failed: ${response.status}` };
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: `Custom integration error: ${error}` };
    }
  }

  private processTemplate(template: string, context: WorkflowContext): string {
    let processed = template;
    
    // Replace form data placeholders
    Object.entries(context.formData).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      processed = processed.replace(new RegExp(placeholder, 'g'), String(value));
    });

    // Replace system placeholders
    processed = processed.replace(/{{timestamp}}/g, new Date().toISOString());
    processed = processed.replace(/{{formTitle}}/g, context.form.title);
    processed = processed.replace(/{{submissionId}}/g, context.submission.id);

    return processed;
  }

  private processTemplateObject(obj: any, context: WorkflowContext): any {
    if (typeof obj === 'string') {
      return this.processTemplate(obj, context);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.processTemplateObject(item, context));
    }
    
    if (obj && typeof obj === 'object') {
      const processed: any = {};
      for (const [key, value] of Object.entries(obj)) {
        processed[key] = this.processTemplateObject(value, context);
      }
      return processed;
    }
    
    return obj;
  }

  private generateAttachments(context: WorkflowContext): any[] {
    const attachments = [];
    
    // Generate JSON attachment with form data
    attachments.push({
      filename: 'submission-data.json',
      content: JSON.stringify(context.formData, null, 2),
      contentType: 'application/json'
    });

    return attachments;
  }
}
