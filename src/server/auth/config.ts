import type { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: "ADMIN" | "USER" | "PENDING";
      // ...other properties
    } & DefaultSession["user"];
  }

  interface User {
    role: "ADMIN" | "USER" | "PENDING";
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("🔍 Auth-Versuch für:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Fehlende Credentials");
          return null;
        }

        try {
          const user = await db.user.findUnique({
            where: { email: credentials.email }
          });

          console.log("👤 User gefunden:", user ? "Ja" : "Nein");

          if (!user || !user.password) {
            console.log("❌ User nicht gefunden oder kein Passwort");
            return null;
          }

          const isPasswordValid = await compare(credentials.password, user.password);
          console.log("🔐 Passwort gültig:", isPasswordValid);

          if (!isPasswordValid) {
            console.log("❌ Passwort ungültig");
            return null;
          }

          console.log("✅ Auth erfolgreich für:", user.email);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as "ADMIN" | "USER" | "PENDING",
          };
        } catch (error) {
          console.error("❌ Auth-Fehler:", error);
          return null;
        }
      }
    }),
  ],
  callbacks: {
    jwt: ({ token, user }: { token: any; user: any }) => {
      console.log("🔄 JWT Callback:", { user: user ? "Ja" : "Nein" });
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session: ({ session, token }: { session: any; token: any }) => {
      console.log("🔄 Session Callback:", { tokenId: token?.id });
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as "ADMIN" | "USER" | "PENDING",
        },
      };
    },
  },
  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt",
  },
  debug: true,
} as any;
