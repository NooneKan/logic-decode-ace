import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface QuizQuestionProps {
  question: string;
  code?: string;
  options: string[];
  correctAnswer: number;
  onAnswer: (correct: boolean) => void;
  timeLeft?: number;
}

export const QuizQuestion = ({
  question,
  code,
  options,
  correctAnswer,
  onAnswer,
  timeLeft = 30
}: QuizQuestionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === correctAnswer;
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1500);
  };

  const getOptionStyle = (index: number) => {
    if (!showResult) {
      return selectedAnswer === index 
        ? "bg-primary text-primary-foreground border-primary" 
        : "bg-card hover:bg-muted border-border";
    }
    
    // Resposta correta sempre em verde
    if (index === correctAnswer) {
      return "bg-green-500/20 text-green-700 border-green-500 dark:bg-green-500/30 dark:text-green-400";
    }
    
    // Resposta errada selecionada em vermelho
    if (index === selectedAnswer && index !== correctAnswer) {
      return "bg-red-500/20 text-red-700 border-red-500 dark:bg-red-500/30 dark:text-red-400";
    }
    
    // Outras opções em cinza quando mostrando resultado
    return "bg-muted/50 text-muted-foreground border-muted";
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Timer */}
      <div className="flex items-center justify-center gap-2 text-warning">
        <Clock className="w-5 h-5" />
        <span className="font-semibold">{timeLeft}s</span>
      </div>

      {/* Question */}
      <Card className="p-6 bg-gradient-card border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">{question}</h2>
        
        {/* Code block if provided */}
        {code && (
          <div className="bg-muted p-4 rounded-lg mb-4 overflow-x-auto">
            <pre className="text-sm text-muted-foreground font-mono">
              <code>{code}</code>
            </pre>
          </div>
        )}
      </Card>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, index) => (
            <Button
            key={index}
            onClick={() => handleAnswer(index)}
            variant="outline"
            className={`w-full p-4 text-left justify-start min-h-[60px] border-2 ${getOptionStyle(index)} transition-all duration-500 transform ${showResult && index === correctAnswer ? 'scale-102' : ''}`}
            disabled={showResult}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-background/20 flex items-center justify-center text-sm font-semibold">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1">{option}</span>
              {showResult && index === correctAnswer && (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 animate-scale-in" />
              )}
              {showResult && index === selectedAnswer && index !== correctAnswer && (
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 animate-scale-in" />
              )}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};