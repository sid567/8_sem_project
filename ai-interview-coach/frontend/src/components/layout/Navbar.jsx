import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogIn, Mic2, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';

  if (isAuthPage) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-all duration-300">
            <Mic2 size={22} className="group-hover:scale-110 transition-transform duration-300" />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight text-white group-hover:text-brand-400 transition-colors duration-300">
            Intervue<span className="text-brand-400">.ai</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-brand-300 hover:text-white transition-colors duration-200">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 flex items-center gap-2">
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 flex items-center gap-2">
                <LogIn size={16} />
                Sign In
              </Link>
              <Link to="/signup">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white hover:bg-slate-100 text-slate-900 px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center gap-2"
                >
                  <User size={16} />
                  Get Started
                </motion.div>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
