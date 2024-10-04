import { headers } from "next/headers";
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
          headers: new Headers(headers()),
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

  console.log(words);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-4 lg:px-96">
        <h1 className="text-2xl font-bold text-center mb-10 mt-10">
          セット編集
        </h1>
        <WordBox wordSet={words} params={params} />
      </div>
    </div>
  );
}
