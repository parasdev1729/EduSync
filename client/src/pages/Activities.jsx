import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Loader2, Calendar, MapPin, ExternalLink, Activity as ActivityIcon } from 'lucide-react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await api.get('/activities');
        setActivities(response.data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

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
        <h1 className="text-2xl font-bold text-slate-100">University Activities</h1>
        <p className="text-slate-400">Discover upcoming events, workshops, and seminars.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activities.length > 0 ? activities.map((activity) => (
          <div key={activity._id} className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden flex flex-col hover:border-blue-500/50 transition-colors">
            <div className="p-6 flex-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-900/30 rounded-lg text-blue-400">
                  <ActivityIcon size={20} />
                </div>
                <span className="px-3 py-1 bg-slate-800 text-blue-400 text-xs font-bold rounded-full border border-slate-700">
                  Upcoming
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-2">{activity.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{activity.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm text-slate-500 font-medium">
                  <Calendar size={16} className="mr-3 text-slate-600" />
                  {new Date(activity.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex items-center text-sm text-slate-500 font-medium">
                  <MapPin size={16} className="mr-3 text-slate-600" />
                  {activity.venue}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-800/50 border-t border-slate-800">
              <a 
                href={activity.registrationLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-bold text-sm"
              >
                Register Now
                <ExternalLink size={16} className="ml-2" />
              </a>
            </div>
          </div>
        )) : (
          <div className="md:col-span-2 text-center py-20 bg-slate-900 rounded-xl border border-slate-800">
            <ActivityIcon size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-500 font-medium">No upcoming activities at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;
