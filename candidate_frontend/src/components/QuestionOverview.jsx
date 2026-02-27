import { Card } from "./ui/card";
import { Bookmark, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

export function QuestionOverview({ questions, currentQuestion, onQuestionSelect }) {
  const [collapsed, setCollapsed] = useState(false);

  const answeredCount = questions.filter(q => q.answered).length;
  const markedCount = questions.filter(q => q.markedForReview).length;

  return (
    <Card className="p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Question Navigator</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </Button>
      </div>

      {!collapsed && (
        <>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {questions.map((question, index) => (
              <button
                key={question.id}
                onClick={() => onQuestionSelect(index)}
                className={`
                  relative w-10 h-10 rounded-lg font-medium text-sm transition-all duration-200
                  ${
                    index === currentQuestion
                      ? "bg-gradient-to-r from-purple-600 to-cyan-400 text-white shadow-lg scale-110"
                      : question.answered
                      ? "bg-green-100 text-green-700 border-2 border-green-300 hover:bg-green-200"
                      : "bg-gray-100 text-gray-600 border-2 border-gray-300 hover:bg-gray-200"
                  }
                `}
              >
                {index + 1}
                {question.markedForReview && (
                  <Bookmark className="w-3 h-3 absolute -top-1 -right-1 text-orange-500 fill-orange-500" />
                )}
              </button>
            ))}
          </div>

          <div className="space-y-2 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Answered:</span>
              <span className="font-semibold text-green-600">{answeredCount}/{questions.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Marked for Review:</span>
              <span className="font-semibold text-orange-600">{markedCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Not Answered:</span>
              <span className="font-semibold text-gray-600">{questions.length - answeredCount}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-r from-purple-600 to-cyan-400" />
                <span className="text-gray-600">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-100 border-2 border-green-300" />
                <span className="text-gray-600">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gray-100 border-2 border-gray-300" />
                <span className="text-gray-600">Not Answered</span>
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
