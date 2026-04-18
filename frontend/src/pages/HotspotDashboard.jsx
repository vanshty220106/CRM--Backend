import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { complaintService } from '../services/complaintService';
import { onHotspotAlert, onNewComplaint, disconnectSocket } from '../services/socketService';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  Activity, AlertTriangle, Radio, Shield, Zap, Droplets,
  Lightbulb, Trash2, Heart, Bus, X, Bell, TrendingUp,
  Clock, RefreshCw, Wifi, WifiOff
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ── Category config ──────────────────────────────────────────────
const CATEGORY_CONFIG = {
  Roads:             { icon: Activity,      color: '#f59e0b', bg: 'bg-amber-50',    text: 'text-amber-700',   border: 'border-amber-200',   gradient: 'from-amber-500 to-orange-500' },
  Water:             { icon: Droplets,      color: '#3b82f6', bg: 'bg-blue-50',     text: 'text-blue-700',    border: 'border-blue-200',    gradient: 'from-blue-500 to-cyan-500' },
  Electricity:       { icon: Lightbulb,     color: '#eab308', bg: 'bg-yellow-50',   text: 'text-yellow-700',  border: 'border-yellow-200',  gradient: 'from-yellow-500 to-amber-500' },
  Sanitation:        { icon: Trash2,        color: '#22c55e', bg: 'bg-emerald-50',  text: 'text-emerald-700', border: 'border-emerald-200', gradient: 'from-emerald-500 to-green-500' },
  Health:            { icon: Heart,         color: '#ef4444', bg: 'bg-red-50',      text: 'text-red-700',     border: 'border-red-200',     gradient: 'from-red-500 to-rose-500' },
  'Public Transport':{ icon: Bus,           color: '#8b5cf6', bg: 'bg-violet-50',   text: 'text-violet-700',  border: 'border-violet-200',  gradient: 'from-violet-500 to-purple-500' },
};

const CHART_COLORS = ['#f59e0b', '#3b82f6', '#eab308', '#22c55e', '#ef4444', '#8b5cf6'];

// ── Hotspot Alert Modal ──────────────────────────────────────────
function HotspotAlertModal({ alert, onClose }) {
  if (!alert) return null;
  const config = CATEGORY_CONFIG[alert.category] || CATEGORY_CONFIG.Roads;
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.7, opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Pulsing header */}
          <div className={`relative bg-gradient-to-r ${config.gradient} p-8 text-center`}>
            {/* Pulse rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-32 h-32 rounded-full bg-white/10 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute w-24 h-24 rounded-full bg-white/15 animate-ping" style={{ animationDuration: '1.5s' }} />
              <div className="absolute w-16 h-16 rounded-full bg-white/20 animate-ping" style={{ animationDuration: '1s' }} />
            </div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">HOTSPOT ALERT</h2>
              <p className="text-white/80 text-sm font-medium mt-1">Surge Detected in Real-Time</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className={`flex items-center gap-4 p-4 ${config.bg} rounded-2xl ${config.border} border mb-4`}>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className={`text-lg font-bold ${config.text}`}>{alert.category}</p>
                <p className="text-sm text-slate-500">Category Surge</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-3xl font-black text-slate-900">{alert.count}</p>
                <p className="text-xs text-slate-500">in 10 min</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-5">
              {alert.message || `${alert.count} complaints in the "${alert.category}" category have been received in the last 10 minutes. Immediate attention recommended.`}
            </p>

            <button
              onClick={onClose}
              className={`w-full h-12 rounded-xl bg-gradient-to-r ${config.gradient} text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all active:scale-[0.98]`}
            >
              Acknowledge & Dismiss
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Live Feed Item ───────────────────────────────────────────────
function LiveFeedItem({ complaint, isNew }) {
  const config = CATEGORY_CONFIG[complaint.mlCategory] || CATEGORY_CONFIG.Roads;
  const Icon = config.icon;

  return (
    <motion.div
      initial={isNew ? { opacity: 0, x: -20, height: 0 } : { opacity: 1, x: 0 }}
      animate={{ opacity: 1, x: 0, height: 'auto' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`flex items-center gap-3 p-3 rounded-xl border ${config.border} ${config.bg} transition-all`}
    >
      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center flex-shrink-0`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{complaint.title || 'Untitled Complaint'}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-xs font-bold ${config.text}`}>{complaint.mlCategory}</span>
          {complaint.mlConfidence && (
            <span className="text-xs text-slate-400">{(complaint.mlConfidence * 100).toFixed(0)}% confidence</span>
          )}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-xs text-slate-400">
          {complaint.timestamp ? new Date(complaint.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Now'}
        </p>
      </div>
    </motion.div>
  );
}

// ── Custom Tooltip for Chart ─────────────────────────────────────
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  const config = CATEGORY_CONFIG[data.category];
  
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-3 min-w-[160px]">
      <p className="font-bold text-sm text-slate-900">{data.category}</p>
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-slate-500">Last 60 min</span>
        <span className="font-bold text-sm" style={{ color: config?.color }}>{data.count}</span>
      </div>
      <div className="flex items-center justify-between mt-0.5">
        <span className="text-xs text-slate-500">Last 10 min</span>
        <span className="font-bold text-sm text-slate-700">{data.recentCount}</span>
      </div>
      {data.isHotspot && (
        <div className="mt-2 bg-red-50 text-red-700 text-xs font-bold px-2 py-1 rounded-lg text-center">
          🔥 HOTSPOT
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────
export function HotspotDashboard() {
  const { user } = useAuth();
  const role = localStorage.getItem('role');

  const [stats, setStats] = useState([]);
  const [liveFeed, setLiveFeed] = useState([]);
  const [activeAlert, setActiveAlert] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const feedRef = useRef(liveFeed);

  // Keep ref in sync
  useEffect(() => { feedRef.current = liveFeed; }, [liveFeed]);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await complaintService.getHotspots();
      setStats(res.data.stats || []);
      setLiveFeed(res.data.recentFeed || []);
    } catch (err) {
      console.error('Failed to fetch hotspot data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Socket.io listeners
  useEffect(() => {
    const unsubAlert = onHotspotAlert((data) => {
      setActiveAlert(data);
      toast.error(`🔥 HOTSPOT: ${data.count} "${data.category}" complaints in 10 min!`, {
        position: 'top-right',
        autoClose: 8000,
        theme: 'colored',
      });
      // Refresh stats
      complaintService.getHotspots().then(res => {
        setStats(res.data.stats || []);
      }).catch(() => {});
    });

    const unsubNew = onNewComplaint((data) => {
      setConnected(true);
      const newEntry = {
        title: data.complaint?.title || 'New Complaint',
        mlCategory: data.mlCategory,
        mlConfidence: data.mlConfidence,
        timestamp: data.timestamp,
        category: data.mlCategory,
        isNew: true,
      };
      setLiveFeed(prev => [newEntry, ...prev].slice(0, 50));

      // Update stats
      setStats(prev => {
        const updated = [...prev];
        const idx = updated.findIndex(s => s.category === data.mlCategory);
        if (idx >= 0) {
          updated[idx] = { ...updated[idx], count: updated[idx].count + 1, recentCount: updated[idx].recentCount + 1 };
        } else {
          updated.push({ category: data.mlCategory, count: 1, recentCount: 1, isHotspot: false });
        }
        return updated;
      });

      toast.info(`📋 New: "${data.complaint?.title}" → ${data.mlCategory}`, {
        position: 'bottom-right',
        autoClose: 4000,
        theme: 'light',
      });
    });

    setConnected(true);

    return () => {
      unsubAlert();
      unsubNew();
    };
  }, []);

  if (role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Chart data — ensure all 6 categories are present
  const chartData = Object.keys(CATEGORY_CONFIG).map(cat => {
    const found = stats.find(s => s.category === cat);
    return {
      category: cat,
      count: found?.count || 0,
      recentCount: found?.recentCount || 0,
      isHotspot: found?.isHotspot || false,
    };
  });

  const totalComplaints = stats.reduce((sum, s) => sum + s.count, 0);
  const activeHotspots = stats.filter(s => s.isHotspot).length;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <HotspotAlertModal alert={activeAlert} onClose={() => setActiveAlert(null)} />

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-500">
              <Radio className="h-6 w-6 text-white" />
            </div>
            Hotspot Monitor
          </h1>
          <p className="mt-1 text-slate-500">ML-powered real-time complaint surge detection</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 h-9 px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <div className={`flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-semibold ${connected ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {connected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {connected ? 'Live' : 'Offline'}
          </div>
        </div>
      </div>

      {/* ── Stats Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Total (60m)</span>
          </div>
          <p className="text-3xl font-black text-slate-900">{totalComplaints}</p>
        </div>
        <div className={`rounded-2xl border p-4 shadow-sm ${activeHotspots > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
          <div className={`flex items-center gap-2 mb-1 ${activeHotspots > 0 ? 'text-red-600' : 'text-slate-500'}`}>
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Active Hotspots</span>
          </div>
          <p className={`text-3xl font-black ${activeHotspots > 0 ? 'text-red-700' : 'text-slate-900'}`}>{activeHotspots}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Zap className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Categories</span>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.filter(s => s.count > 0).length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Feed Items</span>
          </div>
          <p className="text-3xl font-black text-slate-900">{liveFeed.length}</p>
        </div>
      </div>

      {/* ── Main Grid: Chart + Live Feed ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Chart Panel (3/5) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Category Frequency</h2>
              <p className="text-xs text-slate-500">Complaints per category — Last 60 minutes</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Live Data
            </div>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <RefreshCw className="h-8 w-8 text-slate-300 animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={entry.category}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                      opacity={entry.isHotspot ? 1 : 0.7}
                      stroke={entry.isHotspot ? '#ef4444' : 'none'}
                      strokeWidth={entry.isHotspot ? 2 : 0}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {/* Hotspot Category Pills */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
            {chartData.map(cat => {
              const cfg = CATEGORY_CONFIG[cat.category];
              const Icon = cfg?.icon || Activity;
              return (
                <div
                  key={cat.category}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    cat.isHotspot
                      ? 'bg-red-50 text-red-700 border-red-300 ring-2 ring-red-200 animate-pulse'
                      : `${cfg?.bg} ${cfg?.text} ${cfg?.border}`
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {cat.category}: {cat.count}
                  {cat.isHotspot && <span className="ml-1">🔥</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Feed Panel (2/5) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col" style={{ maxHeight: '520px' }}>
          <div className="flex items-center justify-between p-5 border-b border-slate-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-base font-bold text-slate-900">Live Feed</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {liveFeed.length} events
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {liveFeed.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Radio className="h-10 w-10 text-slate-300 mb-3" />
                <p className="text-sm font-medium text-slate-500">Waiting for complaints...</p>
                <p className="text-xs text-slate-400 mt-1">New complaints will appear here in real-time</p>
              </div>
            ) : (
              liveFeed.map((item, i) => (
                <LiveFeedItem
                  key={`${item.timestamp}-${i}`}
                  complaint={item}
                  isNew={i === 0 && item.isNew}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Hotspot Category Detail Cards ──────────────────── */}
      {stats.some(s => s.isHotspot) && (
        <div className="mt-6">
          <h3 className="text-sm font-bold text-red-700 uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Active Hotspot Zones
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.filter(s => s.isHotspot).map(s => {
              const cfg = CATEGORY_CONFIG[s.category] || CATEGORY_CONFIG.Roads;
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={s.category}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`${cfg.bg} rounded-2xl border-2 ${cfg.border} p-5 relative overflow-hidden`}
                >
                  <div className="absolute top-2 right-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className={`font-bold ${cfg.text}`}>{s.category}</p>
                      <p className="text-xs text-slate-500">Hotspot Active</p>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-slate-500">Last 10 min</p>
                      <p className="text-2xl font-black text-slate-900">{s.recentCount}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Last 60 min</p>
                      <p className="text-lg font-bold text-slate-700">{s.count}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
