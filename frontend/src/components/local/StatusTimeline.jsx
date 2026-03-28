import React from 'react';
import { CheckCircle2, Clock, Wrench, AlertCircle, PackageCheck, Loader2 } from 'lucide-react';

const STATUS_STEPS = [
  {
    id: 'initiated',
    label: 'Complaint Registered',
    sublabel: 'Your report has been received',
    icon: AlertCircle,
    color: 'blue',
  },
  {
    id: 'under_review',
    label: 'Under Review',
    sublabel: 'Authority is reviewing your complaint',
    icon: Clock,
    color: 'violet',
  },
  {
    id: 'construction_ongoing',
    label: 'Work in Progress',
    sublabel: 'Crew dispatched to the site',
    icon: Wrench,
    color: 'amber',
  },
  {
    id: 'fixing_issues',
    label: 'Fixing Issues',
    sublabel: 'Actively resolving the problem',
    icon: Loader2,
    color: 'orange',
  },
  {
    id: 'resolved',
    label: 'Resolved',
    sublabel: 'Issue has been resolved',
    icon: PackageCheck,
    color: 'emerald',
  },
];

const colorMap = {
  blue:    { dot: 'bg-blue-600 ring-blue-200',    label: 'text-blue-700',    bar: 'bg-blue-500',    badge: 'bg-blue-50 text-blue-700 border-blue-200'    },
  violet:  { dot: 'bg-violet-600 ring-violet-200', label: 'text-violet-700',  bar: 'bg-violet-500',  badge: 'bg-violet-50 text-violet-700 border-violet-200'  },
  amber:   { dot: 'bg-amber-500 ring-amber-200',   label: 'text-amber-700',   bar: 'bg-amber-400',   badge: 'bg-amber-50 text-amber-700 border-amber-200'   },
  orange:  { dot: 'bg-orange-500 ring-orange-200', label: 'text-orange-700',  bar: 'bg-orange-400',  badge: 'bg-orange-50 text-orange-700 border-orange-200'  },
  emerald: { dot: 'bg-emerald-600 ring-emerald-200', label: 'text-emerald-700', bar: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

export function StatusTimeline({ updates = [], currentStatus }) {
  const currentIndex = STATUS_STEPS.findIndex(s => s.id === currentStatus);

  return (
    <div className="mt-4 pt-5 border-t border-slate-100">
      <div className="flex items-center justify-between mb-5">
        <h4 className="text-sm font-bold text-slate-800 tracking-wide uppercase">Complaint Tracker</h4>
        <span className="text-xs text-slate-500 font-medium">
          Step {Math.max(1, currentIndex + 1)} of {STATUS_STEPS.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative mb-6 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 transition-all duration-700 ease-out"
          style={{ width: `${((currentIndex + 1) / STATUS_STEPS.length) * 100}%` }}
        />
      </div>

      {/* Steps */}
      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-slate-100" />

        <div className="space-y-5">
          {STATUS_STEPS.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isPending = index > currentIndex;
            const updateRecord = updates.findLast?.(u => u.status === step.id) 
              ?? updates.slice().reverse().find(u => u.status === step.id);
            const Icon = step.icon;
            const c = colorMap[step.color];

            return (
              <div
                key={step.id}
                className={`flex gap-4 transition-opacity duration-300 ${isPending ? 'opacity-40' : 'opacity-100'}`}
              >
                {/* Step dot */}
                <div className="relative z-10 flex-shrink-0 flex items-start pt-0.5">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 transition-all duration-500 ${
                      isCompleted
                        ? 'bg-emerald-500 ring-emerald-100'
                        : isCurrent
                        ? `${c.dot} ring-4 shadow-md`
                        : 'bg-slate-200 ring-slate-100'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    ) : isCurrent ? (
                      <Icon className={`h-4 w-4 text-white ${step.id === 'fixing_issues' ? 'animate-spin' : ''}`} />
                    ) : (
                      <Icon className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Step content */}
                <div className="flex-1 min-w-0 pb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-sm font-semibold ${
                        isCompleted ? 'text-emerald-700' : isCurrent ? c.label : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                    {isCurrent && (
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${c.badge}`}>
                        Current
                      </span>
                    )}
                    {isCompleted && (
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                        Done
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mt-0.5 ${isCurrent ? 'text-slate-600' : 'text-slate-400'}`}>
                    {step.sublabel}
                  </p>
                  {updateRecord && (
                    <div className="mt-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600">
                      <p className="italic leading-relaxed">"{updateRecord.message}"</p>
                      <p className="mt-1 text-slate-400 font-medium">
                        {new Date(updateRecord.timestamp).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
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
