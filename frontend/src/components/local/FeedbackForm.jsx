import React, { useState } from 'react';
import { useLocalComplaints } from '../../context/LocalComplaintsContext';
import { Button } from '../ui/Button';

export function FeedbackForm({ complaintId, existingFeedback }) {
  const [message, setMessage] = useState('');
  const { addFeedback } = useLocalComplaints();
  
  if (existingFeedback) {
    return (
      <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-lg text-sm border border-green-100">
        <strong>Your Feedback:</strong> "{existingFeedback.message}"<br />
        <span className="text-xs opacity-75">Submitted: {new Date(existingFeedback.submittedAt).toLocaleDateString()}</span>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      addFeedback(complaintId, message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-slate-100">
      <label className="block text-sm font-medium text-slate-700 mb-1">Leave Feedback (Optional)</label>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="How was the resolution?"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button size="sm" type="submit" className="whitespace-nowrap">Submit</Button>
      </div>
    </form>
  );
}
