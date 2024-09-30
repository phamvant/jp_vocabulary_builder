import { NextResponse } from "next/server";
import mongoInstance from "@/app/db/mongo";

export async function POST(request: Request) {
  const { word, category } = await request.json();

  console.log(word, category);

  if (!category) {
    return NextResponse.json(
      { error: "Word and category are required" },
      { status: 400 }
    );
  }

  try {
    const db = await mongoInstance.connect();
    const collection = db.collection("words");

    const result = await collection?.updateOne(
      { category },
      { $addToSet: { words: word } },
      { upsert: true }
    );
    
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error saving word:", error);
    return NextResponse.json({ error: "Failed to save word" }, { status: 500 });
  } 
}

export async function GET() {
  try {
    const db = await mongoInstance.connect();
    if(!db) {
      console.log(db)
      console.log("No Db instance")
      return NextResponse.json(
        { error: "Failed to fetch words" },
        { status: 500 }
      );
    }

    const collection = db.collection("words");

    const result = await collection.find().toArray();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching words:", error);
    return NextResponse.json(
      { error: "Failed to fetch words" },
      { status: 500 }
    );
  }
}
