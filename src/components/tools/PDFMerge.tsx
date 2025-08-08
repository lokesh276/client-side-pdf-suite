import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Download, Combine, X, File } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { toast } from "@/hooks/use-toast";

export const PDFMerge = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFiles = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      toast({
        title: "Not enough files",
        description: "Please upload at least 2 PDF files to merge.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const fileBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged-document.pdf';
      a.click();
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success!",
        description: "PDFs have been merged successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to merge PDFs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">PDF Merge</h2>
        <p className="text-muted-foreground">Combine multiple PDF files into one document</p>
      </div>

      {files.length === 0 ? (
        <FileUpload
          onFiles={handleFiles}
          accept={{ 'application/pdf': ['.pdf'] }}
          multiple={true}
          title="Upload PDF Files"
          description="Select multiple PDF files to merge together"
        />
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4">
            {files.map((file, index) => (
              <div key={index} className="gradient-card border border-border/50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="gradient-primary p-2 rounded">
                    <File className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="border-border/50 hover:border-destructive/50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Button
              onClick={mergePDFs}
              disabled={isProcessing || files.length < 2}
              className="gradient-primary hover:shadow-glow"
            >
              <Combine className="h-4 w-4 mr-2" />
              {isProcessing ? "Merging..." : "Merge PDFs"}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setFiles([])}
              className="border-border/50"
            >
              Clear All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};