import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderIcon, 
  PlusIcon, 
  ArrowLeftIcon, 
  FileIcon, 
  FileTextIcon,
  ImageIcon,
  VideoIcon,
  MusicIcon,
  KeyIcon
} from 'lucide-react';
import { getFolder, getFolderEvidences, Evidence } from '../utils/storage';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';

interface EvidenceCardProps {
  evidence: Evidence;
}

const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence }) => {
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  const handleUnlock = () => {
    if (secretKey === evidence.secretKey) {
      setIsUnlocked(true);
      setIsUnlockModalOpen(false);
      setError('');
    } else {
      setError('Incorrect secret key');
    }
  };
  
  // Determine the item's primary file type for the icon
  const getPrimaryIcon = () => {
    if (evidence.images.length > 0) {
      return <ImageIcon size={20} className="text-blue-500" />;
    } else if (evidence.videos.length > 0) {
      return <VideoIcon size={20} className="text-red-500" />;
    } else if (evidence.audios.length > 0) {
      return <MusicIcon size={20} className="text-purple-500" />;
    } else {
      return <FileTextIcon size={20} className="text-neutral-500" />;
    }
  };
  
  // Get file counts
  const fileCounts = [
    evidence.images.length > 0 && `${evidence.images.length} ${evidence.images.length === 1 ? 'image' : 'images'}`,
    evidence.videos.length > 0 && `${evidence.videos.length} ${evidence.videos.length === 1 ? 'video' : 'videos'}`,
    evidence.audios.length > 0 && `${evidence.audios.length} ${evidence.audios.length === 1 ? 'audio' : 'audios'}`
  ].filter(Boolean).join(', ');
  
  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="p-5">
          <div className="flex items-start">
            <div className="p-2 bg-neutral-100 rounded-md mr-3">
              {getPrimaryIcon()}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                {evidence.name}
              </h3>
              <p className="text-sm text-neutral-600 line-clamp-2 mb-2">
                {evidence.description || 'No description provided'}
              </p>
              <div className="flex items-center text-xs text-neutral-500">
                <span>{fileCounts}</span>
                <span className="mx-2">•</span>
                <span>{new Date(evidence.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-neutral-50 border-t border-neutral-200 p-3">
          {isUnlocked ? (
            <div className="grid grid-cols-1 gap-2">
              {evidence.images.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <ImageIcon size={14} className="mr-1 text-blue-500" /> Images
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {evidence.images.map((img, i) => (
                      <div key={i} className="aspect-square bg-neutral-200 rounded overflow-hidden">
                        <img 
                          src={img.data} 
                          alt={img.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {evidence.videos.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <VideoIcon size={14} className="mr-1 text-red-500" /> Videos
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {evidence.videos.map((video, i) => (
                      <div key={i} className="rounded bg-neutral-800 overflow-hidden">
                        <video 
                          controls 
                          className="w-full h-auto"
                        >
                          <source src={video.data} type={video.type} />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {evidence.audios.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <MusicIcon size={14} className="mr-1 text-purple-500" /> Audio
                  </h4>
                  {evidence.audios.map((audio, i) => (
                    <div key={i} className="mb-2">
                      <p className="text-xs text-neutral-600 mb-1">{audio.name}</p>
                      <audio 
                        controls 
                        className="w-full"
                      >
                        <source src={audio.data} type={audio.type} />
                        Your browser does not support the audio tag.
                      </audio>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              fullWidth
              icon={<KeyIcon size={16} />}
              onClick={() => setIsUnlockModalOpen(true)}
            >
              Unlock Evidence
            </Button>
          )}
        </div>
      </motion.div>
      
      {/* Unlock Modal */}
      <Modal
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
        title="Unlock Evidence"
        size="sm"
      >
        <div>
          <p className="mb-4 text-neutral-600">
            Enter the secret key to view this evidence.
          </p>
          
          {error && (
            <div className="mb-4 bg-red-50 text-red-600 p-3 rounded">
              {error}
            </div>
          )}
          
          <Input
            label="Secret Key"
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="Enter secret key"
            fullWidth
          />
          
          <div className="flex justify-end mt-6 space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsUnlockModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUnlock}>
              Unlock
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const FolderDashboardPage: React.FC = () => {
  const [folder, setFolder] = useState<{ id: string; name: string } | null>(null);
  const [evidenceItems, setEvidenceItems] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (folderId) {
      const folderData = getFolder(folderId);
      if (folderData) {
        setFolder({ id: folderData.id, name: folderData.name });
        
        // Load evidence items for this folder
        const items = getFolderEvidences(folderId);
        setEvidenceItems(items);
      } else {
        navigate('/home');
      }
    }
    setLoading(false);
  }, [folderId, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-primary-500"></div>
          <div className="mt-4 text-lg font-medium text-neutral-700">Loading...</div>
        </div>
      </div>
    );
  }
  
  if (!folder) {
    return (
      <div className="min-h-screen bg-neutral-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-neutral-700">Folder not found</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate('/home')}
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/home')}
            className="mr-4 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeftIcon size={20} />
          </button>
          
          <div>
            <div className="flex items-center">
              <FolderIcon className="text-primary-600 mr-2" size={24} />
              <h1 className="text-2xl font-bold text-neutral-900">{folder.name}</h1>
            </div>
            <p className="text-neutral-600 mt-1">
              {evidenceItems.length} evidence item{evidenceItems.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="ml-auto">
            <Link to={`/folder/${folderId}/add-evidence`}>
              <Button
                variant="secondary"
                icon={<PlusIcon size={18} />}
              >
                Add Evidence
              </Button>
            </Link>
          </div>
        </div>
        
        {evidenceItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FileIcon className="mx-auto text-neutral-400 mb-4" size={64} />
            <h2 className="text-xl font-medium text-neutral-800 mb-2">No Evidence Items</h2>
            <p className="text-neutral-600 mb-6">
              This folder is empty. Add your first evidence item to get started.
            </p>
            <Link to={`/folder/${folderId}/add-evidence`}>
              <Button
                variant="secondary"
                icon={<PlusIcon size={18} />}
              >
                Add Evidence
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {evidenceItems.map((evidence) => (
                <EvidenceCard key={evidence.id} evidence={evidence} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderDashboardPage;