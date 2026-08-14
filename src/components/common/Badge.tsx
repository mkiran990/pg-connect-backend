import React from 'react';

interface BadgeProps {
  status: string;
  type?: 'payment' | 'complaint' | 'availability' | 'general';
}

export const Badge: React.FC<BadgeProps> = ({ status, type = 'general' }) => {
  let styles = 'bg-slate-100 text-slate-700 border-slate-200';

  if (type === 'payment') {
    switch (status) {
      case 'Paid':
        styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        break;
      case 'Partially Paid':
        styles = 'bg-amber-50 text-amber-700 border-amber-200';
        break;
      case 'Pending':
        styles = 'bg-blue-50 text-blue-700 border-blue-200';
        break;
      case 'Overdue':
        styles = 'bg-rose-50 text-rose-700 border-rose-200';
        break;
    }
  } else if (type === 'complaint') {
    switch (status) {
      case 'Open':
        styles = 'bg-amber-50 text-amber-700 border-amber-200';
        break;
      case 'In Progress':
        styles = 'bg-blue-50 text-blue-700 border-blue-200';
        break;
      case 'Resolved':
        styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        break;
      case 'Closed':
        styles = 'bg-slate-100 text-slate-600 border-slate-200';
        break;
    }
  } else if (type === 'availability') {
    if (status === 'Available' || status === '1') {
      styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else {
      styles = 'bg-slate-100 text-slate-600 border-slate-200';
    }
  }

  const label = status === '1' ? 'Available' : status === '0' ? 'Occupied' : status;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles}`}>
      {label}
    </span>
  );
};
