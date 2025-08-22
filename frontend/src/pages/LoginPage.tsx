import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LockIcon, MailIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import Button from '../components/Button';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      await login(email, password);
      navigate('/home');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-primary-800 px-6 py-4 text-white text-center">
            <LockIcon className="mx-auto mb-2" size={28} />
            <h2 className="text-2xl font-bold">Log In to Evidence Vault</h2>
          </div>
          
          <div className="p-6">
            {error && (
              <motion.div 
                className="mb-4 bg-error bg-opacity-10 text-error px-4 py-3 rounded-md"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                {error}
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  icon={<MailIcon size={18} />}
                  fullWidth
                  required
                />
                
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={<LockIcon size={18} />}
                  fullWidth
                  required
                />
                
                <Button 
                  type="submit" 
                  fullWidth 
                  isLoading={loading}
                  className="mt-2"
                >
                  Log In
                </Button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-neutral-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary-600 hover:text-primary-800 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;