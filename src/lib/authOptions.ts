import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { clientPromise } from "./MongoDBClient";
import { ObjectId } from "mongodb";

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

        const user = await db
          .collection("users")
          .findOne({ email: credentials?.email });
        if (!user) {
          return null;
        }

        const passwordCorrect = await bcrypt.compare(
          credentials?.password,
          user.password,
        );

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
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
      };
    },
    async signIn({ user, account, profile }) {
      const client = await clientPromise;
      const db = client.db("elden-ring");

      // Handle user creation or update based on provider
      try {
        const userCollection = db.collection("users");

        if (account?.provider) {
          // OAuth providers (e.g., GitHub, Google)
          const existingUser = await userCollection.findOne({
            email: user.email,
          });
          if (!existingUser) {
            // Create a new user document if it does not exist
            await userCollection.insertOne({
              id: user.id,
              email: user.email,
              selectedBosses: [], // Initialize selectedBosses as an empty array
              characterProfiles: [
                {
                  id: new ObjectId(),
                  name: "Default profile",
                  status: "In progress",
                  progress: "0/165",
                },
              ],
            });
          } else {
            // Update the user document if it exists
            await userCollection.updateOne(
              { email: user.email },
              { $set: { email: user.email } },
            );
          }
        }
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false; // Deny sign-in if there's an error
      }

      return true; // Allow sign-in
    },
  },
};
