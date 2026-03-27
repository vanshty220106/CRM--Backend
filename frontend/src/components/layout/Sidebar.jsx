import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, PlusCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export function Sidebar({ isOpen, setIsOpen }) {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Complaints', path: '/complaints', icon: FileText },
    { name: 'Submit Complaint', path: '/submit', icon: PlusCircle },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo area */}
        <div className="flex h-16 items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              C
            </div>
            CivicFlow
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* User profile section at bottom */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-600">
              JD
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-900">John Doe</span>
              <span className="text-xs text-slate-500">Citizen</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
