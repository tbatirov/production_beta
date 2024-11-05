import React from 'react';
import { FinancialData } from '../utils/types';

interface DataTableProps {
  data: FinancialData;
  maxRows?: number;
}

export default function DataTable({ data, maxRows = 10 }: DataTableProps) {
  const previewRows = data.rows.slice(0, maxRows);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {data.headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header.replace(/_/g, ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {previewRows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {data.headers.map((header, colIndex) => (
                <td
                  key={`${rowIndex}-${colIndex}`}
                  className="px-4 py-2 whitespace-nowrap text-sm text-gray-900"
                >
                  {row[header]?.toString() || '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.rows.length > maxRows && (
        <div className="text-center py-2 text-sm text-gray-500">
          Showing {maxRows} of {data.rows.length} rows
        </div>
      )}
    </div>
  );
}