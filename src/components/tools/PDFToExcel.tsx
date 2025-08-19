import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2, Table } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getDocument } from "pdfjs-dist";
import * as XLSX from "xlsx";
import { ProcessingCard, ResultCard } from "./_shared";
import { downloadFile } from "./__utils";

export const PDFToExcel = () => {
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

  const convertToExcel = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      
      // Load PDF with PDF.js
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      const worksheetData: any[][] = [];
      
      // Add header row
      worksheetData.push(['Page', 'Content', 'Line Number']);

      // Extract text from each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        let lineNumber = 1;
        textContent.items.forEach((item: any) => {
          if (item.str && item.str.trim()) {
            worksheetData.push([
              pageNum,
              item.str.trim(),
              lineNumber++
            ]);
          }
        });
      }

      // Create workbook
      const workbook = XLSX.utils.book_new();
      
      // Create worksheet from data
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      
      // Set column widths
      worksheet['!cols'] = [
        { wch: 8 },  // Page column
        { wch: 60 }, // Content column
        { wch: 12 }  // Line Number column
      ];

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "PDF Content");

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { 
        bookType: 'xlsx', 
        type: 'array' 
      });
      
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const filename = file.name.replace(/\.pdf$/i, ".xlsx");
      setResult({ blob, filename });

      toast({
        title: "Conversion complete",
        description: "Your PDF has been converted to Excel format",
      });
    } catch (error) {
      console.error("Error converting PDF to Excel:", error);
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
        title="Converting PDF to Excel"
        description="Extracting text content and creating spreadsheet..."
      />
    );
  }

  if (result) {
    return (
      <ResultCard
        title="Excel Spreadsheet Ready"
        description="Your PDF content has been successfully converted to Excel format"
        onDownload={handleDownload}
        onReset={reset}
        filename={result.filename}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">PDF to Excel Converter</h2>
        <p className="text-muted-foreground">
          Extract content from PDF documents and convert to Excel (.xlsx) format
        </p>
      </div>

      <FileUpload
        onFiles={handleFiles}
        accept={{ 'application/pdf': ['.pdf'] }}
        title="Upload PDF File"
        description="Select a PDF file to convert to Excel format"
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

          <div className="alert-info">
            <Table className="h-4 w-4" />
            <div>
              <p className="font-medium">Excel Output Format</p>
              <p className="text-sm">
                Content will be organized in columns: Page, Content, Line Number
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={convertToExcel}
              className="flex-1"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Convert to Excel
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