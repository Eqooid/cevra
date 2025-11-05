'use client';

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  IconUpload, 
  IconFile, 
  IconX, 
  IconCheck,
  IconAlertTriangle 
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import useStorageFile from "@/hooks/use-storage-file";

/**
 * UploadedFile interface includes file information and upload tracking properties.
 * @interface UploadedFile
 * @author Cristono Wijaya
 */
interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  originalFile: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

/**
 * Props for DocumentUploadDialog component.
 * @interface FileUploadDialogProps
 * @author Cristono Wijaya
 */
interface FileUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  storageId: string;
}

/**
 * DocumentUploadDialog is a React component that renders a dialog for uploading documents.
 * It supports drag-and-drop as well as file selection, and provides upload progress feedback.
 * @param {FileUploadDialogProps} props - The properties for the dialog component.
 */
const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
};

/**
 * Maximum file size for uploads (10MB).
 * @constant {number}
 * @author Cristono Wijaya
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024; 

/**
 * Dialog component for uploading documents with drag-and-drop support and progress feedback.
 * @param {FileUploadDialogProps} props - The properties for the dialog component.
 * @returns {JSX.Element} The DocumentUploadDialog component.
 * @author Cristono Wijaya
 */
export default function DocumentUploadDialog({
  isOpen, 
  onClose,
  storageId 
}: FileUploadDialogProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const uploadFile = useStorageFile((state) => state.uploadFile);

  const simulateUpload = (fileId: string) => {
    setIsUploading(true);
    
    const interval = setInterval(() => {
      setUploadedFiles(prev => 
        prev.map(file => {
          if (file.id === fileId && file.status === 'uploading') {
            const newProgress = Math.min(file.progress + Math.random() * 20, 100);
            
            if (newProgress === 100) {
              clearInterval(interval);
              return { ...file, progress: 100, status: 'completed' as const };
            }
            
            return { ...file, progress: newProgress };
          }
          return file;
        })
      );
    }, 500);

    // Complete upload after random time
    setTimeout(() => {
      clearInterval(interval);
      setUploadedFiles(prev => 
        prev.map(file => 
          file.id === fileId 
            ? { ...file, progress: 100, status: 'completed' as const }
            : file
        )
      );
      
      // Check if all uploads are complete
      setTimeout(() => {
        setUploadedFiles(prev => {
          const allComplete = prev.every(f => f.status !== 'uploading');
          if (allComplete) {
            setIsUploading(false);
          }
          return prev;
        });
      }, 100);
    }, 2000 + Math.random() * 3000);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {

    // For single file upload, replace any existing files
    if (rejectedFiles.length > 0) {
      const rejectedFile = rejectedFiles[0].file;
      const errorFile: UploadedFile = {
        id: `error-${Date.now()}`,
        name: rejectedFile.name,
        size: rejectedFile.size,
        type: rejectedFile.type,
        lastModified: rejectedFile.lastModified,
        originalFile: rejectedFile,
        progress: 0,
        status: 'error' as const,
        error: rejectedFiles[0].errors[0]?.message || 'File rejected'
      };
      setUploadedFiles([errorFile]);
    }

    if (acceptedFiles.length > 0) { 
      const originalFile = acceptedFiles[0];
      const newFile: UploadedFile = {
        id: `file-${Date.now()}`,
        name: originalFile.name,
        size: originalFile.size,
        type: originalFile.type,
        lastModified: originalFile.lastModified,
        originalFile: originalFile,
        progress: 0,
        status: 'uploading' as const
      };
      setUploadedFiles([newFile]);
      simulateUpload(newFile.id);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleClose = () => {
    if (!isUploading) {
      setUploadedFiles([]);
      onClose();
    }
  };

  const handleComplete = () => {
    const completedFile = uploadedFiles.find(file => file.status === 'completed');
    
    if (completedFile) {
      const fileToUpload = completedFile.originalFile;
      uploadFile(fileToUpload, storageId);
    }
    setUploadedFiles([]);
    onClose();
  };
  
  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'completed':
        return <IconCheck className="w-4 h-4 text-green-500" />;
      case 'error':
        return <IconAlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <IconFile className="w-4 h-4 text-blue-500" />;
    }
  };

  const completedCount = uploadedFiles.filter(f => f.status === 'completed').length;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Upload a single PDF or DOCX file. Maximum file size: 10MB.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive 
                ? "border-primary bg-primary/5" 
                : "border-muted-foreground/25 hover:border-primary/50",
              isUploading && "pointer-events-none opacity-50"
            )}
          >
            <input {...getInputProps()} />
            <IconUpload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg font-medium">Drop the file here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">
                  Drag & drop a file here, or click to select
                </p>
                <p className="text-sm text-muted-foreground">
                  Only PDF and DOCX files are accepted
                </p>
              </div>
            )}
          </div>

          {/* File List */}  
          {uploadedFiles.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <h4 className="font-medium">File ({uploadedFiles.length})</h4>
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center space-x-3 p-3 border rounded-lg"
                >
                  {getStatusIcon(file.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      {file.status === 'error' && file.error && (
                        <Badge variant="destructive" className="text-xs">
                          {file.error}
                        </Badge>
                      )}
                    </div>
                    {file.status === 'uploading' && (
                      <Progress value={file.progress} className="h-1 mt-1" />
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    disabled={isUploading && file.status === 'uploading'}
                  >
                    <IconX className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Cancel'}
          </Button>
          {completedCount > 0 && (
            <Button onClick={handleComplete}>
              <IconUpload/> Upload
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}