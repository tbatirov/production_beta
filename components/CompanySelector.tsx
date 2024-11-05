import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Search } from 'lucide-react';
import { CompanyProfile } from '../utils/types';

interface CompanySelectorProps {
  companies: CompanyProfile[];
  selectedCompanyId: string;
  onSelect: (companyId: string) => void;
}

export default function CompanySelector({
  companies,
  selectedCompanyId,
  onSelect
}: CompanySelectorProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (company.industry?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        <div className="flex items-center">
          <Building2 className="h-4 w-4 text-gray-400 mr-2" />
          <span className="block truncate">
            {selectedCompany ? selectedCompany.name : t('company.selectCompany')}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          <div className="sticky top-0 z-10 bg-white px-2 py-1.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('company.searchCompanies')}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <ul className="mt-1">
            {filteredCompanies.map((company) => (
              <li
                key={company.id}
                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${
                  company.id === selectedCompanyId
                    ? 'text-white bg-blue-600'
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => {
                  onSelect(company.id);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center">
                  <Building2 className={`h-4 w-4 mr-2 ${
                    company.id === selectedCompanyId ? 'text-white' : 'text-gray-400'
                  }`} />
                  <span className={`block truncate ${
                    company.id === selectedCompanyId ? 'font-semibold' : 'font-normal'
                  }`}>
                    {company.name}
                  </span>
                  {company.industry && (
                    <span className={`ml-2 truncate text-sm ${
                      company.id === selectedCompanyId ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      {company.industry}
                    </span>
                  )}
                </div>
              </li>
            ))}
            {filteredCompanies.length === 0 && (
              <li className="text-center py-2 text-sm text-gray-500">
                {t('company.noCompaniesFound')}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}