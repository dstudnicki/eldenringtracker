import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { rateLimit } from "@/middleware/rateLimiter";
import { headers } from "next/headers";

interface User {
  name: string;
  email: string;
  image: string;
  id: string;
}

const client = new MongoClient(process.env.MONGODB_URI ?? "");
const isValidObjectId = (id: string) => /^[a-fA-F0-9]{24}$/.test(id);

export async function GET() {
  const ip = headers().get("x-forwarded-for") ?? "unknown";

  if (rateLimit(ip)) {
    return NextResponse.json(
      { message: "Rate limit exceeded" },
      { status: 429 },
    );
  }

  try {
    await client.connect();
    const db = client.db("elden-ring");
    const userCollection = db.collection("users");

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      console.error("GET request failed: No session found");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as User).id;
    console.log("Fetching character profiles for user ID:", userId);

    const user = await userCollection.findOne({ id: userId });
    if (!user) {
      console.error("User not found in database:", userId);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.characterProfiles ?? []);
  } catch (error: any) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  } finally {
    if (client) await client.close();
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as User).id;

  try {
    await client.connect();
    const db = client.db("elden-ring");
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({ id: userId });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const doc = await request.json();

    const result = await userCollection.updateOne(
      { id: userId },
      { $push: { characterProfiles: doc } },
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing GET request:", error);
    return NextResponse.error();
  } finally {
    if (client) await client.close();
  }
}

export async function DELETE(request: Request) {
  const ip = headers().get("x-forwarded-for") ?? "unknown";

  if (rateLimit(ip)) {
    return NextResponse.json(
      { message: "Rate limit exceeded" },
      { status: 429 },
    );
  }

  const { id } = await request.json();
  const session = await getServerSession(authOptions);

  const userId = (session?.user as User).id;
  if (!isValidObjectId(id) || !userId) {
    return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
  }

  try {
    await client.connect();
    const db = client.db("elden-ring");
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({ id: userId });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await userCollection.updateOne(
      { id: userId },
      { $pull: { characterProfiles: { id: id } as any } },
    );

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error processing DELETE request:", error);
    return NextResponse.error();
  } finally {
    if (client) await client.close();
  }
}

// export async function PATCH(request: Request) {
//   const ip = headers().get("x-forwarded-for") ?? "unknown";

//   if (rateLimit(ip)) {
//     return NextResponse.json(
//       { message: "Rate limit exceeded" },
//       { status: 429 },
//     );
//   }

//   const { reset } = await request.json();
//   const session = await getServerSession(authOptions);

//   const userId = (session?.user as User).id;
//   if (!userId) {
//     return NextResponse.json({ message: "Invalid User ID" }, { status: 400 });
//   }

//   try {
//     await client.connect();
//     const db = client.db("elden-ring");
//     const userCollection = db.collection("users");

//     const user = await userCollection.findOne({ id: userId });

//     if (!user) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     if (reset) {
//       await userCollection.updateOne(
//         { id: userId },
//         { $set: { selectedBosses: [] } },
//       );
//     }
//     return NextResponse.json({ message: "Updated successfully" });
//   } catch (error) {
//     console.error("Error processing PATCH request:", error);
//     return NextResponse.error();
//   } finally {
//     await client.close();
//   }
// }
