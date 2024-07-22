import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const client = new MongoClient(process.env.MONGODB_URI ?? "");

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    try {
        const { email, password } = await req.json();
        const bcrypt = require("bcrypt");
        // Validate email and password format (simple example)
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        await client.connect();
        const db = client.db("elden-ring");
        const collection = db.collection("users");

        // Insert new user with selectedBosses field initialized as an empty array
        const result = await collection.insertOne({
            email,
            password: hashedPassword,
            selectedBosses: [], // Initialize selectedBosses as an empty array
        });

        return NextResponse.json({ success: "Account created" }, { status: 201 });
    } catch (error) {
        console.error("Error processing POST request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        await client.close();
    }
}
