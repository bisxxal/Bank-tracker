// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { NextAuthOptions } from "next-auth";

// export const authOptions: NextAuthOptions = {
//   secret: process.env.NEXTAUTH_SECRET,
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       authorization: {
//         params: {
//           scope: "openid email profile https://www.googleapis.com/auth/gmail.readonly",
//         },
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//   },
//  callbacks: {
//   async jwt({ token, account }) {
//     if (account) {
//       token.accessToken = account.access_token;
//     }
//     return token;
//   },
//   async session({ session, token }) {
//     session.accessToken = token.accessToken;
//     return session;
//   },
// }
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
 
import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";
  
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };