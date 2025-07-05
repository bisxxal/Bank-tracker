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
    console.error("🔴 Failed to refresh access token", error);
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
          access_type: "offline", // 🟢 Required for refresh_token
          prompt: "consent",      // 🟢 Needed to reissue refresh_token
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
      // 🔐 Initial sign in
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

      // `✅ Still valid access token
      if (Date.now() < (token.accessTokenExpires ?? 0)) {
        return token;
      }

      // 🔁 Refresh access token
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      // session.user.id = token.sub as string;  
      session.user = {
        id: token.user?.id,
        name: token.user?.name,
        email: token.user?.email,
        image: token.user?.image,
      };
      return session;
    },
  },
  
  // events: {
  //     async createUser({ user }) {
  //       const existingProfile = await prisma.profile.findUnique({
  //         where: { userId: user.id },
  //       });

  //       if (!existingProfile) {
  //         await prisma.profile.create({
  //           data: {
  //             userId: user.id,
  //           },
  //         });
  //       }

  //     },
  //   },

};

export default NextAuth(authOptions);
