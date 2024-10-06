"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2, BookOpen, RefreshCw } from "lucide-react";
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
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

export default function Form({
  inCategories,
}: {
  inCategories: { category: string; _id: string; createdDate: string }[];
}) {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [categories, setCategories] =
    useState<{ category: string; _id: string; createdDate: string }[]>(
      inCategories,
    );
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast({
        title: "認証失敗",
        description: "ログインしてください",
      });
      return;
    }

    if (newCategory) {
      try {
        const response = await fetch(`/api/categories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newCategory: newCategory }),
        });

        if (!response.ok) throw new Error("Failed to add category");

        const data = await response.json();

        setCategories((prev) => [
          {
            category: newCategory,
            _id: data.result.insertedId,
            createdDate: data.result.createdDate,
          },
          ...prev,
        ]);
      } catch (error) {
      } finally {
        setNewCategory("");
      }
    }
  };

  const handleDeleteCategory = async (e: any, id: string) => {
    e.preventDefault();
    if (!session) {
      toast({
        title: "認証失敗",
        description: "ログインしてください",
      });
      return;
    }

    try {
      const response = await fetch(`/api/categories`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deleteId: id }),
      });

      if (!response.ok) throw new Error("Failed to delete category");

      setCategories((prev) => prev.filter((val) => val._id !== id));
    } catch (error) {
      toast({
        title: "削除エラー",
      });
    }
  };

  const navigateToWordSet = (categoryId: string) => {
    window.location.href = `/category/${categoryId}`;
  };

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
        <form onSubmit={handleAddCategory} className="mb-4">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <Input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="新しいカテゴリー"
              className="flex-grow text-lg py-6 rounded-2xl"
              // disabled={isLoading}
            />
            <Button
              type="submit"
              // disabled={isLoading}
              className="w-full md:w-auto py-6 rounded-2xl"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              カテゴリーを追加
            </Button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 rounded-2xl">
        {categories.map((category) => (
          <div key={category._id}>
            <Card
              className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={(e) => {
                const isDeleteButton = (e.target as HTMLElement).closest(
                  ".text-red-500",
                );
                if (!isDeleteButton) {
                  navigateToWordSet(category._id);
                }
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 dark:bg-gray-700 rounded-t-2xl">
                <CardTitle className="text-xl font-bold">
                  {category.category}
                </CardTitle>
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
                        "{category.category}" を削除してよろしいですか？
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
                        onClick={(e) => handleDeleteCategory(e, category._id)}
                        className="bg-red-500 text-white hover:bg-red-700"
                      >
                        削除
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardHeader>

              <CardContent className="pt-4">
                作成日: {category.createdDate?.split("T")[0]}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
