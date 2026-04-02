import { Link } from 'react-router-dom';
import { Mic2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-800/60 bg-slate-950/80 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2.5 w-fit group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Mic2 size={18} />
            </div>
            <span className="font-heading font-bold text-lg text-white">
              Intervue<span className="text-indigo-400">.ai</span>
            </span>
          </Link>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
            Your personal AI mock interviewer. Upload a CV, practice real Q&A, get instant performance feedback — all before the real thing.
          </p>
          <p className="text-slate-600 text-xs mt-2">© {new Date().getFullYear()} Intervue.ai · Final Year Project</p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Product</p>
          <Link to="/upload" className="text-slate-500 hover:text-white text-sm transition-colors">Start Interview</Link>
          <Link to="/dashboard" className="text-slate-500 hover:text-white text-sm transition-colors">Dashboard</Link>
          <Link to="/signup" className="text-slate-500 hover:text-white text-sm transition-colors">Create Account</Link>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Account</p>
          <Link to="/signin" className="text-slate-500 hover:text-white text-sm transition-colors">Sign In</Link>
          <Link to="/signup" className="text-slate-500 hover:text-white text-sm transition-colors">Sign Up</Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800/40 px-6 py-4">
        <p className="text-center text-slate-700 text-xs">
          Built with React, Node.js, MongoDB & Groq LLM · Designed for academic demonstration
        </p>
      </div>
    </footer>
  );
}
