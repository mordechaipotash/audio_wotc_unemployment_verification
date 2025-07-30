import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={cn('bg-white rounded-lg shadow-lg', className)}>
    {children}
  </div>
);

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={cn('px-6 py-4 border-b border-gray-200', className)}>
    {children}
  </div>
);

export const CardTitle: React.FC<CardProps> = ({ children, className = '' }) => (
  <h3 className={cn('text-lg font-semibold text-gray-900', className)}>
    {children}
  </h3>
);

export const CardDescription: React.FC<CardProps> = ({ children, className = '' }) => (
  <p className={cn('text-sm text-gray-500', className)}>
    {children}
  </p>
);

export const CardContent: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={cn('px-6 py-4', className)}>
    {children}
  </div>
);

export const CardFooter: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={cn('px-6 py-4 border-t border-gray-200', className)}>
    {children}
  </div>
);
