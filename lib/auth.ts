import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";
import crypto from "crypto";
import { google } from "googleapis";
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    accessToken: string;
  }
  interface JWT {
    accessToken: string;
    accessTokenExpires: number;
    refreshToken: string;
    user?: any;
    error?: string;
  }
}

async function refreshAccessToken(token: any) {
  try {
    const client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!
    );

    client.setCredentials({
      refresh_token: token.refreshToken,
    });

    const { credentials } = await client.refreshAccessToken();

    return {
      ...token,
      accessToken: credentials.access_token,
      accessTokenExpires: credentials.expiry_date ?? Date.now() + 3600 * 1000,

      refreshToken: credentials.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/gmail.readonly",
          access_type: "offline",
          prompt: "consent",
          state: crypto.randomUUID(),
        },

      },

    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + account.expires_in * 1000,
          refreshToken: account.refresh_token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          },
        };
      }

      if (Date.now() < (token.accessTokenExpires ?? 0)) {
        return token;
      }

      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = {
        id: token.user?.id,
        name: token.user?.name,
        email: token.user?.email,
        image: token.user?.image,
      };
      return session;
    },
  },
};

export default NextAuth(authOptions);
