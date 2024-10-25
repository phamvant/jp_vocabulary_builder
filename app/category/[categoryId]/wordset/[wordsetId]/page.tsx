"use client"

import QuizCard from "./QuizCard";

export default function Quiz({
  params,
}: {
  params: { categoryId: string; wordsetId: string };
}) {
  const url = `/api/categories/${params.categoryId}/wordset/${params.wordsetId}`;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <QuizCard url={url} showSave={true} />
    </div>
  );
}
