import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Clock, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';
import Grainient from '../components/ui/Grainient';
import { useAuth } from '../context/AuthContext';

export function LandingPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden">
      {/* Background Gradient */}
      <Grainient
        color1="#dbeafe"
        color2="#bfdbfe"
        color3="#eff6ff"
        timeSpeed={0.15}
        colorBalance={0}
        warpStrength={1.5}
        warpFrequency={4}
        warpSpeed={1}
        warpAmplitude={60}
        blendAngle={45}
        blendSoftness={0.2}
        rotationAmount={300}
        noiseScale={1.5}
        grainAmount={0.06}
        grainScale={2}
        grainAnimated={true}
        contrast={1.1}
        gamma={1}
        saturation={1}
        centerX={0}
        centerY={0}
        zoom={0.8}
        className="absolute inset-0 w-full h-full z-0 opacity-80"
      />

      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <nav className="flex items-center justify-between p-6 max-w-7xl w-full mx-auto">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-800 backdrop-blur-sm bg-white/30 px-3 py-1 rounded-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">C</div>
            CivicFlow
          </div>
          <div className="flex items-center gap-6 backdrop-blur-sm bg-white/50 px-6 py-2 rounded-2xl border border-white/20 shadow-sm">
            {user ? (
              <>
                <span className="text-slate-800 font-medium text-sm hidden sm:block">Welcome, {user.name || user.displayName}</span>
                <button onClick={() => navigate('/dashboard')} className="text-slate-700 hover:text-blue-600 font-medium text-sm transition-colors">Dashboard</button>
                <Button onClick={() => logout()} size="sm" variant="secondary" className="shadow-md">Logout</Button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/public-dashboard')} className="text-slate-700 hover:text-blue-600 font-medium text-sm transition-colors">Public Dashboard</button>
                <button onClick={() => navigate('/login')} className="text-slate-700 hover:text-blue-600 font-medium text-sm transition-colors">Sign In</button>
                <Button onClick={() => navigate('/register')} size="sm" className="shadow-md">Get Started</Button>
              </>
            )}
          </div>
        </nav>

        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-10 pb-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mix-blend-multiply">
              Fix public issues faster with
              <span className="block text-blue-600 mt-2">transparent tracking</span>
            </h1>
            <p className="mt-8 text-lg sm:text-xl text-slate-700 max-w-2xl mx-auto font-medium">
              One unified platform for complaint management. Report local issues, track resolution progress in real-time, and hold authorities accountable.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                 <Button size="lg" onClick={() => navigate('/dashboard')} className="text-lg px-8 py-6 h-auto shadow-xl hover:shadow-blue-500/20 transition-all">
                  Go to Dashboard
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
              ) : (
                <Button size="lg" onClick={() => navigate('/register')} className="text-lg px-8 py-6 h-auto shadow-xl hover:shadow-blue-500/20 transition-all">
                  Get Started
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-24 w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center"
          >
            <div className="backdrop-blur-md bg-white/40 border border-white/50 p-6 rounded-2xl shadow-sm">
              <p className="text-4xl font-extrabold text-slate-900 drop-shadow-sm">15,247</p>
              <p className="mt-2 text-sm font-semibold text-slate-600 uppercase tracking-wide">Issues Resolved</p>
            </div>
            <div className="backdrop-blur-md bg-white/40 border border-white/50 p-6 rounded-2xl shadow-sm">
              <p className="text-4xl font-extrabold text-slate-900 drop-shadow-sm">2.3 days</p>
              <p className="mt-2 text-sm font-semibold text-slate-600 uppercase tracking-wide">Avg Response Time</p>
            </div>
            <div className="backdrop-blur-md bg-white/40 border border-white/50 p-6 rounded-2xl shadow-sm">
              <p className="text-4xl font-extrabold text-slate-900 drop-shadow-sm">96%</p>
              <p className="mt-2 text-sm font-semibold text-slate-600 uppercase tracking-wide">Satisfaction Rate</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-24 grid sm:grid-cols-3 gap-8 max-w-5xl w-full"
          >
            <div className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-sm border border-white/60 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 shadow-inner">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Real-time Tracking</h3>
              <p className="text-slate-600 font-medium">Track your submitted issues securely with end-to-end updates delivered straight to you.</p>
            </div>
            <div className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-sm border border-white/60 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 shadow-inner">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Fast Resolution</h3>
              <p className="text-slate-600 font-medium">Smart routing ensures your complaints reach the right department instantly for faster action.</p>
            </div>
            <div className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-sm border border-white/60 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 shadow-inner">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Transparent Process</h3>
              <p className="text-slate-600 font-medium">Public visibility of local issues holds authorities accountable and builds community trust.</p>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
