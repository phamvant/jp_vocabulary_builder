import { NextResponse } from "next/server";
import { Collection, ObjectId } from "mongodb";
import mongoInstance from "@/app/db/mongo";
import { getServerSession } from "next-auth/next";
import authOptions from "../auth/authOption";

export async function POST(request: Request) {
  const { category } = await request.json();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized Error" }, { status: 401 });
  }

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

    const newId = new ObjectId();
    const result = await collection.insertOne({
      _id: newId,
      category,
      userId: session.user.id,
      isPublic: false,
    });

    return NextResponse.json({ success: true, categoryId: newId });
  } catch (error) {
    console.error("Error saving word:", error);
    return NextResponse.json({ error: "Failed to save word" }, { status: 500 });
  }
}

type Words = {
  category: string;
  words: string[];
  isPublic: boolean;
};

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get("word");
  const category = searchParams.get("category");

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized Error" }, { status: 401 });
  }

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
        { _id: new ObjectId(category), userId: session.user.id },
        { $pull: { words: word } },
      );
    } else {
      // Delete an entire category if isPublic is not true
      const categoryDoc = await collection.findOne({
        _id: new ObjectId(category),
      });

      if (categoryDoc) {
        if (!categoryDoc.isPublic) {
          // Proceed with deletion only if isPublic is false
          result = await collection.deleteOne({
            _id: new ObjectId(category),
          });
          console.log("Category deleted:", result);
        } else {
          console.log("Cannot delete category. It is public.");
        }
      } else {
        console.log("Category not found.");
      }
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error deleting:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
