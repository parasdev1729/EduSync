import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area
} from 'recharts';
import { 
  Users, 
  FileText, 
  Bell, 
  TrendingUp, 
  Loader2, 
  Zap,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [session, setSession] = useState('JanJun2026');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    attendance: 0,
    latestMark: { subject: '', score: 0, total: 100 },
    latestCircular: { title: '', _id: '' },
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const attendanceRes = await api.get(`/attendance?session=${session}`);
        if (attendanceRes.data.length > 0) {
          const totalAttended = attendanceRes.data.reduce((acc, curr) => acc + curr.attended, 0);
          const totalClasses = attendanceRes.data.reduce((acc, curr) => acc + curr.totalClasses, 0);
          setStats(prev => ({ ...prev, attendance: ((totalAttended / totalClasses) * 100).toFixed(1) }));
        }

        const marksRes = await api.get(`/marks?session=${session}&examType=MST2`);
        let marksData = marksRes.data.length > 0 ? marksRes.data : (await api.get(`/marks?session=${session}&examType=MST1`)).data;
        
        if (marksData.length > 0) {
          setChartData(marksData.map(m => ({ subject: m.subject.split(' ')[0], score: m.marksObtained })));
          setStats(prev => ({ ...prev, latestMark: { subject: marksData[0].subject, score: marksData[0].marksObtained, total: marksData[0].maxMarks } }));
        }

        const circularsRes = await api.get('/circulars');
        if (circularsRes.data.length > 0) {
          setStats(prev => ({ ...prev, latestCircular: { title: circularsRes.data[0].title, _id: circularsRes.data[0]._id } }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [session]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 size={48} className="animate-spin text-blue-500" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-400 mt-2 font-medium">
            Welcome back, <span 
              className="text-blue-400 cursor-pointer hover:underline"
              onClick={() => navigate('/profile')}
            >@{user?.name.split(' ')[0]}</span>. Here is your academic overview.
          </p>
        </div>
        <div className="flex items-center bg-white/5 border border-white/10 p-1 rounded-xl">
          {['JulDec2024', 'JanJun2025', 'JulDec2025', 'JanJun2026'].map((s) => (
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            label: 'Attendance', 
            val: `${stats.attendance}%`, 
            icon: Users, 
            col: 'text-emerald-400', 
            bg: 'bg-emerald-500/10',
            onClick: () => navigate('/attendance', { state: { session } })
          },
          { 
            label: 'Latest Score', 
            val: `${stats.latestMark.score}/${stats.latestMark.total}`, 
            icon: Zap, 
            col: 'text-blue-400', 
            bg: 'bg-blue-500/10',
            sub: stats.latestMark.subject,
            onClick: () => navigate('/marks', { state: { session } })
          },
          { 
            label: 'Latest Notice', 
            val: stats.latestCircular.title, 
            icon: Bell, 
            col: 'text-amber-400', 
            bg: 'bg-amber-500/10', 
            sub: 'Click to view notice',
            onClick: () => stats.latestCircular._id && navigate('/circulars', { state: { highlightId: stats.latestCircular._id } })
          },
        ].map((item, i) => (
          <div 
            key={i} 
            onClick={item.onClick}
            className="relative group overflow-hidden bg-slate-900/50 border border-white/5 p-6 rounded-3xl backdrop-blur-sm hover:border-white/10 transition-all cursor-pointer"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${item.bg} blur-3xl -mr-8 -mt-8 rounded-full`}></div>
            <div className="relative z-10">
              <div className={`p-3 w-fit rounded-2xl ${item.bg} ${item.col} mb-4 group-hover:scale-110 transition-transform`}>
                <item.icon size={24} />
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{item.label}</p>
              <h3 className="text-2xl font-black text-white mt-1 truncate">{item.val}</h3>
              {item.sub && <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase truncate">{item.sub}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/50 border border-white/5 p-8 rounded-3xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white flex items-center">
              <TrendingUp size={20} className="mr-3 text-blue-500" />
              Performance Analytics
            </h2>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
              Source: MST-2 Results
            </span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} domain={[0, 50]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                  itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-2xl shadow-blue-900/20 flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-3xl -mr-10 -mt-10 rounded-full"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-white leading-tight">Quick<br/>Actions</h2>
            <p className="text-blue-100 text-sm mt-2 font-medium opacity-80">Access frequently used features</p>
          </div>
          
          <div className="relative z-10 space-y-3 mt-8">
            {[
              { n: 'Check Marks', p: '/marks' },
              { n: 'Check Attendance', p: '/attendance' },
              { n: 'View Profile', p: '/profile' }
            ].map((link, idx) => (
              <button 
                key={idx} 
                onClick={() => navigate(link.p)}
                className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center justify-between transition-all group cursor-pointer"
              >
                <span className="text-white font-bold text-sm">{link.n}</span>
                <ChevronRight size={18} className="text-white/50 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
