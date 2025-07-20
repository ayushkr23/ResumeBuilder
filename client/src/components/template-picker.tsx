import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, FileText, QrCode, Star } from "lucide-react";
import { generatePDF } from "@/lib/pdf-generator";
import { generateQR } from "@/lib/qr-generator";
import { useToast } from "@/hooks/use-toast";
import type { ResumeData } from "@shared/schema";

interface TemplatePickerProps {
  resumeData: ResumeData;
  onBack: () => void;
}

const templates = [
  {
    id: "modern",
    title: "Modern Professional",
    description: "Clean layout with header highlight",
    rating: 5,
    category: "Most Popular",
    color: "blue",
    features: ["ATS-friendly", "Clean typography", "Skills showcase"]
  },
  {
    id: "minimal",
    title: "Minimalist Elite",
    description: "Ultra-clean design for maximum impact",
    rating: 5,
    category: "Clean",
    color: "emerald",
    features: ["Minimalist design", "High readability", "Space efficient"]
  },
  {
    id: "creative",
    title: "Creative Portfolio",
    description: "Eye-catching side layout",
    rating: 5,
    category: "Design Roles",
    color: "purple",
    features: ["Visual appeal", "Portfolio section", "Creative freedom"]
  },
  {
    id: "executive",
    title: "Executive Premium",
    description: "Sophisticated layout for senior positions",
    rating: 5,
    category: "Leadership",
    color: "amber",
    features: ["Leadership focus", "Achievement highlights", "Premium feel"]
  },
  {
    id: "tech",
    title: "Tech Innovator",
    description: "Modern tech-focused design with project highlights",
    rating: 5,
    category: "Technology",
    color: "cyan",
    features: ["Tech-optimized", "Project showcase", "GitHub integration"]
  },
  {
    id: "classic",
    title: "Classic Executive",
    description: "Traditional format ideal for corporate positions",
    rating: 4,
    category: "Corporate",
    color: "slate",
    features: ["Professional layout", "Corporate style", "Experience focused"]
  },
];

export function TemplatePicker({ resumeData, onBack }: TemplatePickerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExportPDF = async () => {
    if (!selectedTemplate) {
      toast({
        title: "Please select a template",
        description: "Choose a template before exporting your resume.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      await generatePDF(resumeData, selectedTemplate);
      toast({
        title: "Resume exported successfully!",
        description: "Your PDF resume has been downloaded.",
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerateQR = async () => {
    try {
      const qrDataUrl = await generateQR("https://example.com/resume/123");
      // Create download link for QR code
      const link = document.createElement("a");
      link.href = qrDataUrl;
      link.download = "resume-qr-code.png";
      link.click();
      
      toast({
        title: "QR code generated!",
        description: "Your resume QR code has been downloaded.",
      });
    } catch (error) {
      console.error("QR generation error:", error);
      toast({
        title: "QR generation failed",
        description: "There was an error generating the QR code. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="mr-2" size={16} />
          Back to Wizard
        </Button>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Choose Your Template</h2>
        <p className="text-gray-600 dark:text-gray-300">Select a professional template that best represents your style</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`card-hover cursor-pointer transition-all duration-300 ${
              selectedTemplate === template.id
                ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/10"
                : ""
            }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <CardContent className="p-4">
              <div className="aspect-[3/4] bg-gray-100 dark:bg-slate-700 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                {/* Template Preview */}
                {template.id === "modern" && (
                  <div className="w-full h-full bg-white dark:bg-slate-800 p-3 text-xs">
                    <div className="bg-blue-500 text-white p-2 rounded-t">
                      <div className="font-bold">{resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}</div>
                      <div className="text-xs opacity-90">{resumeData.personalInfo.title}</div>
                    </div>
                    <div className="p-2 space-y-2">
                      <div className="bg-gray-100 dark:bg-slate-600 h-2 rounded"></div>
                      <div className="bg-gray-100 dark:bg-slate-600 h-2 rounded w-3/4"></div>
                      <div className="bg-gray-100 dark:bg-slate-600 h-2 rounded w-1/2"></div>
                    </div>
                  </div>
                )}

                {template.id === "minimal" && (
                  <div className="w-full h-full bg-white dark:bg-slate-800 p-3 text-xs">
                    <div className="text-center border-b pb-2 mb-2">
                      <div className="font-bold text-gray-900 dark:text-white">
                        {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">{resumeData.personalInfo.title}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-gray-100 dark:bg-slate-600 h-2 rounded"></div>
                      <div className="bg-gray-100 dark:bg-slate-600 h-2 rounded w-4/5"></div>
                      <div className="bg-gray-100 dark:bg-slate-600 h-2 rounded w-3/5"></div>
                    </div>
                  </div>
                )}

                {template.id === "creative" && (
                  <div className="w-full h-full bg-white dark:bg-slate-800 p-3 text-xs flex">
                    <div className="w-1/3 bg-purple-500 text-white p-2 rounded-l">
                      <div className="font-bold text-xs">{resumeData.personalInfo.firstName?.split('')[0] || "J"}</div>
                      <div className="font-bold text-xs">{resumeData.personalInfo.lastName?.split('')[0] || "D"}</div>
                      <div className="text-xs opacity-90 mt-1">{resumeData.personalInfo.title?.substring(0, 8) || "Developer"}</div>
                    </div>
                    <div className="w-2/3 p-2 space-y-2">
                      <div className="bg-gray-100 dark:bg-slate-600 h-2 rounded"></div>
                      <div className="bg-gray-100 dark:bg-slate-600 h-2 rounded w-3/4"></div>
                      <div className="bg-gray-100 dark:bg-slate-600 h-2 rounded w-1/2"></div>
                    </div>
                  </div>
                )}

                <div className={`absolute inset-0 bg-${template.color}-500/10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center`}>
                  <span className={`bg-${template.color}-500 text-white px-3 py-1 rounded-full text-sm font-medium`}>
                    Preview
                  </span>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{template.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{template.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < template.rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{template.category}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Export Section */}
      <div className="text-center">
        <Card className="inline-block">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Ready to Export?</h3>
            <div className="flex space-x-4">
              <Button
                onClick={handleExportPDF}
                disabled={isExporting || !selectedTemplate}
                size="lg"
                className="transform hover:scale-105 transition-all duration-300"
              >
                <FileText className="mr-2" size={20} />
                {isExporting ? "Exporting..." : "Export PDF"}
              </Button>
              <Button
                variant="outline"
                onClick={handleGenerateQR}
                size="lg"
                className="hover:bg-blue-500 hover:text-white transition-all duration-300"
              >
                <QrCode className="mr-2" size={20} />
                Generate QR
              </Button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              Your resume will include a QR code for easy sharing
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
