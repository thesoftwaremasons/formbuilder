import React, { useState } from 'react';
import { FormElement } from '@/lib/types';
import { Upload, X, Check } from 'lucide-react';

export interface FileUploadProps {
  element: FormElement;
  onChange: (value: any) => void;
  isPreview?: boolean;
  value?: any;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  element,
  onChange,
  isPreview = false,
  value = null
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const allowMultiple = element.properties?.allowMultiple || false;
    const maxFiles = element.properties?.maxFiles || 5;
    const maxSize = element.properties?.maxSize || 5 * 1024 * 1024; // 5MB default
    const acceptedTypes = element.properties?.acceptedFileTypes || [];

    // Validate file count
    if (!allowMultiple && fileArray.length > 1) {
      setError('Only one file is allowed');
      return;
    }

    if (fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate file types and sizes
    for (const file of fileArray) {
      if (file.size > maxSize) {
        setError(`File "${file.name}" is too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB`);
        return;
      }

      if (acceptedTypes.length > 0) {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        const mimeType = file.type;
        
        const isValidType = acceptedTypes.some((type: string) => {
          if (type.startsWith('.')) {
            return type.toLowerCase() === `.${fileExtension}`;
          }
          return mimeType.includes(type);
        });

        if (!isValidType) {
          setError(`File type "${fileExtension}" is not allowed`);
          return;
        }
      }
    }

    setError(null);
    onChange(allowMultiple ? fileArray : fileArray[0]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const handleFileRemove = (index: number) => {
    if (Array.isArray(value)) {
      const newFiles = value.filter((_, i) => i !== index);
      onChange(newFiles.length > 0 ? newFiles : null);
    } else {
      onChange(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {element.label}
        {element.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="space-y-3">
        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={element.properties?.acceptedFileTypes?.join(',') || '*'}
            multiple={element.properties?.allowMultiple}
            onChange={handleFileInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={!isPreview}
          />
          
          <div className="flex flex-col items-center">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              {dragOver ? 'Drop files here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {element.properties?.acceptedFileTypes?.length > 0
                ? `Accepted: ${element.properties.acceptedFileTypes.join(', ')}`
                : 'All file types accepted'}
            </p>
            {element.properties?.maxSize && (
              <p className="text-xs text-gray-500">
                Max size: {Math.round(element.properties.maxSize / (1024 * 1024))}MB
              </p>
            )}
          </div>
        </div>

        {/* File List */}
        {value && (
          <div className="space-y-2">
            {Array.isArray(value) ? (
              value.map((file: File, index: number) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
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
              ))
            ) : (
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{value.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(value.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(null);
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
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
};
