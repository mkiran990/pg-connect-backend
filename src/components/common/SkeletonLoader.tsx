import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="glass-card p-6 space-y-4 animate-pulse">
      <div className="h-5 bg-slate-200 rounded-md w-1/3"></div>
      <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
      <div className="h-4 bg-slate-200 rounded-md w-1/2"></div>
      <div className="pt-4 flex justify-between">
        <div className="h-8 bg-slate-200 rounded-xl w-24"></div>
        <div className="h-8 bg-slate-200 rounded-xl w-20"></div>
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-12 bg-slate-200 rounded-xl w-full"></div>
      ))}
    </div>
  );
};
