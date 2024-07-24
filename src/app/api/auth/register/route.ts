import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI ?? "");

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        const bcrypt = require("bcrypt");

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        await client.connect();
        const db = client.db("elden-ring");
        const collection = db.collection("users");
        const generatedId = new ObjectId().toString();

        const result = await collection.insertOne({
            _id: new ObjectId(generatedId),
            id: generatedId,
            email,
            password: hashedPassword,
            selectedBosses: [],
        });

        return NextResponse.json({ success: "Account created" }, { status: 201 });
    } catch (error) {
        console.error("Error processing POST request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        await client.close();
    }
}
