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
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import { Trash2 } from "lucide-react";
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

interface ISentence {
  _id: string;
  content: string;
  mean: string;
  transcription: string;
  word: string;
  isSaved: boolean;
}

export default function QuizCard({
  words,
  name,
  showSave = false,
}: {
  words: ISentence[];
  name: string;
  showSave?: boolean;
}) {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [sentences, setSentences] = useState<ISentence[]>(
    words.map((word) => ({ ...word, isSaved: false })),
  );
  const [currentSentence, setCurrentSentence] = useState(0);
  const [isMean, setIsMean] = useState<boolean>(false);

  const handleNextQuestion = (isNext: boolean) => {
    const nextQuestion = isNext ? currentSentence + 1 : currentSentence - 1;

    if (nextQuestion < sentences!.length && nextQuestion >= 0) {
      setCurrentSentence(nextQuestion);
    }
    setIsMean(false);
  };

  const handleSave = async (idx: number) => {
    if (!session) {
      toast({
        title: "認証失敗",
        description: "ログインしてください",
      });
      return;
    }

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

      setSentences((prev) =>
        prev.map((sentence, i) =>
          i === idx ? { ...sentence, isSaved: true } : sentence,
        ),
      );
    } catch (error) {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-2xl h-2/3">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            <div className="flex justify-between items-center">
              {showSave ? (
                sentences?.[currentSentence].isSaved ? (
                  <HeartFilledIcon className="size-5 text-pink-400" />
                ) : (
                  <HeartIcon
                    className="size-5 text-pink-400"
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
              <a
                target="_blank"
                href={`https://mazii.net/vi-VN/search/word/javi/${sentences?.[currentSentence]?.word ?? "null"}`}
                className="text-sm text-blue-600"
              >
                辞書へ
              </a>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <>
            <Progress
              value={((currentSentence + 1) / sentences.length) * 100}
              className="w-full "
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
          </>
        </CardContent>
        <CardFooter className="flex justify-center gap-6">
          <Button
            className="bg-secondary text-foreground hover:text-primary hover:bg-primary-foreground"
            onClick={() => handleNextQuestion(false)}
          >
            前
          </Button>

          {currentSentence === sentences!.length - 1 ? (
            <Button onClick={() => setCurrentSentence(0)}>もう一度</Button>
          ) : (
            <Button onClick={() => handleNextQuestion(true)}>次</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
