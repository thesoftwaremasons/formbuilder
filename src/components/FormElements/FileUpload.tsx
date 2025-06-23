'use client';

import React, { useState, useRef } from 'react';
import { FormElement } from '@/lib/types';
import { Upload, File, X, Check } from 'lucide-react';

interface FileUploadProps {
  element: FormElement;
  onChange: (value: FileList | null) => void;
  isPreview?: boolean;
  value?: FileList | null;
}

export function FileUpload({ element, onChange, isPreview = false, value = null }: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>(value ? Array.from(value) : []);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    
    // Validate file types if specified
    const allowedTypes = element.properties?.allowedTypes as string[] || [];
    if (allowedTypes.length > 0) {
      const invalidFiles = fileArray.filter(file => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        return !allowedTypes.includes(`.${extension}`);
      });
      
      if (invalidFiles.length > 0) {
        setError(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
        return;
      }
    }

    // Validate file size if specified
    const maxSize = element.properties?.maxSize as number || 10 * 1024 * 1024; // 10MB default
    const oversizedFiles = fileArray.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setError(`File too large. Maximum size: ${formatFileSize(maxSize)}`);
      return;
    }

    // Handle multiple files
    const allowMultiple = element.properties?.allowMultiple as boolean || false;
    const newFiles = allowMultiple ? [...selectedFiles, ...fileArray] : fileArray;
    
    setSelectedFiles(newFiles);
    
    // Create new FileList-like object
    const dataTransfer = new DataTransfer();
    newFiles.forEach(file => dataTransfer.items.add(file));
    onChange(dataTransfer.files);
    
    // Clear error
    if (error) {
      setError('');
    }
  };

  const handleFileRemove = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    
    const dataTransfer = new DataTransfer();
    newFiles.forEach(file => dataTransfer.items.add(file));
    onChange(dataTransfer.files.length > 0 ? dataTransfer.files : null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleBlur = () => {
    // Validate on blur
    if (element.required && selectedFiles.length === 0) {
      setError(`${element.label} is required`);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    // Return appropriate icon based on file type
    return <File className="w-4 h-4" />;
  };

  const containerClasses = `
    relative w-full
    ${isPreview ? 'mb-4' : 'p-4 bg-white border border-gray-200 rounded-lg'}
  `;

  const dropZoneClasses = `
    border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 cursor-pointer
    ${isDragOver 
      ? 'border-primary-400 bg-primary-50' 
      : error 
      ? 'border-red-300 bg-red-50 hover:border-red-400' 
      : 'border-gray-300 bg-gray-50 hover:border-gray-400'
    }
  `;

  const labelClasses = `
    block text-sm font-medium mb-3 transition-colors duration-200
    ${error ? 'text-red-700' : 'text-gray-700'}
    ${element.required ? "after:content-['*'] after:text-red-500 after:ml-1" : ''}
  `;

  const allowedTypes = element.properties?.allowedTypes as string[] || [];
  const maxSize = element.properties?.maxSize as number || 10 * 1024 * 1024;
  const allowMultiple = element.properties?.allowMultiple as boolean || false;

  return (
    <div className={containerClasses}>
      {!isPreview && (
        <div className="absolute -top-2 -left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded shadow-sm">
          FILE
        </div>
      )}
      
      <div className="space-y-3">
        <label className={labelClasses}>
          {element.label}
        </label>
        
        <div
          className={dropZoneClasses}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          onBlur={handleBlur}
          style={{
            width: isPreview ? '100%' : `${element.size.width}px`,
            minHeight: `${element.size.height}px`,
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            multiple={allowMultiple}
            accept={allowedTypes.join(',')}
            required={element.required}
          />
          
          <Upload className={`w-8 h-8 mx-auto mb-3 ${isDragOver ? 'text-primary-600' : 'text-gray-400'}`} />
          
          <div className="space-y-1">
            <p className={`text-sm font-medium ${isDragOver ? 'text-primary-600' : 'text-gray-700'}`}>
              {isDragOver ? 'Drop files here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500">
              {allowedTypes.length > 0 && `Supported: ${allowedTypes.join(', ')} • `}
              Max size: {formatFileSize(maxSize)}
              {allowMultiple && ' • Multiple files allowed'}
            </p>
          </div>
        </div>
        
        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
            <div className="space-y-1">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {getFileIcon(file.name)}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileRemove(index);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}