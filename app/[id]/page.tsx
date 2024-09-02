"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

// Define the structure of a quiz question
interface Question {
  question: string;
  options: string[];
  correct_answer_index: number;
}

export default function Quiz({ params }: { params: { id: string } }) {
  const [question, setQuestion] = useState<Question[]>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const handleAnswerClick = (selectedIndex: number) => {
    setSelectedAnswer(selectedIndex);
  };

  const fetchWords = async () => {
    setIsFetching(true);
    try {
      const response = await fetch(`/api/categories/${params.id}`, {
        cache: "no-cache",
      });
      if (!response.ok) throw new Error("Failed to fetch words");
      const data = await response.json();
      console.log(data);
      setQuestion(JSON.parse(data));
      setIsStarted(true);
    } catch (error) {
      console.error("Error fetching words:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleNextQuestion = () => {
    if (question !== undefined) {
      if (selectedAnswer === question[currentQuestion].correct_answer_index) {
        setScore(score + 1);
      }

      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < question.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(null);
      } else {
        setShowScore(true);
      }
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {!isStarted || question == undefined ? (
        <Button onClick={() => fetchWords()}>Test</Button>
      ) : (
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Japanese Language Quiz
            </CardTitle>
            <CardDescription className="text-center">
              Test your Japanese vocabulary!
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showScore ? (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
                <p className="text-xl">
                  You scored {score} out of {question.length}
                </p>
              </div>
            ) : (
              <>
                <Progress
                  value={((currentQuestion + 1) / question.length) * 100}
                  className="w-full mb-4"
                />
                <h2 className="text-xl font-semibold mb-4">
                  Question {currentQuestion + 1} of {question.length}
                </h2>
                <p className="text-lg mb-4">
                  {question[currentQuestion].question}
                </p>
                <RadioGroup
                  value={selectedAnswer?.toString()}
                  className="space-y-2"
                >
                  {question[currentQuestion].options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={index.toString()}
                        id={`option-${index}`}
                        onClick={() => handleAnswerClick(index)}
                      />
                      <Label htmlFor={`option-${index}`} className="text-base">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {showScore ? (
              <Button onClick={restartQuiz}>Restart Quiz</Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
              >
                {currentQuestion === question.length - 1
                  ? "Finish Quiz"
                  : "Next Question"}
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
