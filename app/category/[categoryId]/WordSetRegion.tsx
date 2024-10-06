"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
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
import { useSharedState } from "./ShareState";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

export default function WordSetRegion({ categoryId }: { categoryId: string }) {
  const { wordSets, setWordSets } = useSharedState();
  const { data: session } = useSession();
  const { toast } = useToast();

  const handleDeleteSet = async (e: any, wordSetId: string) => {
    e.stopPropagation();

    if (!session) {
      toast({
        title: "認証失敗",
        description: "ログインしてください",
      });
      return;
    }

    try {
      const response = await fetch(
        `/api/categories/${categoryId}/wordset/${wordSetId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      if (!response.ok) throw new Error("Failed to delete category");

      setWordSets(wordSets.filter((set) => set._id !== wordSetId));
    } catch (error) {
      toast({
        title: "削除エラー",
      });
    }
  };

  const navigateToWordSet = (wordSetId: string, idx: number) => {
    console.log(wordSets[idx]);
    if (wordSets[idx].words.length) {
      window.location.href = `/category/${categoryId}/wordset/${wordSetId}`;
    } else {
      toast({
        title: "文字なし",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 rounded-2xl">
      {wordSets.map((wordSet, idx) => (
        <Card
          key={wordSet._id}
          className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          onClick={(e) => {
            const isDeleteButton = (e.target as HTMLElement).closest(
              ".text-red-500",
            );
            if (!isDeleteButton) {
              navigateToWordSet(wordSet._id, idx);
            }
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 dark:bg-gray-700 rounded-t-2xl">
            <CardTitle className="text-xl font-bold">{wordSet.name}</CardTitle>

            <div className="flex">
              <a href={`/category/${categoryId}/wordset/${wordSet._id}/edit`}>
                <Button variant="ghost" size="sm" className="text-gray-600 ">
                  <Pencil className="h-4 w-4" />
                </Button>
              </a>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>確認</AlertDialogTitle>
                    <AlertDialogDescription>
                      "{wordSet.name}" を削除してよろしいですか？
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      キャンセル
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-500 text-white hover:bg-red-700"
                      onClick={(e) => handleDeleteSet(e, wordSet._id)}
                    >
                      削除
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {wordSet.words && wordSet.words.length > 0 ? (
              <ul className="space-y-2">
                {wordSet.words.slice(0, 3).map((word, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-2xl pl-4"
                  >
                    <span className="text-lg">{word}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center italic">
                漢字なし
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
