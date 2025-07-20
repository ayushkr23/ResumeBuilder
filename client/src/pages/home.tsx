import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RoleSelector } from "@/components/role-selector";
import { ResumeWizard } from "@/components/resume-wizard";
import { TemplatePickerEnhanced } from "@/components/template-picker-enhanced";
import { AIPanel } from "@/components/ai-panel";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";
import { FileText, Rocket, Upload, Moon, Sun, Save } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import type { ResumeData } from "@shared/schema";

type Screen = "welcome" | "roleSelector" | "wizard" | "templates";

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [resumeData, setResumeData] = useLocalStorage<ResumeData>("resume-draft", {
    personalInfo: {
      firstName: "",
      lastName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
    },
    education: [],
    skills: [],
    projects: [],
    summary: "",
    selectedRole: "",
  });
  const [showAIPanel, setShowAIPanel] = useState(false);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Auto-saving resume draft...");
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setResumeData({ ...resumeData, selectedRole: role });
    setCurrentScreen("wizard");
  };

  const handleWizardComplete = () => {
    setCurrentScreen("templates");
  };

  const handleLoadDraft = () => {
    const savedDraft = localStorage.getItem("resume-draft");
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setResumeData(parsedDraft);
        
        // If there's a selected role, go to wizard, otherwise go to role selector
        if (parsedDraft.selectedRole) {
          setSelectedRole(parsedDraft.selectedRole);
          setCurrentScreen("wizard");
        } else {
          setCurrentScreen("roleSelector");
        }
        
        toast({
          title: "Draft loaded successfully!",
          description: "Your saved resume data has been restored.",
        });
      } catch (error) {
        console.error("Error loading draft:", error);
        toast({
          title: "Error loading draft",
          description: "There was an issue loading your saved draft. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "No saved draft found",
        description: "Start building a new resume to create a draft.",
        variant: "destructive",
      });
    }
  };

  const handleSaveDraft = () => {
    try {
      localStorage.setItem("resume-draft", JSON.stringify(resumeData));
      toast({
        title: "Draft saved!",
        description: "Your resume progress has been saved locally.",
      });
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error saving draft",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Navigation Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
                <FileText className="text-white" size={16} />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">ResumeAI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
              <Button onClick={handleSaveDraft}>
                <Save className="mr-2" size={16} />
                Save Draft
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentScreen === "welcome" && (
          <div className="text-center mb-12 animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Build Your Professional Resume with{" "}
                <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                  AI Guidance
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Designed specifically for Tier-2/Tier-3 students to create impressive resumes that stand out to employers
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => setCurrentScreen("roleSelector")}
                  size="lg"
                  className="transform hover:scale-105 transition-all duration-300"
                >
                  <Rocket className="mr-2" size={20} />
                  Start Building
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleLoadDraft}
                  className="hover:border-blue-500 hover:text-blue-500 transition-all duration-300"
                >
                  <Upload className="mr-2" size={20} />
                  Load Draft
                </Button>
              </div>
            </div>
          </div>
        )}

        {currentScreen === "roleSelector" && (
          <RoleSelector
            onRoleSelect={handleRoleSelect}
            onBack={() => setCurrentScreen("welcome")}
          />
        )}

        {currentScreen === "wizard" && (
          <ResumeWizard
            selectedRole={selectedRole}
            resumeData={resumeData}
            onDataChange={setResumeData}
            onComplete={handleWizardComplete}
            onBack={() => setCurrentScreen("roleSelector")}
          />
        )}

        {currentScreen === "templates" && (
          <TemplatePickerEnhanced
            resumeData={resumeData}
            onBack={() => setCurrentScreen("wizard")}
          />
        )}
      </div>

      {/* AI Panel */}
      {currentScreen === "wizard" && (
        <AIPanel
          isOpen={showAIPanel}
          onToggle={() => setShowAIPanel(!showAIPanel)}
          resumeData={resumeData}
          selectedRole={selectedRole}
        />
      )}
    </div>
  );
}
