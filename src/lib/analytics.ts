import { Form, FormSubmission } from './types';

export interface AnalyticsData {
  totalSubmissions: number;
  completionRate: number;
  averageCompletionTime: number;
  dropOffPoints: DropOffPoint[];
  fieldAnalytics: FieldAnalytics[];
  timeSeriesData: TimeSeriesPoint[];
  deviceBreakdown: DeviceBreakdown;
  conversionFunnel: ConversionFunnelStep[];
}

export interface DropOffPoint {
  pageIndex: number;
  pageTitle: string;
  dropOffRate: number;
  dropOffCount: number;
}

export interface FieldAnalytics {
  fieldId: string;
  fieldLabel: string;
  fieldType: string;
  validationErrors: number;
  averageTimeToComplete: number;
  abandonmentRate: number;
  mostCommonValues: ValueCount[];
}

export interface ValueCount {
  value: string;
  count: number;
  percentage: number;
}

export interface TimeSeriesPoint {
  date: string;
  submissions: number;
  completions: number;
  views: number;
}

export interface DeviceBreakdown {
  desktop: number;
  mobile: number;
  tablet: number;
}

export interface ConversionFunnelStep {
  stepName: string;
  visitors: number;
  conversionRate: number;
  dropOff: number;
}

export class FormAnalytics {
  static analyzeForm(form: Form, submissions: FormSubmission[]): AnalyticsData {
    const completedSubmissions = submissions.filter(s => s.status === 'completed');
    const totalSubmissions = submissions.length;
    const completionRate = totalSubmissions > 0 ? (completedSubmissions.length / totalSubmissions) * 100 : 0;

    return {
      totalSubmissions,
      completionRate,
      averageCompletionTime: this.calculateAverageCompletionTime(completedSubmissions),
      dropOffPoints: this.analyzeDropOffPoints(form, submissions),
      fieldAnalytics: this.analyzeFields(form, submissions),
      timeSeriesData: this.generateTimeSeriesData(submissions),
      deviceBreakdown: this.analyzeDeviceBreakdown(submissions),
      conversionFunnel: this.analyzeConversionFunnel(form, submissions)
    };
  }

  private static calculateAverageCompletionTime(submissions: FormSubmission[]): number {
    if (submissions.length === 0) return 0;

    const times = submissions.map(s => {
      // This would be calculated based on start and end times
      // For now, return a mock value
      return Math.random() * 300; // 0-300 seconds
    });

    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }

  private static analyzeDropOffPoints(form: Form, submissions: FormSubmission[]): DropOffPoint[] {
    const dropOffPoints: DropOffPoint[] = [];

    form.pages.forEach((page, index) => {
      // Mock drop-off analysis
      const dropOffRate = Math.random() * 30; // 0-30% drop-off
      const dropOffCount = Math.floor(submissions.length * (dropOffRate / 100));

      dropOffPoints.push({
        pageIndex: index,
        pageTitle: page.title,
        dropOffRate,
        dropOffCount
      });
    });

    return dropOffPoints;
  }

  private static analyzeFields(form: Form, submissions: FormSubmission[]): FieldAnalytics[] {
    const fieldAnalytics: FieldAnalytics[] = [];

    form.pages.forEach(page => {
      page.elements.forEach(element => {
        const fieldValues = submissions.map(s => s.data[element.id]).filter(v => v !== undefined);
        const mostCommonValues = this.calculateMostCommonValues(fieldValues);

        fieldAnalytics.push({
          fieldId: element.id,
          fieldLabel: element.label,
          fieldType: element.type,
          validationErrors: Math.floor(Math.random() * 10), // Mock data
          averageTimeToComplete: Math.random() * 30, // Mock data
          abandonmentRate: Math.random() * 20, // Mock data
          mostCommonValues
        });
      });
    });

    return fieldAnalytics;
  }

  private static calculateMostCommonValues(values: any[]): ValueCount[] {
    const valueCounts: Record<string, number> = {};
    
    values.forEach(value => {
      const stringValue = String(value);
      valueCounts[stringValue] = (valueCounts[stringValue] || 0) + 1;
    });

    const total = values.length;
    return Object.entries(valueCounts)
      .map(([value, count]) => ({
        value,
        count,
        percentage: (count / total) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 most common values
  }

  private static generateTimeSeriesData(submissions: FormSubmission[]): TimeSeriesPoint[] {
    const timeSeriesData: TimeSeriesPoint[] = [];
    const last30Days = this.getLast30Days();

    last30Days.forEach(date => {
      const daySubmissions = submissions.filter(s => 
        s.submittedAt.toDateString() === date.toDateString()
      );

      timeSeriesData.push({
        date: date.toISOString().split('T')[0],
        submissions: daySubmissions.length,
        completions: daySubmissions.filter(s => s.status === 'completed').length,
        views: daySubmissions.length + Math.floor(Math.random() * 50) // Mock views
      });
    });

    return timeSeriesData;
  }

  private static getLast30Days(): Date[] {
    const days: Date[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    
    return days;
  }

  private static analyzeDeviceBreakdown(submissions: FormSubmission[]): DeviceBreakdown {
    // Mock device breakdown - in real implementation, this would come from user agent analysis
    const total = submissions.length;
    return {
      desktop: Math.floor(total * 0.6),
      mobile: Math.floor(total * 0.35),
      tablet: Math.floor(total * 0.05)
    };
  }

  private static analyzeConversionFunnel(form: Form, submissions: FormSubmission[]): ConversionFunnelStep[] {
    const funnel: ConversionFunnelStep[] = [];
    let currentVisitors = submissions.length + Math.floor(Math.random() * 100); // Mock initial visitors

    // Form view
    funnel.push({
      stepName: 'Form View',
      visitors: currentVisitors,
      conversionRate: 100,
      dropOff: 0
    });

    // Each page
    form.pages.forEach((page, index) => {
      const dropOffRate = Math.random() * 0.3; // 0-30% drop-off
      const dropOff = Math.floor(currentVisitors * dropOffRate);
      currentVisitors -= dropOff;

      funnel.push({
        stepName: `Page ${index + 1}: ${page.title}`,
        visitors: currentVisitors,
        conversionRate: (currentVisitors / funnel[0].visitors) * 100,
        dropOff
      });
    });

    // Submission completion
    const completedSubmissions = submissions.filter(s => s.status === 'completed').length;
    funnel.push({
      stepName: 'Form Submission',
      visitors: completedSubmissions,
      conversionRate: (completedSubmissions / funnel[0].visitors) * 100,
      dropOff: currentVisitors - completedSubmissions
    });

    return funnel;
  }

  static generateReport(analytics: AnalyticsData): string {
    const report = `
# Form Analytics Report

## Overview
- **Total Submissions**: ${analytics.totalSubmissions}
- **Completion Rate**: ${analytics.completionRate.toFixed(1)}%
- **Average Completion Time**: ${analytics.averageCompletionTime.toFixed(1)} seconds

## Drop-off Analysis
${analytics.dropOffPoints.map(point => 
  `- **${point.pageTitle}**: ${point.dropOffRate.toFixed(1)}% drop-off (${point.dropOffCount} users)`
).join('\n')}

## Field Performance
${analytics.fieldAnalytics.slice(0, 5).map(field => 
  `- **${field.fieldLabel}** (${field.fieldType}): ${field.validationErrors} errors, ${field.abandonmentRate.toFixed(1)}% abandonment`
).join('\n')}

## Device Breakdown
- **Desktop**: ${analytics.deviceBreakdown.desktop} (${((analytics.deviceBreakdown.desktop / analytics.totalSubmissions) * 100).toFixed(1)}%)
- **Mobile**: ${analytics.deviceBreakdown.mobile} (${((analytics.deviceBreakdown.mobile / analytics.totalSubmissions) * 100).toFixed(1)}%)
- **Tablet**: ${analytics.deviceBreakdown.tablet} (${((analytics.deviceBreakdown.tablet / analytics.totalSubmissions) * 100).toFixed(1)}%)

## Conversion Funnel
${analytics.conversionFunnel.map(step => 
  `- **${step.stepName}**: ${step.visitors} visitors (${step.conversionRate.toFixed(1)}% conversion)`
).join('\n')}

## Recommendations
${this.generateRecommendations(analytics)}
`;

    return report.trim();
  }

  private static generateRecommendations(analytics: AnalyticsData): string {
    const recommendations: string[] = [];

    // Low completion rate
    if (analytics.completionRate < 50) {
      recommendations.push('- Consider simplifying the form to improve completion rate');
    }

    // High drop-off on specific pages
    const highDropOffPages = analytics.dropOffPoints.filter(point => point.dropOffRate > 20);
    if (highDropOffPages.length > 0) {
      recommendations.push(`- Review pages with high drop-off rates: ${highDropOffPages.map(p => p.pageTitle).join(', ')}`);
    }

    // High validation errors
    const problematicFields = analytics.fieldAnalytics.filter(field => field.validationErrors > 5);
    if (problematicFields.length > 0) {
      recommendations.push(`- Improve validation messages for: ${problematicFields.map(f => f.fieldLabel).join(', ')}`);
    }

    // Long completion time
    if (analytics.averageCompletionTime > 300) {
      recommendations.push('- Consider breaking the form into smaller steps to reduce completion time');
    }

    // Mobile optimization
    if (analytics.deviceBreakdown.mobile > analytics.deviceBreakdown.desktop) {
      recommendations.push('- Ensure mobile optimization as majority of users are on mobile devices');
    }

    return recommendations.length > 0 ? recommendations.join('\n') : '- Form is performing well, no immediate changes needed';
  }

  static exportAnalytics(analytics: AnalyticsData, format: 'json' | 'csv' | 'pdf' = 'json'): string {
    switch (format) {
      case 'json':
        return JSON.stringify(analytics, null, 2);
      case 'csv':
        return this.convertToCSV(analytics);
      case 'pdf':
        return this.generateReport(analytics);
      default:
        return JSON.stringify(analytics, null, 2);
    }
  }

  private static convertToCSV(analytics: AnalyticsData): string {
    const csvRows: string[] = [];
    
    // Header
    csvRows.push('Metric,Value');
    
    // Overview metrics
    csvRows.push(`Total Submissions,${analytics.totalSubmissions}`);
    csvRows.push(`Completion Rate,${analytics.completionRate.toFixed(1)}%`);
    csvRows.push(`Average Completion Time,${analytics.averageCompletionTime.toFixed(1)} seconds`);
    
    // Field analytics
    csvRows.push(''); // Empty row
    csvRows.push('Field,Type,Validation Errors,Abandonment Rate');
    analytics.fieldAnalytics.forEach(field => {
      csvRows.push(`${field.fieldLabel},${field.fieldType},${field.validationErrors},${field.abandonmentRate.toFixed(1)}%`);
    });

    return csvRows.join('\n');
  }
}

export default FormAnalytics;
