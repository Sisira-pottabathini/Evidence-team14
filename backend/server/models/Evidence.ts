import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

interface File {
  filename: string;
  contentType: string;
  size: number;
  gridFSId: mongoose.Types.ObjectId;
}

export interface IEvidence extends mongoose.Document {
  name: string;
  description: string;
  folderId: mongoose.Types.ObjectId;
  secretKey: string;
  videos: File[];
  images: File[];
  audios: File[];
  createdAt: Date;
  compareSecretKey(candidateKey: string): Promise<boolean>;
}

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  gridFSId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

const evidenceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide an evidence name'],
    trim: true,
    maxlength: [200, 'Evidence name cannot be more than 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    required: true
  },
  secretKey: {
    type: String,
    required: [true, 'Please provide a secret key'],
    minlength: [6, 'Secret key must be at least 6 characters'],
    select: false
  },
  videos: [fileSchema],
  images: [fileSchema],
  audios: [fileSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash secret key before saving
evidenceSchema.pre('save', async function(next) {
  if (!this.isModified('secretKey')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.secretKey = await bcrypt.hash(this.secretKey, salt);
  next();
});

// Compare secret key method
evidenceSchema.methods.compareSecretKey = async function(candidateKey: string): Promise<boolean> {
  return bcrypt.compare(candidateKey, this.secretKey);
};

export default mongoose.model<IEvidence>('Evidence', evidenceSchema);