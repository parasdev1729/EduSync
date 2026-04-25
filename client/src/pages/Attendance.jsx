import React, { useState, useEffect } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Cell } from 'recharts';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import { Loader2, Calendar, ClipboardCheck, Info } from 'lucide-react';

const Attendance = () => {
  const location = useLocation();
  const [session, setSession] = useState(location.state?.session || 'JanJun2026');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const sessions = ["JulDec2024", "JanJun2025", "JulDec2025", "JanJun2026"];

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/attendance?session=${session}`);
        setData(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [session]);

  const totalAttended = data.reduce((acc, curr) => acc + curr.attended, 0);
  const totalClasses = data.reduce((acc, curr) => acc + curr.totalClasses, 0);
  const overall = totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0;

  const chartData = [{ name: 'Overall', value: Math.round(overall) }];

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 size={48} className="animate-spin text-blue-500" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Attendance</h1>
          <p className="text-slate-400 mt-2 font-medium">Detailed tracking of your subject-wise presence.</p>
        </div>
        <div className="flex items-center bg-white/5 border border-white/10 p-1 rounded-xl">
          {sessions.map((s) => (
            <button
              key={s}
              onClick={() => setSession(s)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                session === s ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-200'
              }`}
            >
              {s.slice(0, 3)} '{s.slice(-2)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="relative group overflow-hidden bg-slate-900/50 border border-white/5 p-8 rounded-3xl backdrop-blur-sm shadow-2xl flex flex-col items-center justify-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-12 -mt-12 rounded-full"></div>
          
          <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-8">Overall Presence</h2>
          
          <div className="relative w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="75%" outerRadius="100%" barSize={20} data={chartData} startAngle={90} endAngle={450}>
                <RadialBar 
                  minAngle={15} 
                  background={{ fill: '#1e293b' }} 
                  clockWise 
                  dataKey="value" 
                  cornerRadius={10}
                >
                  <Cell fill={overall >= 75 ? '#10b981' : '#f43f5e'} shadow="0 0 20px rgba(16, 185, 129, 0.3)" />
                </RadialBar>
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-5xl font-black ${overall >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {Math.round(overall)}%
              </span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Average</span>
            </div>
          </div>
          
          <div className={`mt-8 flex items-center px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider border ${
            overall >= 75 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            <Info size={12} className="mr-2" />
            {overall >= 75 ? 'Criteria Met' : 'Criteria Not Met'}
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm">
          <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center">
              <ClipboardCheck size={20} className="mr-3 text-blue-500" />
              Course-wise Log
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <th className="px-8 py-5">Course</th>
                  <th className="px-4 py-5 text-center">Total</th>
                  <th className="px-4 py-5 text-center">Present</th>
                  <th className="px-8 py-5 text-right">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.length > 0 ? data.map((item, idx) => {
                  const percent = (item.attended / item.totalClasses) * 100;
                  return (
                    <tr key={idx} className="group hover:bg-white/5 transition-all">
                      <td className="px-8 py-5">
                        <span className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors">{item.subject}</span>
                      </td>
                      <td className="px-4 py-5 text-center text-slate-400 text-sm font-bold">{item.totalClasses}</td>
                      <td className="px-4 py-5 text-center text-slate-200 text-sm font-bold">{item.attended}</td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end space-x-3">
                          <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${percent >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm font-black w-10 ${percent >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {Math.round(percent)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan="4" className="px-8 py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">No records found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
