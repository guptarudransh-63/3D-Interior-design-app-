import React from 'react';

export const StatusBadge = ({ status, className = '' }) => {
  const styles = {
    Draft: 'bg-stone-warm text-charcoal-700 border-charcoal-700/20',
    Submitted: 'bg-amber-50 text-amber-900 border-amber-300',
    'Under Review': 'bg-blue-50 text-blue-900 border-blue-200',
    'Proposal Ready': 'bg-purple-50 text-purple-900 border-purple-200',
    'Revision Requested': 'bg-terracotta/10 text-terracotta border-terracotta/30',
    Accepted: 'bg-emerald-50 text-emerald-900 border-emerald-300',
    Declined: 'bg-rose-50 text-rose-800 border-rose-200',
    Completed: 'bg-charcoal-900 text-ivory-100 border-charcoal-900',
    Published: 'bg-purple-50 text-purple-900 border-purple-200',
    Superseded: 'bg-stone-warm/50 text-charcoal-700/60 border-stone-accent/30 line-through',
  };

  const currentStyle = styles[status] || 'bg-stone-warm text-charcoal-800 border-charcoal-200';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${currentStyle} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {status}
    </span>
  );
};
