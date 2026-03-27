import React, { useState } from 'react';
import { StatusTimeline } from './StatusTimeline';
import { Button } from '../ui/Button';

export function ComplaintCard({ complaint, isAdmin, onUpdate }) {
  
  const [newStatus, setNewStatus] = useState(complaint.status);
  const [adminMessage, setAdminMessage] = useState('');
  const [proofImage, setProofImage] = useState('');

  const handleProofChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProofImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAdminUpdate = () => {
    if (newStatus === 'resolved' && !proofImage && !complaint.proofImage) {
      alert("A proof image is strictly required when marking as resolved.");
      return;
    }
    if (onUpdate) {
      onUpdate(complaint.id, newStatus, adminMessage || 'Status updated by Admin.', proofImage);
    }
    setAdminMessage('');
    setProofImage('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-4 relative">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{complaint.title}</h3>
          <p className="text-xs text-slate-500">ID: {complaint.id} • Assigned to: {complaint.userEmail}</p>
        </div>
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wider
          ${complaint.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}
        `}>
          {complaint.status.replace('_', ' ')}
        </span>
      </div>

      <p className="text-sm text-slate-600 mb-4">{complaint.description}</p>
      
      {complaint.location && (
        <p className="text-xs font-mono text-slate-500 mb-4">
          📍 Lat: {complaint.location.lat.toFixed(4)}, Lng: {complaint.location.lng.toFixed(4)}
        </p>
      )}

      {/* Proof / Original Evidence Images */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {complaint.image && (
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Citizen Evidence</span>
            <img src={complaint.image} alt="Evidence" className="mt-1 h-32 w-full object-cover rounded-lg border border-slate-200" />
          </div>
        )}
        {complaint.proofImage && (
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Admin Proof</span>
            <img src={complaint.proofImage} alt="Proof" className="mt-1 h-32 w-full object-cover rounded-lg border border-green-200" />
          </div>
        )}
      </div>

      <StatusTimeline updates={complaint.updates || []} currentStatus={complaint.status} />

      {/* Admin Action Panel */}
      {isAdmin && complaint.status !== 'resolved' && (
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="text-sm font-bold text-slate-800 mb-3">Admin Actions</h4>
          <div className="space-y-3">
            <select 
              value={newStatus} 
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full text-sm border-slate-300 rounded-md shadow-sm"
            >
              <option value="initiated">Initiated</option>
              <option value="under_review">Under Review</option>
              <option value="construction_ongoing">Construction</option>
              <option value="fixing_issues">Fixing Issues</option>
              <option value="resolved">Resolved</option>
            </select>
            
            <input 
              type="text" 
              placeholder="Admin update message..." 
              value={adminMessage}
              onChange={(e) => setAdminMessage(e.target.value)}
              className="w-full text-sm border-slate-300 rounded-md shadow-sm"
            />

            {newStatus === 'resolved' && (
              <div className="text-sm">
                <label className="block text-xs font-medium text-red-600 mb-1">Proof Image (Required for Resolution)</label>
                <input type="file" accept="image/*" onChange={handleProofChange} />
              </div>
            )}

            <Button onClick={handleAdminUpdate} className="w-full">Apply Update</Button>
          </div>
        </div>
      )}
    </div>
  );
}
