import React, { useState, useEffect } from 'react';
import { Bell, Menu, Search, CheckCircle2, Database } from 'lucide-react';
import { Input } from '../ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogoutModal } from '../ui/LogoutModal';

export function Navbar({ onMenuClick }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [dbMode, setDbMode] = useState(null); // null | 'atlas' | 'local_file'
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(d => setDbMode(d.dbMode || null))
      .catch(() => setDbMode(null));
  }, []);

  const notifications = [
    { id: 1, title: 'Issue Resolved', message: 'Your complaint regarding "Pothole on Main St" has been marked as resolved.', time: '2h ago' },
    { id: 2, title: 'In Progress', message: 'The city council is now reviewing your "Water pipe leak" report.', time: '1d ago' },
  ];

  return (
    <>
      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />

      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-slate-500 hover:text-slate-700 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="w-full max-w-md hidden sm:block">
            <Input
              placeholder="Search complaints..."
              icon={<Search className="h-4 w-4" />}
              className="bg-slate-50 border-transparent focus:border-blue-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* DB Mode badge */}
          {dbMode === 'local_file' && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200" title="MongoDB Atlas unreachable — data is saved locally on disk">
              <Database className="h-3 w-3" />
              Local Mode
            </div>
          )}
          {dbMode === 'atlas' && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Database className="h-3 w-3" />
              Atlas Live
            </div>
          )}
          <div className="hidden sm:block text-slate-700 text-sm font-medium">
            Welcome, {user?.name || user?.displayName || 'Citizen'}
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors hidden sm:block"
          >
            Logout
          </button>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-400 hover:text-slate-500 transition-colors focus:ring-2 focus:ring-blue-500 rounded-full"
            >
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              <Bell className="h-5 w-5" />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">2 New</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map(note => (
                      <div key={note.id} className="px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3">
                        <div className="mt-1 flex-shrink-0">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{note.title}</p>
                          <p className="text-xs text-slate-500 mt-1">{note.message}</p>
                          <p className="text-xs text-slate-400 mt-1 font-medium">{note.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 text-center border-t border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                    <span className="text-xs font-semibold text-blue-600">Mark all as read</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
    </>
  );
}
