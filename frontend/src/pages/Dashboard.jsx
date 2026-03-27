import React, { useState, useEffect } from 'react';
import { DashboardCards } from '../components/dashboard/DashboardCards';
import { ComplaintTable } from '../components/dashboard/ComplaintTable';
import { complaintService } from '../services/complaintService';

export function Dashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, resolved: 0 });
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, complaintsRes] = await Promise.all([
          complaintService.getStats(),
          complaintService.getComplaints()
        ]);
        setStats(statsRes.data);
        setComplaints(complaintsRes.data);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Track and manage your public service requests</p>
      </div>

      {loading ? (
        <div className="space-y-8 animate-pulse">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-96 bg-slate-200 rounded-xl mt-8"></div>
        </div>
      ) : (
        <>
          <DashboardCards stats={stats} />
          <ComplaintTable complaints={complaints} />
        </>
      )}
    </div>
  );
}
