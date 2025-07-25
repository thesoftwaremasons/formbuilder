// types.ts - Enhanced with Preview, Pages, and Workflow
export interface FormElement {
  id: string;
  type: FormElementType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  properties: Record<string, any>;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style?: ElementStyle;
  validation?: ValidationRule[];
  pageId: string;
  conditionalLogic?: ConditionalLogic[];
}

export type FormElementType = 
  | 'text' 
  | 'textarea' 
  | 'select' 
  | 'checkbox' 
  | 'radio' 
  | 'submit'
  | 'number'
  | 'email'
  | 'date'
  | 'file'
  | 'heading'
  | 'paragraph'
  | 'divider'
  | 'time'
  | 'datetime'
  | 'url'
  | 'tel'
  | 'password'
  | 'color'
  | 'range'
  | 'image'
  | 'video'
  | 'audio'
  | 'table'
  | 'rating'
  | 'signature'
  | 'location'
  | 'payment'
  | 'multiselect'
  | 'toggle'
  | 'button'
  | 'link'
  | 'spacer'
  | 'code'
  | 'html'
  | 'calculation'
  | 'section'
  | 'tabs'
  | 'accordion'
  | 'card'
  | 'progress'
  | 'matrix'
  | 'ranking'
  | 'likert'
  | 'nps'
  | 'embed'
  | 'qr'
  | 'chart';

export interface ElementStyle {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  fontSize?: number;
  fontWeight?: string;
  padding?: number;
  textAlign?: 'left' | 'center' | 'right';
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'pattern' | 'min' | 'max';
  value?: string | number;
  message: string;
}

export interface ConditionalLogic {
  id: string;
  condition: {
    elementId: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'isEmpty' | 'isNotEmpty';
    value: string | number;
  };
  action: {
    type: 'show' | 'hide' | 'require' | 'setValue' | 'redirect';
    targetId?: string;
    value?: string;
  };
}

export interface FormPage {
  id: string;
  title: string;
  description?: string;
  elements: FormElement[];
  order: number;
  conditions?: ConditionalLogic[];
  settings?: PageSettings;
}

export interface PageSettings {
  showProgressBar?: boolean;
  allowBack?: boolean;
  autoAdvance?: boolean;
  timeLimit?: number;
  backgroundImage?: string;
  backgroundColor?: string;
}

export interface Form {
  id: string;
  title: string;
  description: string;
  pages: FormPage[];
  settings: FormSettings;
  theme: FormTheme;
  workflow: WorkflowStep[];
  createdAt: Date;
  updatedAt: Date;
  isTemplate: boolean;
  templateCategory?: string;
}

export interface FormSettings {
  allowMultipleSubmissions: boolean;
  requireLogin: boolean;
  showProgressBar: boolean;
  enableAutoSave: boolean;
  redirectUrl?: string;
  confirmationMessage: string;
  emailNotifications: EmailNotificationSettings;
  submitButtonText?: string;
  saveAndContinue?: boolean;
}

export interface EmailNotificationSettings {
  enabled: boolean;
  recipients: string[];
  template: string;
  subject?: string;
  includeSubmissionData?: boolean;
}

export interface FormTheme {
  primaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  fontSize: string;
  borderRadius: string;
  customCSS?: string;
}

export interface WorkflowStep {
  id: string;
  type: 'condition' | 'action' | 'notification' | 'integration';
  title: string;
  description: string;
  config: WorkflowConfig;
  order: number;
  enabled: boolean;
}

export interface WorkflowConfig {
  // Condition workflow
  condition?: {
    field: string;
    operator: string;
    value: string;
    actions: WorkflowAction[];
  };
  
  // Action workflow
  action?: {
    type: 'webhook' | 'email' | 'database' | 'redirect' | 'calculation';
    endpoint?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: string;
    template?: string;
  };
  
  // Notification workflow
  notification?: {
    type: 'email' | 'sms' | 'push' | 'slack';
    recipients: string[];
    template: string;
    subject?: string;
    message: string;
  };
  
  // Integration workflow
  integration?: {
    service: 'zapier' | 'integromat' | 'custom';
    endpoint: string;
    apiKey?: string;
    mapping: Record<string, string>;
  };
}

export interface WorkflowAction {
  type: 'show' | 'hide' | 'setValue' | 'redirect' | 'calculate' | 'validate';
  targetId?: string;
  value?: string;
  formula?: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface FormBuilderState {
  form: Form | null;
  selectedElement: FormElement | null;
  selectedPage: string;
  draggedElement: any;
  previewMode: boolean;
  workflowMode: boolean;
  canvasSize: { width: number; height: number };
  zoom: number;
}

export interface PreviewState {
  currentPageIndex: number;
  formData: Record<string, any>;
  validationErrors: Record<string, string>;
  isSubmitting: boolean;
  device: 'desktop' | 'tablet' | 'mobile';
}

// Component Props Interfaces
export interface ComponentPaletteItem {
  type: FormElementType;
  label: string;
  icon: any;
  category: 'input' | 'selection' | 'action' | 'advanced' | 'layout' | 'media' | 'interactive' | 'display' | 'business';
  defaultProperties: Partial<FormElement>;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface DragState {
  isDragging: boolean;
  isResizing: boolean;
  dragStart: Position;
  initialPos: Position;
  initialSize: Size;
}

export interface ColorPaletteProps {
  onColorSelect: (color: string) => void;
  selectedColor?: string;
  colors?: string[];
}

export interface ResizableElementProps {
  element: FormElement;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<FormElement>) => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  isPreview?: boolean;
}

export interface PropertiesPanelProps {
  selectedElement: FormElement | null;
  onUpdate: (updates: Partial<FormElement>) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

export interface ComponentPaletteProps {
  onElementAdd: (type: FormElementType) => void;
}

export interface FormCanvasProps {
  elements: FormElement[];
  selectedElement: FormElement | null;
  onElementSelect: (element: FormElement | null) => void;
  onElementUpdate: (id: string, updates: Partial<FormElement>) => void;
  onElementDelete: (id: string) => void;
  onElementAdd: (element: FormElement) => void;
  isPreview?: boolean;
}

export interface PreviewModalProps {
  form: Form;
  isOpen: boolean;
  onClose: () => void;
  initialPage?: number;
}

export interface PageManagerProps {
  form: Form;
  selectedPage: string;
  onPageSelect: (pageId: string) => void;
  onPageAdd: () => void;
  onPageDelete: (pageId: string) => void;
  onPageUpdate: (pageId: string, updates: Partial<FormPage>) => void;
  onPageReorder: (fromIndex: number, toIndex: number) => void;
}

export interface WorkflowPanelProps {
  form: Form;
  onWorkflowUpdate: (workflow: WorkflowStep[]) => void;
}

export interface FormRendererProps {
  page: FormPage;
  formData: Record<string, any>;
  onDataChange: (data: Record<string, any>) => void;
  onSubmit?: (data: Record<string, any>) => void;
  validationErrors?: Record<string, string>;
  isPreview?: boolean;
}