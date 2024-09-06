import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const client = new MongoClient(process.env.MONGODB_URI ?? "");
const isValidObjectId = (id: string) => /^[a-fA-F0-9]{24}$/.test(id);

export async function GET() {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any).id;

    try {
        await client.connect();
        const db = client.db("elden-ring");
        const userCollection = db.collection("users");

        const user = await userCollection.findOne({ id: userId });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const selectedBosses = user.selectedBosses || [];

        const bossCollection = db.collection("bosses");

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
    const { id } = await request.json();
    const session = await getServerSession(authOptions);

    const userId = (session?.user as any).id;

    if (!isValidObjectId(id) || !userId) {
        return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
    }

    try {
        await client.connect();
        const db = client.db("elden-ring");
        const userCollection = db.collection("users");
        const bossCollection = db.collection("bosses");

        const user = await userCollection.findOne({ id: userId });
        const alreadySelected = user?.selectedBosses.includes(id);

        if (alreadySelected) {
            await userCollection.updateOne({ id: userId }, { $pull: { selectedBosses: id } });
        } else {
            const boss = await bossCollection.findOne({ _id: new ObjectId(id) });
            if (!boss) {
                return NextResponse.json({ message: "Boss not found" }, { status: 404 });
            }
            await userCollection.updateOne(
                { id: userId },
                { $addToSet: { selectedBosses: { id, name: boss.name, image: boss.image, region: boss.region, description: boss.description, location: boss.location } } }
            );
        }

        return NextResponse.json({ message: "Updated successfully" });
    } catch (error) {
        console.error("Error processing PATCH request:", error);
        return NextResponse.error();
    } finally {
        await client.close();
    }
}
