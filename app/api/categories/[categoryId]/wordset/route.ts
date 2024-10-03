import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import mongoInstance from "@/app/db/mongo";
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/api/auth/authOption";

interface WordSet {
  _id: ObjectId;
  name: string;
  words: string[];
}

export interface WordsSchema {
  _id: ObjectId;
  isPublic: boolean;
  userId: string;
  wordSet: WordSet[];
}

export async function GET(
  request: Request,
  { params }: { params: { categoryId: string } },
) {
  const session = await getServerSession(authOptions);

  try {
    const db = await mongoInstance.connect();

    const collection = db.collection("words");

    const data = await collection.findOne(
      {
        _id: new ObjectId(params.categoryId),
        $or: [{ isPublic: true }, { userId: session?.user.id }],
      },
      {
        projection: { wordSet: 1, category: 1 },
      },
    );

    if (!data) {
      throw new Error("No category");
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching words:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { categoryId: string } },
) {
  const { newSetName } = await request.json();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized Error" }, { status: 401 });
  }

  if (!params.categoryId || !newSetName) {
    return NextResponse.json(
      { error: "Word and category are required" },
      { status: 400 },
    );
  }

  try {
    const db = await mongoInstance.connect();
    const collection = db.collection<WordsSchema>("words");

    const newSetId = new ObjectId();

    const result = await collection.updateOne(
      {
        _id: new ObjectId(params.categoryId),
        isPublic: false,
        userId: session.user.id,
      },
      {
        $push: {
          wordSet: { _id: newSetId, name: newSetName, words: [] },
        },
      },
    );

    if (!result) {
      return NextResponse.json({ error: "Write failed" }, { status: 404 });
    }

    return NextResponse.json({ success: true, newSetId });
  } catch (error) {
    console.error("Error saving word:", error);
    return NextResponse.json({ error: "Failed to save word" }, { status: 500 });
  }
}
