import { Session, AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { ObjectId } from "mongodb";
import mongoInstance from "@/app/db/mongo";

const authOptions: AuthOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
      // Add more providers here if needed
    ],
    callbacks: {
      async session({ session, token }: { session: Session; token: any }) {
        if (session.user && token.sub) {
          session.user.id = token.sub; // Add the user ID to the session
        }
        return session;
      },
      async signIn({ user, account, profile }) {
        try {
          const db = await mongoInstance.connect();
          const usersCollection = db.collection("users"); // Your users collection
  
          // Check if the user already exists in the database
          const existingUser = await usersCollection.findOne({ email: profile?.email });
          
          // If the user doesn't exist, create a new record
          if (!existingUser) {
            await usersCollection.insertOne({
              _id: new ObjectId(), // Generate a new ObjectId for the user
              name: profile?.name,
              email: profile?.email,
            });
          }
  
          return true; // Return true to allow sign in
        } catch (error) {
          console.error("Error signing in:", error);
          return false; // Return false to deny sign in on error
        }
      },
    },
};

export default authOptions;