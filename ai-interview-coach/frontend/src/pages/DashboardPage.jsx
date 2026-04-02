import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Clock, FileText, CheckCircle, BarChart, Calendar, ChevronRight, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/api/session/history');
        setSessions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const completedSessions = sessions.filter(s => s.status === 'completed');
  const displayName = user?.user?.name || user?.name || 'there';
  const firstName = displayName.split(' ')[0];

  return (
    <div className="min-h-screen bg-[#020617] pt-28 pb-12 px-6 relative">
      {/* Background elements */}
      <div className="absolute top-[10%] left-[5%] w-[40%] h-[30%] bg-brand-900/20 blur-[100px] rounded-full point-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-2">
              <LayoutDashboard size={14} /> Dashboard
            </div>
            <h1 className="text-3xl font-bold font-heading text-white mb-1">
              Welcome back, {firstName} 👋
            </h1>
            <p className="text-slate-500 text-sm">Here's a summary of your interview practice history.</p>
          </div>

          <Link to="/upload">
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 flex items-center gap-2 hover:-translate-y-0.5">
              <Plus size={18} />
              New Interview
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {[
            { label: 'Total Sessions', value: sessions.length, icon: FileText, color: 'text-indigo-400 bg-indigo-500/10' },
            { label: 'Completed', value: completedSessions.length, icon: BarChart, color: 'text-purple-400 bg-purple-500/10' },
            { label: 'In Progress', value: sessions.filter(s => s.status === 'in_progress' || s.status === 'ready').length, icon: Clock, color: 'text-emerald-400 bg-emerald-500/10' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex items-center gap-5">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={22} />
              </div>
              <div>
                <div className="text-3xl font-bold font-heading text-white">{loading ? '—' : value}</div>
                <div className="text-slate-500 text-sm">{label}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-bold font-heading text-white mb-5 flex items-center gap-2">
          <FileText size={18} className="text-slate-500"/>
          Recent Sessions
        </h2>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="divide-y divide-slate-800/60">
            {loading && (
              <div className="p-8 text-center text-slate-500 text-sm">Loading your sessions…</div>
            )}
            {!loading && sessions.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-600">
                  <FileText size={24} />
                </div>
                <p className="text-slate-400 font-medium mb-1">No sessions yet</p>
                <p className="text-slate-600 text-sm mb-6">Upload your CV and start your first mock interview</p>
                <Link to="/upload">
                  <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all">
                    <Plus size={16}/> Start Interview
                  </button>
                </Link>
              </div>
            )}
            {!loading && sessions.map((session, i) => {
              const statusColor = session.status === 'completed' ? 'text-emerald-400 bg-emerald-400/10' :
                                  session.status === 'in_progress' ? 'text-yellow-400 bg-yellow-400/10' :
                                  'text-slate-500 bg-slate-700/30';
              return (
                <motion.div
                  key={session.sessionId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.07 }}
                  className="p-5 hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {session.profileJSON?.name || 'Interview Session'}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-slate-500 text-xs">
                          <Calendar size={12}/> {new Date(session.uploadedAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                        </span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${statusColor}`}>
                          {session.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link to={`/report/${session.sessionId}`}>
                    <button className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-400 text-xs font-medium transition-colors bg-slate-800/60 hover:bg-slate-800 px-3 py-2 rounded-lg">
                      View Report <ChevronRight size={14}/>
                    </button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

