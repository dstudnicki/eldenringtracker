import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI ?? "");

export async function GET() {
    try {
        await client.connect();
        const db = client.db("elden-ring");
        const collection = db.collection("bosses");
        const bosses = await collection.find().toArray();
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
    try {
        await client.connect();
        const db = client.db("elden-ring");
        const collection = db.collection("bosses");
        const result = await collection.updateOne({ id: id }, { $set: { isChecked: true } });
        return NextResponse.json({ message: "Updated successfully", result: result });
    } catch (error) {
        console.error("Error processing PATCH request:", error);
        return NextResponse.error();
    } finally {
        await client.close();
    }
}
