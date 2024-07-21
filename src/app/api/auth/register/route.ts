import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI ?? "");

// validate server side email and password and confirm password!

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        const bcrypt = require("bcrypt");
        const hashedPassword = await bcrypt.hash(password, 10);
        await client.connect();
        const db = client.db("elden-ring");
        const collection = db.collection("users");
        const users = await collection.insertOne({ email: email, password: hashedPassword });
        return NextResponse.json({ succes: "Account created" }, { status: 200 });
    } catch (error) {
        console.error("Error processing GET request:", error);
        return NextResponse.error();
    } finally {
        await client.close();
    }
}
