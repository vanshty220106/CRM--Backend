import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Shield } from 'lucide-react';

export function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
      <div className="h-20 w-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-3xl font-bold ring-4 ring-slate-50 uppercase">
        {user.name ? user.name.charAt(0) : (user.displayName ? user.displayName.charAt(0) : 'U')}
      </div>
      <div className="flex-1 space-y-2">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          {user.name || user.displayName || 'Citizen'}
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            <Mail className="h-4 w-4" />
            {user.email}
          </div>
          <div className="flex items-center gap-1.5 capitalize">
            <Shield className="h-4 w-4 text-blue-500" />
            {user.role || 'Citizen'}
          </div>
        </div>
      </div>
    </div>
  );
}
