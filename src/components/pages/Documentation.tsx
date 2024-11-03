import React from 'react';
import { useTranslation } from 'react-i18next';
import { Book, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const userManual = `# Financial Analysis System - User Manual

## Table of Contents
1. [System Overview](#system-overview)
2. [Getting Started](#getting-started)
3. [Core Features](#core-features)
4. [Financial Analysis](#financial-analysis)
5. [Data Management](#data-management)
6. [Settings & Configuration](#settings)
7. [Troubleshooting](#troubleshooting)

## System Overview

The Financial Analysis System is a comprehensive platform for analyzing financial statements, tracking performance metrics, and generating insights using advanced AI analysis.

### Key Features
- Real-time financial statement analysis
- AI-powered insights and recommendations
- Multi-currency support (USD, UZS)
- Historical data tracking and comparison
- Export capabilities (Excel, PDF, Word)
- Multi-language support (English, Russian, Uzbek)

### Technical Specifications
- Built with React 18.3+
- Real-time data processing
- Secure authentication via Supabase
- Responsive design for all devices
- PWA-ready for offline capabilities

## Getting Started

### Initial Setup
1. **Account Creation**
   - Visit the login page
   - Click "Create Account"
   - Fill in required information
   - Verify email address

2. **Company Setup**
   - Add your first company
   - Configure company details
   - Set preferred currency
   - Choose fiscal year settings

### Navigation
- Dashboard: Overview of financial health
- Analysis: Detailed financial analysis
- Reports: Generate comprehensive reports
- Settings: System configuration

## Core Features

### Financial Statement Import
- Supported formats: Excel, CSV
- Trial balance import
- Transaction data import
- Automatic account mapping

### Data Analysis
- Balance Sheet analysis
- Income Statement analysis
- Cash Flow analysis
- Ratio calculations
- Trend analysis

### Report Generation
- Comprehensive financial reports
- Period comparisons
- Custom date ranges
- Multiple export formats

## Financial Analysis

### Available Analysis Types
1. **Statement Analysis**
   - Balance Sheet structure
   - Income Statement performance
   - Cash Flow patterns
   - Working capital analysis

2. **Ratio Analysis**
   - Profitability ratios
   - Liquidity ratios
   - Efficiency ratios
   - Leverage ratios

3. **Trend Analysis**
   - Historical comparisons
   - Growth analysis
   - Performance trends
   - Forecasting

### AI-Powered Insights
- Automatic ratio calculation
- Industry benchmarking
- Strategic recommendations
- Risk assessment

## Data Management

### Data Security
- End-to-end encryption
- Role-based access control
- Audit logging
- Regular backups

### Data Import/Export
- Batch import capabilities
- Multiple export formats
- Data validation
- Error handling

### Data Retention
- Configurable retention periods
- Automated archiving
- Data cleanup tools
- Backup management

## Settings & Configuration

### System Settings
1. **General Settings**
   - Language preferences
   - Date format
   - Number format
   - Time zone

2. **Company Settings**
   - Fiscal year
   - Currency preferences
   - Industry settings
   - Contact information

3. **User Preferences**
   - Notification settings
   - Display preferences
   - Export defaults
   - Dashboard layout

### Security Settings
- Two-factor authentication
- Session management
- Password policies
- Access logs

## Troubleshooting

### Common Issues

1. **Data Import Issues**
   - Verify file format
   - Check column mappings
   - Ensure data consistency
   - Validate account codes

2. **Analysis Errors**
   - Confirm data completeness
   - Check calculation settings
   - Verify period selection
   - Review account mappings

3. **Export Problems**
   - Check file permissions
   - Verify export format
   - Ensure data availability
   - Review template settings

### Support Resources
- Documentation: [docs.financialanalysis.com](https://docs.financialanalysis.com)
- Email Support: support@financialanalysis.com
- Knowledge Base: [help.financialanalysis.com](https://help.financialanalysis.com)
- Community Forum: [community.financialanalysis.com](https://community.financialanalysis.com)

### Best Practices
1. **Data Management**
   - Regular backups
   - Periodic data validation
   - Consistent naming conventions
   - Proper categorization

2. **Analysis Workflow**
   - Data verification
   - Regular reconciliation
   - Systematic review process
   - Documentation maintenance

3. **Security**
   - Regular password updates
   - Access review
   - Session management
   - Audit log review

---

© ${new Date().getFullYear()} Financial Analysis System. All rights reserved.`;

export default function Documentation() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-3">
            <Book className="h-6 w-6 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">
              {t('common.documentation')}
            </h1>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <ChevronRight className="h-4 w-4 mr-1" />
            <span>User Manual</span>
          </div>
        </div>

        {/* Documentation Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-blue max-w-none">
            <ReactMarkdown>{userManual}</ReactMarkdown>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}