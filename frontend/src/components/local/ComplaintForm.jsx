import React, { useState } from 'react';
import { useLocalComplaints } from '../../context/LocalComplaintsContext';
import { useAuth } from '../../context/AuthContext';
import { MapPicker } from './MapPicker';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function ComplaintForm({ onSuccess }) {
  const { addComplaint } = useLocalComplaints();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [location, setLocation] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !location) {
      alert("Please fill all required fields and pin a location on the map.");
      return;
    }

    addComplaint({
      userEmail: user?.email || 'anonymous',
      title,
      description,
      image,
      location,
      feedback: null,
      proofImage: null
    });

    setTitle('');
    setDescription('');
    setImage('');
    setLocation(null);

    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-bl-lg">
        Local Simulator
      </div>
      
      <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Submit Local Complaint</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="e.g., Broken Streetlight" 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="flex w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Evidence Image (Optional)</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange}
            className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {image && (
            <img src={image} alt="Preview" className="mt-3 h-32 w-auto object-cover rounded-lg border border-slate-200 shadow-sm" />
          )}
        </div>

        <div>
          <MapPicker onLocationSelect={(loc) => setLocation(loc)} />
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <Button type="submit" className="bg-amber-600 hover:bg-amber-700">Submit Local Simulation</Button>
      </div>
    </form>
  );
}
