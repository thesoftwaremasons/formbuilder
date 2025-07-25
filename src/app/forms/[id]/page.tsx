
import React from 'react';
import { FormSubmissionHandler } from '@/components/FormElements/FormSubmissionHandler';
import { Form } from '@/lib/types';
import { notFound } from 'next/navigation';

// This would typically fetch form data from your database
async function getForm(formId: string): Promise<Form | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/forms/${formId}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching form:', error);
    return null;
  }
}

export default async function FormPage({ params }: { params: { id: string } }) {
  const form = await getForm(params.id);
  
  if (!form) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <FormSubmissionHandler
        form={form}
        onSubmissionComplete={(submission) => {
          console.log('Form submitted:', submission);
        }}
        onError={(error) => {
          console.error('Form submission error:', error);
        }}
      />
    </div>
  );
}
