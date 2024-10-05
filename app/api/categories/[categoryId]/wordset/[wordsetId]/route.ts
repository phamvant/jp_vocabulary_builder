import { NextRequest, NextResponse } from "next/server";
import mongoInstance from "@/app/db/mongo";
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/api/auth/authOption";
import { ObjectId } from "mongodb";
import { getSentences } from "./mazii";
import { WordsSchema } from "../route";

export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string; wordsetId: string } },
) {
  const session = await getServerSession(authOptions);

  const wordonly = request.nextUrl.searchParams.get("wordonly");

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

    let ret;
    if (wordonly) {
      ret = wordSet[0].words;
    } else {
      ret = await getSentences({ str: wordSet[0].words });
    }

    return NextResponse.json({
      name: wordSet[0].name,
      words: ret,
      isPublic: categoryExists.isPublic,
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { categoryId: string; wordsetId: string } },
) {
  const { newWords } = await request.json();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized Error" }, { status: 401 });
  }

  try {
    const db = await mongoInstance.connect();
    const collection = db.collection("words");

    const result = await collection.updateOne(
      {
        isPublic: false,
        _id: new ObjectId(params.categoryId),
        userId: session.user.id,
        "wordSet._id": new ObjectId(params.wordsetId),
      }, // Filter to find the document
      {
        $set: { "wordSet.$.words": newWords },
      },
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
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
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
