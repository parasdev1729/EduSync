import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import { Loader2, Bell, Calendar, User, Download, ExternalLink } from 'lucide-react';

const Circulars = () => {
  const [circulars, setCirculars] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const circularRefs = useRef({});

  useEffect(() => {
    const fetchCirculars = async () => {
      try {
        const response = await api.get('/circulars');
        setCirculars(response.data);
      } catch (error) {
        console.error('Error fetching circulars:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCirculars();
  }, []);

  useEffect(() => {
    if (!loading && location.state?.highlightId && circularRefs.current[location.state.highlightId]) {
      circularRefs.current[location.state.highlightId].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [loading, location.state]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 size={48} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-slate-950 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">University Circulars</h1>
        <p className="text-slate-400">Stay updated with the latest official notices and announcements.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {circulars.length > 0 ? circulars.map((circular) => (
          <div 
            key={circular._id} 
            ref={el => circularRefs.current[circular._id] = el}
            className={`p-6 rounded-xl shadow-sm border transition-all group ${
              location.state?.highlightId === circular._id 
              ? 'bg-blue-600/10 border-blue-500 shadow-blue-500/20' 
              : 'bg-slate-900 border-slate-800 hover:border-blue-500/50'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg mt-1 ${
                  location.state?.highlightId === circular._id ? 'bg-blue-500 text-white' : 'bg-blue-900/30 text-blue-400'
                }`}>
                  <Bell size={24} />
                </div>
                <div>
                  <h3 className={`text-lg font-bold transition-colors ${
                    location.state?.highlightId === circular._id ? 'text-blue-400' : 'text-slate-100 group-hover:text-blue-400'
                  }`}>{circular.title}</h3>
                  <p className="text-slate-400 text-sm mt-1 leading-relaxed">{circular.description}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-medium text-slate-500">
                    <span className="flex items-center">
                      <User size={14} className="mr-1" />
                      {circular.issuedBy}
                    </span>
                    <span className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {new Date(circular.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  if (circular.fileUrl) {
                    window.open(circular.fileUrl, '_blank');
                  } else {
                    alert('No document attached to this circular.');
                  }
                }}
                className={`flex items-center justify-center px-4 py-2 rounded-lg transition-all text-sm font-semibold border cursor-pointer whitespace-nowrap ${
                  circular.fileUrl 
                  ? 'bg-slate-800 text-slate-200 hover:bg-blue-600 hover:text-white border-slate-700' 
                  : 'bg-slate-900/50 text-slate-600 border-slate-800 cursor-not-allowed'
                }`}
              >
                <Download size={16} className="mr-2" />
                {circular.fileUrl ? 'View Document' : 'No Document'}
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-slate-900 rounded-xl border border-slate-800">
            <Bell size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-500 font-medium">No circulars available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Circulars;
