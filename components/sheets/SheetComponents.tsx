import React from 'react';

export const StatBlock: React.FC<{ label: string; value: number | string; modifier?: number }> = ({ label, value, modifier }) => (
  <div className="flex flex-col items-center justify-center bg-gray-900 p-3 rounded-lg border border-gray-600 text-center shadow-inner print-bg-white print-border-gray">
    <div className="text-2xl font-bold text-amber-300 print-text-black">{value}</div>
    <div className="text-xs uppercase tracking-widest text-gray-400 print-text-black">{label}</div>
    {modifier !== undefined && (
      <div className="mt-1 text-lg font-bold print-text-black">{modifier >= 0 ? `+${modifier}` : modifier}</div>
    )}
  </div>
);

export const SheetSection: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className="" }) => (
  <div className={`bg-gray-800/50 p-4 rounded-lg border border-gray-700 shadow-lg print-bg-white print-border-gray ${className}`}>
    <h3 className="font-title text-xl text-amber-400 border-b-2 border-amber-800/50 pb-2 mb-3 print-text-black print-border-gray">{title}</h3>
    {children}
  </div>
);

export const ValueBox: React.FC<{label: string, value: string | number, className?: string}> = ({label, value, className}) => (
    <div className={`flex flex-col items-center justify-center bg-gray-900 p-2 rounded-lg border border-gray-600 text-center shadow-inner print-bg-white print-border-gray ${className}`}>
        <div className="text-xs uppercase tracking-widest text-gray-400 print-text-black">{label}</div>
        <div className="text-xl font-bold text-amber-300 print-text-black">{value}</div>
    </div>
);

export const IconListItem: React.FC<{icon: React.ReactNode, children: React.ReactNode}> = ({icon, children}) => (
    <li className="flex items-start text-gray-300 print-text-black">
        <span className="flex-shrink-0 w-5 h-5 mt-0.5">{icon}</span>
        <span className="ml-2">{children}</span>
    </li>
);

export const Pill: React.FC<{children: React.ReactNode}> = ({children}) => (
    <span className="inline-block bg-gray-700 text-gray-300 text-xs font-medium mr-2 mb-2 px-2.5 py-1 rounded-full print-border-gray border print-bg-white print-text-black">
        {children}
    </span>
);
