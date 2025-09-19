import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/",
  },
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uuid = (user as any).uuid;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.uuid = token.uuid as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.uuid || !credentials?.email) return null;

        return {
          uuid: credentials.uuid as string,
          email: credentials.email as string,
          name: credentials.name as string,
        };
      },
    }),
  ],
};

export const { auth, signIn, signOut, handlers } = NextAuth(authConfig);
