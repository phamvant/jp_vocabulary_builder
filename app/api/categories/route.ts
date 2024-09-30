import { NextResponse } from "next/server";
import { Collection, ObjectId } from "mongodb";
import mongoInstance from "@/app/db/mongo";

export async function POST(request: Request) {
  const { category } = await request.json();

  if (!category) {
    return NextResponse.json(
      { error: "Category are required" },
      { status: 400 },
    );
  }

  try {
    const db = await mongoInstance.connect();
    const collection = db.collection("words");

    const exist = await db.collection("words").findOne({
      category,
    });

    if (exist) {
      throw new Error();
    }

    const result = await collection?.insertOne({ category });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error saving word:", error);
    return NextResponse.json({ error: "Failed to save word" }, { status: 500 });
  }
}

type Words = {
  category: string;
  words: string[];
};

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get("word");
  const category = searchParams.get("category");

  const db = await mongoInstance.connect();

  if (!category) {
    return NextResponse.json(
      { error: "Category is required" },
      { status: 400 },
    );
  }

  try {
    const collection: Collection<Words> = db.collection("words"); 

    let result;
    if (word) {
      // Delete a specific word from a category
      result = await collection.updateOne(
        { id_: new ObjectId(category) },
        { $pull: { words: word } },
      );
    } else {
      // Delete an entire category
      console.log(category);
      const result = await collection.deleteOne({
        _id: new ObjectId(category),
      }); // Assuming categoryId is a string
      console.log(result);
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error deleting:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  } 
}
