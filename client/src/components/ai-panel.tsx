import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Bot, X, Lightbulb, Zap, TrendingUp } from "lucide-react";
import type { ResumeData, AISuggestion, ResumeScore } from "@shared/schema";

interface AIPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  resumeData: ResumeData;
  selectedRole: string | null;
}

export function AIPanel({ isOpen, onToggle, resumeData, selectedRole }: AIPanelProps) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [score, setScore] = useState<ResumeScore | null>(null);

  // Fetch AI suggestions
  const suggestionsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/ai/suggestions", {
        resumeData,
        role: selectedRole,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setSuggestions(data.suggestions || []);
    },
  });

  // Fetch resume score
  const scoreMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/ai/score", {
        resumeData,
        role: selectedRole,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setScore(data);
    },
  });

  // Auto-fetch suggestions when panel opens
  useEffect(() => {
    if (isOpen && selectedRole && resumeData.personalInfo.firstName) {
      suggestionsMutation.mutate();
      scoreMutation.mutate();
    }
  }, [isOpen, selectedRole]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "skill":
        return <Zap className="h-4 w-4" />;
      case "improvement":
        return <TrendingUp className="h-4 w-4" />;
      case "content":
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-4 right-4 w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg transform hover:scale-110 transition-all duration-300"
        size="icon"
      >
        <Bot className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-xl animate-slide-up">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">AI Assistant</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onToggle}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {/* Resume Score */}
          {score && (
            <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-amber-800 dark:text-amber-300">Resume Score</span>
                <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                  {score.score}/10
                </span>
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-300">{score.feedback}</p>
            </div>
          )}

          {/* AI Suggestions */}
          {suggestionsMutation.isPending && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Analyzing your resume...</p>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center space-x-1">
                      {getTypeIcon(suggestion.type)}
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                        {suggestion.title}
                      </span>
                    </div>
                    <Badge variant={getPriorityColor(suggestion.priority)} className="text-xs">
                      {suggestion.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    {suggestion.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {!suggestionsMutation.isPending && suggestions.length === 0 && selectedRole && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Fill out more sections to get AI suggestions
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => suggestionsMutation.mutate()}
              >
                Get Suggestions
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
