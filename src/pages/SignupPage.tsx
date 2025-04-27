import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LockIcon, MailIcon, UserIcon, AlertCircleIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail, validatePassword, getPasswordStrength } from '../utils/validations';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import Button from '../components/Button';

const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const { signup } = useAuth();
  const navigate = useNavigate();
  
  const passwordStrength = getPasswordStrength(password);
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      errors.password = 'Password must be at least 8 characters with uppercase, lowercase, and numbers';
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      await signup(name, email, password);
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Password strength indicator
  const PasswordStrengthIndicator = () => {
    const { score } = passwordStrength;
    
    // No indicator if no password
    if (!password) return null;
    
    const getColorClass = () => {
      if (score < 3) return 'bg-red-500';
      if (score < 5) return 'bg-yellow-500';
      if (score < 7) return 'bg-green-500';
      return 'bg-emerald-500';
    };
    
    const getStrengthText = () => {
      if (score < 3) return 'Weak';
      if (score < 5) return 'Moderate';
      if (score < 7) return 'Strong';
      return 'Very Strong';
    };
    
    return (
      <div className="mt-1">
        <div className="flex h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
          <motion.div
            className={`${getColorClass()}`}
            initial={{ width: '0%' }}
            animate={{ width: `${(score / 7) * 100}%` }}
            transition={{ duration: 0.3 }}
          ></motion.div>
        </div>
        <p className="text-xs mt-1 text-neutral-600">
          Password strength: <span className="font-medium">{getStrengthText()}</span>
        </p>
      </div>
    );
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
            <h2 className="text-2xl font-bold">Create Your Account</h2>
          </div>
          
          <div className="p-6">
            {error && (
              <motion.div 
                className="mb-4 bg-error bg-opacity-10 text-error px-4 py-3 rounded-md flex items-start"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <AlertCircleIcon size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  icon={<UserIcon size={18} />}
                  fullWidth
                  error={formErrors.name}
                  required
                />
                
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  icon={<MailIcon size={18} />}
                  fullWidth
                  error={formErrors.email}
                  required
                />
                
                <div>
                  <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    icon={<LockIcon size={18} />}
                    fullWidth
                    error={formErrors.password}
                    required
                  />
                  <PasswordStrengthIndicator />
                </div>
                
                <Input
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={<LockIcon size={18} />}
                  fullWidth
                  error={formErrors.confirmPassword}
                  required
                />
                
                <Button 
                  type="submit" 
                  fullWidth 
                  isLoading={loading}
                  className="mt-2"
                >
                  Create Account
                </Button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-neutral-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-800 font-medium">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;