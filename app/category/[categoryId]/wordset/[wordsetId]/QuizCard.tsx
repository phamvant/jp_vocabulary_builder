"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import { RotateCwIcon, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import MaziiPopup from "@/components/mazii-popup";
import { setDefaultHighWaterMark } from "stream";

interface ISentence {
  _id: string;
  content: string;
  mean: string;
  transcription: string;
  word: string;
  isSaved: boolean;
}

export default function QuizCard({
  url,
  showSave = false,
  defName,
}: {
  url: string;
  showSave?: boolean;
  defName?: string;
}) {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [sentences, setSentences] = useState<ISentence[]>([
    {
      _id: "",
      content: "",
      mean: "",
      transcription: "",
      word: "",
      isSaved: false,
    },
  ]);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [isMean, setIsMean] = useState<boolean>(false);
  const [name, setName] = useState<string | undefined>(defName);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
          cache: "no-cache",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch words");

        const data = await response.json();

        setSentences(
          data.words.map((word: ISentence) => ({ ...word, isSaved: false })),
        );
        setName(data.name);
      } catch (error) {
        return false;
      }
    };

    fetchWords();
  }, []);

  const handleNextQuestion = useCallback(
    (isNext: boolean) => {
      setCurrentSentence((prev) => {
        const nextQuestion = isNext ? prev + 1 : prev - 1;
        if (nextQuestion < sentences.length && nextQuestion >= 0) {
          return nextQuestion;
        }
        return prev;
      });
      setIsMean(false);
    },
    [sentences.length],
  );

  const handleSave = async (idx: number) => {
    if (!session) {
      toast({
        title: "認証失敗",
        description: "ログインしてください",
      });
      return;
    }

    setSentences((prev) =>
      prev.map((sentence, i) =>
        i === idx ? { ...sentence, isSaved: true } : sentence,
      ),
    );

    try {
      const response = await fetch(`/api/saves`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(sentences[idx]),
      });

      if (!response.ok) throw new Error("Failed to add favorite");
    } catch (error) {
      setSentences((prev) =>
        prev.map((sentence, i) =>
          i === idx ? { ...sentence, isSaved: false } : sentence,
        ),
      );

      toast({
        title: "保存失敗",
      });
    }
  };

  const handleDelete = async (idx: number) => {
    if (!session) {
      toast({
        title: "認証失敗",
        description: "ログインしてください",
      });
      return;
    }

    try {
      const response = await fetch(`/api/saves`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ sentenceId: sentences[idx]._id }),
      });

      if (!response.ok) throw new Error("Failed to remove favorite");

      toast({
        title: "削除した",
      });
    } catch (error) {
      toast({
        title: "削除失敗",
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNextQuestion(true);
      if (e.key === "ArrowLeft") handleNextQuestion(false);
      if (e.key === "ArrowDown") setIsMean((prev) => !prev);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleNextQuestion]);

  return (
    <Card className="w-full max-w-2xl h-2/3 backdrop-blur-xl">
      {sentences[0]._id === "" ? (
        <div className="w-full h-60 flex justify-center items-center">
          <RotateCwIcon className="animate-spin text-white" />
        </div>
      ) : (
        <>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-center mb-8">
              <div className="flex justify-between items-center">
                {showSave ? (
                  sentences?.[currentSentence].isSaved ? (
                    <HeartFilledIcon className="size-5 text-pink-400" />
                  ) : (
                    <HeartIcon
                      className="size-5 text-pink-400 mr-2"
                      onClick={() => handleSave(currentSentence)}
                    />
                  )
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete item"
                        className="text-red-500"
                      >
                        <Trash2 className="size-5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>確認</AlertDialogTitle>
                        <AlertDialogDescription>
                          このワードを削除してよろしいですか？
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(currentSentence)}
                        >
                          削除
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                <p>{name}</p>

                <MaziiPopup
                  href={`https://mazii.net/vi-VN/search/word/javi/${
                    sentences?.[currentSentence]?.word ?? "null"
                  }`}
                >
                  <a
                    target="_blank"
                    className="text-sm text-blue-200 cursor-pointer"
                  >
                    辞書へ
                  </a>
                </MaziiPopup>
              </div>
            </div>
            <div>
              <p className="text-center mb-4">
                {currentSentence + 1} / {sentences.length}
              </p>
              <Progress
                value={((currentSentence + 1) / sentences.length) * 100}
                className="w-full"
              />
              <div
                className="text-xl text-center py-20  rounded-xl"
                onClick={() => {
                  setIsMean((prev) => !prev);
                }}
              >
                {sentences[currentSentence] &&
                  (isMean ? (
                    <div>
                      <p>{sentences[currentSentence]?.mean}</p>
                      <br />
                      <p>{sentences[currentSentence]?.transcription}</p>
                    </div>
                  ) : (
                    sentences[currentSentence]?.content
                  ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-6">
            <Button onClick={() => handleNextQuestion(false)}>前</Button>

            {currentSentence === sentences!.length - 1 ? (
              <Button onClick={() => setCurrentSentence(0)}>もう一度</Button>
            ) : (
              <Button onClick={() => handleNextQuestion(true)}>次</Button>
            )}
          </CardFooter>
        </>
      )}
    </Card>
  );
}
