import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { MapPin, Image as ImageIcon, X } from 'lucide-react';
import { complaintService } from '../services/complaintService';
import { MapPicker } from '../components/local/MapPicker';

export function SubmitComplaint() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: null,
    description: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      if (formData.location) {
        data.append('location', JSON.stringify(formData.location));
      }
      data.append('description', formData.description);
      if (file) {
        data.append('image', file);
      }

      await complaintService.submitComplaint(data);
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to submit complaint', err);
      setError(err.response?.data?.message || err.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview('');
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
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
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
              <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">Pinpoint Location on Map *</label>
              <div className="h-[300px] w-[100%] rounded-lg border border-slate-300 overflow-hidden relative z-0">
                <MapPicker onLocationSelect={(loc) => setFormData(prev => ({ ...prev, location: loc }))} />
              </div>
              {!formData.location && (
                <p className="text-xs text-amber-600 mt-1">Please drop a pin on the map to record exact coordinates.</p>
              )}
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
              
              {!preview ? (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:bg-slate-50 transition-colors cursor-pointer relative">
                  <div className="space-y-1 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-600 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                      </label>
                      <p className="pl-1">or click to browse</p>
                    </div>
                    <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              ) : (
                <div className="relative mt-2 inline-block">
                  <img src={preview} alt="Evidence preview" className="h-40 w-auto rounded-lg object-cover border border-slate-200 shadow-sm" />
                  <button type="button" onClick={clearFile} className="absolute -top-3 -right-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1.5 transition-colors shadow-sm">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
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
