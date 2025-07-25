/**
 * Test script for the workflow system
 * Run with: npm run test-workflow
 */

const { WorkflowEngine } = require('./src/lib/workflow-engine');

async function testWorkflow() {
  console.log('🚀 Testing Form Builder Workflow System\n');

  // Sample form data
  const sampleForm = {
    id: 'test-form',
    title: 'Contact Form',
    description: 'A test contact form',
    pages: [{
      id: 'page1',
      title: 'Contact Information',
      elements: [
        { id: 'name', type: 'text', label: 'Name', required: true },
        { id: 'email', type: 'email', label: 'Email', required: true },
        { id: 'age', type: 'number', label: 'Age', required: false },
        { id: 'message', type: 'textarea', label: 'Message', required: true }
      ]
    }],
    settings: {
      allowMultipleSubmissions: true,
      requireLogin: false,
      confirmationMessage: 'Thank you for your submission!'
    },
    workflow: []
  };

  // Sample submission data
  const sampleSubmission = {
    id: 'sub_test_123',
    formId: 'test-form',
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      age: '25',
      message: 'This is a test message'
    },
    submittedAt: new Date(),
    ipAddress: '192.168.1.1',
    userAgent: 'Test User Agent',
    status: 'pending'
  };

  console.log('📋 Sample Form Data:');
  console.log(JSON.stringify(sampleForm, null, 2));
  console.log('\n📝 Sample Submission:');
  console.log(JSON.stringify(sampleSubmission, null, 2));

  // Test 1: Conditional Logic Workflow
  console.log('\n🔍 Test 1: Conditional Logic Workflow');
  console.log('─'.repeat(50));
  
  const conditionalWorkflow = [{
    id: 'step1',
    type: 'condition',
    title: 'Age Check',
    description: 'Check if user is an adult',
    order: 0,
    enabled: true,
    config: {
      condition: {
        field: 'age',
        operator: 'greaterThan',
        value: '18',
        actions: [
          { type: 'show', targetId: 'adult_content' }
        ]
      }
    }
  }];

  const engine = new WorkflowEngine();
  const result1 = await engine.executeWorkflow(conditionalWorkflow, sampleSubmission, sampleForm);
  
  console.log('✅ Conditional workflow result:', result1);

  // Test 2: Email Notification Workflow
  console.log('\n📧 Test 2: Email Notification Workflow');
  console.log('─'.repeat(50));
  
  const emailWorkflow = [{
    id: 'step2',
    type: 'notification',
    title: 'Send Email',
    description: 'Send notification email',
    order: 0,
    enabled: true,
    config: {
      notification: {
        type: 'email',
        recipients: ['admin@example.com'],
        template: 'default',
        subject: 'New Form Submission from {{name}}',
        message: 'Hello! A new form has been submitted.\n\nDetails:\nName: {{name}}\nEmail: {{email}}\nMessage: {{message}}'
      }
    }
  }];

  const result2 = await engine.executeWorkflow(emailWorkflow, sampleSubmission, sampleForm);
  console.log('✅ Email workflow result:', result2);

  // Test 3: Webhook Action Workflow
  console.log('\n🔗 Test 3: Webhook Action Workflow');
  console.log('─'.repeat(50));
  
  const webhookWorkflow = [{
    id: 'step3',
    type: 'action',
    title: 'Send Webhook',
    description: 'Send data to external API',
    order: 0,
    enabled: true,
    config: {
      action: {
        type: 'webhook',
        endpoint: 'https://httpbin.org/post',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'FormBuilder/1.0'
        },
        body: JSON.stringify({
          formData: '{{formData}}',
          timestamp: '{{timestamp}}',
          formTitle: '{{formTitle}}'
        })
      }
    }
  }];

  const result3 = await engine.executeWorkflow(webhookWorkflow, sampleSubmission, sampleForm);
  console.log('✅ Webhook workflow result:', result3);

  // Test 4: Complex Multi-Step Workflow
  console.log('\n🔄 Test 4: Complex Multi-Step Workflow');
  console.log('─'.repeat(50));
  
  const complexWorkflow = [
    {
      id: 'step4a',
      type: 'condition',
      title: 'Age Validation',
      description: 'Validate user age',
      order: 0,
      enabled: true,
      config: {
        condition: {
          field: 'age',
          operator: 'greaterThan',
          value: '0',
          actions: []
        }
      }
    },
    {
      id: 'step4b',
      type: 'notification',
      title: 'Admin Notification',
      description: 'Notify admin of submission',
      order: 1,
      enabled: true,
      config: {
        notification: {
          type: 'email',
          recipients: ['admin@example.com'],
          template: 'admin',
          subject: 'Form Submission Alert',
          message: 'New submission received from {{name}} ({{email}})'
        }
      }
    },
    {
      id: 'step4c',
      type: 'action',
      title: 'Log to External System',
      description: 'Send to logging service',
      order: 2,
      enabled: true,
      config: {
        action: {
          type: 'webhook',
          endpoint: 'https://httpbin.org/post',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'form_submission',
            data: '{{formData}}',
            timestamp: '{{timestamp}}'
          })
        }
      }
    }
  ];

  const result4 = await engine.executeWorkflow(complexWorkflow, sampleSubmission, sampleForm);
  console.log('✅ Complex workflow result:', result4);

  // Test Summary
  console.log('\n📊 Test Summary');
  console.log('─'.repeat(50));
  console.log(`✅ Conditional Logic: ${result1.success ? 'PASSED' : 'FAILED'}`);
  console.log(`✅ Email Notification: ${result2.success ? 'PASSED' : 'FAILED'}`);
  console.log(`✅ Webhook Action: ${result3.success ? 'PASSED' : 'FAILED'}`);
  console.log(`✅ Complex Multi-Step: ${result4.success ? 'PASSED' : 'FAILED'}`);
  
  const allPassed = [result1, result2, result3, result4].every(r => r.success);
  console.log(`\n🎉 Overall Result: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
  
  if (!allPassed) {
    console.log('\n❌ Errors found:');
    [result1, result2, result3, result4].forEach((result, index) => {
      if (!result.success) {
        console.log(`Test ${index + 1}: ${result.errors.join(', ')}`);
      }
    });
  }
}

// Run the test
testWorkflow().catch(console.error);

module.exports = { testWorkflow };
