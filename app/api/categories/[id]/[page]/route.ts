import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getSentences } from "../groq";
const uri = process.env.MONGODB_URL;

export async function GET(
  request: Request,
  { params }: { params: { id: number; page: number } },
) {
  const client = new MongoClient(uri ? uri : "");

  try {
    await client.connect();
    const database = client.db("jp_quiz");
    const collection = database.collection("words");

    const data = await collection.findOne({ _id: new ObjectId(params.id) });

    const chunk = data!.words.slice(10 * (params.page - 1), 10 * params.page);

    const result = await getSentences({ str: chunk });
    /*
    const pattern = /\{([^]*?)\}/;
    const retData = result!.match(pattern);

    let contentInsideBraces;

    if (retData) {
      contentInsideBraces = retData[1].trim(); // result[1] contains the captured group inside {}
    }

    console.log(retData[1]);
    */
    console.log(result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching words:", error);
    return NextResponse.json(
      { error: "Failed to fetch words" },
      { status: 500 },
    );
  } finally {
    await client.close();
  }
}
