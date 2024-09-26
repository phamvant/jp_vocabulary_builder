import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { Collection } from "mongodb";

const uri = process.env.MONGODB_URL;

export async function POST(request: Request) {
  const { category } = await request.json();

  if (!category) {
    return NextResponse.json(
      { error: "Category are required" },
      { status: 400 },
    );
  }

  const client = new MongoClient(uri ? uri : "");

  try {
    await client.connect();
    const database = client.db("jp_quiz");
    const collection = database.collection("words");

    const exist = await database.collection("words").findOne({
      category,
    });

    if (exist) {
      throw new Error();
    }

    const result = await collection.insertOne({ category });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error saving word:", error);
    return NextResponse.json({ error: "Failed to save word" }, { status: 500 });
  } finally {
    await client.close();
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

  if (!category) {
    return NextResponse.json(
      { error: "Category is required" },
      { status: 400 },
    );
  }

  const client = new MongoClient(uri ? uri : "");

  try {
    await client.connect();
    const database = client.db("jp_quiz");
    const collection: Collection<Words> = database.collection("words");

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
  } finally {
    await client.close();
  }
}
