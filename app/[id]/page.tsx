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
import { CloudCog, RefreshCw } from "lucide-react";
import { redirect, useRouter } from "next/navigation";

interface ISentence {
  content: string;
  mean: string;
}

export default function Quiz({ params }: { params: { id: string } }) {
  const [question, setQuestion] = useState<ISentence[]>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isMean, setIsMean] = useState<boolean>(false);
  const router = useRouter();

  const fetchWords = async () => {
    setIsFetching(true);
    try {
      const response = await fetch(`/api/categories/${params.id}`, {
        cache: "no-cache",
      });

      if (!response.ok) throw new Error("Failed to fetch words");
      const data = (await response.json()).result;
      setQuestion(data);
      setIsStarted(true);
      setIsFetching(false);
    } catch (error) {
      console.error("Error fetching words:", error);
      return false;
    }
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;

    if (nextQuestion < question!.length) {
      setCurrentQuestion(nextQuestion);
    }
    setIsMean(false);
  };

  const handleRepeat = () => {
    setCurrentQuestion(0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {!isStarted || question == undefined ? (
        <Button
          onClick={() => {
            fetchWords();
          }}
        >
          Test
          {isFetching ? (
            <RefreshCw className=" animate-spin ml-4 size-4" />
          ) : (
            ""
          )}
        </Button>
      ) : (
        <Card className="w-full max-w-2xl h-2/3">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              日本語能力試験を達成しろ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <>
              <Progress
                value={((currentQuestion + 1) / question.length) * 100}
                className="w-full mb-4"
              />
              <p
                className="text-xl mb-4 text-center py-20  rounded-xl"
                onClick={() => {
                  setIsMean((prev) => !prev);
                }}
              >
                {question[currentQuestion]
                  ? isMean
                    ? question[currentQuestion].mean
                    : question[currentQuestion].content
                  : ""}
              </p>
            </>
          </CardContent>
          <CardFooter className="flex justify-center gap-10">
            <Button onClick={handleNextQuestion}>次</Button>
            {currentQuestion === question!.length - 1 ? (
              <Button onClick={handleRepeat}>もう一度</Button>
            ) : null}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}