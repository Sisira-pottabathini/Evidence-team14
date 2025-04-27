// Types
export interface Folder {
  id: string;
  name: string;
  password: string;
  userId: string;
  createdAt: number;
}

export interface Evidence {
  id: string;
  name: string;
  description: string;
  folderId: string;
  secretKey: string;
  videos: EvidenceFile[];
  images: EvidenceFile[];
  audios: EvidenceFile[];
  createdAt: number;
}

export interface EvidenceFile {
  name: string;
  type: string;
  size: number;
  data: string; // Base64 encoded data
}

// Save a new folder to localStorage
export const saveFolder = (folder: Folder): void => {
  const folders = getFolders();
  folders.push(folder);
  localStorage.setItem('evidenceFolders', JSON.stringify(folders));
};

// Get all folders from localStorage
export const getFolders = (): Folder[] => {
  return JSON.parse(localStorage.getItem('evidenceFolders') || '[]');
};

// Get folders for a specific user
export const getUserFolders = (userId: string): Folder[] => {
  const folders = getFolders();
  return folders.filter(folder => folder.userId === userId);
};

// Get a specific folder by id
export const getFolder = (folderId: string): Folder | null => {
  const folders = getFolders();
  return folders.find(folder => folder.id === folderId) || null;
};

// Verify folder password
export const verifyFolderPassword = (folderId: string, password: string): boolean => {
  const folder = getFolder(folderId);
  if (!folder) return false;
  return folder.password === password;
};

// Save evidence to localStorage
export const saveEvidence = (evidence: Evidence): void => {
  const evidences = getEvidences();
  evidences.push(evidence);
  localStorage.setItem('evidenceItems', JSON.stringify(evidences));
};

// Get all evidence items from localStorage
export const getEvidences = (): Evidence[] => {
  return JSON.parse(localStorage.getItem('evidenceItems') || '[]');
};

// Get evidence items for a specific folder
export const getFolderEvidences = (folderId: string): Evidence[] => {
  const evidences = getEvidences();
  return evidences.filter(evidence => evidence.folderId === folderId);
};

// Get a specific evidence item by id
export const getEvidence = (evidenceId: string): Evidence | null => {
  const evidences = getEvidences();
  return evidences.find(evidence => evidence.id === evidenceId) || null;
};

// Clear all local storage (for testing)
export const clearStorage = (): void => {
  localStorage.removeItem('evidenceFolders');
  localStorage.removeItem('evidenceItems');
};