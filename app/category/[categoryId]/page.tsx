import AuthButtons from "@/components/AuthButton";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ICategory, SharedStateProvider } from "./ShareState";
import SubmitForm from "./SubmitForm";
import WordSetRegion from "./WordSetRegion";
import { getServerSession } from "next-auth";
import { Button } from "@/components/ui/button";

export default async function Page({
  params,
}: {
  params: { categoryId: string };
}) {
  const session = await getServerSession();

  const response = await fetch(
    `${process.env.BASEURL}/api/categories/${params.categoryId}/wordset`,
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
        <div className="container mx-auto p-4 xl:px-60">
          <div className="flex flex-col gap-4">
            <AuthButtons session={session} />
            {session ? (
              <a href="/saved">
                <Button className="bg-pink-400/80 hover:bg-pink-400">
                  気に入る
                </Button>
              </a>
            ) : null}
          </div>
          <div />

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
