import { NextRequest, NextResponse } from 'next/server';
import { Form } from '@/lib/types';

// This would typically connect to your database
// For demo purposes, using in-memory storage
const forms: Map<string, Form> = new Map();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const isTemplate = searchParams.get('template') === 'true';
    
    const allForms = Array.from(forms.values());
    
    let filteredForms = allForms;
    
    if (category) {
      filteredForms = filteredForms.filter(form => form.templateCategory === category);
    }
    
    if (isTemplate !== null) {
      filteredForms = filteredForms.filter(form => form.isTemplate === isTemplate);
    }

    return NextResponse.json(filteredForms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const newForm: Form = {
      ...formData,
      id: `form_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    forms.set(newForm.id, newForm);

    return NextResponse.json(newForm, { status: 201 });
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
