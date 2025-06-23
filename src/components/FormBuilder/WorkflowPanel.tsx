// components/WorkflowPanel.tsx
import React, { useState } from 'react';
import { 
  Plus,
  Trash2,
  Edit3,
  Move,
  ArrowRight,
  Zap,
  Mail,
  Database,
  GitBranch,
  Webhook,
  Settings,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { WorkflowPanelProps, WorkflowStep, WorkflowConfig } from '@/lib/types';


export const WorkflowPanel: React.FC<WorkflowPanelProps> = ({
  form,
  onWorkflowUpdate
}) => {
  const [showAddWorkflow, setShowAddWorkflow] = useState(false);
  const [editingStep, setEditingStep] = useState<string | null>(null);

  const workflowTypes = [
    {
      type: 'condition' as const,
      title: 'Conditional Logic',
      description: 'Show/hide fields based on user input',
      icon: GitBranch,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      type: 'notification' as const,
      title: 'Email Notification',
      description: 'Send email when form is submitted',
      icon: Mail,
      color: 'bg-green-100 text-green-600',
    },
    {
      type: 'action' as const,
      title: 'Webhook Action',
      description: 'Send data to external service',
      icon: Webhook,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      type: 'integration' as const,
      title: 'Database Integration',
      description: 'Save data to database',
      icon: Database,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  const addWorkflowStep = (type: WorkflowStep['type']) => {
    const stepType = workflowTypes.find(t => t.type === type);
    
    const newStep: WorkflowStep = {
      id: `step_${Date.now()}`,
      type,
      title: stepType?.title || 'New Step',
      description: stepType?.description || '',
      config: getDefaultConfig(type),
      order: form.workflow.length,
      enabled: true,
    };

    const updatedWorkflow = [...form.workflow, newStep];
    onWorkflowUpdate(updatedWorkflow);
    setShowAddWorkflow(false);
  };

  const removeWorkflowStep = (stepId: string) => {
    const updatedWorkflow = form.workflow.filter(step => step.id !== stepId);
    onWorkflowUpdate(updatedWorkflow);
  };

  const updateWorkflowStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    const updatedWorkflow = form.workflow.map(step =>
      step.id === stepId ? { ...step, ...updates } : step
    );
    onWorkflowUpdate(updatedWorkflow);
  };

  const toggleStepEnabled = (stepId: string) => {
    const step = form.workflow.find(s => s.id === stepId);
    if (step) {
      updateWorkflowStep(stepId, { enabled: !step.enabled });
    }
  };

  const getDefaultConfig = (type: WorkflowStep['type']): WorkflowConfig => {
    switch (type) {
      case 'condition':
        return {
          condition: {
            field: '',
            operator: 'equals',
            value: '',
            actions: []
          }
        };
      case 'notification':
        return {
          notification: {
            type: 'email',
            recipients: [],
            template: 'default',
            subject: 'New Form Submission',
            message: 'A new form has been submitted.'
          }
        };
      case 'action':
        return {
          action: {
            type: 'webhook',
            endpoint: '',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: ''
          }
        };
      case 'integration':
        return {
          integration: {
            service: 'custom',
            endpoint: '',
            mapping: {}
          }
        };
      default:
        return {};
    }
  };

  const StepEditor: React.FC<{ step: WorkflowStep }> = ({ step }) => {
    const [localConfig, setLocalConfig] = useState(step.config);

    const saveConfig = () => {
      updateWorkflowStep(step.id, { config: localConfig });
      setEditingStep(null);
    };

    const updateConfig = (updates: Partial<WorkflowConfig>) => {
      setLocalConfig(prev => ({ ...prev, ...updates }));
    };

    if (step.type === 'condition' && step.config.condition) {
      return (
        <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-4">
          <h4 className="font-medium text-gray-900">Conditional Logic Settings</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field to Check
              </label>
              <select
                value={localConfig.condition?.field || ''}
                onChange={(e) => updateConfig({
                  condition: { ...localConfig.condition!, field: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Select field...</option>
                {form.pages.flatMap(page => 
                  page.elements
                    .filter(el => el.type !== 'submit')
                    .map(el => (
                      <option key={el.id} value={el.id}>
                        {el.label}
                      </option>
                    ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <select
                value={localConfig.condition?.operator || 'equals'}
                onChange={(e) => updateConfig({
                  condition: { ...localConfig.condition!, operator: e.target.value as any }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="equals">Equals</option>
                <option value="notEquals">Not Equals</option>
                <option value="contains">Contains</option>
                <option value="greaterThan">Greater Than</option>
                <option value="lessThan">Less Than</option>
                <option value="isEmpty">Is Empty</option>
                <option value="isNotEmpty">Is Not Empty</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value to Compare
            </label>
            <input
              type="text"
              value={localConfig.condition?.value || ''}
              onChange={(e) => updateConfig({
                condition: { ...localConfig.condition!, value: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Enter value..."
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={saveConfig}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => setEditingStep(null)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    if (step.type === 'notification' && step.config.notification) {
      return (
        <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-4">
          <h4 className="font-medium text-gray-900">Email Notification Settings</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipients (comma-separated)
            </label>
            <input
              type="text"
              value={localConfig.notification?.recipients.join(', ') || ''}
              onChange={(e) => updateConfig({
                notification: { 
                  ...localConfig.notification!, 
                  recipients: e.target.value.split(',').map(email => email.trim()).filter(Boolean)
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="admin@example.com, user@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={localConfig.notification?.subject || ''}
              onChange={(e) => updateConfig({
                notification: { ...localConfig.notification!, subject: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Email subject..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={localConfig.notification?.message || ''}
              onChange={(e) => updateConfig({
                notification: { ...localConfig.notification!, message: e.target.value }
              })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Email message content..."
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={saveConfig}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => setEditingStep(null)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    if (step.type === 'action' && step.config.action) {
      return (
        <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-4">
          <h4 className="font-medium text-gray-900">Webhook Action Settings</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HTTP Method
              </label>
              <select
                value={localConfig.action?.method || 'POST'}
                onChange={(e) => updateConfig({
                  action: { ...localConfig.action!, method: e.target.value as any }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endpoint URL
              </label>
              <input
                type="url"
                value={localConfig.action?.endpoint || ''}
                onChange={(e) => updateConfig({
                  action: { ...localConfig.action!, endpoint: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="https://api.example.com/webhook"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Request Body (JSON)
            </label>
            <textarea
              value={localConfig.action?.body || ''}
              onChange={(e) => updateConfig({
                action: { ...localConfig.action!, body: e.target.value }
              })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
              placeholder='{"data": "{{formData}}", "timestamp": "{{timestamp}}"}'
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={saveConfig}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => setEditingStep(null)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-600">Configuration panel for {step.type} steps coming soon...</p>
        <button
          onClick={() => setEditingStep(null)}
          className="mt-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
        >
          Close
        </button>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Workflow Steps
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Automate actions when forms are submitted
          </p>
        </div>
        <button
          onClick={() => setShowAddWorkflow(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Step
        </button>
      </div>

      {/* Workflow Steps */}
      {form.workflow.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h4 className="font-medium text-gray-500 mb-2">No Workflow Steps</h4>
          <p className="text-sm text-gray-400 mb-4">
            Add workflow steps to automate form processing
          </p>
          <button
            onClick={() => setShowAddWorkflow(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add First Step
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {form.workflow.map((step, index) => {
            const stepType = workflowTypes.find(t => t.type === step.type);
            const IconComponent = stepType?.icon || Settings;

            return (
              <div key={step.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stepType?.color || 'bg-gray-100 text-gray-600'}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{step.title}</h4>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Step {index + 1}
                        </span>
                        {!step.enabled && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                            Disabled
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleStepEnabled(step.id)}
                        className={`p-1.5 rounded transition-colors ${
                          step.enabled
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                        title={step.enabled ? 'Disable step' : 'Enable step'}
                      >
                        {step.enabled ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                      </button>
                      
                      <button
                        onClick={() => setEditingStep(editingStep === step.id ? null : step.id)}
                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                        title="Edit step"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => removeWorkflowStep(step.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Delete step"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step Editor */}
                {editingStep === step.id && <StepEditor step={step} />}

                {/* Step Connection Arrow */}
                {index < form.workflow.length - 1 && (
                  <div className="flex justify-center py-2">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Step Modal */}
      {showAddWorkflow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Add Workflow Step
              </h3>
              <div className="space-y-3">
                {workflowTypes.map((stepType) => {
                  const IconComponent = stepType.icon;
                  
                  return (
                    <button
                      key={stepType.type}
                      onClick={() => addWorkflowStep(stepType.type)}
                      className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stepType.color}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{stepType.title}</h4>
                        <p className="text-sm text-gray-600">{stepType.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddWorkflow(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Tips */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Workflow Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Steps execute in order from top to bottom</li>
          <li>• Use conditional logic to show/hide fields dynamically</li>
          <li>• Email notifications can include form data</li>
          <li>• Webhooks can integrate with external services</li>
        </ul>
      </div>
    </div>
  );
};