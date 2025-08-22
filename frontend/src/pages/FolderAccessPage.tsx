import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderLockIcon, KeyIcon, ArrowLeftIcon } from 'lucide-react';
import { getFolder, verifyFolderPassword } from '../utils/storage';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import Button from '../components/Button';

const FolderAccessPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [folder, setFolder] = useState<{ id: string; name: string } | null>(null);
  
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (folderId) {
      const folderData = getFolder(folderId);
      if (folderData) {
        setFolder({ id: folderData.id, name: folderData.name });
      } else {
        navigate('/home');
      }
    }
  }, [folderId, navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim() || !folderId) {
      setError('Please enter the folder password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Verify password
    const isCorrect = verifyFolderPassword(folderId, password);
    
    if (isCorrect) {
      navigate(`/folder/${folderId}`);
    } else {
      setError('Incorrect password');
      setLoading(false);
    }
  };
  
  if (!folder) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-primary-500"></div>
          <div className="mt-4 text-lg font-medium text-neutral-700">Loading...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-primary-800 p-6 text-white">
            <button
              onClick={() => navigate('/home')}
              className="mb-4 flex items-center text-neutral-200 hover:text-white transition-colors"
            >
              <ArrowLeftIcon size={16} className="mr-1" />
              <span>Back to Home</span>
            </button>
            
            <div className="flex items-center justify-center flex-col">
              <FolderLockIcon size={48} className="mb-3 text-accent-500" />
              <h2 className="text-2xl font-bold">{folder.name}</h2>
              <p className="text-neutral-200 mt-1">
                This folder is password protected
              </p>
            </div>
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
                  label="Enter Folder Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={<KeyIcon size={18} />}
                  fullWidth
                  autoFocus
                />
                
                <Button 
                  type="submit" 
                  fullWidth 
                  isLoading={loading}
                  className="mt-2"
                >
                  Unlock Folder
                </Button>
              </div>
            </form>
            
            <div className="mt-6">
              <p className="text-sm text-neutral-500">
                <strong>Note:</strong> You must enter the correct password to access the contents of this folder. The password was set when you created the folder.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FolderAccessPage;