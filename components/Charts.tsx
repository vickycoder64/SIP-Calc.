import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { SipResult, YearlyBreakdown } from '../types';

interface ChartsProps {
  results: SipResult;
  yearlyData: YearlyBreakdown[];
}

const COLORS = ['#e5e7eb', '#3b82f6']; // Gray for Invested, Blue for Returns

export const Charts: React.FC<ChartsProps> = ({ results, yearlyData }) => {
  const pieData = [
    { name: 'Invested', value: results.investedAmount },
    { name: 'Returns', value: results.estimatedReturns },
  ];

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${(value / 1000).toFixed(0)}k`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Allocation Breakdown</h3>
        <div className="w-full h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <span className="text-xs text-gray-400 block">Total</span>
              <span className="text-sm font-bold text-gray-700">₹{(results.totalValue/100000).toFixed(1)}L</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-200"></div>
            <span className="text-sm text-gray-600">Invested</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-600">Returns</span>
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Growth Over Time</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={yearlyData}
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="year" 
                tick={{fontSize: 12, fill: '#9ca3af'}} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tickFormatter={formatCurrency} 
                tick={{fontSize: 12, fill: '#9ca3af'}}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                formatter={(value: number) => `₹${value.toLocaleString()}`}
                labelFormatter={(label) => `Year ${label}`}
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
              <Area 
                type="monotone" 
                dataKey="invested" 
                stroke="#d1d5db" 
                strokeWidth={2}
                fill="transparent" 
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">Dashed: Invested • Solid: Total Value</p>
      </div>
    </div>
  );
};