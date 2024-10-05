import { NextResponse } from "next/server";
import mongoInstance from "@/app/db/mongo";
import { getServerSession } from "next-auth/next";
import authOptions from "../auth/authOption";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized Error" }, { status: 401 });
  }

  const { newCategory } = await request.json();

  if (!newCategory) {
    return NextResponse.json(
      { error: "Category are required" },
      { status: 400 },
    );
  }

  try {
    const db = await mongoInstance.connect();
    const collection = db.collection("words");

    const result = await collection.insertOne({
      userId: session.user.id,
      category: newCategory,
      isPublic: false,
      wordSet: [],
      createdDate: new Date(),
    });

    if (!result) {
      throw new Error();
    }

    const newDocument = await collection.findOne(
      { _id: result.insertedId },
      { projection: { _id: 1, createdDate: 1 } }, // Project only the fields you need
    );

    return NextResponse.json({
      success: true,
      result: {
        insertedId: result.insertedId,
        createdDate: newDocument!.createdDate,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save word" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  const { deleteId } = await request.json();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized Error" }, { status: 401 });
  }

  try {
    const db = await mongoInstance.connect();
    const collection = db.collection("words");

    const result = await collection.deleteOne({
      _id: new ObjectId(deleteId),
      isPublic: false,
      userId: session.user.id,
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
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
      .project({ category: 1, createdDate: 1 })
      .toArray();

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
