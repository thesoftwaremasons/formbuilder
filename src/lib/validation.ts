import { FormElement, ValidationRule } from './types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class FormValidator {
  static validateElement(element: FormElement, value: any): ValidationResult {
    const errors: string[] = [];
    
    // Check required field
    if (element.required && this.isEmpty(value)) {
      errors.push(`${element.label} is required`);
    }
    
    // Skip other validations if empty and not required
    if (this.isEmpty(value) && !element.required) {
      return { isValid: true, errors: [] };
    }
    
    // Apply validation rules
    if (element.validation) {
      element.validation.forEach(rule => {
        const ruleResult = this.validateRule(rule, value, element.label);
        if (!ruleResult.isValid) {
          errors.push(...ruleResult.errors);
        }
      });
    }
    
    // Type-specific validation
    const typeResult = this.validateByType(element.type, value, element.label);
    if (!typeResult.isValid) {
      errors.push(...typeResult.errors);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  static validateRule(rule: ValidationRule, value: any, fieldLabel: string): ValidationResult {
    const errors: string[] = [];
    
    switch (rule.type) {
      case 'required':
        if (this.isEmpty(value)) {
          errors.push(rule.message || `${fieldLabel} is required`);
        }
        break;
        
      case 'email':
        if (!this.isValidEmail(value)) {
          errors.push(rule.message || `${fieldLabel} must be a valid email address`);
        }
        break;
        
      case 'minLength':
        if (typeof value === 'string' && value.length < (rule.value as number)) {
          errors.push(rule.message || `${fieldLabel} must be at least ${rule.value} characters long`);
        }
        break;
        
      case 'maxLength':
        if (typeof value === 'string' && value.length > (rule.value as number)) {
          errors.push(rule.message || `${fieldLabel} must be no more than ${rule.value} characters long`);
        }
        break;
        
      case 'min':
        if (typeof value === 'number' && value < (rule.value as number)) {
          errors.push(rule.message || `${fieldLabel} must be at least ${rule.value}`);
        }
        break;
        
      case 'max':
        if (typeof value === 'number' && value > (rule.value as number)) {
          errors.push(rule.message || `${fieldLabel} must be no more than ${rule.value}`);
        }
        break;
        
      case 'pattern':
        if (typeof value === 'string' && !new RegExp(rule.value as string).test(value)) {
          errors.push(rule.message || `${fieldLabel} format is invalid`);
        }
        break;
        
      default:
        console.warn(`Unknown validation rule: ${rule.type}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  static validateByType(type: string, value: any, fieldLabel: string): ValidationResult {
    const errors: string[] = [];
    
    switch (type) {
      case 'email':
        if (!this.isEmpty(value) && !this.isValidEmail(value)) {
          errors.push(`${fieldLabel} must be a valid email address`);
        }
        break;
        
      case 'url':
        if (!this.isEmpty(value) && !this.isValidUrl(value)) {
          errors.push(`${fieldLabel} must be a valid URL`);
        }
        break;
        
      case 'tel':
        if (!this.isEmpty(value) && !this.isValidPhoneNumber(value)) {
          errors.push(`${fieldLabel} must be a valid phone number`);
        }
        break;
        
      case 'number':
        if (!this.isEmpty(value) && !this.isValidNumber(value)) {
          errors.push(`${fieldLabel} must be a valid number`);
        }
        break;
        
      case 'date':
        if (!this.isEmpty(value) && !this.isValidDate(value)) {
          errors.push(`${fieldLabel} must be a valid date`);
        }
        break;
        
      case 'file':
        if (!this.isEmpty(value) && !this.isValidFile(value)) {
          errors.push(`${fieldLabel} must be a valid file`);
        }
        break;
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  static isEmpty(value: any): boolean {
    if (value === null || value === undefined || value === '') {
      return true;
    }
    
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    
    if (typeof value === 'object') {
      return Object.keys(value).length === 0;
    }
    
    return false;
  }
  
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  
  static isValidPhoneNumber(phone: string): boolean {
    // Basic phone number validation (adjust regex as needed)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }
  
  static isValidNumber(value: any): boolean {
    return !isNaN(value) && isFinite(value);
  }
  
  static isValidDate(date: string): boolean {
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj.getTime());
  }
  
  static isValidFile(file: any): boolean {
    if (Array.isArray(file)) {
      return file.every(f => f instanceof File || (f && f.name && f.size !== undefined));
    }
    return file instanceof File || (file && file.name && file.size !== undefined);
  }
  
  static validateForm(elements: FormElement[], formData: Record<string, any>): Record<string, string[]> {
    const errors: Record<string, string[]> = {};
    
    elements.forEach(element => {
      const value = formData[element.id];
      const result = this.validateElement(element, value);
      
      if (!result.isValid) {
        errors[element.id] = result.errors;
      }
    });
    
    return errors;
  }
  
  static hasValidationErrors(errors: Record<string, string[]>): boolean {
    return Object.keys(errors).length > 0;
  }
  
  static getFirstError(errors: Record<string, string[]>): string | null {
    for (const fieldErrors of Object.values(errors)) {
      if (fieldErrors.length > 0) {
        return fieldErrors[0];
      }
    }
    return null;
  }
  
  static countTotalErrors(errors: Record<string, string[]>): number {
    return Object.values(errors).reduce((total, fieldErrors) => total + fieldErrors.length, 0);
  }
}

export default FormValidator;
