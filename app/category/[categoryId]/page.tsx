import AuthButtons from "@/components/AuthButton";
import { SharedStateProvider } from "./ShareState";
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

  return (
    <SharedStateProvider categoryId={params.categoryId}>
      <div className="min-h-screen">
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
            <h1 className="text-4xl font-bold text-white mb-2 mt-10">
              {/* {data.category} */}
            </h1>
            <p className="text-xl"></p>
          </header>

          <SubmitForm categoryId={params.categoryId} />
          <WordSetRegion categoryId={params.categoryId} />
        </div>
      </div>
    </SharedStateProvider>
  );
}
