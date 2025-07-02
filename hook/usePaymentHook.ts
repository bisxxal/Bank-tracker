import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getBankEmails } from "@/lib/gmail";
import { getServerSession } from "next-auth";

export const usePaymentHook = async() => {
     const session = await getServerSession(authOptions);
      const accessToken = (session as any)?.accessToken;
      const messages = await getBankEmails(accessToken);

    return messages
}