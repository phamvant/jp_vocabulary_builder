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

    const result = collection.insertOne({
      userId: session.user.id,
      category: newCategory,
      isPublic: false,
      wordSet: [],
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error saving word:", error);
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
    console.error("Error deleting:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
