import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeftIcon, SaveIcon, FolderIcon } from 'lucide-react';
import { getFolder, saveEvidence, Evidence, EvidenceFile } from '../utils/storage';
import { validateEvidenceForm } from '../utils/validations';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Input from '../components/Input';
import FileUpload from '../components/FileUpload';

const AddEvidencePage: React.FC = () => {
  const [folder, setFolder] = useState<{ id: string; name: string } | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    setLoading(false);
  }, [folderId, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if at least one file is uploaded
    const hasFiles = videoFile !== null || imageFile !== null || audioFile !== null;
    
    // Validate form
    const { valid, errors } = validateEvidenceForm(name, secretKey, hasFiles);
    
    if (!valid) {
      setFormErrors(errors);
      return;
    }
    
    // Clear errors if valid
    setFormErrors({});
    setIsSubmitting(true);
    
    // Process files
    const videos: EvidenceFile[] = [];
    const images: EvidenceFile[] = [];
    const audios: EvidenceFile[] = [];
    
    try {
      // Process video file
      if (videoFile) {
        const videoData = await readFileAsDataURL(videoFile);
        videos.push({
          name: videoFile.name,
          type: videoFile.type,
          size: videoFile.size,
          data: videoData,
        });
      }
      
      // Process image file
      if (imageFile) {
        const imageData = await readFileAsDataURL(imageFile);
        images.push({
          name: imageFile.name,
          type: imageFile.type,
          size: imageFile.size,
          data: imageData,
        });
      }
      
      // Process audio file
      if (audioFile) {
        const audioData = await readFileAsDataURL(audioFile);
        audios.push({
          name: audioFile.name,
          type: audioFile.type,
          size: audioFile.size,
          data: audioData,
        });
      }
      
      // Create evidence object
      const evidence: Evidence = {
        id: uuidv4(),
        name,
        description,
        folderId: folderId!,
        secretKey,
        videos,
        images,
        audios,
        createdAt: Date.now(),
      };
      
      // Save evidence to storage
      saveEvidence(evidence);
      
      // Navigate back to folder dashboard
      navigate(`/folder/${folderId}`);
    } catch (error) {
      console.error('Error processing files:', error);
      setFormErrors({ 
        general: 'There was an error processing your files. Please try again.'
      });
      setIsSubmitting(false);
    }
  };
  
  // Helper function to read file as data URL
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  
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
      
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(`/folder/${folderId}`)}
            className="mr-4 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeftIcon size={20} />
          </button>
          
          <div>
            <div className="flex items-center">
              <FolderIcon className="text-primary-600 mr-2" size={24} />
              <h1 className="text-2xl font-bold text-neutral-900">Add Evidence</h1>
            </div>
            <p className="text-neutral-600 mt-1">
              Adding to folder: {folder.name}
            </p>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-6">
            {formErrors.general && (
              <div className="mb-6 bg-error bg-opacity-10 text-error px-4 py-3 rounded-md">
                {formErrors.general}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <Input
                    label="Evidence Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Witness Statement"
                    fullWidth
                    error={formErrors.name}
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full border border-neutral-300 rounded-md px-3 py-2 
                                focus:outline-none focus:ring-1 focus:ring-primary-500"
                      placeholder="Provide details about this evidence"
                    ></textarea>
                  </div>
                  
                  <Input
                    label="Secret Key"
                    type="password"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="Enter secure secret key"
                    fullWidth
                    error={formErrors.secretKey}
                  />
                  <p className="text-sm text-neutral-500 -mt-4">
                    <strong>Important:</strong> You'll need this secret key each time you want to view this evidence.
                  </p>
                </div>
                
                <div className="border-t border-neutral-200 pt-6">
                  <h3 className="text-lg font-medium text-neutral-900 mb-4">
                    Evidence Files
                  </h3>
                  
                  {formErrors.files && (
                    <div className="mb-4 text-error text-sm">{formErrors.files}</div>
                  )}
                  
                  <div className="space-y-6">
                    <FileUpload
                      label="Upload Video (Optional)"
                      type="video"
                      onChange={setVideoFile}
                    />
                    
                    <FileUpload
                      label="Upload Image (Optional)"
                      type="image"
                      onChange={setImageFile}
                    />
                    
                    <FileUpload
                      label="Upload Audio (Optional)"
                      type="audio"
                      onChange={setAudioFile}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/folder/${folderId}`)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="secondary"
                    icon={<SaveIcon size={18} />}
                    isLoading={isSubmitting}
                  >
                    Save Evidence
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddEvidencePage;