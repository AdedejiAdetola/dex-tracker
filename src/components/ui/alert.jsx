// src/components/ui/alert.jsx
import React from 'react';

export function Alert({ children, className }) {
  return (
    <div className={`flex items-start p-4 border-l-4 border-yellow-400 bg-yellow-50 rounded-md ${className}`}>
      {children}
    </div>
  );
}

export function AlertDescription({ children }) {
  return <p className="text-sm text-yellow-700">{children}</p>;
}
