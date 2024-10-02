import { NextResponse } from "next/server";
import mongoInstance from "@/app/db/mongo";
import { getServerSession } from "next-auth/next";
import authOptions from "../auth/authOption";

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

export async function GET() {
  const session = await getServerSession(authOptions);

  try {
    const db = await mongoInstance.connect();

    const collection = db.collection("words");

    const result = await collection
      .find({
        $or: [{ userId: session?.user.id }, { isPublic: true }],
      })
      .sort({ userId: session?.user.id ? -1 : 1, isPublic: -1 }) // Sort by userId presence first, then by isPublic
      .project({ category: 1 })
      .toArray();

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
