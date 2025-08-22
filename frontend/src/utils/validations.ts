// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
// - At least 8 characters
// - Contains at least one uppercase letter
// - Contains at least one lowercase letter
// - Contains at least one number
export const validatePassword = (password: string): boolean => {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /[0-9]/.test(password);
};

// Validate folder password
// - At least 6 characters
export const validateFolderPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Get password strength feedback
export const getPasswordStrength = (password: string): {
  score: number;
  feedback: string;
} => {
  if (!password) {
    return { score: 0, feedback: 'Password is required' };
  }
  
  let score = 0;
  let feedback = '';
  
  // Length check
  if (password.length < 6) {
    feedback = 'Password is too short';
  } else if (password.length < 8) {
    score += 1;
    feedback = 'Password could be stronger';
  } else if (password.length < 10) {
    score += 2;
  } else {
    score += 3;
  }
  
  // Character variety checks
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  // Determine overall strength
  if (score < 3) {
    feedback = 'Weak password';
  } else if (score < 5) {
    feedback = 'Moderate password';
  } else if (score < 7) {
    feedback = 'Strong password';
  } else {
    feedback = 'Very strong password';
  }
  
  return { score: Math.min(score, 7), feedback };
};

// File size validation
export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// File type validation
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => file.type.startsWith(type));
};

// Validate evidence form
export const validateEvidenceForm = (
  name: string,
  secretKey: string,
  hasFiles: boolean
): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (!name.trim()) {
    errors.name = 'Name is required';
  }
  
  if (!secretKey.trim()) {
    errors.secretKey = 'Secret key is required';
  } else if (secretKey.length < 6) {
    errors.secretKey = 'Secret key must be at least 6 characters';
  }
  
  if (!hasFiles) {
    errors.files = 'At least one file (image, video, or audio) is required';
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};