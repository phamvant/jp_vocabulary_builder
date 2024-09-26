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
  word: string;
  example: string;
}

export default function Quiz({
  params,
}: {
  params: { id: string; page: number };
}) {
  const [question, setQuestion] = useState<ISentence[]>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const router = useRouter();

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const response = await fetch(
        `/api/categories/${params.id}/${params.page}`,
        {
          cache: "no-cache",
        },
      );

      if (!response.ok) throw new Error("Failed to fetch words");
      const data = await response.json();
      setQuestion(JSON.parse(data).response.sentences);
      setIsStarted(true);
      setIsFetching(false);
      return true;
    } catch (error) {
      console.error("Error fetching words:", error);
      return false;
    }
  };

  const fetchWords = async () => {
    while (1) {
      if (await fetchData()) {
        break;
      }
    }
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < question!.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      router.push(`/${params.id}/${Number(params.page) + 1}`);
    }
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
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Japanese Language Quiz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <>
              <Progress
                value={((currentQuestion + 1) / question.length) * 100}
                className="w-full mb-4"
              />
              <h2 className="text-xl font-semibold mb-4 text-center">
                Sentence {currentQuestion + 1} of {question.length}
              </h2>
              <p className="text-lg mb-4 text-center">
                {question[currentQuestion].example}
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
