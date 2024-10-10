import { NextResponse } from "next/server";
import mongoInstance from "@/app/db/mongo";
import { getServerSession } from "next-auth/next";
import authOptions from "../auth/authOption";
import { ObjectId } from "mongodb";

interface ISave {
  userId: string;
  sentences: ISentence[];
  createdDate: Date;
}

interface ISentence {
  _id: ObjectId;
  content: string;
  mean: string;
  transcription: string;
  word: string;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized Error" }, { status: 401 });
  }

  const { content, mean, transcription, word } = await request.json();

  try {
    const db = await mongoInstance.connect();
    const collection = db.collection<ISave>("saves");

    const existingSave = await collection.findOne({ userId: session.user.id });

    if (existingSave) {
      const result = await collection.updateOne(
        { userId: session.user.id },
        {
          $push: {
            sentences: {
              _id: new ObjectId(),
              content,
              mean,
              transcription,
              word,
            },
          },
        }
      );

      if (!result.modifiedCount) {
        throw new Error();
      }

      return NextResponse.json(result, { status: 200 });
    } else {
      const newSave = {
        _id: new ObjectId(),
        userId: session.user.id,
        sentences: [
          { _id: new ObjectId(), content, mean, transcription, word },
        ],
        createdDate: new Date(),
      };

      const result = await collection.insertOne(newSave);

      if (!result) {
        throw new Error();
      }

      return NextResponse.json(result, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to save word" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized Error" }, { status: 401 });
  }

  try {
    const db = await mongoInstance.connect();
    const collection = db.collection("saves");

    const existingSave = await collection.findOne({ userId: session.user.id });

    if (!existingSave) {
      throw new Error();
    }

    return NextResponse.json(
      { words: existingSave.sentences },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving sentences:", error);
    return NextResponse.json(
      { error: "Failed to retrieve sentences" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized Error" }, { status: 401 });
  }

  const { sentenceId } = await request.json();

  try {
    const db = await mongoInstance.connect();
    const collection = db.collection<ISave>("saves");

    const result = await collection.updateOne(
      { userId: session.user.id },
      {
        $pull: {
          sentences: { _id: new ObjectId(sentenceId) },
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Sentence not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Sentence deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting sentence:", error);
    return NextResponse.json(
      { error: "Failed to delete sentence" },
      { status: 500 }
    );
  }
}
