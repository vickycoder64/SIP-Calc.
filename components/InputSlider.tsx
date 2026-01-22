import React from 'react';

interface InputSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}

export const InputSlider: React.FC<InputSliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}) => {
  return (
    <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <label className="text-gray-600 font-medium text-sm sm:text-base">{label}</label>
        <div className="bg-blue-50 text-blue-700 font-bold py-1 px-3 rounded-lg text-sm sm:text-base">
          {unit === '₹' ? '₹' : ''}
          {value.toLocaleString()}
          {unit === '%' ? '%' : ''}
          {unit === 'Yr' ? ' Yr' : ''}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
      />
    </div>
  );
};