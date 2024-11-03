import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Plus, Loader2, Pencil, Trash2 } from 'lucide-react';
import { useCompany } from '../contexts/CompanyContext';
import CompanyForm from './CompanyForm';
import LoadingSpinner from './LoadingSpinner';

export default function CompanyList() {
  const { t } = useTranslation();
  const { companies, loading, error, loadCompanies, addCompany, deleteCompany } = useCompany();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const handleAddCompany = async (data) => {
    try {
      await addCompany(data);
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to add company:', err);
    }
  };

  const handleDeleteCompany = async (id) => {
    if (window.confirm(t('companies.confirmDelete'))) {
      try {
        await deleteCompany(id);
      } catch (err) {
        console.error('Failed to delete company:', err);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={loadCompanies}
          className="mt-2 text-sm text-red-600 hover:text-red-500"
        >
          {t('common.tryAgain')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          {t('companies.title')}
        </h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          <Plus className="h-4 w-4" />
          <span>{t('companies.addNew')}</span>
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <CompanyForm
              onSubmit={handleAddCompany}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      {companies.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {t('companies.noCompanies')}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {t('companies.getStarted')}
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('companies.addFirst')}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {company.name}
                  </h3>
                  {company.industry && (
                    <p className="mt-1 text-sm text-gray-500">{company.industry}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingCompany(company)}
                    className="p-1 text-gray-400 hover:text-gray-500"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCompany(company.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {company.description && (
                <p className="mt-2 text-sm text-gray-600">
                  {company.description}
                </p>
              )}
              <div className="mt-4 space-y-2">
                {company.email && (
                  <p className="text-sm text-gray-500">
                    {company.email}
                  </p>
                )}
                {company.phone && (
                  <p className="text-sm text-gray-500">
                    {company.phone}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {editingCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <CompanyForm
              company={editingCompany}
              onSubmit={async (data) => {
                try {
                  await addCompany({ ...editingCompany, ...data });
                  setEditingCompany(null);
                } catch (err) {
                  console.error('Failed to update company:', err);
                }
              }}
              onCancel={() => setEditingCompany(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}