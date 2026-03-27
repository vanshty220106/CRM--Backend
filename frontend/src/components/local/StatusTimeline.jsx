import React from 'react';
import { CheckCircle2, Circle, Clock, Wrench, AlertCircle } from 'lucide-react';

const STATUS_STEPS = [
  { id: 'initiated', label: 'Initiated', icon: AlertCircle },
  { id: 'under_review', label: 'Under Review', icon: Clock },
  { id: 'construction_ongoing', label: 'Construction', icon: Wrench },
  { id: 'fixing_issues', label: 'Fixing', icon: Wrench },
  { id: 'resolved', label: 'Resolved', icon: CheckCircle2 }
];

export function StatusTimeline({ updates, currentStatus }) {
  const currentIndex = STATUS_STEPS.findIndex(s => s.id === currentStatus);

  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <h4 className="text-sm font-semibold text-slate-700 mb-3">Status Timeline</h4>
      <div className="relative">
        {/* Vertical line connecting steps */}
        <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-200"></div>

        <div className="space-y-4 relative">
          {STATUS_STEPS.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const updateRecord = updates.find(u => u.status === step.id);
            
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex gap-3">
                <div className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                  isCompleted ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="-mt-0.5 flex flex-col">
                  <span className={`text-sm font-medium ${isCompleted ? 'text-slate-900' : 'text-slate-500'}`}>
                    {step.label}
                  </span>
                  {updateRecord && (
                    <div className="text-xs text-slate-500 mt-0.5 max-w-sm">
                      <span className="block italic">"{updateRecord.message}"</span>
                      <span className="opacity-70">{new Date(updateRecord.timestamp).toLocaleDateString()} {new Date(updateRecord.timestamp).toLocaleTimeString()}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
