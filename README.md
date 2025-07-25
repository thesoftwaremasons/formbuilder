# Modern Form Builder

A comprehensive, enterprise-grade form builder application built with Next.js, TypeScript, and Tailwind CSS. This application provides a complete solution for creating, managing, and analyzing custom forms with advanced workflow automation capabilities.

## ✨ Features

### Core Form Builder
- **Drag & Drop Interface**: Intuitive form building with visual drag-and-drop
- **20+ Form Elements**: Text inputs, selectors, file uploads, ratings, signatures, and more
- **Multi-Page Forms**: Create complex multi-step forms with conditional logic
- **Real-time Preview**: See your forms as you build them
- **Responsive Design**: Forms that work perfectly on all devices

### Advanced Workflow System
- **Conditional Logic**: Show/hide fields based on user responses
- **Email Notifications**: Automated email sending with custom templates
- **Webhook Integration**: Send form data to external services
- **Database Integration**: Save submissions to external databases
- **Zapier/Integromat Support**: Connect with thousands of third-party services

### Form Elements Included
- **Input Types**: Text, Email, Password, Number, Tel, URL
- **Selection Types**: Radio buttons, Checkboxes, Dropdown menus
- **Advanced Types**: Date picker, File upload, Rating system, Signature pad
- **Interactive Types**: Range slider, Matrix questions, Likert scale, NPS
- **Layout Types**: Headings, Paragraphs, Images, Dividers, Spacers
- **Business Types**: Payment forms, Address fields, Company information

### Analytics & Reporting
- **Submission Analytics**: Track completion rates, drop-off points
- **Field Performance**: Analyze which fields cause issues
- **Device Breakdown**: See how users access your forms
- **Conversion Funnel**: Understand user journey through forms
- **Export Reports**: JSON, CSV, and PDF report generation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Optional: PostgreSQL (for production database)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd formbuilder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration values.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── form-builder/      # Form builder interface
│   ├── forms/             # Public form display
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── FormBuilder/       # Form builder components
│   └── FormElements/      # Form element components
├── lib/                   # Core utilities
│   ├── constants.ts       # Form element definitions
│   ├── types.ts          # TypeScript types
│   ├── utils.ts          # Utility functions
│   ├── validation.ts     # Form validation
│   ├── workflow-engine.ts # Workflow execution
│   ├── workflow-service.ts # Workflow management
│   ├── workflow-tester.ts # Workflow testing
│   └── analytics.ts      # Analytics engine
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/formbuilder

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_FROM_NUMBER=+1234567890

# Slack
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# File Upload
UPLOAD_MAX_SIZE=5242880
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,application/pdf
```

### Database Setup

For production use, set up a PostgreSQL database:

1. **Create database**
   ```bash
   createdb formbuilder
   ```

2. **Run migrations**
   ```bash
   psql -d formbuilder -f database/schema.sql
   ```

## 🎯 Usage

### Creating a Form

1. **Access Form Builder**
   Navigate to `/form-builder` to start creating forms

2. **Add Elements**
   - Drag elements from the palette to the canvas
   - Configure properties in the right panel
   - Add multiple pages if needed

3. **Set Up Workflows**
   - Click the "Workflow" tab
   - Add conditional logic, notifications, or integrations
   - Test your workflow before publishing

4. **Preview & Publish**
   - Use the preview mode to test your form
   - Export or publish when ready

### Form Submission

1. **Public Form Access**
   Forms are accessible at `/forms/[form-id]`

2. **Submission Handling**
   - Submissions are processed through the workflow engine
   - Notifications are sent automatically
   - Data is stored according to your configuration

### Analytics

1. **View Analytics**
   Access form analytics at `/forms/[form-id]/submissions`

2. **Export Reports**
   - Generate reports in JSON, CSV, or PDF format
   - Track performance metrics and user behavior

## 🔄 Workflow System

### Workflow Types

1. **Conditional Logic**
   ```typescript
   {
     type: 'condition',
     config: {
       condition: {
         field: 'email',
         operator: 'contains',
         value: '@company.com',
         actions: [/* actions to execute */]
       }
     }
   }
   ```

2. **Email Notifications**
   ```typescript
   {
     type: 'notification',
     config: {
       notification: {
         type: 'email',
         recipients: ['admin@company.com'],
         subject: 'New Form Submission',
         message: 'A new form has been submitted.'
       }
     }
   }
   ```

3. **Webhook Actions**
   ```typescript
   {
     type: 'action',
     config: {
       action: {
         type: 'webhook',
         endpoint: 'https://api.example.com/webhook',
         method: 'POST',
         body: JSON.stringify({
           formData: '{{formData}}',
           timestamp: '{{timestamp}}'
         })
       }
     }
   }
   ```

### Template Variables

Use these variables in your workflow configurations:

- `{{formData}}` - Complete form submission data
- `{{timestamp}}` - Submission timestamp
- `{{formTitle}}` - Form title
- `{{submissionId}}` - Unique submission ID
- `{{fieldName}}` - Value of specific field

## 🧪 Testing

### Manual Testing

1. **Form Builder Testing**
   ```bash
   npm run test:form-builder
   ```

2. **Workflow Testing**
   ```bash
   npm run test:workflow
   ```

3. **End-to-End Testing**
   ```bash
   npm run test:e2e
   ```

### Automated Testing

The application includes comprehensive test coverage:

- **Unit Tests**: Component and utility testing
- **Integration Tests**: API route testing
- **Workflow Tests**: Workflow execution testing
- **Performance Tests**: Load and stress testing

## 📊 Analytics Features

### Metrics Tracked

- **Submission Metrics**: Total submissions, completion rate
- **Performance Metrics**: Average completion time, drop-off points
- **Field Analytics**: Validation errors, abandonment rates
- **User Behavior**: Device usage, conversion funnel
- **Time Series**: Submission trends over time

### Report Generation

Generate comprehensive reports:

```typescript
import { FormAnalytics } from '@/lib/analytics';

const analytics = FormAnalytics.analyzeForm(form, submissions);
const report = FormAnalytics.generateReport(analytics);
const csvExport = FormAnalytics.exportAnalytics(analytics, 'csv');
```

## 🔐 Security

### Data Protection

- **Input Validation**: All form inputs are validated
- **CSRF Protection**: Cross-site request forgery protection
- **XSS Prevention**: Cross-site scripting protection
- **Rate Limiting**: API rate limiting implemented
- **Secure Headers**: Security headers configured

### Privacy

- **Data Minimization**: Only collect necessary data
- **Consent Management**: User consent tracking
- **Data Retention**: Configurable data retention policies
- **GDPR Compliance**: Privacy-first design

## 🚀 Deployment

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set up environment variables**
   Configure production environment variables

3. **Deploy to your platform**
   - **Vercel**: `vercel deploy`
   - **Netlify**: `netlify deploy`
   - **Docker**: Use included Dockerfile

### Environment Setup

- **Database**: Set up PostgreSQL or MySQL
- **Email Service**: Configure SMTP or SendGrid
- **File Storage**: Set up AWS S3 or Google Cloud Storage
- **Monitoring**: Set up error tracking and monitoring

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```
3. **Make your changes**
4. **Add tests**
5. **Submit a pull request**

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow the existing code style

## 📚 Documentation

### API Documentation

- **Forms API**: `/api/forms` - CRUD operations for forms
- **Submissions API**: `/api/forms/[id]/submit` - Handle form submissions
- **Workflow API**: `/api/workflow` - Workflow management
- **Analytics API**: `/api/analytics` - Analytics data

### Component Documentation

Each component includes TypeScript interfaces and JSDoc comments:

```typescript
/**
 * Form Builder Component
 * 
 * @param onFormSave - Callback when form is saved
 * @param initialForm - Initial form data
 */
interface FormBuilderProps {
  onFormSave: (form: Form) => void;
  initialForm?: Form;
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Email not sending**
   - Check SMTP configuration
   - Verify credentials
   - Check firewall settings

2. **Database connection issues**
   - Verify DATABASE_URL
   - Check database permissions
   - Ensure database is running

3. **File upload problems**
   - Check file size limits
   - Verify allowed file types
   - Check storage permissions

### Support

- **Documentation**: Check the `/docs` folder
- **Examples**: See `/examples` for usage examples
- **Issues**: Report bugs on GitHub Issues

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the excellent React framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Lucide Icons**: For the beautiful icon library
- **TypeScript**: For type safety and developer experience

## 📈 Roadmap

### Upcoming Features

- [ ] **Form Templates**: Pre-built form templates
- [ ] **Team Collaboration**: Multi-user form editing
- [ ] **Advanced Analytics**: Custom dashboard widgets
- [ ] **API Integrations**: More third-party integrations
- [ ] **Mobile App**: React Native mobile app
- [ ] **White-label**: Customizable branding options

### Performance Improvements

- [ ] **Caching**: Redis caching implementation
- [ ] **CDN**: Asset delivery optimization
- [ ] **Database**: Query optimization
- [ ] **Bundle Size**: Code splitting improvements

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

For more information, visit our [documentation](./docs) or [examples](./examples).
