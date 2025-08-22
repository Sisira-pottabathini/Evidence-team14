import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LockIcon, LogOutIcon, ShieldIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav 
      className="bg-neutral-800 text-white py-4 px-6 shadow-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
          <ShieldIcon className="text-secondary-500" size={24} />
          <span>Evidence Vault</span>
        </Link>
        
        <div className="space-x-4 flex items-center">
          {isAuthenticated ? (
            <>
              <Link to="/home" className="text-neutral-200 hover:text-white transition-colors">
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-neutral-700 hover:bg-neutral-600 px-3 py-2 rounded-md transition-colors"
              >
                <LogOutIcon size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-neutral-200 hover:text-white transition-colors">
                Login
              </Link>
              <Link 
                to="/signup" 
                className="flex items-center space-x-1 bg-secondary-600 hover:bg-secondary-500 px-3 py-2 rounded-md transition-colors"
              >
                <LockIcon size={16} />
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;