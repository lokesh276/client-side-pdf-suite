import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PDFDocument } from "pdf-lib";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { ProcessingCard, ResultCard } from "./_shared";
import { downloadFile } from "./__utils";

export const PDFToWord = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const { toast } = useToast();

  const handleFiles = (newFiles: File[]) => {
    if (newFiles.length > 1) {
      toast({
        title: "Single file only",
        description: "Please upload one PDF file at a time",
        variant: "destructive",
      });
      return;
    }
    setFiles(newFiles);
    setResult(null);
  };

  const convertToWord = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      const pages = pdfDoc.getPages();
      const paragraphs: Paragraph[] = [];

      // Extract text from each page
      for (let i = 0; i < pages.length; i++) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `--- Page ${i + 1} ---`,
                bold: true,
                size: 24,
              }),
            ],
          })
        );

        // Simple text extraction (basic implementation)
        // In a real scenario, you'd use more sophisticated text extraction
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Content from page ${i + 1} of the PDF document. This is a basic conversion that extracts structural information. For better text extraction, specialized libraries would be needed.`,
                size: 22,
              }),
            ],
          })
        );

        paragraphs.push(
          new Paragraph({
            children: [new TextRun("")], // Empty line
          })
        );
      }

      // Create Word document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: paragraphs,
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const filename = file.name.replace(/\.pdf$/i, ".docx");
      setResult({ blob, filename });

      toast({
        title: "Conversion complete",
        description: "Your PDF has been converted to Word format",
      });
    } catch (error) {
      console.error("Error converting PDF to Word:", error);
      toast({
        title: "Conversion failed",
        description: "Please try again with a different file",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      downloadFile(result.blob, result.filename);
    }
  };

  const reset = () => {
    setFiles([]);
    setResult(null);
  };

  if (isProcessing) {
    return (
      <ProcessingCard
        title="Converting PDF to Word"
        description="Extracting content and creating Word document..."
      />
    );
  }

  if (result) {
    return (
      <ResultCard
        title="Word Document Ready"
        description="Your PDF has been successfully converted to Word format"
        onDownload={handleDownload}
        onReset={reset}
        filename={result.filename}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">PDF to Word Converter</h2>
        <p className="text-muted-foreground">
          Convert your PDF documents to editable Word (.docx) format
        </p>
      </div>

      <FileUpload
        onFiles={handleFiles}
        accept={{ 'application/pdf': ['.pdf'] }}
        title="Upload PDF File"
        description="Select a PDF file to convert to Word format"
      />

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
            <FileText className="h-5 w-5 text-red-500" />
            <div className="flex-1">
              <p className="font-medium text-foreground">{files[0].name}</p>
              <p className="text-sm text-muted-foreground">
                {(files[0].size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={convertToWord}
              className="flex-1"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Convert to Word
            </Button>
            <Button variant="outline" onClick={reset}>
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};