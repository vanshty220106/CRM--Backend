import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X } from 'lucide-react';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function LogoutModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleConfirmLogout = async () => {
    await logout();
    onClose();
    navigate('/login');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
          />
          
          {/* Modal Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
            >
              <div className="px-6 py-8 text-center bg-red-50 relative">
                <button 
                  onClick={onClose}
                  className="absolute right-4 top-4 p-2 text-red-300 hover:bg-red-100 hover:text-red-500 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
                  <LogOut className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Sign Out</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Are you absolutely sure you want to log out of your account? You will need to sign in again to submit complaints.
                </p>
              </div>
              <div className="bg-white px-6 py-4 flex flex-col gap-3">
                <Button 
                  variant="danger" 
                  className="w-full text-base font-semibold py-6 h-12 rounded-xl"
                  onClick={handleConfirmLogout}
                >
                  Yes, Log out
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full text-base font-semibold py-6 h-12 rounded-xl border-2 border-slate-100"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
