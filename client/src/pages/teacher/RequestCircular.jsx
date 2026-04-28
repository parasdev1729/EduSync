import React, { useState } from 'react';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const RequestCircular = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    batch: '',
    fileUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await api.post('/requests', {
        type: 'circular',
        payload: {
          ...formData,
          issuedBy: user?.name
        }
      });
      setSuccess(true);
      setFormData({ title: '', description: '', batch: '', fileUrl: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-3xl mx-auto">
      <div>
        <h1 className="text-4xl font-black text-white tracking-tight">Request Circular</h1>
        <p className="text-slate-400 mt-2 font-medium">Submit a new circular for admin approval to be published to students.</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl">
        {success && (
          <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl flex items-center font-medium">
            <CheckCircle2 className="mr-3" size={20} />
            Request submitted successfully! It will be published once an admin approves it.
          </div>
        )}

        {error && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Title *</label>
            <input 
              type="text" 
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="e.g. Mid-Term Examination Schedule"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Description *</label>
            <textarea 
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
              placeholder="Enter the detailed information..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Target Batch (Optional)</label>
              <input 
                type="text" 
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="e.g. Batch 2024"
              />
              <p className="text-[10px] text-slate-500 font-medium">Leave empty to broadcast to all students.</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Attachment URL (Optional)</label>
              <input 
                type="url" 
                name="fileUrl"
                value={formData.fileUrl}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="https://..."
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center px-8 py-3 rounded-xl font-black text-white bg-blue-600 hover:bg-blue-500 transition-colors disabled:opacity-50 mt-8"
          >
            {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : <Send size={18} className="mr-2" />}
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestCircular;
