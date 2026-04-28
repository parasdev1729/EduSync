import React, { useState, useEffect } from 'react';
import { Loader2, ClipboardList, CheckCircle, XCircle } from 'lucide-react';
import api from '../../api/axios';

const ApprovalRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/requests?status=pending');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, status) => {
    setProcessingId(id);
    try {
      await api.put(`/requests/${id}/status`, { status });
      // Remove from list after processing
      setRequests(requests.filter(req => req._id !== id));
    } catch (error) {
      console.error(`Error updating request ${id}:`, error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black text-white tracking-tight">Approval Requests</h1>
        <p className="text-slate-400 mt-2 font-medium">Review and process teacher requests.</p>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center">
            <ClipboardList size={20} className="mr-3 text-amber-500" />
            Pending Queue
          </h2>
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest bg-slate-900/50 px-3 py-1 rounded-full">
            {requests.length} Pending
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        ) : requests.length > 0 ? (
          <div className="divide-y divide-white/5">
            {requests.map(req => (
              <div key={req._id} className="p-6 hover:bg-white/[0.02] transition-colors">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md">
                        {req.type.replace('_', ' ')}
                      </span>
                      <span className="text-sm font-bold text-slate-300">
                        Requested by: <span className="text-white">{req.requester?.name || 'Unknown'}</span>
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                      {req.type === 'circular' ? (
                        <>
                          <h4 className="font-bold text-white mb-1">{req.payload.title}</h4>
                          <p className="text-sm text-slate-400">{req.payload.description}</p>
                          {req.payload.batch && (
                            <p className="text-xs text-blue-400 mt-2 font-medium">Target: {req.payload.batch}</p>
                          )}
                        </>
                      ) : (
                        <pre className="text-xs text-slate-400 overflow-x-auto">
                          {JSON.stringify(req.payload, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 md:self-end">
                    <button 
                      onClick={() => handleAction(req._id, 'rejected')}
                      disabled={processingId === req._id}
                      className="flex items-center px-4 py-2 rounded-xl text-sm font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors disabled:opacity-50"
                    >
                      {processingId === req._id ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} className="mr-2" />}
                      Reject
                    </button>
                    <button 
                      onClick={() => handleAction(req._id, 'approved')}
                      disabled={processingId === req._id}
                      className="flex items-center px-4 py-2 rounded-xl text-sm font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                    >
                      {processingId === req._id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} className="mr-2" />}
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">
            No pending requests
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalRequests;
