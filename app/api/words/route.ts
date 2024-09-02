import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URL;

export async function POST(request: Request) {
  const { word, category } = await request.json();

  console.log(word, category);

  if (!category) {
    return NextResponse.json(
      { error: "Word and category are required" },
      { status: 400 }
    );
  }

  const client = new MongoClient(uri ? uri : "");

  try {
    await client.connect();
    const database = client.db("jp_quiz");
    const collection = database.collection("words");

    const result = await collection.updateOne(
      { category },
      { $addToSet: { words: word } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error saving word:", error);
    return NextResponse.json({ error: "Failed to save word" }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function GET() {
  const client = new MongoClient(uri ? uri : "");

  try {
    await client.connect();
    const database = client.db("jp_quiz");
    const collection = database.collection("words");

    const result = await collection.find().toArray();

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
