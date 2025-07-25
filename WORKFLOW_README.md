# Form Builder Workflow System

This document explains how to implement and use the workflow system in your form builder application.

## Overview

The workflow system allows you to automate actions when forms are submitted. It supports multiple types of workflow steps:

- **Conditional Logic**: Show/hide fields based on user input
- **Email Notifications**: Send emails when forms are submitted
- **Webhook Actions**: Send data to external services
- **Database Integrations**: Save data to databases

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install nodemailer @types/nodemailer
   ```

2. **Set up Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration.

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Forms API

- `GET /api/forms` - List all forms
- `POST /api/forms` - Create a new form
- `GET /api/forms/[id]` - Get a specific form
- `PUT /api/forms/[id]` - Update a form
- `DELETE /api/forms/[id]` - Delete a form

### Submissions API

- `POST /api/forms/[id]/submit` - Submit a form
- `GET /api/forms/[id]/submit` - Get form submissions

### Workflow API

- `POST /api/workflow/test` - Test workflow execution
- `GET /api/workflow/status/[submissionId]` - Get workflow execution status

## Workflow Configuration

### 1. Conditional Logic

Shows or hides form elements based on user input.

```javascript
{
  type: 'condition',
  config: {
    condition: {
      field: 'age',
      operator: 'greaterThan',
      value: '18',
      actions: [
        {
          type: 'show',
          targetId: 'adult_content'
        }
      ]
    }
  }
}
```

### 2. Email Notifications

Sends emails when forms are submitted.

```javascript
{
  type: 'notification',
  config: {
    notification: {
      type: 'email',
      recipients: ['admin@example.com'],
      subject: 'New Form Submission',
      message: 'A new form has been submitted with the following data: {{formData}}'
    }
  }
}
```

### 3. Webhook Actions

Sends HTTP requests to external services.

```javascript
{
  type: 'action',
  config: {
    action: {
      type: 'webhook',
      endpoint: 'https://api.example.com/webhook',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer {{apiKey}}'
      },
      body: JSON.stringify({
        data: '{{formData}}',
        timestamp: '{{timestamp}}'
      })
    }
  }
}
```

## Template Variables

You can use template variables in your workflow configurations:

- `{{formData}}` - All form submission data
- `{{timestamp}}` - Current timestamp
- `{{formTitle}}` - Form title
- `{{submissionId}}` - Submission ID
- `{{fieldName}}` - Specific field value (replace fieldName with actual field name)

## Using the Workflow Service

### Client-side Usage

```javascript
import { WorkflowService } from '@/lib/workflow-service';

const workflowService = WorkflowService.getInstance();

// Submit a form
const result = await workflowService.submitForm(formId, formData);

// Test a workflow
const testResult = await workflowService.testWorkflow(workflow, formData, form);

// Get workflow status
const status = await workflowService.getWorkflowStatus(submissionId);
```

### Server-side Usage

```javascript
import { WorkflowEngine } from '@/lib/workflow-engine';

const engine = new WorkflowEngine();
const result = await engine.executeWorkflow(workflow, submission, form);
```

## Form Components

### FormSubmissionHandler

A complete form submission component that handles multi-page forms and workflow execution.

```jsx
import { FormSubmissionHandler } from '@/components/FormElements/FormSubmissionHandler';

<FormSubmissionHandler
  form={form}
  onSubmissionComplete={(submission) => {
    console.log('Form submitted:', submission);
  }}
  onError={(error) => {
    console.error('Error:', error);
  }}
/>
```

## Email Configuration

For email notifications to work, configure your SMTP settings:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

### Gmail Setup

1. Enable 2-factor authentication
2. Generate an app password
3. Use the app password in `SMTP_PASS`

## Database Integration

The system is designed to work with PostgreSQL. Use the provided schema in `database/schema.sql` to set up your database.

## Testing Workflows

Use the built-in workflow testing feature:

1. Open the form builder
2. Configure your workflow steps
3. Click "Test Workflow"
4. Review the test results

## Error Handling

The system includes comprehensive error handling:

- Validation errors are displayed to users
- Workflow execution errors are logged
- Email sending failures are handled gracefully
- Webhook timeouts are managed

## Security Considerations

- Always validate form data server-side
- Use HTTPS for production deployments
- Secure your SMTP credentials
- Implement rate limiting for form submissions
- Sanitize user input before processing

## Deployment

### Environment Variables

Set these environment variables in production:

```bash
NEXT_PUBLIC_API_URL=https://your-domain.com
SMTP_HOST=your-smtp-host
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
DATABASE_URL=your-database-url
```

### Database

1. Create your database
2. Run the schema migration
3. Set up proper indexes
4. Configure backups

## Troubleshooting

### Common Issues

1. **Email not sending**: Check SMTP configuration
2. **Webhook failures**: Verify endpoint URL and authentication
3. **Form not submitting**: Check browser console for errors
4. **Database connection**: Verify DATABASE_URL

### Debug Mode

Enable debug logging by setting `NODE_ENV=development`.

## Contributing

When adding new workflow step types:

1. Update the `WorkflowStep` type in `types.ts`
2. Add handling in `WorkflowEngine.executeStep()`
3. Update the UI in `WorkflowPanel.tsx`
4. Add validation in `WorkflowService.validateWorkflow()`

## License

This project is licensed under the MIT License.
