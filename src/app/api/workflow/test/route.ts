import { NextRequest, NextResponse } from 'next/server';
import { WorkflowEngine } from '@/lib/workflow-engine';
import { WorkflowStep, Form, FormSubmission } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { workflow, formData, form } = await request.json();
    
    // Create a mock submission for testing
    const mockSubmission: FormSubmission = {
      id: `test_${Date.now()}`,
      formId: form.id,
      data: formData,
      submittedAt: new Date(),
      ipAddress: 'test',
      userAgent: 'test',
      status: 'pending'
    };

    const workflowEngine = new WorkflowEngine();
    const result = await workflowEngine.executeWorkflow(workflow, mockSubmission, form);

    return NextResponse.json({
      success: result.success,
      errors: result.errors,
      logs: result.logs,
      redirectUrl: result.redirectUrl
    });
  } catch (error) {
    console.error('Error testing workflow:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
