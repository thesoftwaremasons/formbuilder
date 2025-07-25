import { NextRequest, NextResponse } from 'next/server';
import { Form, FormSubmission, WorkflowStep } from '@/lib/types';
import { WorkflowEngine } from '@/lib/workflow-engine';

// This would typically connect to your database
// For demo purposes, using in-memory storage
const forms: Map<string, Form> = new Map();
const submissions: Map<string, FormSubmission> = new Map();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const submissionData = await request.json();
    const form = forms.get(params.id);
    
    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    // Create submission record
    const submission: FormSubmission = {
      id: `sub_${Date.now()}`,
      formId: params.id,
      data: submissionData,
      submittedAt: new Date(),
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      status: 'pending'
    };

    submissions.set(submission.id, submission);

    // Execute workflow
    const workflowEngine = new WorkflowEngine();
    const workflowResult = await workflowEngine.executeWorkflow(form.workflow, submission, form);

    // Update submission status based on workflow result
    if (workflowResult.success) {
      submission.status = 'completed';
    } else {
      submission.status = 'failed';
    }

    submissions.set(submission.id, submission);

    return NextResponse.json({
      success: workflowResult.success,
      submissionId: submission.id,
      message: workflowResult.success ? 'Form submitted successfully' : 'Form submitted but workflow failed',
      errors: workflowResult.errors,
      redirectUrl: workflowResult.redirectUrl
    });

  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formSubmissions = Array.from(submissions.values())
      .filter(submission => submission.formId === params.id)
      .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());

    return NextResponse.json(formSubmissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
