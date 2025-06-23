// utils.ts
import { FormElement, FormElementType, Position, Size } from './types';
import { COMPONENT_PALETTE_ITEMS, MIN_ELEMENT_SIZE, MAX_ELEMENT_SIZE, DEFAULT_ELEMENT_POSITION } from './constants';

export const generateId = (prefix: string = 'element'): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createFormElement = (
  type: FormElementType, 
  position: Position = DEFAULT_ELEMENT_POSITION
): FormElement => {
  const paletteItem = COMPONENT_PALETTE_ITEMS.find(item => item.type === type);
  
  if (!paletteItem) {
    throw new Error(`Unknown element type: ${type}`);
  }

  return {
  id: generateId('element'),
  type,
  label: paletteItem.defaultProperties.label || type.charAt(0).toUpperCase() + type.slice(1),
  placeholder: paletteItem.defaultProperties.placeholder,
  required: paletteItem.defaultProperties.required || false,
  options: paletteItem.defaultProperties.options ? [...paletteItem.defaultProperties.options] : undefined,
  properties: paletteItem.defaultProperties.properties ? { ...paletteItem.defaultProperties.properties } : {},
  position: { ...position },
  size: { ...paletteItem.defaultProperties.size! },
  style: { ...paletteItem.defaultProperties.style },
  pageId: ''
};
};

export const cloneFormElement = (element: FormElement, offset: Position = { x: 20, y: 20 }): FormElement => {
  return {
    ...element,
    id: generateId('element'),
    position: {
      x: element.position.x + offset.x,
      y: element.position.y + offset.y,
    },
    label: `${element.label} (Copy)`,
  };
};

export const constrainSize = (size: Size): Size => {
  return {
    width: Math.max(MIN_ELEMENT_SIZE.width, Math.min(MAX_ELEMENT_SIZE.width, size.width)),
    height: Math.max(MIN_ELEMENT_SIZE.height, Math.min(MAX_ELEMENT_SIZE.height, size.height)),
  };
};

export const constrainPosition = (position: Position, canvasSize?: Size): Position => {
  const minX = 0;
  const minY = 0;
  const maxX = canvasSize ? canvasSize.width - MIN_ELEMENT_SIZE.width : Infinity;
  const maxY = canvasSize ? canvasSize.height - MIN_ELEMENT_SIZE.height : Infinity;

  return {
    x: Math.max(minX, Math.min(maxX, position.x)),
    y: Math.max(minY, Math.min(maxY, position.y)),
  };
};

export const isValidHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

export const getContrastColor = (backgroundColor: string): string => {
  // Simple contrast calculation
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return brightness > 155 ? '#000000' : '#ffffff';
};

export const snapToGrid = (value: number, gridSize: number = 10): number => {
  return Math.round(value / gridSize) * gridSize;
};

export const getElementBounds = (element: FormElement) => {
  return {
    left: element.position.x,
    top: element.position.y,
    right: element.position.x + element.size.width,
    bottom: element.position.y + element.size.height,
  };
};

export const isPointInElement = (point: Position, element: FormElement): boolean => {
  const bounds = getElementBounds(element);
  return point.x >= bounds.left && 
         point.x <= bounds.right && 
         point.y >= bounds.top && 
         point.y <= bounds.bottom;
};

export const getElementsAtPoint = (point: Position, elements: FormElement[]): FormElement[] => {
  return elements.filter(element => isPointInElement(point, element));
};

export const sortElementsByZIndex = (elements: FormElement[], selectedElement?: FormElement | null): FormElement[] => {
  return [...elements].sort((a, b) => {
    // Selected element should be on top
    if (selectedElement) {
      if (a.id === selectedElement.id) return 1;
      if (b.id === selectedElement.id) return -1;
    }
    return 0;
  });
};

export const validateFormElement = (element: FormElement): string[] => {
  const errors: string[] = [];

  if (!element.label.trim()) {
    errors.push('Label is required');
  }

  if (element.type === 'email' && element.placeholder && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(element.placeholder)) {
    // Only validate placeholder if it looks like it should be an email
    if (element.placeholder.includes('@')) {
      errors.push('Invalid email format in placeholder');
    }
  }

  if (['select', 'radio', 'checkbox'].includes(element.type)) {
    if (!element.options || element.options.length === 0) {
      errors.push('At least one option is required');
    } else if (element.options.some(option => !option.trim())) {
      errors.push('All options must have text');
    }
  }

  if (element.size.width < MIN_ELEMENT_SIZE.width || element.size.height < MIN_ELEMENT_SIZE.height) {
    errors.push(`Element is too small (minimum ${MIN_ELEMENT_SIZE.width}x${MIN_ELEMENT_SIZE.height})`);
  }

  return errors;
};

export const exportFormElements = (elements: FormElement[]): string => {
  return JSON.stringify(elements, null, 2);
};

export const importFormElements = (jsonString: string): FormElement[] => {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) {
      throw new Error('Invalid format: expected array of elements');
    }
    
    return parsed.map((element, index) => {
      if (!element.id || !element.type) {
        throw new Error(`Invalid element at index ${index}: missing id or type`);
      }
      return element as FormElement;
    });
  } catch (error) {
    throw new Error(`Failed to import elements: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const calculateDistance = (point1: Position, point2: Position): number => {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

export const getElementCenter = (element: FormElement): Position => {
  return {
    x: element.position.x + element.size.width / 2,
    y: element.position.y + element.size.height / 2,
  };
};