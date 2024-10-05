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

  const handleDeleteSet = async (wordSetId: string) => {
    if (!session) {
      toast({
        title: "Unauthenticated",
        description: "Please login",
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

      console.log(wordSets);
    } catch (error) {}
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 rounded-2xl">
      {wordSets.map((wordSet, idx) => (
        <Card
          key={wordSet._id}
          className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 dark:bg-gray-700 rounded-t-2xl">
            <CardTitle className="text-xl font-bold">
              {!wordSet.words.length ? (
                wordSet.name
              ) : (
                <a href={`/category/${categoryId}/wordset/${wordSet._id}`}>
                  {wordSet.name}
                </a>
              )}
            </CardTitle>

            <div className="flex">
              {}
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
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the "{wordSet.name}" category
                      and all its words.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-500 text-white hover:bg-red-700"
                      onClick={() => handleDeleteSet(wordSet._id)}
                    >
                      Delete
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
                No words added yet.
              </p>
            )}
          </CardContent>

          {/* <CardContent className="pt-4">Created at: 10/02/2024</CardContent> */}
        </Card>
      ))}
    </div>
  );
}
