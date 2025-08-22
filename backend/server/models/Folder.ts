import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IFolder extends mongoose.Document {
  name: string;
  password: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a folder name'],
    trim: true,
    maxlength: [100, 'Folder name cannot be more than 100 characters']
  },
  password: {
    type: String,
    required: [true, 'Please provide a folder password'],
    minlength: [6, 'Folder password must be at least 6 characters'],
    select: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
folderSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
folderSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IFolder>('Folder', folderSchema);