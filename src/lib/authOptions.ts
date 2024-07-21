import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { clientPromise } from "./MongoDBClient";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const client = await clientPromise;
                const db = client.db("elden-ring");
                const bcrypt = require("bcrypt");

                const user = await db.collection("users").findOne({ email: credentials?.email });
                if (!user) {
                    return null;
                }

                const passwordCorrect = await bcrypt.compare(credentials?.password, user.password);

                if (passwordCorrect) {
                    return {
                        id: user._id.toString(),
                        email: user.email,
                    };
                }

                return null;
            },
        }),
    ],
    callbacks: {
        session: ({ session, token }) => ({
            ...session,
            user: {
                ...session.user,
                id: token.sub,
            },
        }),
    },
};
