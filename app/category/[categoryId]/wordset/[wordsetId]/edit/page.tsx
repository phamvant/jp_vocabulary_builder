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
import WordBox from "./WordBox";

export default async function EditPage({
  params,
}: {
  params: { categoryId: string; wordsetId: string };
}) {
  const fetchWords = async () => {
    try {
      const response = await fetch(
        `${process.env.BASEURL}/api/categories/${params.categoryId}/wordset/${params.wordsetId}?wordonly=true`,
        {
          method: "GET",
          cache: "no-cache",
        },
      );

      if (!response.ok) throw new Error("Failed to fetch words");

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error fetching words:", error);
      return false;
    }
  };

  const words = (await fetchWords()) as string[];

  return (
    <div className="w-full px-10">
      <h1 className="text-2xl font-bold text-center mb-10 mt-10">セット編集</h1>
      <WordBox wordSet={words} />
    </div>
  );
}
