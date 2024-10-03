import { NextResponse } from "next/server";
import mongoInstance from "@/app/db/mongo";
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/api/auth/authOption";
import { ObjectId } from "mongodb";
import { getSentences } from "./mazii";
import { WordsSchema } from "../route";

export async function GET(
  request: Request,
  { params }: { params: { categoryId: string; wordsetId: string } },
) {
  const session = await getServerSession(authOptions);

  console.log(params);
  try {
    const db = await mongoInstance.connect();

    const collection = db.collection("words");

    const categoryExists = await collection.findOne({
      _id: new ObjectId(params.categoryId),
      $or: [{ isPublic: true }, { userId: session?.user.id }],
    });

    if (!categoryExists) {
      throw new Error("No category exists");
    }

    const wordSet = categoryExists.wordSet.filter((set: any) =>
      set._id.equals(new ObjectId(params.wordsetId)),
    );

    if (!wordSet.length) {
      return NextResponse.json([]);
    }

    console.log(wordSet);

    const sentences = await getSentences({ str: wordSet[0].words });

    return NextResponse.json(sentences);
  } catch (error) {
    console.error("Error fetching words:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { word, category } = await request.json();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized Error" }, { status: 401 });
  }

  if (!category) {
    return NextResponse.json(
      { error: "Word and category are required" },
      { status: 400 },
    );
  }

  try {
    const db = await mongoInstance.connect();
    const collection = db.collection("words");

    const existed = await collection.findOne({
      category,
      isPublic: true,
    });

    if (existed) {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }

    const result = await collection.updateOne(
      { category, isPublic: false }, // Filter to find the document
      {
        $addToSet: { words: word }, // Add the word to the words array
        $set: { userId: session.user.id }, // Set the userId field
      },
      { upsert: true }, // Create the document if it doesn't exist
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error saving word:", error);
    return NextResponse.json({ error: "Failed to save word" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { categoryId: string; wordsetId: string } },
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized Error" }, { status: 401 });
  }

  try {
    const db = await mongoInstance.connect();
    const collection = db.collection<WordsSchema>("words");

    // Delete the specific wordset element from the category
    const result = await collection.updateOne(
      {
        _id: new ObjectId(params.categoryId),
        isPublic: false,
        userId: session.user.id,
      },
      {
        $pull: { wordSet: { _id: new ObjectId(params.wordsetId) } },
      },
    );

    if (result.modifiedCount === 0) {
      throw new Error("Category or wordSet not found");
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error deleting:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
