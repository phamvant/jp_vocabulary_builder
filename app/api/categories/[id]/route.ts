import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getSentences } from "./groq";
const uri = process.env.MONGODB_URL;

export async function GET(
  request: Request,
  { params }: { params: { id: number } },
) {
  const client = new MongoClient(uri ? uri : "");

  try {
    await client.connect();
    const database = client.db("jp_quiz");
    const collection = database.collection("words");

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
  } finally {
    await client.close();
  }
}
