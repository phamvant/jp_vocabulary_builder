import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getSentences } from "./groq";
import mongoInstance from "@/app/db/mongo";
import { getServerSession } from "next-auth/next";
import authOptions from "../../auth/authOption";

export async function GET({ params }: { params: { id: number } }) {
  const session = await getServerSession(authOptions);

  try {
    const db = await mongoInstance.connect();

    const collection = db.collection("words");

    const data = await collection.findOne({
      _id: ObjectId.createFromTime(params.id),
    });

    const chunk = data!.words;

    const result = await getSentences({ str: chunk });

    return NextResponse.json({ result: result });
  } catch (error) {
    console.error("Error fetching words:", error);
    return NextResponse.json(
      { error: "Failed to fetch words" },
      { status: 500 },
    );
  }
}
