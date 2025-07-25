-- Forms table
CREATE TABLE forms (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  pages JSONB NOT NULL,
  settings JSONB NOT NULL,
  theme JSONB NOT NULL,
  workflow JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_template BOOLEAN DEFAULT FALSE,
  template_category VARCHAR(255)
);

-- Form submissions table
CREATE TABLE form_submissions (
  id VARCHAR(255) PRIMARY KEY,
  form_id VARCHAR(255) NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT,
  status VARCHAR(50) DEFAULT 'pending'
);

-- Workflow execution logs table
CREATE TABLE workflow_logs (
  id SERIAL PRIMARY KEY,
  submission_id VARCHAR(255) NOT NULL REFERENCES form_submissions(id) ON DELETE CASCADE,
  step_id VARCHAR(255) NOT NULL,
  step_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  error_message TEXT,
  execution_time INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_forms_created_at ON forms(created_at);
CREATE INDEX idx_forms_template ON forms(is_template, template_category);
CREATE INDEX idx_submissions_form_id ON form_submissions(form_id);
CREATE INDEX idx_submissions_submitted_at ON form_submissions(submitted_at);
CREATE INDEX idx_workflow_logs_submission_id ON workflow_logs(submission_id);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_forms_updated_at 
    BEFORE UPDATE ON forms 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
