import React, { useState, useRef } from 'react';
import { UploadIcon, XIcon, FileIcon, ImageIcon, VideoIcon, MusicIcon } from 'lucide-react';
import Button from './Button';

interface FileUploadProps {
  label: string;
  accept?: string;
  onChange: (file: File | null) => void;
  type?: 'image' | 'video' | 'audio' | 'any';
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  label, 
  accept, 
  onChange, 
  type = 'any',
  error 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      setSelectedFile(file);
      onChange(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };
  
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Determine file type icon
  const getFileIcon = () => {
    if (!selectedFile) return <UploadIcon size={24} />;
    
    if (selectedFile.type.startsWith('image/')) {
      return <ImageIcon size={24} />;
    } else if (selectedFile.type.startsWith('video/')) {
      return <VideoIcon size={24} />;
    } else if (selectedFile.type.startsWith('audio/')) {
      return <MusicIcon size={24} />;
    } else {
      return <FileIcon size={24} />;
    }
  };
  
  // Determine accept attribute based on type
  const getAcceptTypes = () => {
    if (accept) return accept;
    
    switch (type) {
      case 'image': return 'image/*';
      case 'video': return 'video/*';
      case 'audio': return 'audio/*';
      default: return undefined;
    }
  };
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-neutral-700 mb-1">
        {label}
      </label>
      
      {selectedFile ? (
        <div className="mt-2 flex items-start">
          <div className="flex-1 bg-neutral-50 border border-neutral-200 rounded-md p-3">
            <div className="flex items-center">
              <div className="mr-3 text-neutral-500">
                {preview ? (
                  <div className="w-12 h-12 rounded overflow-hidden bg-neutral-100">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded bg-neutral-100 flex items-center justify-center">
                    {getFileIcon()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-neutral-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="ml-2 flex-shrink-0 text-neutral-500 hover:text-error transition-colors p-1"
              >
                <XIcon size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div 
          className={`
            mt-1 border-2 border-dashed rounded-md px-6 pt-5 pb-6 
            flex flex-col items-center cursor-pointer 
            hover:border-primary-500 transition-colors
            ${error ? 'border-error' : 'border-neutral-300'}
          `}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-neutral-500 mb-3">
            {getFileIcon()}
          </div>
          <div className="text-center">
            <p className="text-sm text-neutral-700">
              <span className="font-medium text-primary-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              {type === 'image' && 'PNG, JPG, GIF up to 10MB'}
              {type === 'video' && 'MP4, WebM, AVI up to 50MB'}
              {type === 'audio' && 'MP3, WAV, OGG up to 10MB'}
              {type === 'any' && 'Any file up to 50MB'}
            </p>
          </div>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept={getAcceptTypes()}
      />
      
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
};

export default FileUpload;