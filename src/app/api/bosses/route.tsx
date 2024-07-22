import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const client = new MongoClient(process.env.MONGODB_URI ?? "");
const isValidObjectId = (id: string) => /^[a-fA-F0-9]{24}$/.test(id);

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "You are not authorized" }, { status: 401 });
    }

    const userId = session?.user as any;

    try {
        await client.connect();
        const db = client.db("elden-ring");
        const userCollection = db.collection("users");

        // Fetch user by their 'id' field
        const user = await userCollection.findOne({ id: userId });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const selectedBosses = user.selectedBosses || [];

        const bossCollection = db.collection("bosses");

        // Fetch all bosses except those in the selectedBosses array
        const bosses = await bossCollection.find({ _id: { $nin: selectedBosses.map((id: string) => new ObjectId(id)) } }).toArray();

        return NextResponse.json(bosses);
    } catch (error) {
        console.error("Error processing GET request:", error);
        return NextResponse.error();
    } finally {
        await client.close();
    }
}

export async function PATCH(request: Request) {
    const { id, name } = await request.json();
    const session = await getServerSession(authOptions);

    const userId = session?.user?.id as any;

    if (!isValidObjectId(id) || !userId) {
        return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
    }

    try {
        await client.connect();
        const db = client.db("elden-ring");
        const userCollection = db.collection("users");

        // Fetch user by their 'id' field
        const user = await userCollection.findOne({ id: userId });
        const alreadySelected = user?.selectedBosses.includes(id);

        if (alreadySelected) {
            // Remove boss ID if already selected
            await userCollection.updateOne({ id: userId }, { $pull: { selectedBosses: id } });
        } else {
            // Add boss ID if not selected
            await userCollection.updateOne({ id: userId }, { $addToSet: { selectedBosses: id } });
        }

        return NextResponse.json({ message: "Updated successfully" });
    } catch (error) {
        console.error("Error processing PATCH request:", error);
        return NextResponse.error();
    } finally {
        await client.close();
    }
}

export async function OPTIONS() {
    return NextResponse.json(
        {},
        {
            headers: {
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,DELETE,PATCH,POST,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
            },
        }
    );
}
