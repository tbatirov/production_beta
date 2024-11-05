import React from 'react';
import { useTranslation } from 'react-i18next';
import { Book, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentationModal({ isOpen, onClose }: DocumentationModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Book className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {t('common.documentation')}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="prose prose-blue max-w-none">
              <ReactMarkdown>{userManual}</ReactMarkdown>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="text-right">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}