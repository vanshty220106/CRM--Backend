import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { MapPin, Image as ImageIcon } from 'lucide-react';
import { complaintService } from '../services/complaintService';

export function SubmitComplaint() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    description: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await complaintService.submitComplaint(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to submit complaint', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Submit New Complaint</h1>
        <p className="mt-1 text-sm text-slate-500">Report a public issue directly to the concerned authority.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Issue Title</label>
              <Input id="title" value={formData.title} onChange={handleChange} placeholder="e.g., Pothole on main street" required />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select 
                id="category" 
                value={formData.category}
                onChange={handleChange}
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              >
                <option value="" disabled>Select a category</option>
                <option value="Roads & Infrastructure">Roads & Infrastructure</option>
                <option value="Utilities">Utilities (Water, Electricity)</option>
                <option value="Environment">Environment & Sanitation</option>
                <option value="Noise">Noise Disturbance</option>
                <option value="Vandalism">Vandalism & Security</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">Location Address</label>
              <Input id="location" value={formData.location} onChange={handleChange} placeholder="Full address or landmark" icon={<MapPin className="h-4 w-4" />} required />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Detailed Description</label>
              <textarea 
                id="description" 
                value={formData.description}
                onChange={handleChange}
                rows={4} 
                className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Describe the issue in detail..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Evidence (Images)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="space-y-1 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
                  <div className="flex text-sm text-slate-600 justify-center">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
            <Button type="submit" isLoading={loading}>
              Submit Request
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
