"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ISentence {
  content: string;
  mean: string;
  transcription: string;
  word: string;
}

export default function QuizCard({ words }: { words: any }) {
  const [questions, setQuestion] = useState<ISentence[]>(words);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isMean, setIsMean] = useState<boolean>(false);

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;

    if (nextQuestion < questions!.length) {
      setCurrentQuestion(nextQuestion);
    }
    setIsMean(false);
  };

  const handleRepeat = () => {
    setCurrentQuestion(0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-2xl h-2/3">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            <div className="flex justify-between items-center">
              <div className="text-sm text-white">Mazii</div>
              <p>達成しろ</p>
              <a
                target="_blank"
                href={`https://mazii.net/vi-VN/search/word/javi/${questions[currentQuestion]?.word ?? "null"}`}
                className="text-sm text-blue-600"
              >
                Mazii
              </a>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <>
            <Progress
              value={((currentQuestion + 1) / questions.length) * 100}
              className="w-full "
            />
            <div
              className="text-xl text-center py-20  rounded-xl"
              onClick={() => {
                setIsMean((prev) => !prev);
              }}
            >
              {questions[currentQuestion] &&
                (isMean ? (
                  <div>
                    <p>{questions[currentQuestion]?.mean}</p>
                    <br />
                    <p>{questions[currentQuestion]?.transcription}</p>
                  </div>
                ) : (
                  questions[currentQuestion]?.content
                ))}
            </div>
          </>
        </CardContent>
        <CardFooter className="flex justify-center gap-10">
          <Button onClick={handleNextQuestion}>次</Button>
          {currentQuestion === questions!.length - 1 ? (
            <Button onClick={handleRepeat}>もう一度</Button>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
}
