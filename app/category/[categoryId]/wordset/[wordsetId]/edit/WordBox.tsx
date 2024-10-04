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

export default function WordBox({ wordSet }: { wordSet: string[] }) {
  const [words, setWords] = useState<string[]>(wordSet);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

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

  const handleSave = () => {
    // Here you would typically send the data to a server or perform some other action
    console.log("Saving words:", words);
    alert("Changes saved successfully!");
  };

  // const fetchWords = async () => {
  //   try {
  //     const response = await fetch(
  //       `/api/categories/${params.categoryId}/wordset/${params.wordsetId}?wordonly=true`,
  //       {
  //         method: "GET",
  //         cache: "no-cache",
  //       },
  //     );

  //     if (!response.ok) throw new Error("Failed to fetch words");

  //     const data = await response.json();
  //     setWords(data.map((val: any) => val.word));
  //   } catch (error) {
  //     console.error("Error fetching words:", error);
  //     return false;
  //   }
  // };

  // useEffect(() => {
  //   fetchWords();
  // }, []);

  return (
    <div className="w-full flex flex-col gap-4 my-10">
      {words.map((str, index) => (
        <div key={index} className="w-full flex justify-between items-center">
          <Input
            type="text"
            defaultValue={""}
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
                  This action cannot be undone. This will permanently delete the
                  item.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteIndex(null)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
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
