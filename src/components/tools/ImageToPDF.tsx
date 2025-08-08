import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Download, Image, X } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { toast } from "@/hooks/use-toast";

export const ImageToPDF = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFiles = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const convertToPDF = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one image file.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        const imageBytes = await file.arrayBuffer();
        let image;
        
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          image = await pdfDoc.embedJpg(imageBytes);
        } else if (file.type === 'image/png') {
          image = await pdfDoc.embedPng(imageBytes);
        } else {
          throw new Error(`Unsupported image type: ${file.type}`);
        }

        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        const imageRatio = image.width / image.height;
        const pageRatio = width / height;

        let drawWidth, drawHeight;
        if (imageRatio > pageRatio) {
          drawWidth = width - 40;
          drawHeight = drawWidth / imageRatio;
        } else {
          drawHeight = height - 40;
          drawWidth = drawHeight * imageRatio;
        }

        page.drawImage(image, {
          x: (width - drawWidth) / 2,
          y: (height - drawHeight) / 2,
          width: drawWidth,
          height: drawHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'images-to-pdf.pdf';
      a.click();
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success!",
        description: "Images have been converted to PDF successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert images to PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Images to PDF</h2>
        <p className="text-muted-foreground">Convert multiple images into a single PDF document</p>
      </div>

      {files.length === 0 ? (
        <FileUpload
          onFiles={handleFiles}
          accept={{ 
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'] 
          }}
          multiple={true}
          title="Upload Image Files"
          description="Select JPG or PNG images to convert to PDF"
        />
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4">
            {files.map((file, index) => (
              <div key={index} className="gradient-card border border-border/50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="gradient-primary p-2 rounded">
                    <Image className="h-4 w-4 text-white" />
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
              onClick={convertToPDF}
              disabled={isProcessing}
              className="gradient-primary hover:shadow-glow"
            >
              <Download className="h-4 w-4 mr-2" />
              {isProcessing ? "Converting..." : "Convert to PDF"}
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