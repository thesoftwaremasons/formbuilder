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
  Send,
  Clock,
  Globe,
  Phone,
  Lock,
  Palette,
  Sliders,
  Image,
  Video,
  Volume2,
  Table,
  Star,
  PenTool,
  MapPin,
  CreditCard,
  MousePointer,
  Link,
  Minus,
  Code,
  Calculator,
  Folder,
  BarChart3,
  List,
  Grid,
  Target,
  ExternalLink,
  QrCode,
  PieChart,
  Heading1,
  AlignLeft,
  ToggleLeft,
  Calendar as CalendarIcon,
  Box,
  Layers,
  Move,
  CheckCircle
} from 'lucide-react';

import { ComponentPaletteItem } from './types';

export const DEFAULT_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
  '#8b5cf6', '#ec4899', '#6b7280', '#000000',
  '#ffffff', '#f3f4f6', '#ddd6fe', '#fef3c7',
  '#dcfce7', '#fee2e2', '#dbeafe', '#f3e8ff'
];

export const COMPONENT_PALETTE_ITEMS: ComponentPaletteItem[] = [
  // Basic Input Fields
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
    type: 'password',
    label: 'Password',
    icon: Lock,
    category: 'input',
    defaultProperties: {
      label: 'Password',
      placeholder: 'Enter password...',
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
    type: 'tel',
    label: 'Phone',
    icon: Phone,
    category: 'input',
    defaultProperties: {
      label: 'Phone Number',
      placeholder: 'Enter phone number...',
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
    type: 'url',
    label: 'URL',
    icon: Globe,
    category: 'input',
    defaultProperties: {
      label: 'Website URL',
      placeholder: 'https://example.com',
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
  
  // Date & Time Inputs
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
    type: 'time',
    label: 'Time',
    icon: Clock,
    category: 'input',
    defaultProperties: {
      label: 'Time',
      placeholder: 'Select time...',
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
    type: 'datetime',
    label: 'Date & Time',
    icon: CalendarIcon,
    category: 'input',
    defaultProperties: {
      label: 'Date & Time',
      placeholder: 'Select date and time...',
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

  // Selection Components
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
    type: 'multiselect',
    label: 'Multi Select',
    icon: CheckSquare,
    category: 'selection',
    defaultProperties: {
      label: 'Multi Select',
      placeholder: 'Choose multiple options...',
      required: false,
      options: ['Option 1', 'Option 2', 'Option 3'],
      size: { width: 300, height: 120 },
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
    type: 'toggle',
    label: 'Toggle Switch',
    icon: ToggleLeft,
    category: 'selection',
    defaultProperties: {
      label: 'Toggle Switch',
      required: false,
      size: { width: 300, height: 50 },
      style: {
        backgroundColor: 'transparent',
        textColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 4,
      }
    },
  },

  // Advanced Input Components
  {
    type: 'color',
    label: 'Color Picker',
    icon: Palette,
    category: 'advanced',
    defaultProperties: {
      label: 'Color Picker',
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
    type: 'range',
    label: 'Range Slider',
    icon: Sliders,
    category: 'advanced',
    defaultProperties: {
      label: 'Range Slider',
      required: false,
      properties: {
        min: 0,
        max: 100,
        step: 1,
        value: 50,
      },
      size: { width: 300, height: 60 },
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
    type: 'rating',
    label: 'Star Rating',
    icon: Star,
    category: 'advanced',
    defaultProperties: {
      label: 'Star Rating',
      required: false,
      properties: {
        max: 5,
        allowHalf: true,
        showLabels: true,
      },
      size: { width: 300, height: 60 },
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
    type: 'signature',
    label: 'Signature Pad',
    icon: PenTool,
    category: 'advanced',
    defaultProperties: {
      label: 'Signature',
      required: false,
      size: { width: 400, height: 200 },
      style: {
        backgroundColor: '#ffffff',
        textColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 2,
        borderRadius: 8,
      }
    },
  },
  {
    type: 'location',
    label: 'Location Picker',
    icon: MapPin,
    category: 'advanced',
    defaultProperties: {
      label: 'Location',
      required: false,
      size: { width: 400, height: 300 },
      style: {
        backgroundColor: '#ffffff',
        textColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 8,
      }
    },
  },

  // File Upload Components
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
    type: 'image',
    label: 'Image Upload',
    icon: Image,
    category: 'media',
    defaultProperties: {
      label: 'Image Upload',
      required: false,
      size: { width: 300, height: 200 },
      properties: {
        allowMultiple: false,
        maxSize: 5242880, // 5MB
        allowedTypes: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
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
    type: 'video',
    label: 'Video Upload',
    icon: Video,
    category: 'media',
    defaultProperties: {
      label: 'Video Upload',
      required: false,
      size: { width: 400, height: 250 },
      properties: {
        allowMultiple: false,
        maxSize: 52428800, // 50MB
        allowedTypes: ['.mp4', '.mov', '.avi', '.mkv'],
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
    type: 'audio',
    label: 'Audio Upload',
    icon: Volume2,
    category: 'media',
    defaultProperties: {
      label: 'Audio Upload',
      required: false,
      size: { width: 300, height: 80 },
      properties: {
        allowMultiple: false,
        maxSize: 10485760, // 10MB
        allowedTypes: ['.mp3', '.wav', '.ogg', '.m4a'],
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

  // Business Components
  {
    type: 'payment',
    label: 'Payment',
    icon: CreditCard,
    category: 'business',
    defaultProperties: {
      label: 'Payment Information',
      required: false,
      size: { width: 400, height: 300 },
      properties: {
        acceptedCards: ['visa', 'mastercard', 'amex'],
        currency: 'USD',
        amount: 0,
      },
      style: {
        backgroundColor: '#ffffff',
        textColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 8,
      }
    },
  },

  // Display Components
  {
    type: 'heading',
    label: 'Heading',
    icon: Heading1,
    category: 'display',
    defaultProperties: {
      label: 'Heading Text',
      required: false,
      properties: {
        level: 1,
        text: 'Heading Text',
      },
      size: { width: 400, height: 50 },
      style: {
        backgroundColor: 'transparent',
        textColor: '#111827',
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 0,
      }
    },
  },
  {
    type: 'paragraph',
    label: 'Paragraph',
    icon: AlignLeft,
    category: 'display',
    defaultProperties: {
      label: 'Paragraph Text',
      required: false,
      properties: {
        text: 'This is a paragraph of text.',
      },
      size: { width: 400, height: 80 },
      style: {
        backgroundColor: 'transparent',
        textColor: '#374151',
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 0,
      }
    },
  },
  {
    type: 'divider',
    label: 'Divider',
    icon: Minus,
    category: 'layout',
    defaultProperties: {
      label: 'Divider',
      required: false,
      size: { width: 400, height: 20 },
      style: {
        backgroundColor: 'transparent',
        textColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 0,
      }
    },
  },
  {
    type: 'spacer',
    label: 'Spacer',
    icon: Move,
    category: 'layout',
    defaultProperties: {
      label: 'Spacer',
      required: false,
      size: { width: 400, height: 40 },
      style: {
        backgroundColor: 'transparent',
        textColor: '#374151',
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 0,
      }
    },
  },

  // Interactive Components
  {
    type: 'table',
    label: 'Table',
    icon: Table,
    category: 'interactive',
    defaultProperties: {
      label: 'Table',
      required: false,
      properties: {
        rows: 3,
        columns: 3,
        headers: ['Column 1', 'Column 2', 'Column 3'],
        editable: true,
      },
      size: { width: 500, height: 200 },
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
    type: 'matrix',
    label: 'Matrix',
    icon: Grid,
    category: 'interactive',
    defaultProperties: {
      label: 'Matrix Question',
      required: false,
      properties: {
        rows: ['Row 1', 'Row 2', 'Row 3'],
        columns: ['Column 1', 'Column 2', 'Column 3'],
        type: 'radio', // radio, checkbox, dropdown
      },
      size: { width: 500, height: 250 },
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
    type: 'ranking',
    label: 'Ranking',
    icon: List,
    category: 'interactive',
    defaultProperties: {
      label: 'Ranking Question',
      required: false,
      properties: {
        options: ['Option 1', 'Option 2', 'Option 3'],
        instruction: 'Drag to rank from most to least important',
      },
      size: { width: 400, height: 200 },
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
    type: 'likert',
    label: 'Likert Scale',
    icon: BarChart3,
    category: 'interactive',
    defaultProperties: {
      label: 'Likert Scale',
      required: false,
      properties: {
        statements: ['Statement 1', 'Statement 2', 'Statement 3'],
        scale: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
      },
      size: { width: 600, height: 200 },
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
    type: 'nps',
    label: 'NPS Score',
    icon: Target,
    category: 'interactive',
    defaultProperties: {
      label: 'Net Promoter Score',
      required: false,
      properties: {
        question: 'How likely are you to recommend us to a friend?',
        leftLabel: 'Not likely',
        rightLabel: 'Very likely',
      },
      size: { width: 500, height: 100 },
      style: {
        backgroundColor: '#ffffff',
        textColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 4,
      }
    },
  },

  // Layout Components
  {
    type: 'section',
    label: 'Section',
    icon: Box,
    category: 'layout',
    defaultProperties: {
      label: 'Section',
      required: false,
      properties: {
        title: 'Section Title',
        collapsible: false,
        collapsed: false,
      },
      size: { width: 600, height: 400 },
      style: {
        backgroundColor: '#f9fafb',
        textColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 8,
      }
    },
  },
  {
    type: 'tabs',
    label: 'Tabs',
    icon: Folder,
    category: 'layout',
    defaultProperties: {
      label: 'Tabs',
      required: false,
      properties: {
        tabs: [
          { id: 'tab1', label: 'Tab 1', content: 'Tab 1 Content' },
          { id: 'tab2', label: 'Tab 2', content: 'Tab 2 Content' },
        ],
      },
      size: { width: 600, height: 300 },
      style: {
        backgroundColor: '#ffffff',
        textColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 8,
      }
    },
  },
  {
    type: 'accordion',
    label: 'Accordion',
    icon: ChevronDown,
    category: 'layout',
    defaultProperties: {
      label: 'Accordion',
      required: false,
      properties: {
        panels: [
          { id: 'panel1', title: 'Panel 1', content: 'Panel 1 Content' },
          { id: 'panel2', title: 'Panel 2', content: 'Panel 2 Content' },
        ],
      },
      size: { width: 600, height: 200 },
      style: {
        backgroundColor: '#ffffff',
        textColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 8,
      }
    },
  },
  {
    type: 'card',
    label: 'Card',
    icon: Layers,
    category: 'layout',
    defaultProperties: {
      label: 'Card',
      required: false,
      properties: {
        title: 'Card Title',
        content: 'Card content goes here',
        showHeader: true,
        showFooter: false,
      },
      size: { width: 400, height: 200 },
      style: {
        backgroundColor: '#ffffff',
        textColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 8,
      }
    },
  },
  {
    type: 'progress',
    label: 'Progress Bar',
    icon: BarChart3,
    category: 'display',
    defaultProperties: {
      label: 'Progress Bar',
      required: false,
      properties: {
        value: 50,
        max: 100,
        showLabel: true,
        showPercentage: true,
      },
      size: { width: 400, height: 30 },
      style: {
        backgroundColor: '#f3f4f6',
        textColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 8,
      }
    },
  },

  // Advanced Components
  {
    type: 'code',
    label: 'Code Block',
    icon: Code,
    category: 'advanced',
    defaultProperties: {
      label: 'Code Block',
      required: false,
      properties: {
        language: 'javascript',
        code: '// Enter your code here',
        editable: true,
        showLineNumbers: true,
      },
      size: { width: 500, height: 200 },
      style: {
        backgroundColor: '#1f2937',
        textColor: '#f9fafb',
        borderColor: '#374151',
        borderWidth: 1,
        borderRadius: 8,
      }
    },
  },
  {
    type: 'html',
    label: 'HTML Block',
    icon: Code,
    category: 'advanced',
    defaultProperties: {
      label: 'HTML Block',
      required: false,
      properties: {
        html: '<p>Enter your HTML here</p>',
        allowScripts: false,
      },
      size: { width: 500, height: 200 },
      style: {
        backgroundColor: '#ffffff',
        textColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 8,
      }
    },
  },
  {
    type: 'calculation',
    label: 'Calculation',
    icon: Calculator,
    category: 'advanced',
    defaultProperties: {
      label: 'Calculation',
      required: false,
      properties: {
        formula: 'field1 + field2',
        dependentFields: [],
        displayFormat: 'number',
      },
      size: { width: 300, height: 60 },
      style: {
        backgroundColor: '#f3f4f6',
        textColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 4,
      }
    },
  },
  {
    type: 'embed',
    label: 'Embed',
    icon: ExternalLink,
    category: 'advanced',
    defaultProperties: {
      label: 'Embed',
      required: false,
      properties: {
        url: 'https://example.com',
        type: 'iframe', // iframe, video, map
        allowFullscreen: true,
      },
      size: { width: 500, height: 300 },
      style: {
        backgroundColor: '#ffffff',
        textColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 8,
      }
    },
  },
  {
    type: 'qr',
    label: 'QR Code',
    icon: QrCode,
    category: 'display',
    defaultProperties: {
      label: 'QR Code',
      required: false,
      properties: {
        value: 'https://example.com',
        size: 128,
        errorCorrectionLevel: 'M',
      },
      size: { width: 150, height: 150 },
      style: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 8,
      }
    },
  },
  {
    type: 'chart',
    label: 'Chart',
    icon: PieChart,
    category: 'display',
    defaultProperties: {
      label: 'Chart',
      required: false,
      properties: {
        type: 'bar', // bar, line, pie, doughnut
        data: {
          labels: ['Label 1', 'Label 2', 'Label 3'],
          datasets: [
            {
              label: 'Dataset 1',
              data: [10, 20, 30],
            },
          ],
        },
      },
      size: { width: 500, height: 300 },
      style: {
        backgroundColor: '#ffffff',
        textColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 8,
      }
    },
  },

  // Action Components
  {
    type: 'button',
    label: 'Button',
    icon: MousePointer,
    category: 'action',
    defaultProperties: {
      label: 'Button',
      required: false,
      properties: {
        text: 'Click Me',
        variant: 'primary',
        size: 'medium',
        showIcon: false,
        action: 'submit', // submit, reset, custom
      },
      size: { width: 150, height: 40 },
      style: {
        backgroundColor: '#3b82f6',
        textColor: '#ffffff',
        borderColor: '#3b82f6',
        borderWidth: 1,
        borderRadius: 6,
      }
    },
  },
  {
    type: 'link',
    label: 'Link',
    icon: Link,
    category: 'action',
    defaultProperties: {
      label: 'Link',
      required: false,
      properties: {
        text: 'Click Here',
        url: 'https://example.com',
        target: '_blank',
        showIcon: true,
      },
      size: { width: 150, height: 30 },
      style: {
        backgroundColor: 'transparent',
        textColor: '#3b82f6',
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 0,
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
  layout: 'Layout',
  media: 'Media',
  interactive: 'Interactive',
  display: 'Display',
  business: 'Business',
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
