import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const client = new MongoClient(process.env.MONGODB_URI ?? "");

export async function GET() {
    const session = await getServerSession(authOptions);
    const admin = process.env.ADMIN_EMAIL;

    if (session?.user?.email !== admin) {
        return NextResponse.json({ message: "You are not authorized" }, { status: 401 });
    }

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
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "You are not authorized" }, { status: 401 });
    }

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
