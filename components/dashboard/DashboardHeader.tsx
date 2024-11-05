import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building2 } from 'lucide-react';
import { useCompany } from '../../contexts/CompanyContext';

export default function DashboardHeader() {
  const { t } = useTranslation();
  const { companies, selectedCompany, selectCompany } = useCompany();

  const handleCompanyChange = (companyId: string) => {
    const company = companies.find(c => c.id == companyId);
    if (company) {
      selectCompany(company);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-3">
          <Building2 className="h-6 w-6 text-blue-500" />
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              {t('dashboard.selectCompany')}
            </h2>
            {selectedCompany && (
              <p className="text-sm text-gray-500">{selectedCompany.industry}</p>
            )}
          </div>
        </div>
        <div className="w-full md:w-96">
          <select
            value={selectedCompany?.id || ''}
            onChange={(e) => handleCompanyChange(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">{t('company.selectCompany')}</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
                {company.industry ? ` (${company.industry})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedCompany && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                {t('company.industry')}
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedCompany.industry || '-'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                {t('company.email')}
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedCompany.email || '-'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                {t('company.phone')}
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedCompany.phone || '-'}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}