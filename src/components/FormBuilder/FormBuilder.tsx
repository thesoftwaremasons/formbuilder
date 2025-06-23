// FormBuilder.tsx - Enhanced Main Component with Preview, Pages & Workflow
import React, { useState, useCallback, useEffect } from 'react';
import { 
  Save, 
  Download, 
  Eye, 
  Settings, 
  Undo, 
  Redo,
  FileText,
  Zap,
  Plus,
  Layers
} from 'lucide-react';
import { FormBuilderState, Form, FormElement, FormElementType, FormPage, WorkflowStep } from '@/lib/types';
import { cloneFormElement, createFormElement } from '@/lib/utils';
import { ComponentPalette } from './ComponentPalette';
import { FormCanvas } from './FormCanvas';
import { PageManager } from './PageManager';
import { PreviewModal } from './PreviewModal';
import { PropertiesPanel } from './PropertiesPanel';
import { WorkflowPanel } from './WorkflowPanel';
// import { ComponentPalette } from './components/ComponentPalette';
// import { FormCanvas } from './components/FormCanvas';
// import { PropertiesPanel } from './components/PropertiesPanel';
// import { PreviewModal } from './components/PreviewModal';
// import { PageManager } from './components/PageManager';
// import { WorkflowPanel } from './components/WorkflowPanel';
// import { createFormElement, cloneFormElement, exportFormElements } from './utils';

  const createDefaultForm = (): Form => ({
    id: `form_${Date.now()}`,
    title: 'Untitled Form',
    description: 'Form description',
    pages: [
      {
        id: `page_${Date.now()}`,
        title: 'Page 1',
        elements: [],
        order: 0,
      }
    ],
    settings: {
      allowMultipleSubmissions: false,
      requireLogin: false,
      showProgressBar: true,
      enableAutoSave: true,
      confirmationMessage: 'Thank you for your submission!',
      emailNotifications: {
        enabled: false,
        recipients: [],
        template: 'default',
      },
    },
    theme: {
      primaryColor: '#3b82f6',
      backgroundColor: '#ffffff',
      fontFamily: 'Inter',
      fontSize: '16px',
      borderRadius: '8px',
    },
    workflow: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isTemplate: false,
  });
export const FormBuilder: React.FC = () => {
  const [state, setState] = useState<FormBuilderState>({
    form: createDefaultForm(),
    selectedElement: null,
    selectedPage: '',
    draggedElement: null,
    previewMode: false,
    workflowMode: false,
    canvasSize: { width: 800, height: 600 },
    zoom: 100,
  });

  const [showPreview, setShowPreview] = useState(false);
  const [activePanel, setActivePanel] = useState<'pages' | 'workflow' | 'properties'>('properties');
  const [history, setHistory] = useState<Form[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Initialize with first page selected
  useEffect(() => {
    if (state.form && state.form.pages.length > 0 && !state.selectedPage) {
      setState((prev: any) => ({ ...prev, selectedPage: state.form!.pages[0].id }));
    }
  }, [state.form, state.selectedPage]);


  const saveToHistory = useCallback((form: Form) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ ...form });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Add element to current page
  const handleElementAdd = useCallback((type: FormElementType) => {
    if (!state.form || !state.selectedPage) return;

    const currentPage = state.form.pages.find(p => p.id === state.selectedPage);
    if (!currentPage) return;

    const newElement = createFormElement(type, { x: 50, y: 50 });
    newElement.pageId = state.selectedPage;
    
    setState(prev => {
      if (!prev.form) return prev;
      
      const updatedPages = prev.form.pages.map(page => 
        page.id === state.selectedPage 
          ? { ...page, elements: [...page.elements, newElement] }
          : page
      );
      
      const updatedForm = {
        ...prev.form,
        pages: updatedPages,
        updatedAt: new Date(),
      };
      
      saveToHistory(updatedForm);
      
      return {
        ...prev,
        form: updatedForm,
        selectedElement: newElement,
      };
    });
  }, [state.form, state.selectedPage, saveToHistory]);

  // Add element directly (for duplications, etc.)
  const handleElementAddDirect = useCallback((element: FormElement) => {
    setState(prev => {
      if (!prev.form || !prev.selectedPage) return prev;
      
      const updatedPages = prev.form.pages.map(page => 
        page.id === prev.selectedPage 
          ? { ...page, elements: [...page.elements, element] }
          : page
      );
      
      const updatedForm = {
        ...prev.form,
        pages: updatedPages,
        updatedAt: new Date(),
      };
      
      saveToHistory(updatedForm);
      
      return {
        ...prev,
        form: updatedForm,
        selectedElement: element,
      };
    });
  }, [saveToHistory]);

  // Update element
  const handleElementUpdate = useCallback((id: string, updates: Partial<FormElement>) => {
    setState(prev => {
      if (!prev.form) return prev;
      
      const updatedPages = prev.form.pages.map(page => ({
        ...page,
        elements: page.elements.map(el => 
          el.id === id ? { ...el, ...updates } : el
        )
      }));
      
      const updatedForm = {
        ...prev.form,
        pages: updatedPages,
        updatedAt: new Date(),
      };
      
      return {
        ...prev,
        form: updatedForm,
        selectedElement: prev.selectedElement?.id === id 
          ? { ...prev.selectedElement, ...updates }
          : prev.selectedElement,
      };
    });
  }, []);

  // Delete element
  const handleElementDelete = useCallback((id: string) => {
    setState(prev => {
      if (!prev.form) return prev;
      
      const updatedPages = prev.form.pages.map(page => ({
        ...page,
        elements: page.elements.filter(el => el.id !== id)
      }));
      
      const updatedForm = {
        ...prev.form,
        pages: updatedPages,
        updatedAt: new Date(),
      };
      
      saveToHistory(updatedForm);
      
      return {
        ...prev,
        form: updatedForm,
        selectedElement: prev.selectedElement?.id === id ? null : prev.selectedElement,
      };
    });
  }, [saveToHistory]);

  // Select element
  const handleElementSelect = useCallback((element: FormElement | null) => {
    setState(prev => ({ ...prev, selectedElement: element }));
  }, []);

  // Duplicate selected element
  const handleElementDuplicate = useCallback(() => {
    if (!state.selectedElement) return;
    
    const duplicatedElement = cloneFormElement(state.selectedElement);
    duplicatedElement.pageId = state.selectedPage;
    handleElementAddDirect(duplicatedElement);
  }, [state.selectedElement, state.selectedPage, handleElementAddDirect]);

  // Page management
  const handlePageAdd = useCallback(() => {
    setState(prev => {
      if (!prev.form) return prev;
      
      const newPage: FormPage = {
        id: `page_${Date.now()}`,
        title: `Page ${prev.form.pages.length + 1}`,
        elements: [],
        order: prev.form.pages.length,
      };
      
      const updatedForm = {
        ...prev.form,
        pages: [...prev.form.pages, newPage],
        updatedAt: new Date(),
      };
      
      saveToHistory(updatedForm);
      
      return {
        ...prev,
        form: updatedForm,
        selectedPage: newPage.id,
        selectedElement: null,
      };
    });
  }, [saveToHistory]);

  const handlePageDelete = useCallback((pageId: string) => {
    setState(prev => {
      if (!prev.form || prev.form.pages.length <= 1) return prev;
      
      const updatedPages = prev.form.pages
        .filter(page => page.id !== pageId)
        .map((page, index) => ({ ...page, order: index }));
      
      const newSelectedPage = prev.selectedPage === pageId 
        ? updatedPages[0]?.id || ''
        : prev.selectedPage;
      
      const updatedForm = {
        ...prev.form,
        pages: updatedPages,
        updatedAt: new Date(),
      };
      
      saveToHistory(updatedForm);
      
      return {
        ...prev,
        form: updatedForm,
        selectedPage: newSelectedPage,
        selectedElement: null,
      };
    });
  }, [saveToHistory]);

  const handlePageSelect = useCallback((pageId: string) => {
    setState(prev => ({ 
      ...prev, 
      selectedPage: pageId, 
      selectedElement: null 
    }));
  }, []);

  const handlePageUpdate = useCallback((pageId: string, updates: Partial<FormPage>) => {
    setState(prev => {
      if (!prev.form) return prev;
      
      const updatedPages = prev.form.pages.map(page =>
        page.id === pageId ? { ...page, ...updates } : page
      );
      
      const updatedForm = {
        ...prev.form,
        pages: updatedPages,
        updatedAt: new Date(),
      };
      
      return {
        ...prev,
        form: updatedForm,
      };
    });
  }, []);

  const handlePageReorder = useCallback((fromIndex: number, toIndex: number) => {
    setState(prev => {
      if (!prev.form) return prev;
      
      const pages = [...prev.form.pages];
      const [movedPage] = pages.splice(fromIndex, 1);
      pages.splice(toIndex, 0, movedPage);
      
      // Update order
      const updatedPages = pages.map((page, index) => ({ ...page, order: index }));
      
      const updatedForm = {
        ...prev.form,
        pages: updatedPages,
        updatedAt: new Date(),
      };
      
      saveToHistory(updatedForm);
      
      return {
        ...prev,
        form: updatedForm,
      };
    });
  }, [saveToHistory]);

  // Workflow management
  const handleWorkflowUpdate = useCallback((workflow: WorkflowStep[]) => {
    setState(prev => {
      if (!prev.form) return prev;
      
      const updatedForm = {
        ...prev.form,
        workflow,
        updatedAt: new Date(),
      };
      
      saveToHistory(updatedForm);
      
      return {
        ...prev,
        form: updatedForm,
      };
    });
  }, [saveToHistory]);

  // Save form
  const handleSave = useCallback(() => {
    if (!state.form) return;
    
    const formData = {
      form: state.form,
      metadata: {
        saved: new Date().toISOString(),
        version: '1.0',
        pageCount: state.form.pages.length,
        elementCount: state.form.pages.reduce((sum, page) => sum + page.elements.length, 0),
      }
    };
    
    localStorage.setItem('form-builder-data', JSON.stringify(formData));
    alert('Form saved successfully!');
  }, [state.form]);

  // Export form
  const handleExport = useCallback(() => {
    if (!state.form) return;
    
    const jsonString = JSON.stringify(state.form, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${state.form.title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [state.form]);

  // Preview form
  const handlePreview = useCallback(() => {
    setShowPreview(true);
  }, []);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const form = history[newIndex];
      
      setHistoryIndex(newIndex);
      setState(prev => ({
        ...prev,
        form,
        selectedElement: null,
      }));
    }
  }, [history, historyIndex]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const form = history[newIndex];
      
      setHistoryIndex(newIndex);
      setState(prev => ({
        ...prev,
        form,
        selectedElement: null,
      }));
    }
  }, [history, historyIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
          case 'd':
            e.preventDefault();
            handleElementDuplicate();
            break;
          case 'p':
            e.preventDefault();
            handlePreview();
            break;
        }
      }
      
      // Delete key
      if (e.key === 'Delete' && state.selectedElement) {
        handleElementDelete(state.selectedElement.id);
      }
      
      // Escape key
      if (e.key === 'Escape') {
        setState(prev => ({ ...prev, selectedElement: null }));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, handleUndo, handleRedo, handleElementDuplicate, handlePreview, handleElementDelete, state.selectedElement]);

  if (!state.form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form builder...</p>
        </div>
      </div>
    );
  }

  const currentPageElements = state.form.pages
    .find(page => page.id === state.selectedPage)?.elements || [];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900">
              {state.form.title}
            </h1>
            <div className="text-sm text-gray-500">
              {state.form.pages.length} page{state.form.pages.length !== 1 ? 's' : ''} • {' '}
              {state.form.pages.reduce((sum, page) => sum + page.elements.length, 0)} element{state.form.pages.reduce((sum, page) => sum + page.elements.length, 0) !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* History Controls */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Undo (Ctrl+Z)"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>

            <div className="h-6 w-px bg-gray-300"></div>

            {/* Action Buttons */}
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Save (Ctrl+S)"
            >
              <Save className="w-4 h-4" />
              Save
            </button>

            <button
              onClick={handlePreview}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Preview (Ctrl+P)"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Sidebar - Component Palette */}
        <div className="w-80 bg-white border-r border-gray-200 flex-shrink-0 overflow-hidden">
          <ComponentPalette onElementAdd={handleElementAdd} />
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Page Tabs */}
          <div className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center gap-2 overflow-x-auto">
              {state.form.pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => handlePageSelect(page.id)}
                  className={`px-3 py-2 text-sm rounded-md transition-colors whitespace-nowrap flex items-center gap-2 ${
                    state.selectedPage === page.id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  {page.title}
                  <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                    {page.elements.length}
                  </span>
                </button>
              ))}
              <button
                onClick={handlePageAdd}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors whitespace-nowrap flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Page
              </button>
            </div>
          </div>

          {/* Canvas */}
          <FormCanvas
            elements={currentPageElements}
            selectedElement={state.selectedElement}
            onElementSelect={handleElementSelect}
            onElementUpdate={handleElementUpdate}
            onElementDelete={handleElementDelete}
            onElementAdd={handleElementAddDirect}
          />
        </div>

        {/* Right Sidebar - Properties/Pages/Workflow */}
        <div className="w-80 bg-white border-l border-gray-200 flex-shrink-0 overflow-hidden flex flex-col">
          {/* Panel Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActivePanel('properties')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activePanel === 'properties'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Settings className="w-4 h-4 mx-auto mb-1" />
                Properties
              </button>
              <button
                onClick={() => setActivePanel('pages')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activePanel === 'pages'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Layers className="w-4 h-4 mx-auto mb-1" />
                Pages
              </button>
              <button
                onClick={() => setActivePanel('workflow')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activePanel === 'workflow'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Zap className="w-4 h-4 mx-auto mb-1" />
                Workflow
              </button>
            </div>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-hidden">
            {activePanel === 'properties' && (
              <PropertiesPanel
                selectedElement={state.selectedElement}
                onUpdate={(updates) => {
                  if (state.selectedElement) {
                    handleElementUpdate(state.selectedElement.id, updates);
                  }
                }}
onDelete={state.selectedElement ? () => handleElementDelete(state.selectedElement?.id!) : undefined}
                onDuplicate={handleElementDuplicate}
              />
            )}
            
            {activePanel === 'pages' && (
              <PageManager
                form={state.form}
                selectedPage={state.selectedPage}
                onPageSelect={handlePageSelect}
                onPageAdd={handlePageAdd}
                onPageDelete={handlePageDelete}
                onPageUpdate={handlePageUpdate}
                onPageReorder={handlePageReorder}
              />
            )}
            
            {activePanel === 'workflow' && (
              <WorkflowPanel
                form={state.form}
                onWorkflowUpdate={handleWorkflowUpdate}
              />
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-2 flex items-center justify-between text-sm text-gray-600 flex-shrink-0">
        <div className="flex items-center gap-4">
          <span>
            Page: {state.form.pages.findIndex(p => p.id === state.selectedPage) + 1}/{state.form.pages.length}
          </span>
          <span>Elements: {currentPageElements.length}</span>
          {state.selectedElement && (
            <span>Selected: {state.selectedElement.type}</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span>History: {historyIndex + 1}/{history.length}</span>
          <span>Workflow: {state.form.workflow.length} step{state.form.workflow.length !== 1 ? 's' : ''}</span>
          <span className="text-green-600">● Ready</span>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal
          form={state.form}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          initialPage={Math.max(0, state.form.pages.findIndex(p => p.id === state.selectedPage))}
        />
      )}
    </div>
  );
};

export default FormBuilder;