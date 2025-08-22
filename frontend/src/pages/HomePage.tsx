import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderIcon, PlusIcon, LockIcon, FolderLockIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../contexts/AuthContext';
import { getUserFolders, saveFolder, Folder } from '../utils/storage';
import { validateFolderPassword } from '../utils/validations';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';

const HomePage: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderPassword, setNewFolderPassword] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Load user folders on component mount
  useEffect(() => {
    if (currentUser) {
      const userFolders = getUserFolders(currentUser.id);
      setFolders(userFolders);
    }
  }, [currentUser]);
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!newFolderName.trim()) {
      errors.name = 'Folder name is required';
    }
    
    if (!newFolderPassword) {
      errors.password = 'Password is required';
    } else if (!validateFolderPassword(newFolderPassword)) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleCreateFolder = () => {
    if (!validateForm() || !currentUser) {
      return;
    }
    
    setLoading(true);
    
    // Create new folder
    const newFolder: Folder = {
      id: uuidv4(),
      name: newFolderName.trim(),
      password: newFolderPassword,
      userId: currentUser.id,
      createdAt: Date.now(),
    };
    
    // Save folder to localStorage
    saveFolder(newFolder);
    
    // Update state
    setFolders([...folders, newFolder]);
    
    // Reset form
    setNewFolderName('');
    setNewFolderPassword('');
    setIsCreateModalOpen(false);
    setLoading(false);
  };
  
  const handleFolderClick = (folderId: string) => {
    navigate(`/folder-access/${folderId}`);
  };
  
  // Animation variants for folder cards
  const folderVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };
  
  return (
    <div className="min-h-screen bg-neutral-100">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-neutral-900">Evidence Folders</h1>
            <p className="text-neutral-600 mt-1">
              Create and manage your secure evidence collections
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 md:mt-0"
          >
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              variant="secondary"
              icon={<PlusIcon size={18} />}
            >
              Create New Folder
            </Button>
          </motion.div>
        </div>
        
        {folders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-8 text-center"
          >
            <FolderIcon className="mx-auto text-neutral-400 mb-4" size={64} />
            <h2 className="text-xl font-medium text-neutral-800 mb-2">No Folders Yet</h2>
            <p className="text-neutral-600 mb-6">
              Create your first evidence folder to start organizing your secure evidence.
            </p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              variant="secondary"
              icon={<PlusIcon size={18} />}
            >
              Create New Folder
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {folders.map((folder, index) => (
                <motion.div
                  key={folder.id}
                  custom={index}
                  variants={folderVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                  onClick={() => handleFolderClick(folder.id)}
                >
                  <div className="p-6">
                    <div className="flex items-start">
                      <div className="p-3 rounded-full bg-primary-100 text-primary-600 mr-4">
                        <FolderLockIcon size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                          {folder.name}
                        </h3>
                        <p className="text-sm text-neutral-500">
                          Created on {new Date(folder.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-neutral-50 px-6 py-3 border-t border-neutral-200 flex items-center">
                    <LockIcon size={16} className="text-accent-500 mr-2" />
                    <span className="text-sm text-neutral-600">Password protected</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
      
      {/* Create Folder Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Evidence Folder"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Folder Name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Investigation #12345"
            fullWidth
            error={formErrors.name}
          />
          
          <Input
            label="Folder Password"
            type="password"
            value={newFolderPassword}
            onChange={(e) => setNewFolderPassword(e.target.value)}
            placeholder="Enter secure password"
            fullWidth
            error={formErrors.password}
          />
          
          <p className="text-sm text-neutral-500 mt-1">
            <strong>Important:</strong> You'll need this password every time you access this folder.
            Make sure to remember it as there's no way to recover it.
          </p>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolder}
              variant="secondary"
              isLoading={loading}
            >
              Create Folder
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HomePage;