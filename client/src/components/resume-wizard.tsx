import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Plus, X, Lightbulb, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { personalInfoSchema, educationSchema, projectSchema, type ResumeData, type PersonalInfo, type Education, type Skill, type Project } from "@shared/schema";

interface ResumeWizardProps {
  selectedRole: string | null;
  resumeData: ResumeData;
  onDataChange: (data: ResumeData) => void;
  onComplete: () => void;
  onBack: () => void;
}

const steps = [
  { id: 1, title: "Personal Info", description: "Basic contact information" },
  { id: 2, title: "Education", description: "Educational background" },
  { id: 3, title: "Skills", description: "Technical and soft skills" },
  { id: 4, title: "Projects", description: "Portfolio and work samples" },
  { id: 5, title: "Summary", description: "Professional summary" },
];

export function ResumeWizard({ selectedRole, resumeData, onDataChange, onComplete, onBack }: ResumeWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [skillInput, setSkillInput] = useState("");
  const [projectInput, setProjectInput] = useState({
    title: "",
    description: "",
    technologies: "",
    link: "",
    github: "",
  });

  // Fetch AI skill suggestions for the selected role
  const { data: skillSuggestions } = useQuery({
    queryKey: ["/api/skills", selectedRole],
    enabled: !!selectedRole && currentStep === 3,
  });

  const personalForm = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: resumeData.personalInfo.firstName || "",
      lastName: resumeData.personalInfo.lastName || "",
      title: resumeData.personalInfo.title || "",
      email: resumeData.personalInfo.email || "",
      phone: resumeData.personalInfo.phone || "",
      location: resumeData.personalInfo.location || "",
      linkedin: resumeData.personalInfo.linkedin || "",
      github: resumeData.personalInfo.github || "",
    },
  });

  const educationForm = useForm<Education>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      degree: resumeData.education[0]?.degree || "",
      fieldOfStudy: resumeData.education[0]?.fieldOfStudy || "",
      institution: resumeData.education[0]?.institution || "",
      gpa: resumeData.education[0]?.gpa || "",
      startYear: resumeData.education[0]?.startYear || undefined,
      endYear: resumeData.education[0]?.endYear || undefined,
    },
  });

  const projectForm = useForm<Project>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      technologies: [],
      link: "",
      github: "",
    },
  });

  const handlePersonalInfoSubmit = (data: PersonalInfo) => {
    onDataChange({
      ...resumeData,
      personalInfo: data,
    });
    nextStep();
  };

  const handleEducationSubmit = (data: Education) => {
    onDataChange({
      ...resumeData,
      education: [data],
    });
    nextStep();
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      const newSkill: Skill = {
        name: skillInput.trim(),
        category: "technical",
      };
      onDataChange({
        ...resumeData,
        skills: [...resumeData.skills, newSkill],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    onDataChange({
      ...resumeData,
      skills: resumeData.skills.filter((_, i) => i !== index),
    });
  };

  const addSuggestedSkill = (skillName: string) => {
    const newSkill: Skill = {
      name: skillName,
      category: "technical",
    };
    onDataChange({
      ...resumeData,
      skills: [...resumeData.skills, newSkill],
    });
  };

  const addProject = () => {
    if (projectInput.title.trim()) {
      const newProject: Project = {
        title: projectInput.title.trim(),
        description: projectInput.description.trim(),
        technologies: projectInput.technologies ? projectInput.technologies.split(",").map(t => t.trim()) : [],
        link: projectInput.link.trim(),
        github: projectInput.github.trim(),
      };
      onDataChange({
        ...resumeData,
        projects: [...resumeData.projects, newProject],
      });
      setProjectInput({
        title: "",
        description: "",
        technologies: "",
        link: "",
        github: "",
      });
    }
  };

  const removeProject = (index: number) => {
    onDataChange({
      ...resumeData,
      projects: resumeData.projects.filter((_, i) => i !== index),
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div>
      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.id} className="step-indicator flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep > step.id
                    ? "bg-green-500 text-white"
                    : currentStep === step.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 dark:bg-slate-600 text-gray-600 dark:text-gray-400"
                }`}
              >
                {currentStep > step.id ? <CheckCircle size={20} /> : step.id}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Progress value={progress} className="mb-8" />

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Information</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <Lightbulb className="text-amber-500" size={16} />
                        <span>AI suggestions available</span>
                      </div>
                    </div>

                    <Form {...personalForm}>
                      <form onSubmit={personalForm.handleSubmit(handlePersonalInfoSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={personalForm.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={personalForm.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={personalForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Professional Title</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Software Developer, Data Analyst" {...field} />
                              </FormControl>
                              <p className="text-xs text-gray-500 dark:text-gray-400">This will appear as your headline</p>
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={personalForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="john.doe@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={personalForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                  <Input type="tel" placeholder="+91 98765 43210" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={personalForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="Mumbai, Maharashtra, India" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={personalForm.control}
                            name="linkedin"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>LinkedIn Profile</FormLabel>
                                <FormControl>
                                  <Input type="url" placeholder="https://linkedin.com/in/johndoe" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={personalForm.control}
                            name="github"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>GitHub Profile</FormLabel>
                                <FormControl>
                                  <Input type="url" placeholder="https://github.com/johndoe" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-slate-700">
                          <Button type="button" variant="ghost" onClick={onBack}>
                            <ArrowLeft className="mr-2" size={16} />
                            Back
                          </Button>
                          <Button type="submit">
                            Next
                            <ArrowRight className="ml-2" size={16} />
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                )}

                {/* Step 2: Education */}
                {currentStep === 2 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Education</h3>
                      <Button variant="outline" size="sm">
                        <Plus className="mr-1" size={16} />
                        Add Education
                      </Button>
                    </div>

                    <Form {...educationForm}>
                      <form onSubmit={educationForm.handleSubmit(handleEducationSubmit)} className="space-y-6">
                        <div className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <FormField
                              control={educationForm.control}
                              name="degree"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Degree *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Bachelor of Technology" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={educationForm.control}
                              name="fieldOfStudy"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Field of Study</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Computer Science Engineering" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <FormField
                              control={educationForm.control}
                              name="institution"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Institution *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="ABC Engineering College" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={educationForm.control}
                              name="gpa"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>GPA/Percentage</FormLabel>
                                  <FormControl>
                                    <Input placeholder="8.5 CGPA" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={educationForm.control}
                              name="startYear"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Start Year</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="2020"
                                      {...field}
                                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={educationForm.control}
                              name="endYear"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>End Year</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="2024"
                                      {...field}
                                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-slate-700">
                          <Button type="button" variant="ghost" onClick={prevStep}>
                            <ArrowLeft className="mr-2" size={16} />
                            Previous
                          </Button>
                          <Button type="submit">
                            Next
                            <ArrowRight className="ml-2" size={16} />
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                )}

                {/* Step 3: Skills */}
                {currentStep === 3 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Skills & Technologies</h3>
                      <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle size={16} />
                        <span>AI optimized</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Add Skills</label>
                        <div className="flex space-x-2 mt-2 mb-3">
                          <Input
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            placeholder="Type a skill and press Enter"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addSkill();
                              }
                            }}
                            className="flex-1"
                          />
                          <Button onClick={addSkill}>
                            <Plus size={16} />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {resumeData.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center">
                              {skill.name}
                              <button
                                onClick={() => removeSkill(index)}
                                className="ml-2 text-gray-500 hover:text-gray-700"
                              >
                                <X size={12} />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {skillSuggestions && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                            <Lightbulb className="inline mr-2" size={16} />
                            AI Skill Suggestions for {selectedRole}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {skillSuggestions.skills?.map((skill: any, index: number) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => addSuggestedSkill(skill.name)}
                                className="bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                              >
                                {skill.name}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-slate-700">
                      <Button variant="ghost" onClick={prevStep}>
                        <ArrowLeft className="mr-2" size={16} />
                        Previous
                      </Button>
                      <Button onClick={nextStep}>
                        Next
                        <ArrowRight className="ml-2" size={16} />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 4: Projects */}
                {currentStep === 4 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Projects & Portfolio</h3>
                      <div className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
                        <Lightbulb size={16} />
                        <span>Showcase your work</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Add Project Form */}
                      <div className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg">
                        <h4 className="font-medium mb-4">Add New Project</h4>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              placeholder="Project Title"
                              value={projectInput.title}
                              onChange={(e) => setProjectInput(prev => ({ ...prev, title: e.target.value }))}
                            />
                            <Input
                              placeholder="Technologies (comma separated)"
                              value={projectInput.technologies}
                              onChange={(e) => setProjectInput(prev => ({ ...prev, technologies: e.target.value }))}
                            />
                          </div>
                          <Textarea
                            placeholder="Project description and key achievements"
                            value={projectInput.description}
                            onChange={(e) => setProjectInput(prev => ({ ...prev, description: e.target.value }))}
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              placeholder="Demo/Live Link (optional)"
                              value={projectInput.link}
                              onChange={(e) => setProjectInput(prev => ({ ...prev, link: e.target.value }))}
                            />
                            <Input
                              placeholder="GitHub Link (optional)"
                              value={projectInput.github}
                              onChange={(e) => setProjectInput(prev => ({ ...prev, github: e.target.value }))}
                            />
                          </div>
                          <Button onClick={addProject} disabled={!projectInput.title.trim()}>
                            <Plus className="mr-2" size={16} />
                            Add Project
                          </Button>
                        </div>
                      </div>

                      {/* Projects List */}
                      {resumeData.projects.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="font-medium">Your Projects</h4>
                          {resumeData.projects.map((project, index) => (
                            <div key={index} className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-medium text-gray-900 dark:text-white">{project.title}</h5>
                                <button
                                  onClick={() => removeProject(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{project.description}</p>
                              {project.technologies && project.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {project.technologies.map((tech, techIndex) => (
                                    <Badge key={techIndex} variant="outline" className="text-xs">
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              <div className="flex space-x-4 text-sm">
                                {project.link && (
                                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                    Live Demo
                                  </a>
                                )}
                                {project.github && (
                                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                    GitHub
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-slate-700">
                      <Button variant="ghost" onClick={prevStep}>
                        <ArrowLeft className="mr-2" size={16} />
                        Previous
                      </Button>
                      <Button onClick={nextStep}>
                        Next
                        <ArrowRight className="ml-2" size={16} />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 5: Summary */}
                {currentStep === 5 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Professional Summary</h3>
                      <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle size={16} />
                        <span>Final step</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
                          Write a compelling summary for your {selectedRole} resume
                        </label>
                        <Textarea
                          placeholder="Write 2-3 sentences highlighting your key skills, experience, and career goals..."
                          value={resumeData.summary || ""}
                          onChange={(e) => onDataChange({ ...resumeData, summary: e.target.value })}
                          className="min-h-[120px]"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Tip: Focus on what makes you unique and how you can add value to employers
                        </p>
                      </div>

                      {resumeData.summary && (
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                          <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Preview</h4>
                          <p className="text-sm text-green-700 dark:text-green-400">
                            {resumeData.summary}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-slate-700">
                      <Button variant="ghost" onClick={prevStep}>
                        <ArrowLeft className="mr-2" size={16} />
                        Previous
                      </Button>
                      <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
                        Complete & Choose Template
                        <ArrowRight className="ml-2" size={16} />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Live Preview Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Live Preview</h4>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                      Auto-save
                    </Badge>
                  </div>
                </div>

                {/* Mock Resume Preview */}
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 text-sm">
                  <div className="border-b border-gray-200 dark:border-slate-600 pb-3 mb-3">
                    <h5 className="font-bold text-lg text-gray-900 dark:text-white">
                      {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
                    </h5>
                    <p className="text-gray-600 dark:text-gray-300">{resumeData.personalInfo.title}</p>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>{resumeData.personalInfo.email}</span>
                      {resumeData.personalInfo.phone && (
                        <>
                          {" • "}
                          <span>{resumeData.personalInfo.phone}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {resumeData.education.length > 0 && (
                    <div className="mb-3">
                      <h6 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Education</h6>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {resumeData.education[0].degree} {resumeData.education[0].fieldOfStudy}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {resumeData.education[0].institution} ({resumeData.education[0].startYear}-{resumeData.education[0].endYear})
                      </p>
                    </div>
                  )}

                  {resumeData.skills.length > 0 && (
                    <div>
                      <h6 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Skills</h6>
                      <div className="flex flex-wrap gap-1">
                        {resumeData.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Resume Score */}
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-amber-800 dark:text-amber-300">Resume Score</span>
                    <span className="text-lg font-bold text-amber-600 dark:text-amber-400">7/10</span>
                  </div>
                  <Progress value={70} className="mb-2" />
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    Add projects to improve your score
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
