"use client";

import { useEffect, useState } from "react";
import { Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useToast } from "@/hooks/use-toast";

export default function WordBox({
  wordSet,
  params,
}: {
  wordSet: { name: string; words: string[]; isPublic: boolean };
  params: { categoryId: string; wordsetId: string };
}) {
  const [words, setWords] = useState<string[]>(wordSet.words);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const handleChange = (index: number, value: string) => {
    if (wordSet.isPublic) {
      toast({
        title: "公共セットを変更できない",
      });
      return;
    }

    const newStrings = [...words];
    newStrings[index] = value;
    setWords(newStrings);
  };

  const handleDelete = () => {
    /*
    if (wordSet.isPublic) {
      toast({
        title: "公共セットを変更できない",
      });
      return;
    }
    */

    if (deleteIndex !== null) {
      setWords(words.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
    }
  };

  const handleAdd = () => {
    if (wordSet.isPublic) {
      toast({
        title: "公共セットを変更できない",
      });
      return;
    }

    setWords([...words, ""]);
  };

  const handleSave = async () => {
    if (wordSet.isPublic) {
      /*
      toast({
        title: "公共セットを変更できない",
      });
      return;
      */
    }
    try {
      const response = await fetch(
        `/api/categories/${params.categoryId}/wordset/${params.wordsetId}`,
        {
          method: "POST",
          cache: "no-cache",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newWords: words, // Assuming `words` is a state or variable containing new words
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save words");
      }

      // Success: Show a toast notification
      toast({
        title: "保存した",
      });
    } catch (error) {
      toast({
        title: "エラー",
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 py-10 px-6">
      {words.map((str, index) => (
        <div key={index} className="w-full flex justify-between items-center">
          <Input
            type="text"
            value={str}
            onChange={(e) => handleChange(index, e.target.value)}
            className="p-6 w-4/5 rounded-3xl focus:outline-none text-base shadow-md text-white"
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteIndex(index)}
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
                <AlertDialogCancel onClick={() => setDeleteIndex(null)}>
                  キャンセル
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  削除
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
      <Button
        onClick={handleAdd}
        variant={"secondary"}
        className="text-base w-full mt-5 rounded-3xl shadow-md bg-card"
      >
        追加
      </Button>
      <Button
        onClick={handleSave}
        className="text-base w-full rounded-3xl shadow-xl bg-green-600 hover:bg-green-700 text-background"
      >
        保存
      </Button>
    </div>
  );
}
