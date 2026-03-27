import React, { useEffect, useState } from 'react';
import { ComplaintTable } from '../components/dashboard/ComplaintTable';
import { ComplaintCard } from '../components/local/ComplaintCard';
import { complaintService } from '../services/complaintService';

export function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await complaintService.getMyComplaints();
        setComplaints(response.data);
      } catch (error) {
        console.error('Failed to load your complaints', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Reports</h1>
        <p className="mt-1 text-sm text-slate-500">History and status of all the public issues you have submitted.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">Issue History</h2>
        </div>
        {loading ? (
          <div className="p-10 text-center animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-40 bg-slate-100 rounded-xl w-3/4 mx-auto"></div>
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No complaints registered yet.</div>
        ) : (
          <div className="p-6 space-y-6">
            {complaints.map(complaint => (
              <ComplaintCard key={complaint.id} complaint={complaint} isAdmin={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
