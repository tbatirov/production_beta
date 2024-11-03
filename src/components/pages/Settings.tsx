import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon, Coins, Globe, Calculator, Bell, Shield, Database } from 'lucide-react';
import TestConnection from '../TestConnection';
import AISettingsPanel from '../settings/AISettings';
import CurrencySettings from '../settings/CurrencySettings';
import NotificationSettings from '../settings/NotificationSettings';
import SecuritySettings from '../settings/SecuritySettings';
import DataRetentionSettings from '../settings/DataRetentionSettings';

export default function Settings() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('currency');

  const tabs = [
    { id: 'currency', label: 'Currency & Exchange', icon: Coins },
    { id: 'ai', label: 'AI Analysis', icon: Calculator },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data Management', icon: Database }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <SettingsIcon className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900">
            {t('settings.title')}
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 px-3 pt-2" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-link inline-flex items-center py-4 ${
                  activeTab === tab.id
                    ? 'nav-link-active'
                    : 'nav-link-inactive'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'currency' && <CurrencySettings />}
          {activeTab === 'ai' && <AISettingsPanel />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'data' && <DataRetentionSettings />}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Database Connection</h2>
        <TestConnection />
      </div>
    </div>
  );
}