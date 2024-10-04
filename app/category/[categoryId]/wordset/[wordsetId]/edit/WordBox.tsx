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
  wordSet: string[];
  params: { categoryId: string; wordsetId: string };
}) {
  const [words, setWords] = useState<string[]>(wordSet);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const handleChange = (index: number, value: string) => {
    const newStrings = [...words];
    newStrings[index] = value;
    setWords(newStrings);
  };

  const handleDelete = () => {
    if (deleteIndex !== null) {
      setWords(words.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
    }
  };

  const handleAdd = () => {
    setWords([...words, ""]);
  };

  const handleSave = async () => {
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
        title: "Words saved successfully!",
      });
    } catch (error) {
      console.error("Error adding words:", error);

      toast({
        title: "Error adding words",
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 my-10">
      {words.map((str, index) => (
        <div key={index} className="w-full flex justify-between items-center">
          <Input
            type="text"
            value={str}
            onChange={(e) => handleChange(index, e.target.value)}
            className="p-6 w-4/5 shadow-none rounded-3xl focus:outline-none focus:border-slate-300 text-base"
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
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
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
        className="text-base w-full mt-5 rounded-3xl"
      >
        追加
      </Button>
      <Button
        onClick={handleSave}
        className="text-base w-full bg-green-600 hover:bg-green-700 rounded-3xl"
      >
        <Save className="mr-2 h-4 w-4" /> 保存
      </Button>
    </div>
  );
}
