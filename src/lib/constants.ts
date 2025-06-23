// constants.ts
import { 
  Type, 
  FileText, 
  Mail, 
  Hash, 
  Calendar, 
  ChevronDown, 
  Circle, 
  CheckSquare, 
  Upload, 
  Send 
} from 'lucide-react';
import { ComponentPaletteItem, FormElementType } from './types';

export const DEFAULT_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
  '#8b5cf6', '#ec4899', '#6b7280', '#000000',
  '#ffffff', '#f3f4f6', '#ddd6fe', '#fef3c7',
  '#dcfce7', '#fee2e2', '#dbeafe', '#f3e8ff'
];

export const COMPONENT_PALETTE_ITEMS: ComponentPaletteItem[] = [
  {
    type: 'text',
    label: 'Text Input',
    icon: Type,
    category: 'input',
    defaultProperties: {
      label: 'Text Input',
      placeholder: 'Enter text...',
      required: false,
      size: { width: 300, height: 40 },
      style: {
        backgroundColor: '#ffffff',
        textColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 4,
      }
    },
  },
  {
    type: 'textarea',
    label: 'Textarea',
    icon: FileText,
    category: 'input',
    defaultProperties: {
      label: 'Textarea',
      placeholder: 'Enter long text...',
      required: false,
      size: { width: 300, height: 80 },
      style: {
        backgroundColor: '#ffffff',
        textColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 4,
      }
    },
  },
  {
    type: 'email',
    label: 'Email',
    icon: Mail,
    category: 'input',
    defaultProperties: {
      label: 'Email',
      placeholder: 'Enter email...',
      required: false,
      size: { width: 300, height: 40 },
      style: {
        backgroundColor: '#ffffff',
        textColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 4,
      }
    },
  },
  {
    type: 'number',
    label: 'Number',
    icon: Hash,
    category: 'input',
    defaultProperties: {
      label: 'Number',
      placeholder: 'Enter number...',
      required: false,
      size: { width: 300, height: 40 },
      style: {
        backgroundColor: '#ffffff',
        textColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 4,
      }
    },
  },
  {
    type: 'date',
    label: 'Date',
    icon: Calendar,
    category: 'input',
    defaultProperties: {
      label: 'Date',
      placeholder: 'Select date...',
      required: false,
      size: { width: 300, height: 40 },
      style: {
        backgroundColor: '#ffffff',
        textColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 4,
      }
    },
  },
  {
    type: 'select',
    label: 'Select',
    icon: ChevronDown,
    category: 'selection',
    defaultProperties: {
      label: 'Select',
      placeholder: 'Choose option...',
      required: false,
      options: ['Option 1', 'Option 2', 'Option 3'],
      size: { width: 300, height: 40 },
      style: {
        backgroundColor: '#ffffff',
        textColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 4,
      }
    },
  },
  {
    type: 'radio',
    label: 'Radio',
    icon: Circle,
    category: 'selection',
    defaultProperties: {
      label: 'Radio Group',
      required: false,
      options: ['Option 1', 'Option 2', 'Option 3'],
      size: { width: 300, height: 120 },
      style: {
        backgroundColor: 'transparent',
        textColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 4,
      }
    },
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    icon: CheckSquare,
    category: 'selection',
    defaultProperties: {
      label: 'Checkbox Group',
      required: false,
      options: ['Option 1', 'Option 2', 'Option 3'],
      size: { width: 300, height: 120 },
      style: {
        backgroundColor: 'transparent',
        textColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 4,
      }
    },
  },
  {
    type: 'file',
    label: 'File Upload',
    icon: Upload,
    category: 'advanced',
    defaultProperties: {
      label: 'File Upload',
      required: false,
      size: { width: 300, height: 100 },
      properties: {
        allowMultiple: false,
        maxSize: 10485760, // 10MB
        allowedTypes: ['.pdf', '.doc', '.docx', '.jpg', '.png'],
      },
      style: {
        backgroundColor: '#f9fafb',
        textColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 2,
        borderRadius: 8,
      }
    },
  },
  {
    type: 'submit',
    label: 'Submit Button',
    icon: Send,
    category: 'action',
    defaultProperties: {
      label: 'Submit',
      required: false,
      size: { width: 150, height: 40 },
      style: {
        backgroundColor: '#3b82f6',
        textColor: '#ffffff',
        borderColor: '#3b82f6',
        borderWidth: 1,
        borderRadius: 6,
      },
      properties: {
        variant: 'primary',
        size: 'medium',
        showIcon: true,
      },
    },
  },
];

export const CATEGORIES = {
  input: 'Input Fields',
  selection: 'Selection',
  action: 'Actions',
  advanced: 'Advanced',
} as const;

export const MIN_ELEMENT_SIZE = {
  width: 50,
  height: 30,
};

export const MAX_ELEMENT_SIZE = {
  width: 800,
  height: 600,
};

export const DEFAULT_ELEMENT_POSITION = {
  x: 50,
  y: 50,
};

export const GRID_SIZE = 10;

export const CANVAS_CONFIG = {
  minWidth: 800,
  minHeight: 600,
  backgroundColor: '#ffffff',
  gridColor: '#f3f4f6',
  showGrid: false,
};

export const RESIZE_HANDLE_SIZE = 12;

export const SELECTION_BORDER_COLOR = '#3b82f6';
export const SELECTION_BORDER_WIDTH = 2;

export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  minLength: 'Minimum length is {value} characters',
  maxLength: 'Maximum length is {value} characters',
  min: 'Minimum value is {value}',
  max: 'Maximum value is {value}',
  pattern: 'Please match the requested format',
};