import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "~/server/db";
import type { DefaultSession, SessionStrategy } from "next-auth";
import type { JWT } from "next-auth/jwt";

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
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: "ADMIN" | "USER" | "PENDING";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "ADMIN" | "USER" | "PENDING";
    name?: string;
    email?: string;
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
        if (!credentials?.email || !credentials?.password) return null;

        console.log("🔐 Auth-Versuch für:", credentials.email);

        const user = await db.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user?.password) {
          console.log("❌ Benutzer nicht gefunden oder kein Passwort");
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) {
          console.log("❌ Passwort ungültig");
          return null;
        }

        console.log("✅ Auth erfolgreich für:", user.email, "Rolle:", user.role);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as "ADMIN" | "USER" | "PENDING",
        };
      }
    }),
  ],
  callbacks: {
    jwt: ({ token, user }: { token: JWT; user?: { id: string; role: "ADMIN" | "USER" | "PENDING"; name?: string | null; email?: string | null } }) => {
      console.log("🔄 JWT Callback - User:", user ? "Ja" : "Nein", "Token ID:", token.id);

      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name!;
        token.email = user.email!;
        console.log("✅ JWT Token aktualisiert mit User-Daten");
      }
      return token;
    },
    session: ({ session, token }: { session: DefaultSession; token: JWT }) => {
      console.log("🔄 Session Callback - Token ID:", token.id, "Rolle:", token.role);

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as "ADMIN" | "USER" | "PENDING",
          name: token.name as string | null,
          email: token.email as string | null,
        },
      };
    },
  },
  pages: { signIn: "/auth" },
  session: { strategy: "jwt" as SessionStrategy },
  secret: process.env.AUTH_SECRET,
};
