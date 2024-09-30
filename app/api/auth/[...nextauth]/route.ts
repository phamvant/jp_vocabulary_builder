// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Add more providers here if needed
  ],
  callbacks: {
    async session({ session, token }) {
      if(session.user && token.sub) {
          session.user.id = token.sub;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };

