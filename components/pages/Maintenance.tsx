import React from 'react';
import { useTranslation } from 'react-i18next';
import { Wrench, Clock, RefreshCw } from 'lucide-react';

export default function Maintenance() {
  const { t } = useTranslation();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="mx-auto max-w-max">
        <main className="sm:flex">
          <div className="text-center">
            <Wrench className="mx-auto h-12 w-12 text-blue-500" />
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Under Maintenance
            </h1>
            <p className="mt-4 text-base text-gray-500">
              We're performing scheduled maintenance. We'll be back shortly.
            </p>
            <div className="mt-8 flex justify-center space-x-3">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Check again
              </button>
            </div>
            <div className="mt-8 flex items-center justify-center text-sm text-gray-500">
              <Clock className="mr-2 h-4 w-4" />
              <span>Estimated completion time: 30 minutes</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}