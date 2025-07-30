'use client'

import React from 'react';

interface DateInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  required?: boolean;
  className?: string;
}

export const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  name,
  required = false,
  className = '',
}) => {
  // Parse the current value into month, day, year
  const [month, day, year] = value ? value.split('/') : ['', '', ''];

  // Generate arrays for the dropdowns
  const months = Array.from({ length: 12 }, (_, i) => {
    const num = (i + 1).toString().padStart(2, '0');
    return { value: num, label: num };
  });

  const days = Array.from({ length: 31 }, (_, i) => {
    const num = (i + 1).toString().padStart(2, '0');
    return { value: num, label: num };
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => {
    const year = (currentYear - i).toString();
    return { value: year, label: year };
  });

  const handleDateChange = (part: 'month' | 'day' | 'year', newValue: string) => {
    let newMonth = part === 'month' ? newValue : month;
    let newDay = part === 'day' ? newValue : day;
    let newYear = part === 'year' ? newValue : year;

    const newDate = [newMonth, newDay, newYear].join('/');
    onChange({
      target: {
        name,
        value: newDate
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <select
        value={month}
        onChange={(e) => handleDateChange('month', e.target.value)}
        className={`w-20 px-2 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
        required={required}
      >
        <option value="">MM</option>
        {months.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      <select
        value={day}
        onChange={(e) => handleDateChange('day', e.target.value)}
        className={`w-20 px-2 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
        required={required}
      >
        <option value="">DD</option>
        {days.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      <select
        value={year}
        onChange={(e) => handleDateChange('year', e.target.value)}
        className={`w-28 px-2 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
        required={required}
      >
        <option value="">YYYY</option>
        {years.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  );
};
