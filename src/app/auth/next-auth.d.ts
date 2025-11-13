// next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      uuid?: string;
      name?: string;
      email?: string;
      permissions?: any[];
    };
  }

  interface User {
    uuid?: string;
    name?: string;
    email?: string;
    permissions?: any[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uuid: string;
  }
}
