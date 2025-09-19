import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        return {
          uuid: credentials?.uuid as string,
          email: credentials?.email as string,
          name: credentials?.name as string,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.uuid = (user as any).uuid;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.uuid = token.uuid as string;
      return session;
    },
  },
});
