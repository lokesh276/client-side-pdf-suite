import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { ToolCard } from "@/components/ToolCard";
import { PDFMerge } from "@/components/tools/PDFMerge";
import { ImageToPDF } from "@/components/tools/ImageToPDF";
import { PDFSplit } from "@/components/tools/PDFSplit";
import { PDFViewer } from "@/components/tools/PDFViewer";
import { PDFRotate } from "@/components/tools/PDFRotate";
import { PDFExtract } from "@/components/tools/PDFExtract";
import { TextToPDF } from "@/components/tools/TextToPDF";
import { PDFCompress } from "@/components/tools/PDFCompress";
import { PDFWatermark } from "@/components/tools/PDFWatermark";
import { PDFToWord } from "@/components/tools/PDFToWord";
import { PDFToExcel } from "@/components/tools/PDFToExcel";
import { 
  Combine, 
  Split, 
  Image, 
  Eye, 
  RotateCw, 
  Scissors, 
  FileText, 
  Download,
  Edit,
  Stamp,
  ArrowLeft,
  Table,
  FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Tool = 'merge' | 'split' | 'imageToPdf' | 'viewer' | 'rotate' | 'extract' | 'textToPdf' | 'compress' | 'editor' | 'watermark' | 'pdfToWord' | 'pdfToExcel' | null;

const Index = () => {
  const [selectedTool, setSelectedTool] = useState<Tool>(null);

  const tools = [
    {
      id: 'merge' as const,
      title: 'PDF Merge',
      description: 'Combine multiple PDFs into one document',
      icon: Combine,
      gradient: 'gradient-primary'
    },
    {
      id: 'split' as const,
      title: 'PDF Split',
      description: 'Extract specific pages from a PDF',
      icon: Split,
      gradient: 'gradient-primary'
    },
    {
      id: 'imageToPdf' as const,
      title: 'Images to PDF',
      description: 'Convert multiple images into one PDF',
      icon: Image,
      gradient: 'gradient-primary'
    },
    {
      id: 'viewer' as const,
      title: 'PDF Viewer',
      description: 'Preview and view PDF documents',
      icon: Eye,
      gradient: 'gradient-primary'
    },
    {
      id: 'rotate' as const,
      title: 'PDF Rotate',
      description: 'Rotate pages left or right',
      icon: RotateCw,
      gradient: 'gradient-primary'
    },
    {
      id: 'extract' as const,
      title: 'Extract Pages',
      description: 'Extract and download specific pages',
      icon: Scissors,
      gradient: 'gradient-primary'
    },
    {
      id: 'textToPdf' as const,
      title: 'Text to PDF',
      description: 'Convert text content to PDF format',
      icon: FileText,
      gradient: 'gradient-primary'
    },
    {
      id: 'compress' as const,
      title: 'PDF Compress',
      description: 'Reduce PDF file size efficiently',
      icon: Download,
      gradient: 'gradient-primary'
    },
    {
      id: 'editor' as const,
      title: 'PDF Editor',
      description: 'Edit and annotate PDF documents',
      icon: Edit,
      gradient: 'gradient-primary'
    },
    {
      id: 'watermark' as const,
      title: 'Add Watermark',
      description: 'Add text or image watermarks to PDFs',
      icon: Stamp,
      gradient: 'gradient-primary'
    },
    {
      id: 'pdfToWord' as const,
      title: 'PDF to Word',
      description: 'Convert PDF files to editable Word documents',
      icon: FileText,
      gradient: 'gradient-primary'
    },
    {
      id: 'pdfToExcel' as const,
      title: 'PDF to Excel',
      description: 'Extract content from PDFs to Excel spreadsheets',
      icon: FileSpreadsheet,
      gradient: 'gradient-primary'
    }
  ];

  const renderTool = () => {
    switch (selectedTool) {
      case 'merge':
        return <PDFMerge />;
      case 'imageToPdf':
        return <ImageToPDF />;
      case 'split':
        return <PDFSplit />;
      case 'viewer':
        return <PDFViewer />;
      case 'rotate':
        return <PDFRotate />;
      case 'extract':
        return <PDFExtract />;
      case 'textToPdf':
        return <TextToPDF />;
      case 'compress':
        return <PDFCompress />;
      case 'watermark':
        return <PDFWatermark />;
      case 'pdfToWord':
        return <PDFToWord />;
      case 'pdfToExcel':
        return <PDFToExcel />;
      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-foreground mb-2">Tool Coming Soon</h3>
            <p className="text-muted-foreground">This tool is under development</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedTool ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setSelectedTool(null)}
                className="border-border/50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tools
              </Button>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-8 shadow-card">
              {renderTool()}
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-6 bg-card rounded-2xl p-12 shadow-card">
              <div className="gradient-hero bg-clip-text text-transparent">
                <h1 className="text-5xl font-bold mb-4">
                  All In One Editor
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Professional PDF tools that work entirely in your browser. 
                Merge, split, convert, and edit your PDFs with complete privacy and security.
              </p>
              <div className="pt-4">
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg transition-smooth hover:scale-105 shadow-card">
                  Get Started Free
                </button>
              </div>
            </div>

            {/* Tools Grid */}
            <div className="bg-muted/30 rounded-2xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">Choose Your Tool</h2>
                <p className="text-muted-foreground">Select from our comprehensive suite of PDF editing tools</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  title={tool.title}
                  description={tool.description}
                  icon={tool.icon}
                  gradient={tool.gradient}
                  onClick={() => setSelectedTool(tool.id)}
                />
              ))}
              </div>
            </div>

            {/* Features Section */}
            <div className="bg-card rounded-2xl p-12 shadow-card">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-foreground">
                  Why Choose All In One Editor?
                </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                <div className="space-y-2">
                  <div className="bg-accent p-3 rounded-lg w-fit mx-auto">
                    <Eye className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">100% Private</h3>
                  <p className="text-muted-foreground">All processing happens in your browser. Your files never leave your device.</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-success p-3 rounded-lg w-fit mx-auto">
                    <Download className="h-6 w-6 text-success-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">No Limits</h3>
                  <p className="text-muted-foreground">Process unlimited files without restrictions or watermarks.</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-primary p-3 rounded-lg w-fit mx-auto">
                    <RotateCw className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Fast & Reliable</h3>
                  <p className="text-muted-foreground">Lightning-fast processing with professional-grade results.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">All In One Editor</h3>
              <p className="text-secondary-foreground/80 mb-6 max-w-md">
                Professional PDF tools that work entirely in your browser. Fast, secure, and private.
              </p>
              <div className="flex gap-4">
                <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                  ✓ 100% Private
                </span>
                <span className="bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-medium">
                  ✓ No Limits
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Tools</h4>
              <ul className="space-y-2 text-secondary-foreground/80">
                <li>PDF Merge</li>
                <li>PDF Split</li>
                <li>PDF Compress</li>
                <li>PDF to Word</li>
                <li>PDF to Excel</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-secondary-foreground/80">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact Us</li>
                <li>Help Center</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-secondary-foreground/20 mt-8 pt-8 text-center text-secondary-foreground/60">
            <p>&copy; 2024 All In One Editor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;