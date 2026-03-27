import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle2 } from 'lucide-react';

export function DashboardCards({ stats }) {
  const cards = [
    {
      title: 'Total Complaints',
      value: stats?.total || 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active',
      value: stats?.active || 0,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Resolved',
      value: stats?.resolved || 0,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          key={card.title}
          className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-600">{card.title}</p>
            <div className={`rounded-lg p-2 ${card.bgColor}`}>
              <card.icon className={`h-5 w-5 ${card.color}`} strokeWidth={2.5} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline">
            <p className="text-3xl font-bold text-slate-900">{card.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
