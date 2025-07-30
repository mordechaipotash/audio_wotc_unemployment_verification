import React from 'react';
import { Tooltip } from './Tooltip';

interface FormFieldProps {
  label: string;
  type?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  pattern?: string;
  className?: string;
  tooltip?: string;
  children?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ 
  label,
  type,
  name,
  value,
  onChange,
  required = false,
  placeholder,
  pattern,
  className = '',
  tooltip,
  children
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center mb-2">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {tooltip && <Tooltip text={tooltip} />}
      </div>
      {children ? (
        children
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          pattern={pattern}
          className="block w-full rounded-lg border-gray-300 bg-white px-4 py-3 shadow-sm transition-colors
                   hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
        />
      )}
    </div>
  );
};