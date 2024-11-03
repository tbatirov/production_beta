import React from 'react';
import { Bell, Mail, MessageSquare, AlertTriangle } from 'lucide-react';

export default function NotificationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage how and when you receive notifications
        </p>
      </div>

      <div className="space-y-4">
        <div className="card">
          <div className="card-header">
            <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
          </div>
          <div className="card-content space-y-4">
            {[
              { id: 'analysis-complete', label: 'Analysis Completion' },
              { id: 'report-ready', label: 'Report Generation' },
              { id: 'period-closing', label: 'Period Closing Reminders' },
              { id: 'data-import', label: 'Data Import Status' }
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <label htmlFor={item.id} className="text-sm text-gray-700">
                  {item.label}
                </label>
                <input
                  type="checkbox"
                  id={item.id}
                  defaultChecked
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4 className="text-sm font-medium text-gray-900">System Alerts</h4>
          </div>
          <div className="card-content space-y-4">
            {[
              { id: 'error-alerts', label: 'Error Notifications' },
              { id: 'security-alerts', label: 'Security Alerts' },
              { id: 'maintenance', label: 'Maintenance Updates' },
              { id: 'rate-updates', label: 'Exchange Rate Updates' }
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <label htmlFor={item.id} className="text-sm text-gray-700">
                  {item.label}
                </label>
                <input
                  type="checkbox"
                  id={item.id}
                  defaultChecked
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}