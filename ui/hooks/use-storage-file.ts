'use client';

import api from "@/apis/cevra-api";
import useSWR from "swr";
import { create } from "zustand";

/**
 * Type definition for a file item in storage.
 * @typedef {Object} FileItem
 * @property {string} id - Unique identifier for the file.
 * @property {string} name - Name of the file.
 * @property {string} size - Size of the file in human-readable format.
 * @property {string} lastModified - Last modified date of the file.
 * @property {"completed" | "in-progress" | "failed"} status - Upload status of the file.
 * @property {string} [mimeType] - Optional MIME type of the file.
 * @author Cristono Wijaya
 */
export type FileItem = {
  _id: string;
  name: string;
  size: string;
  lastModified: string;
  status: "completed" | "in-progress" | "failed";
  mimeType?: string;
}; 

/**
 * Response interface for storage file items from the API.
 * @interface StorageFileResponse
 * @author Cristono Wijaya
 */
interface StorageFileResponse {
  _id: string;
  name: string;
  size: number;
  uploadDate: string;
  status: string;
  type: string;
}

/**
 * State management for storage files using Zustand.
 * It includes loading state, file data, and methods to set data, upload, and remove files.
 * @interface StorageFileState
 * @author Cristono Wijaya
 */
export interface StorageFileState {
  isModalOpen: boolean;
  isLoading: boolean;
  files: FileItem[];
  setData: (files:FileItem[]) => void;
  uploadFile: (file: File, storageId:string) => void;
  removeFile: (fileId: string, storageId: string) => void;
  setLoading: (isLoading: boolean) => void;
  toggleModal: (isOpen: boolean) => void;
}

/**
 * Zustand store for managing storage file state.
 * @constant {import('zustand').UseStore<StorageFileState>}
 * @author Cristono Wijaya
 */
const useStorageFile = create<StorageFileState>((set) => ({
  isModalOpen: false,
  isLoading: true,
  files: [],
  setData: async (files: FileItem[]) => {
    set({ files: files, isLoading: false });
  },
  uploadFile: async (file: File, storageId:string) => {
    const data = await uploadFileToStorage(storageId, file);
    set((state) => ({ files: [data, ...state.files] }));
  },
  removeFile: async (fileId: string, storageId: string) => {
    await deleteStorageFile(storageId, fileId);
    set((state) => ({ files: state.files.filter((file) => file._id !== fileId) }));
  },
  setLoading: (isLoading: boolean) => set({ isLoading: isLoading }),
  toggleModal: (isOpen: boolean) => set({ isModalOpen: isOpen })
}));

/**
 * Fetches storage files for a given storage ID.
 * In a real application, this would involve an API call.
 * @param {string} storageId - The ID of the storage to fetch files for.
 * @returns {Promise<FileItem[]>} A promise that resolves to an array of FileItem objects.
 * @author Cristono Wijaya
 */
const fetchStorageFiles = async (storageId: string): Promise<FileItem[]> => {
  const response = await api.get(`/vector-storage/storage-items/${storageId}`);
  const data = response.data.data.map((item:StorageFileResponse) => {
    return {
      ...item,
      lastModified: new Date(item.uploadDate).toISOString().split('T')[0],
      size: `${(item.size / (1024 * 1024)).toFixed(2)} MB`,
      status: item.status === 'Success' ? 'completed' : item.status === 'On Progress' ? 'in-progress' : 'failed',
      mimeType: item.type
    }
  });
  return data;
} 

/**
 * Uploads a file to the specified storage.
 * In a real application, this would involve an API call.
 * @param {string} storageId - The ID of the storage to upload the file to.
 * @param {FileItem} file - The file item to upload.
 * @returns {Promise<FileItem>} A promise that resolves to the uploaded FileItem.
 * @author Cristono Wijaya
 */
const uploadFileToStorage = async (storageId: string, file: File): Promise<FileItem> => {
  console.log(file);
  const formData = new FormData();
  formData.append('file', file);
  await api.post(`/vector-storage/upload/${storageId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return {
    _id: `file-${Math.random().toString(36).substr(2, 9)}`,
    name: file.name,
    size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
    lastModified: new Date().toISOString().split('T')[0],
    status: "in-progress",
    mimeType: file.type
  } 
}

/**
 * Deletes a file from the specified storage.
 * In a real application, this would involve an API call.
 * @param {string} storageId - The ID of the storage to delete the file from.
 * @param {string} fileId - The ID of the file to delete.
 * @returns {Promise<void>} A promise that resolves when the file is deleted.
 * @author Cristono Wijaya
 */
const deleteStorageFile = async (storageId: string, fileId: string): Promise<void> => {
  await api.delete(`/vector-storage/delete-item/${storageId}/${fileId}`);
}

/**
 * Custom hook to fetch storage files using SWR and update the Zustand store.
 * @param {string} storageId - The ID of the storage to fetch files for.
 * @returns {{ data: FileItem[]; isLoading: boolean }} An object containing the fetched data and loading state.
 * @author Cristono Wijaya
 */
export const useFetchStorageFiles = (storageId: string) => {
  const files = useStorageFile((state) => state.files);
  const isLoading = useStorageFile((state) => state.isLoading);
  const setData = useStorageFile((state) => state.setData);
  
  useSWR<FileItem[]>(`storage-files-${storageId}`, () => {
    return fetchStorageFiles(storageId);
  }, {
    suspense: true,
    fallback: [],
    fallbackData: [],
    refreshInterval: 0,
    revalidateOnFocus: false,
    onSuccess: (data) => {
      setData(data);
    }
  });

  return { 
    data: files, 
    isLoading 
  };
}

export default useStorageFile;



