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

      if (!response.ok) throw new Error("Failed to fetch wordSet");

      const data = await response.json();

      return data;
    } catch (error) {
      return false;
    }
  };

  const wordSet = await fetchWords();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4 md:max-w-[30rem] max-w-[24rem]">
        <h1 className="text-2xl font-bold text-center mb-10 mt-10 text-white">
          {wordSet.name}
        </h1>
        <WordBox wordSet={wordSet} params={params} />
      </div>
    </div>
  );
}
