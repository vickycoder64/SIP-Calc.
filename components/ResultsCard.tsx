import React from 'react';
import { SipResult } from '../types';

interface ResultsCardProps {
  results: SipResult;
}

export const ResultsCard: React.FC<ResultsCardProps> = ({ results }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Invested Amount</p>
        <p className="text-xl sm:text-2xl font-bold text-gray-800">
          ₹{results.investedAmount.toLocaleString()}
        </p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Est. Returns</p>
        <p className="text-xl sm:text-2xl font-bold text-green-600">
          ₹{results.estimatedReturns.toLocaleString()}
        </p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center ring-2 ring-blue-100">
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Value</p>
        <p className="text-xl sm:text-2xl font-bold text-blue-700">
          ₹{results.totalValue.toLocaleString()}
        </p>
      </div>
    </div>
  );
};