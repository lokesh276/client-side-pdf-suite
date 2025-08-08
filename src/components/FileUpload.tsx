import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFiles: (files: File[]) => void;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  title?: string;
  description?: string;
}

export const FileUpload = ({ 
  onFiles, 
  accept = { 'application/pdf': ['.pdf'] }, 
  multiple = false,
  title = "Upload Files",
  description = "Drag and drop files here or click to browse"
}: FileUploadProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFiles(acceptedFiles);
  }, [onFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple
  });

  return (
    <div
      {...getRootProps()}
      className={`upload-area cursor-pointer ${
        isDragActive ? 'border-primary bg-primary/5' : ''
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="gradient-primary p-4 rounded-full">
          <Upload className="h-8 w-8 text-white" />
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {title}
          </h3>
          <p className="text-muted-foreground mb-4">
            {description}
          </p>
          
          <Button variant="outline" className="border-border/50 hover:border-primary/50">
            <File className="h-4 w-4 mr-2" />
            Browse Files
          </Button>
        </div>
      </div>
    </div>
  );
};