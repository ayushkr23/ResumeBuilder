import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, FileText, QrCode, Star, Check, Sparkles } from "lucide-react";
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
    description: "Clean layout with header highlight perfect for tech roles",
    rating: 5,
    category: "Most Popular",
    color: "blue",
    features: ["ATS-friendly", "Clean typography", "Skills showcase"],
    gradient: "from-blue-500 to-blue-600"
  },
  {
    id: "minimal",
    title: "Minimalist Elite",
    description: "Ultra-clean design for maximum impact and readability",
    rating: 5,
    category: "Clean",
    color: "emerald",
    features: ["Minimalist design", "High readability", "Space efficient"],
    gradient: "from-emerald-500 to-teal-600"
  },
  {
    id: "creative",
    title: "Creative Portfolio",
    description: "Eye-catching side layout for design professionals",
    rating: 5,
    category: "Design Roles",
    color: "purple",
    features: ["Visual appeal", "Portfolio section", "Creative freedom"],
    gradient: "from-purple-500 to-pink-600"
  },
  {
    id: "executive",
    title: "Executive Premium",
    description: "Sophisticated layout for senior leadership positions",
    rating: 5,
    category: "Leadership",
    color: "amber",
    features: ["Leadership focus", "Achievement highlights", "Premium feel"],
    gradient: "from-amber-500 to-orange-600"
  },
  {
    id: "tech",
    title: "Tech Innovator",
    description: "Modern tech-focused design with project highlights",
    rating: 5,
    category: "Technology",
    color: "cyan",
    features: ["Tech-optimized", "Project showcase", "GitHub integration"],
    gradient: "from-cyan-500 to-blue-600"
  },
  {
    id: "classic",
    title: "Classic Executive",
    description: "Traditional format ideal for corporate positions",
    rating: 4,
    category: "Corporate",
    color: "slate",
    features: ["Professional layout", "Corporate style", "Experience focused"],
    gradient: "from-slate-500 to-gray-600"
  },
];

export function TemplatePickerEnhanced({ resumeData, onBack }: TemplatePickerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-1000">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header with enhanced animations */}
        <div className="flex items-center justify-between mb-12 animate-in fade-in slide-in-from-top duration-700">
          <div>
            <Button 
              variant="ghost" 
              onClick={onBack} 
              className="mb-6 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-300 hover:scale-105 group"
            >
              <ArrowLeft className="mr-2 transition-transform duration-300 group-hover:-translate-x-1" size={16} />
              Back to Resume
            </Button>
            <div className="space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent animate-gradient-x">
                Choose Your Perfect Template
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                Select a professional template that matches your career goals and personal style
              </p>
            </div>
          </div>
          <div className="flex space-x-4">
            <Button 
              onClick={handleGenerateQR} 
              variant="outline" 
              className="hover:scale-105 transition-all duration-300 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm"
            >
              <QrCode className="mr-2" size={16} />
              Generate QR
            </Button>
            <Button 
              onClick={handleExportPDF} 
              disabled={!selectedTemplate || isExporting}
              className="hover:scale-105 transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
            >
              <FileText className="mr-2" size={16} />
              {isExporting ? "Exporting..." : "Export PDF"}
            </Button>
          </div>
        </div>

        {/* Templates grid with staggered animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, index) => (
            <Card
              key={template.id}
              className={`group cursor-pointer transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 ${
                selectedTemplate === template.id
                  ? "ring-4 ring-blue-500 shadow-2xl bg-white dark:bg-slate-800 scale-105"
                  : "hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-2xl"
              }`}
              onClick={() => setSelectedTemplate(template.id)}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
              style={{ 
                animationDelay: `${index * 150}ms`,
                animation: 'slideInUp 0.8s ease-out forwards'
              }}
            >
              <CardContent className="p-6 h-full flex flex-col">
                {/* Header with category and rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                    template.color === 'blue' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200' :
                    template.color === 'emerald' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200' :
                    template.color === 'purple' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200' :
                    template.color === 'amber' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200' :
                    template.color === 'cyan' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-200' :
                    'bg-slate-100 text-slate-800 dark:bg-slate-900/50 dark:text-slate-200'
                  } ${hoveredTemplate === template.id ? 'scale-110' : ''}`}>
                    <Sparkles className="inline w-3 h-3 mr-1" />
                    {template.category}
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={`transition-all duration-300 ${
                          i < template.rating 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "text-gray-300"
                        } ${hoveredTemplate === template.id ? 'animate-pulse' : ''}`}
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Template preview */}
                <div className={`relative h-48 rounded-xl mb-4 overflow-hidden transition-all duration-500 bg-gradient-to-br ${template.gradient} p-1`}>
                  <div className="w-full h-full bg-white dark:bg-slate-800 rounded-lg p-3 flex flex-col justify-between">
                    {/* Mock resume content */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full"></div>
                        <div>
                          <div className="w-16 h-2 bg-gray-300 rounded"></div>
                          <div className="w-12 h-1.5 bg-gray-200 rounded mt-1"></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="w-full h-2 bg-gray-200 rounded"></div>
                        <div className="w-4/5 h-2 bg-gray-200 rounded"></div>
                        <div className="w-3/5 h-2 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="w-2/3 h-1.5 bg-gray-200 rounded"></div>
                      <div className="w-1/2 h-1.5 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  
                  {/* Hover overlay */}
                  {hoveredTemplate === template.id && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-sm transition-all duration-300">
                      <span className="bg-white/90 dark:bg-slate-900/90 text-gray-900 dark:text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                        Click to Select
                      </span>
                    </div>
                  )}
                </div>

                {/* Template info */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {template.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                    {template.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {template.features.map((feature, featureIndex) => (
                      <div 
                        key={featureIndex} 
                        className="flex items-center text-xs text-gray-600 dark:text-gray-400 transition-all duration-300"
                        style={{ animationDelay: `${featureIndex * 100}ms` }}
                      >
                        <Check className={`w-3 h-3 mr-2 transition-colors duration-300 ${
                          template.color === 'blue' ? 'text-blue-500' :
                          template.color === 'emerald' ? 'text-emerald-500' :
                          template.color === 'purple' ? 'text-purple-500' :
                          template.color === 'amber' ? 'text-amber-500' :
                          template.color === 'cyan' ? 'text-cyan-500' :
                          'text-slate-500'
                        }`} />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selection indicator */}
                {selectedTemplate === template.id && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-700 animate-in fade-in slide-in-from-bottom duration-500">
                    <div className="flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-500 mr-2 animate-bounce" />
                      <span className="text-blue-800 dark:text-blue-300 font-bold">
                        Template Selected - Ready to Export!
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
}