'use server' 
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth"; 
import { syncBankEmails } from ".";

export async function syncBank() {
  const session = await getServerSession(authOptions);
  const accessToken = (session as any)?.accessToken;

  if (!accessToken) throw new Error("No access token");

  await syncBankEmails(accessToken);
}
