import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { main } from "./groq";
const uri = process.env.MONGODB_URL;
import { readFile } from "fs/promises";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const client = new MongoClient(uri ? uri : "");

  try {
    await client.connect();
    const database = client.db("jp_quiz");
    const collection = database.collection("words");

    const data = await collection.findOne({ _id: new ObjectId(id) });
    const result = await main({ str: data!.words });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching words:", error);
    return NextResponse.json(
      { error: "Failed to fetch words" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
