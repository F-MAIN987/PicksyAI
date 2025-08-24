import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface StyleQuizProps {
  onComplete: () => void;
}

const StyleQuiz = ({ onComplete }: StyleQuizProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const questions = [
    {
      id: "budget",
      title: "What's your budget range?",
      type: "choice",
      options: [
        { label: "Under ₹2,000", value: "under-2000" },
        { label: "₹2,000 - ₹5,000", value: "2000-5000" },
        { label: "₹5,000 - ₹10,000", value: "5000-10000" },
        { label: "₹10,000+", value: "10000-plus" }
      ]
    },
    {
      id: "style",
      title: "Which aesthetic speaks to you?",
      type: "multiple",
      options: [
        { label: "Minimal", value: "minimal" },
        { label: "Street", value: "street" },
        { label: "Classic", value: "classic" },
        { label: "Bold", value: "bold" },
        { label: "Romantic", value: "romantic" },
        { label: "Edgy", value: "edgy" }
      ]
    },
    {
      id: "fit",
      title: "How do you prefer your clothes to fit?",
      type: "choice",
      options: [
        { label: "Tailored & fitted", value: "fitted" },
        { label: "Relaxed & comfortable", value: "relaxed" },
        { label: "Oversized & loose", value: "oversized" },
        { label: "Mix of both", value: "mixed" }
      ]
    },
    {
      id: "colors",
      title: "Colors you love?",
      type: "multiple",
      options: [
        { label: "Neutrals", value: "neutrals" },
        { label: "Earth tones", value: "earth" },
        { label: "Bright colors", value: "bright" },
        { label: "Pastels", value: "pastels" },
        { label: "Monochromes", value: "mono" },
        { label: "Jewel tones", value: "jewel" }
      ]
    },
    {
      id: "priorities",
      title: "What matters most to you?",
      type: "multiple",
      options: [
        { label: "Quality over quantity", value: "quality" },
        { label: "Sustainability", value: "sustainability" },
        { label: "Fast shipping", value: "shipping" },
        { label: "Easy returns", value: "returns" },
        { label: "Trend-focused", value: "trends" },
        { label: "Timeless pieces", value: "timeless" }
      ]
    }
  ];

  const progress = ((currentStep + 1) / questions.length) * 100;
  const currentQuestion = questions[currentStep];

  const handleAnswer = (value: string) => {
    if (currentQuestion.type === "multiple") {
      const currentAnswers = answers[currentQuestion.id] || [];
      const newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter((v: string) => v !== value)
        : [...currentAnswers, value];
      setAnswers({ ...answers, [currentQuestion.id]: newAnswers });
    } else {
      setAnswers({ ...answers, [currentQuestion.id]: value });
    }
  };

  const isAnswered = () => {
    const answer = answers[currentQuestion.id];
    return currentQuestion.type === "multiple" 
      ? answer && answer.length > 0
      : answer;
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save preferences to localStorage
      localStorage.setItem('stylePreferences', JSON.stringify(answers));
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-subtle-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="border-0 shadow-hero">
          <CardHeader className="text-center pb-6">
            <div className="mb-4">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                Step {currentStep + 1} of {questions.length}
              </p>
            </div>
            <CardTitle className="text-2xl lg:text-3xl">
              {currentQuestion.title}
            </CardTitle>
            {currentQuestion.type === "multiple" && (
              <p className="text-sm text-muted-foreground">
                Select all that apply
              </p>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {currentQuestion.options.map((option) => {
                const isSelected = currentQuestion.type === "multiple"
                  ? (answers[currentQuestion.id] || []).includes(option.value)
                  : answers[currentQuestion.id] === option.value;

                return (
                  <Button
                    key={option.value}
                    variant={isSelected ? "default" : "subtle"}
                    className="justify-start h-auto p-4 text-left"
                    onClick={() => handleAnswer(option.value)}
                  >
                    <Badge 
                      variant={isSelected ? "secondary" : "outline"}
                      className="mr-3 shrink-0"
                    >
                      {isSelected ? "✓" : " "}
                    </Badge>
                    {option.label}
                  </Button>
                );
              })}
            </div>

            <div className="flex justify-between pt-6">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <Button
                onClick={nextStep}
                disabled={!isAnswered()}
                variant={isAnswered() ? "default" : "outline"}
              >
                {currentStep === questions.length - 1 ? "Complete" : "Next"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StyleQuiz;