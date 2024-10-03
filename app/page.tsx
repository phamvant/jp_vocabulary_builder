"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import AuthButtons from "@/components/AuthButton";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

export default function JapaneseVocabSaaS() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [categories, setCategories] = useState<
    { category: string; _id: string }[]
  >([]);
  const [newCategory, setNewCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const response = await fetch("/api/categories", { cache: "no-cache" });
      if (!response.ok) throw new Error("Failed to fetch words");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching words:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast({
        title: "Unauthenticated",
        description: "Please login",
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
          { category: newCategory, _id: data._id },
          ...prev,
        ]);
      } catch (error) {
      } finally {
        setNewCategory("");
      }
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!session) {
      toast({
        title: "Unauthenticated",
        description: "Please login",
      });
      return;
    }

    setCategories((prev) => prev.filter((val) => val._id !== id));

    try {
      const response = await fetch(`/api/categories`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deleteId: id }),
      });

      if (!response.ok) throw new Error("Failed to delete category");
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-4 lg:px-60">
        <AuthButtons />
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2"></h1>
          <p className="text-xl text-gray-600 dark:text-gray-300"></p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <form onSubmit={handleAddCategory} className="mb-4">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <Input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="分類を記入"
                className="flex-grow text-lg py-6 rounded-2xl"
                // disabled={isLoading}
              />
              <Button
                type="submit"
                // disabled={isLoading}
                className="w-full md:w-auto py-6 rounded-2xl"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                分類を追加
              </Button>
            </div>
          </form>
        </div>
        {isLoading ? (
          <div className="flex justify-center">
            <RefreshCw className="animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 rounded-2xl">
            {categories.map((category) => (
              <Card
                key={category._id}
                className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 dark:bg-gray-700 rounded-t-lg rounded-t-2xl">
                  <a href={`category/${category._id}`}>
                    <CardTitle className="text-xl font-bold">
                      {category.category}
                    </CardTitle>
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
                          This will permanently delete the "{category.category}"
                          category and all its words.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteCategory(category._id)}
                          className="bg-red-500 text-white hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardHeader>

                <CardContent className="pt-4">
                  Created at: 10/02/2024
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
