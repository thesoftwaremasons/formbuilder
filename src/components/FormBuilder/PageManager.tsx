// components/PageManager.tsx
import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Copy, 
  Move, 
  Eye,
  EyeOff,
  Settings,
  ChevronUp,
  ChevronDown,
  FileText
} from 'lucide-react';
import { FormPage, PageManagerProps } from '@/lib/types';

export const PageManager: React.FC<PageManagerProps> = ({
  form,
  selectedPage,
  onPageSelect,
  onPageAdd,
  onPageDelete,
  onPageUpdate,
  onPageReorder
}) => {
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [showPageSettings, setShowPageSettings] = useState<string | null>(null);

  const handleEditStart = (page: FormPage) => {
    setEditingPageId(page.id);
    setEditingTitle(page.title);
  };

  const handleEditSave = () => {
    if (editingPageId && editingTitle.trim()) {
      onPageUpdate(editingPageId, { title: editingTitle.trim() });
    }
    setEditingPageId(null);
    setEditingTitle('');
  };

  const handleEditCancel = () => {
    setEditingPageId(null);
    setEditingTitle('');
  };

  const handleDuplicatePage = (page: FormPage) => {
    const newPage: FormPage = {
      ...page,
      id: `page_${Date.now()}`,
      title: `${page.title} (Copy)`,
      order: form.pages.length,
      elements: page.elements.map(element => ({
        ...element,
        id: `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        pageId: `page_${Date.now()}`
      }))
    };
    
    // This would need to be handled by the parent component
    console.log('Duplicate page:', newPage);
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      onPageReorder(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < form.pages.length - 1) {
      onPageReorder(index, index + 1);
    }
  };

  const PageSettingsPanel: React.FC<{ page: FormPage }> = ({ page }) => (
    <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Page Description
        </label>
        <textarea
          value={page.description || ''}
          onChange={(e) => onPageUpdate(page.id, { description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          rows={2}
          placeholder="Optional page description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Show Progress Bar
          </label>
          <input
            type="checkbox"
            checked={page.settings?.showProgressBar !== false}
            onChange={(e) => onPageUpdate(page.id, {
              settings: { ...page.settings, showProgressBar: e.target.checked }
            })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Allow Back
          </label>
          <input
            type="checkbox"
            checked={page.settings?.allowBack !== false}
            onChange={(e) => onPageUpdate(page.id, {
              settings: { ...page.settings, allowBack: e.target.checked }
            })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Background Color
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={page.settings?.backgroundColor || '#ffffff'}
            onChange={(e) => onPageUpdate(page.id, {
              settings: { ...page.settings, backgroundColor: e.target.value }
            })}
            className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
          />
          <input
            type="text"
            value={page.settings?.backgroundColor || '#ffffff'}
            onChange={(e) => onPageUpdate(page.id, {
              settings: { ...page.settings, backgroundColor: e.target.value }
            })}
            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="#ffffff"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Pages ({form.pages.length})
          </h3>
          <button
            onClick={onPageAdd}
            className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            title="Add new page"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Manage form pages and navigation flow
        </p>
      </div>

      {/* Pages List */}
      <div className="max-h-96 overflow-y-auto">
        {form.pages.map((page, index) => (
          <div key={page.id} className="border-b border-gray-100 last:border-b-0">
            {/* Page Item */}
            <div
              className={`p-3 cursor-pointer transition-colors ${
                selectedPage === page.id
                  ? 'bg-blue-50 border-l-4 border-l-blue-500'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onPageSelect(page.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  {editingPageId === page.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleEditSave();
                          if (e.key === 'Escape') handleEditCancel();
                        }}
                        onBlur={handleEditSave}
                        className="flex-1 px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {index + 1}
                        </span>
                        <h4 className="font-medium text-gray-900 text-sm truncate">
                          {page.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {page.elements.length} element{page.elements.length !== 1 ? 's' : ''}
                        </span>
                        {page.description && (
                          <span className="text-xs text-blue-600">• Has description</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Page Actions */}
                <div className="flex items-center gap-1 ml-2">
                  {/* Move buttons */}
                  <div className="flex flex-col">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveUp(index);
                      }}
                      disabled={index === 0}
                      className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveDown(index);
                      }}
                      disabled={index === form.pages.length - 1}
                      className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Action buttons */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditStart(page);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title="Edit page title"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPageSettings(showPageSettings === page.id ? null : page.id);
                    }}
                    className={`p-1 rounded transition-colors ${
                      showPageSettings === page.id
                        ? 'text-blue-600 bg-blue-100'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                    title="Page settings"
                  >
                    <Settings className="w-3 h-3" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicatePage(page);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title="Duplicate page"
                  >
                    <Copy className="w-3 h-3" />
                  </button>

                  {form.pages.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Are you sure you want to delete "${page.title}"?`)) {
                          onPageDelete(page.id);
                        }
                      }}
                      className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete page"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Page Settings Panel */}
            {showPageSettings === page.id && (
              <PageSettingsPanel page={page} />
            )}
          </div>
        ))}

        {form.pages.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No pages yet</p>
            <button
              onClick={onPageAdd}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700"
            >
              Create your first page
            </button>
          </div>
        )}
      </div>

      {/* Page Navigation Tips */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <h4 className="text-xs font-medium text-gray-700 mb-2">Tips:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Click a page to select and edit it</li>
          <li>• Use ↑↓ buttons to reorder pages</li>
          <li>• Settings icon for page-specific options</li>
          <li>• Duplicate pages to save time</li>
        </ul>
      </div>
    </div>
  );
};