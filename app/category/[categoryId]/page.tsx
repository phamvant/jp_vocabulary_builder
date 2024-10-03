import AuthButtons from "@/components/AuthButton";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ICategory, SharedStateProvider } from "./ShareState";
import SubmitForm from "./SubmitForm";
import WordSetRegion from "./WordSetRegion";

export default async function Page({
  params,
}: {
  params: { categoryId: string };
}) {
  const response = await fetch(
    `${process.env.BASE_URL}/api/categories/${params.categoryId}/wordset`,
    {
      cache: "no-cache",
      method: "GET",
      headers: new Headers(headers()),
    },
  );

  if (!response.ok) {
    redirect("/");
  }

  const data = (await response.json()) as ICategory;
  const wordSets = data.wordSet;

  return (
    <SharedStateProvider initWordSets={wordSets}>
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto p-4 lg:px-60">
          <AuthButtons />
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2 mt-10">
              {data.category}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300"></p>
          </header>

          <SubmitForm categoryId={params.categoryId} />
          <WordSetRegion categoryId={params.categoryId} />
        </div>
      </div>
    </SharedStateProvider>
  );
}
