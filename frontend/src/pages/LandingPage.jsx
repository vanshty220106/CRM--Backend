import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Clock, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <nav className="flex items-center justify-between p-6 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">C</div>
          CivicFlow
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/dashboard')} className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors">Public Dashboard</button>
          <button onClick={() => navigate('/login')} className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors">Sign In</button>
          <Button onClick={() => navigate('/register')} size="sm">Get Started</Button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Fix public issues faster with
            <span className="block text-blue-600 mt-2">transparent tracking</span>
          </h1>
          <p className="mt-8 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            One unified platform for complaint management. Report local issues, track resolution progress in real-time, and hold authorities accountable.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/register')} className="text-lg px-8 py-6 h-auto">
              Get Started
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center"
        >
          <div>
            <p className="text-4xl font-extrabold text-slate-900">15,247</p>
            <p className="mt-2 text-sm font-medium text-slate-500 uppercase tracking-wide">Issues Resolved</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-slate-900">2.3 days</p>
            <p className="mt-2 text-sm font-medium text-slate-500 uppercase tracking-wide">Avg Response Time</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-slate-900">96%</p>
            <p className="mt-2 text-sm font-medium text-slate-500 uppercase tracking-wide">Satisfaction Rate</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-32 grid sm:grid-cols-3 gap-8 max-w-5xl w-full"
        >
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Real-time Tracking</h3>
            <p className="text-slate-600">Track your submitted issues securely with end-to-end updates delivered straight to you.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Fast Resolution</h3>
            <p className="text-slate-600">Smart routing ensures your complaints reach the right department instantly for faster action.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Transparent Process</h3>
            <p className="text-slate-600">Public visibility of local issues holds authorities accountable and builds community trust.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
