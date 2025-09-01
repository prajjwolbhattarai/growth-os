
import React from 'react';

interface CardProps {
  title: string;
  value?: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, value, change, changeType, icon, children, className }) => {
  const changeColor = changeType === 'positive' ? 'text-green-600' : 'text-red-500';
  const changeBg = changeType === 'positive' ? 'bg-green-100' : 'bg-red-100';

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200/75 ${className}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-brand-blue-100 flex items-center justify-center mr-4">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                {value && <p className="text-2xl font-bold text-slate-800">{value}</p>}
            </div>
        </div>
        {change && (
          <div className={`text-xs font-semibold px-2 py-1 rounded-full ${changeColor} ${changeBg}`}>
            {change}
          </div>
        )}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default Card;
