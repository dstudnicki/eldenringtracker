import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const client = new MongoClient(process.env.MONGODB_URI ?? "");
const isValidObjectId = (id: string) => /^[a-fA-F0-9]{24}$/.test(id);

interface User {
  name: string;
  email: string;
  image: string;
  id: string;
}

export async function GET(
  req: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session?.user as User).id;
    await client.connect();
    const db = client.db("elden-ring");

    // Check if the user exists
    const user = await db.collection("users").findOne({ id: userId });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Validate the slug (should be a valid MongoDB ObjectId)
    if (!isValidObjectId(params.slug)) {
      return NextResponse.json({ message: "Invalid boss ID" }, { status: 400 });
    }

    const boss = await db
      .collection("bosses")
      .findOne({ _id: new ObjectId(params.slug) });

    if (!boss) {
      return NextResponse.json({ message: "Boss not found" }, { status: 404 });
    }

    return NextResponse.json(boss);
  } catch (error) {
    console.error("Error processing GET request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  } finally {
    if (client) await client.close();
  }
}
