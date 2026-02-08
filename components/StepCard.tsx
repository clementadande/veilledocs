
import React from 'react';
import { MonitoringStep } from '../types';

interface StepCardProps {
  step: MonitoringStep;
  index: number;
}

const StepCard: React.FC<StepCardProps> = ({ step, index }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow group">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          {step.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
          <p className="text-slate-600 text-sm mb-4 leading-relaxed">
            {step.description}
          </p>
          <ul className="space-y-2">
            {step.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-indigo-500 mt-1">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StepCard;
