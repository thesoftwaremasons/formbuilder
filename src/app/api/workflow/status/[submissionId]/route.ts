import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for workflow execution logs
const workflowLogs: Map<string, any[]> = new Map();

export async function GET(
  request: NextRequest,
  { params }: { params: { submissionId: string } }
) {
  try {
    const logs = workflowLogs.get(params.submissionId) || [];
    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Error fetching workflow status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { submissionId: string } }
) {
  try {
    const { log } = await request.json();
    
    const existingLogs = workflowLogs.get(params.submissionId) || [];
    existingLogs.push({
      ...log,
      timestamp: new Date()
    });
    
    workflowLogs.set(params.submissionId, existingLogs);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating workflow status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
