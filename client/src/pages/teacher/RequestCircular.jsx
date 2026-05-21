import React, { useState } from 'react';
import { Send, Loader2, CheckCircle2, Upload, FileText, X } from 'lucide-react';
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
  const [pdfFile, setPdfFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setPdfFile(file);
      } else {
        setError("Only PDF files are allowed!");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setPdfFile(file);
      } else {
        setError("Only PDF files are allowed!");
      }
    }
  };

  const removeFile = () => {
    setPdfFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const submitData = new FormData();
      submitData.append('type', 'circular');
      submitData.append('payload', JSON.stringify({
        ...formData,
        issuedBy: user?.name
      }));
      
      if (pdfFile) {
        submitData.append('pdf', pdfFile);
      }

      await api.post('/requests', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess(true);
      setFormData({ title: '', description: '', batch: '', fileUrl: '' });
      setPdfFile(null);
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
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Attachment Link (Optional)</label>
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

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Upload PDF Document (Optional)</label>
            <div 
              className={`relative border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                dragActive 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : pdfFile 
                    ? 'border-emerald-500/50 bg-emerald-500/5' 
                    : 'border-white/10 bg-black/20 hover:border-white/20 hover:bg-black/30'
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <input 
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              
              {pdfFile ? (
                <div className="flex flex-col items-center space-y-3 z-20">
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                    <FileText size={32} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white max-w-xs truncate">{pdfFile.name}</p>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                      {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="flex items-center text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <X size={14} className="mr-1" />
                    Remove File
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-3 pointer-events-none">
                  <div className={`p-3 rounded-xl transition-colors ${
                    dragActive ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-slate-400'
                  }`}>
                    <Upload size={28} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Drag & drop your PDF here or click to browse</p>
                    <p className="text-[10px] text-slate-500 font-semibold mt-1">
                      Max file size: 10MB (PDF files only)
                    </p>
                  </div>
                </div>
              )}
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
