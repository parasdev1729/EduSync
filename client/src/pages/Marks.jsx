import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import { Loader2, Calendar, Filter, GraduationCap, Award } from 'lucide-react';

const Marks = () => {
  const location = useLocation();
  const [session, setSession] = useState(location.state?.session || 'JanJun2026');
  const [examType, setExamType] = useState('EndSem');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sgpa, setSgpa] = useState(0);
  const [cgpa, setCgpa] = useState(0);

  const sessions = ["JulDec2024", "JanJun2025", "JulDec2025", "JanJun2026"];

  const getGradeInfo = (percentage) => {
    if (percentage >= 80) return { grade: 'O', points: 10, col: 'text-emerald-400', bg: 'bg-emerald-500/10' };
    if (percentage >= 70) return { grade: 'A+', points: 9, col: 'text-blue-400', bg: 'bg-blue-500/10' };
    if (percentage >= 60) return { grade: 'A', points: 8, col: 'text-indigo-400', bg: 'bg-indigo-500/10' };
    if (percentage >= 50) return { grade: 'B+', points: 7, col: 'text-amber-400', bg: 'bg-amber-500/10' };
    if (percentage >= 40) return { grade: 'B', points: 6, col: 'text-orange-400', bg: 'bg-orange-500/10' };
    return { grade: 'F', points: 0, col: 'text-rose-400', bg: 'bg-rose-500/10' };
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/marks?session=${session}&examType=${examType}`);
        setData(response.data);

        const allRes = await api.get(`/marks?examType=EndSem`);
        const allEndSemMarks = allRes.data;

        if (examType === 'EndSem') {
          const sMarks = allEndSemMarks.filter(m => m.session === session);
          if (sMarks.length > 0) {
            let twp = 0, tc = 0;
            sMarks.forEach(m => {
              const { points } = getGradeInfo((m.marksObtained / m.maxMarks) * 100);
              twp += (points * m.credits);
              tc += m.credits;
            });
            setSgpa((twp / tc).toFixed(2));
          }
        } else {
          setSgpa('N/A');
        }

        const sessionWise = sessions.map(s => {
          const sMarks = allEndSemMarks.filter(m => m.session === s);
          if (sMarks.length === 0) return null;
          let twp = 0, tc = 0;
          sMarks.forEach(m => {
            const { points } = getGradeInfo((m.marksObtained / m.maxMarks) * 100);
            twp += (points * m.credits);
            tc += m.credits;
          });
          return { twp, tc };
        }).filter(v => v !== null);

        if (sessionWise.length > 0) {
          const totalWP = sessionWise.reduce((acc, curr) => acc + curr.twp, 0);
          const totalC = sessionWise.reduce((acc, curr) => acc + curr.tc, 0);
          setCgpa((totalWP / totalC).toFixed(2));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [session, examType]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 size={48} className="animate-spin text-blue-500" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Academic Results</h1>
          <p className="text-slate-400 mt-2 font-medium">Session-wise performance and cumulative grading.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={session}
            onChange={(e) => setSession(e.target.value)}
            className="bg-slate-900 border border-white/10 text-white text-xs font-bold rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          >
            {sessions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select 
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
            className="bg-slate-900 border border-white/10 text-white text-xs font-bold rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          >
            <option value="MST1">MST 1</option>
            <option value="MST2">MST 2</option>
            <option value="EndSem">End Sem</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative group overflow-hidden bg-slate-900/50 border border-white/5 p-8 rounded-3xl backdrop-blur-sm shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-12 -mt-12 rounded-full transition-all group-hover:bg-blue-500/20"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Session SGPA</p>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-6xl font-black text-white">{sgpa}</h3>
                <span className="text-blue-500 text-xl font-bold">/ 10.0</span>
              </div>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400">
              <GraduationCap size={32} />
            </div>
          </div>
        </div>

        <div className="relative group overflow-hidden bg-slate-900/50 border border-white/5 p-8 rounded-3xl backdrop-blur-sm shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mr-12 -mt-12 rounded-full transition-all group-hover:bg-indigo-500/20"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Cumulative CGPA</p>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-6xl font-black text-white">{cgpa}</h3>
                <span className="text-indigo-500 text-xl font-bold">/ 10.0</span>
              </div>
            </div>
            <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400">
              <Award size={32} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm">
          <div className="p-6 border-b border-white/5 bg-white/5">
            <h2 className="text-lg font-bold text-white">Subject Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <th className="px-8 py-5">Subject</th>
                  <th className="px-4 py-5 text-center">Credits</th>
                  <th className="px-4 py-5 text-center">Score</th>
                  <th className="px-4 py-5 text-center">Grade</th>
                  <th className="px-8 py-5 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.length > 0 ? data.map((item, idx) => {
                  const percentage = (item.marksObtained / item.maxMarks) * 100;
                  const grade = getGradeInfo(percentage);
                  return (
                    <tr key={idx} className="group hover:bg-white/5 transition-all">
                      <td className="px-8 py-5">
                        <span className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors">{item.subject}</span>
                      </td>
                      <td className="px-4 py-5 text-center text-slate-400 text-sm font-bold">{item.credits}</td>
                      <td className="px-4 py-5 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-bold text-slate-200">{item.marksObtained}/{item.maxMarks}</span>
                          <div className="w-12 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                            <div className={`h-full ${grade.col.replace('text', 'bg')}`} style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5 text-center">
                        <span className={`px-3 py-1 rounded-lg text-xs font-black border border-white/5 ${grade.bg} ${grade.col}`}>
                          {grade.grade}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right text-sm font-black text-slate-100">{grade.points}</td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">No records found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marks;
