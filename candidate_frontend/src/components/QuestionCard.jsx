import { Card } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { CheckCircle2 } from "lucide-react";

export function QuestionCard({
  question,
  selectedAnswer, // This will now be "A", "B", "C", or "D"
  onAnswerSelect,
  questionNumber,
  totalQuestions,
}) {
  const optionLabels = ["A", "B", "C", "D"];

  const formatDifficulty = (difficulty) => {
    if (!difficulty) return "";
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-700 border-green-300";
      case "medium":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "hard":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  if (!question) return null;

  return (
    <Card className="p-8 bg-white shadow-lg">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {question.skill && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
                {question.skill}
              </Badge>
            )}
            {question.difficulty && (
              <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
                {formatDifficulty(question.difficulty)}
              </Badge>
            )}
          </div>
          <span className="text-sm text-gray-500">
            Question {questionNumber} of {totalQuestions}
          </span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
          {question.text}
        </h2>
      </div>

      <RadioGroup value={selectedAnswer || ""} onValueChange={onAnswerSelect}>
        <div className="space-y-3">
          {question.options?.map((option, index) => {
            // 🔥 1. Define the letter for this specific option (A, B, C, or D)
            const letter = optionLabels[index]; 

            return (
              <div
                key={index}
                className={`
                  relative flex items-center p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                  ${
                    selectedAnswer === letter // 🔥 2. Check if the saved state matches the LETTER
                      ? "border-purple-500 bg-gradient-to-r from-purple-50 to-cyan-50 shadow-md"
                      : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                  }
                `}
              >
                {/* 🔥 3. THIS IS THE MOST IMPORTANT LINE. value={letter} forces the payload to be A/B/C/D */}
                <RadioGroupItem value={letter} id={`option-${index}`} className="sr-only" />
                
                <Label
                  htmlFor={`option-${index}`}
                  className="flex items-center gap-4 cursor-pointer flex-1"
                >
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all
                      ${
                        selectedAnswer === letter // 🔥 4. Check against letter for UI styling
                          ? "bg-gradient-to-r from-purple-600 to-cyan-400 text-white"
                          : "bg-gray-100 text-gray-600"
                      }
                    `}
                  >
                    {letter}
                  </div>
                  <span className="flex-1 text-gray-800">{option}</span>
                  {selectedAnswer === letter && (
                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  )}
                </Label>
              </div>
            );
          })}
        </div>
      </RadioGroup>
    </Card>
  );
}