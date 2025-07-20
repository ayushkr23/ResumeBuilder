import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Code, BarChart, Megaphone, Palette, Briefcase, Users } from "lucide-react";

interface RoleSelectorProps {
  onRoleSelect: (role: string) => void;
  onBack: () => void;
}

const roles = [
  {
    id: "developer",
    title: "Software Developer",
    description: "Backend, Frontend, Full-stack development roles",
    icon: Code,
    color: "blue",
    skills: ["JavaScript", "Python", "React"],
  },
  {
    id: "analyst",
    title: "Data Analyst", 
    description: "Business intelligence, data science, analytics",
    icon: BarChart,
    color: "emerald",
    skills: ["SQL", "Excel", "Tableau"],
  },
  {
    id: "marketing",
    title: "Marketing",
    description: "Digital marketing, content, social media",
    icon: Megaphone,
    color: "violet",
    skills: ["SEO", "Analytics", "Content"],
  },
  {
    id: "design",
    title: "UI/UX Designer",
    description: "User experience, interface design, product design",
    icon: Palette,
    color: "rose",
    skills: ["Figma", "Sketch", "Adobe XD"],
  },
  {
    id: "business",
    title: "Business Analyst",
    description: "Process improvement, requirements analysis",
    icon: Briefcase,
    color: "amber",
    skills: ["JIRA", "Confluence", "SQL"],
  },
  {
    id: "hr",
    title: "Human Resources",
    description: "Recruitment, employee relations, training",
    icon: Users,
    color: "teal",
    skills: ["Recruiting", "HRIS", "Training"],
  },
];

export function RoleSelector({ onRoleSelect, onBack }: RoleSelectorProps) {
  return (
    <div className="animate-slide-up">
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="mr-2" size={16} />
          Back
        </Button>
      </div>
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Choose Your Career Path</h2>
        <p className="text-gray-600 dark:text-gray-300">Select your target role to get personalized resume guidance and examples</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => {
          const IconComponent = role.icon;
          return (
            <Card
              key={role.id}
              className="card-hover cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-blue-500"
              onClick={() => onRoleSelect(role.id)}
            >
              <CardContent className="p-6">
                <div className={`w-16 h-16 bg-${role.color}-100 dark:bg-${role.color}-900/30 rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                  <IconComponent className={`text-2xl text-${role.color}-500`} size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
                  {role.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center text-sm mb-4">
                  {role.description}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {role.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`px-2 py-1 bg-${role.color}-50 dark:bg-${role.color}-900/20 text-${role.color}-600 dark:text-${role.color}-400 text-xs rounded-full`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
