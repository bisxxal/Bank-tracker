import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { getBanks } from "@/actions";

export async function getBankEmails() {
   const session = await getServerSession(authOptions);
  
    if (!session || !session.accessToken) {
      return new Response(JSON.stringify({ error: 'No access token in session' }), { status: 401 });
    }
   
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.accessToken });
  const gmail = google.gmail({ version: "v1", auth });
  // const query = [
  //   'from:alerts@hdfcbank.net', 
  //   'from:no-reply@kotak.com',
  // ].join(' OR ');

  const banks = await getBanks();
  const bankEmails = banks.map((bank:{mailId:string}) => `from:${bank.mailId}`).join(' OR ');

  const res = await gmail.users.messages.list({
    userId: "me",
    q: bankEmails,
    maxResults: 500,
    
  });

  const messages = res.data.messages || [];

  const results = await Promise.all(
    messages.map(async (msg) => {
      const message = await gmail.users.messages.get({
        userId: "me",
        id: msg.id!,
        format: "metadata",
        metadataHeaders: ["Subject", "From", "Date"],
      });

      const headers = message.data.payload?.headers || [];
      const body = message.data.snippet || "";
      const subject = headers.find((h) => h.name === "Subject")?.value || "(no subject)";
      const from = headers.find((h) => h.name === "From")?.value || "(no sender)";
      const date = headers.find((h) => h.name === "Date")?.value;

      return {
        id: msg.id,
        subject,
        from,
        date,
        body
      };
    })
  );

  return {  banks, results};
}
