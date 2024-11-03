import React from 'react';
import { Shield, Key, Lock, UserCheck } from 'lucide-react';

export default function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account security and access controls
        </p>
      </div>

      <div className="space-y-4">
        <div className="card">
          <div className="card-header">
            <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
          </div>
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-900">Enable 2FA</p>
                <p className="text-xs text-gray-500">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button className="btn-primary">
                Setup 2FA
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4 className="text-sm font-medium text-gray-900">Session Management</h4>
          </div>
          <div className="card-content space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-900">Active Sessions</p>
                <p className="text-xs text-gray-500">
                  View and manage your active sessions
                </p>
              </div>
              <button className="btn-secondary">
                View Sessions
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-900">Auto Logout</p>
                <p className="text-xs text-gray-500">
                  Automatically logout after inactivity
                </p>
              </div>
              <select className="block rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm">
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="240">4 hours</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4 className="text-sm font-medium text-gray-900">Access Logs</h4>
          </div>
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-900">Security Logs</p>
                <p className="text-xs text-gray-500">
                  View login attempts and security events
                </p>
              </div>
              <button className="btn-secondary">
                View Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}