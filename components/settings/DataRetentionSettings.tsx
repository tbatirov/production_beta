import React from 'react';
import { Database, Archive, Trash2, Download } from 'lucide-react';

export default function DataRetentionSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Data Management</h3>
        <p className="mt-1 text-sm text-gray-500">
          Configure data retention and backup settings
        </p>
      </div>

      <div className="space-y-4">
        <div className="card">
          <div className="card-header">
            <h4 className="text-sm font-medium text-gray-900">Data Retention</h4>
          </div>
          <div className="card-content space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-900">Historical Data</p>
                <p className="text-xs text-gray-500">
                  How long to keep historical financial data
                </p>
              </div>
              <select className="block rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm">
                <option value="1">1 year</option>
                <option value="2">2 years</option>
                <option value="5">5 years</option>
                <option value="10">10 years</option>
                <option value="0">Indefinitely</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-900">Analysis Reports</p>
                <p className="text-xs text-gray-500">
                  Retention period for generated reports
                </p>
              </div>
              <select className="block rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm">
                <option value="6">6 months</option>
                <option value="12">1 year</option>
                <option value="24">2 years</option>
                <option value="0">Indefinitely</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4 className="text-sm font-medium text-gray-900">Automated Backups</h4>
          </div>
          <div className="card-content space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="enableBackups"
                defaultChecked
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="enableBackups" className="text-sm text-gray-700">
                Enable automated backups
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-900">Backup Frequency</p>
                <p className="text-xs text-gray-500">
                  How often to create backups
                </p>
              </div>
              <select className="block rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-900">Retention Period</p>
                <p className="text-xs text-gray-500">
                  How long to keep backups
                </p>
              </div>
              <select className="block rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm">
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="180">180 days</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4 className="text-sm font-medium text-gray-900">Data Export</h4>
          </div>
          <div className="card-content">
            <button className="btn-secondary inline-flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}