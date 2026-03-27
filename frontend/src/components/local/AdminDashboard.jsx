import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ComplaintCard } from './ComplaintCard';
import { Navigate } from 'react-router-dom';
import { Search, Filter, Shield } from 'lucide-react';
import { complaintService } from '../../services/complaintService';

export function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await complaintService.getComplaints();
        setComplaints(res.data);
      } catch(e) { console.error(e) }
      finally { setLoading(false) }
    };
    fetchAll();
  }, []);

  const handleUpdate = async (id, status, message, proofImage) => {
    try {
      await complaintService.updateComplaintStatus(id, { status, message, proofImage });
      const newUpdate = { status, message, timestamp: new Date() };
      setComplaints(prev => prev.map(c => 
        c.id === id ? { ...c, status, proofImage: proofImage || c.proofImage, updates: [...(c.updates||[]), newUpdate] } : c
      ));
    } catch(e) { console.error("Update failed", e) }
  };

  // Strict local role validation matching the user's constraints
  const role = localStorage.getItem('role');
  if (role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Derived state filtering
  let displayComplaints = [...complaints];
  if (filterStatus !== 'all') {
    displayComplaints = displayComplaints.filter(c => c.status === filterStatus);
  }
  
  displayComplaints.sort((a, b) => {
    if (sortOrder === 'newest') return b.createdAt - a.createdAt;
    return a.createdAt - b.createdAt; // oldest
  });

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Shield className="h-8 w-8 text-amber-600" />
            Admin Operations Hub
          </h1>
          <p className="mt-2 text-slate-600">Offline Management Command Center.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">{user?.name || user?.email}</p>
          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs uppercase tracking-wide">System Administrator</span>
        </div>
      </div>

      {/* Admin Filters Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
          <Filter className="h-4 w-4" />
          <span>Status Filter:</span>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="ml-2 border-slate-300 rounded-md py-1 px-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
          >
            <option value="all">All Complaints ({complaints.length})</option>
            <option value="initiated">Initiated</option>
            <option value="under_review">Under Review</option>
            <option value="construction_ongoing">Construction</option>
            <option value="fixing_issues">Fixing Issues</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
          <Search className="h-4 w-4" />
          <span>Sort:</span>
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="ml-2 border-slate-300 rounded-md py-1 px-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
             <div className="animate-pulse flex flex-col items-center">
               <div className="h-6 w-32 bg-slate-200 rounded mb-4"></div>
               <div className="h-4 w-48 bg-slate-200 rounded"></div>
             </div>
          </div>
        ) : displayComplaints.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500 font-medium text-lg">No complaints found matching this criteria.</p>
          </div>
        ) : (
          displayComplaints.map(complaint => (
            <ComplaintCard key={complaint.id} complaint={complaint} isAdmin={true} onUpdate={handleUpdate} />
          ))
        )}
      </div>
    </div>
  );
}
