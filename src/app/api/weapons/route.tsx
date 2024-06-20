import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.DB_URI ?? "");

export async function GET() {
    try {
        await client.connect();
        const db = client.db("elden-ring");
        const collection = db.collection("weapons");
        const weapons = await collection.find().toArray();
        console.log(weapons);
        return NextResponse.json(weapons);
    } catch (error) {
        console.error("Error processing GET request:", error);
        return NextResponse.error();
    } finally {
        await client.close();
    }
}
