import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getSentences } from "./groq";
import mongoInstance from "@/app/db/mongo";


export async function GET(
  request: Request,
  { params }: { params: { id: number } },
) {

  try {
    const db = await mongoInstance.connect();

    const collection = db.collection("words");

    const data = await collection.findOne({ _id: new ObjectId(params.id) });

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
