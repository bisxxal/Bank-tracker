// import { google } from "googleapis";
// import { getServerSession } from "next-auth";
// import { authOptions } from "./auth";
// import { getBanks } from "@/actions";

// export async function getBankEmails() {
//   const session = await getServerSession(authOptions);
//   if (!session || !session.accessToken) {
//     return new Response(JSON.stringify({ error: 'No access token in session' }), { status: 401 });
//   }
//   const auth = new google.auth.OAuth2();
//   auth.setCredentials({ access_token: session.accessToken });
//   const gmail = google.gmail({ version: "v1", auth });
//   // const query = [
//   //   'from:alerts@hdfcbank.net', 
//   //   'from:no-reply@kotak.com',
//   // ].join(' OR ');

//   const banks = await getBanks();
//   const bankEmails = banks?.map((bank: { mailId: string }) => `from:${bank.mailId}`).join(' OR ');
//   if (!bankEmails) {
//     return { banks: [], results: [], error: "No bank emails found" };
//   }
//   const res = await gmail.users.messages.list({
//     userId: "me",
//     q: bankEmails,
//     maxResults: 500,

//   });
//   const messages = res.data.messages || [];
//   const results = await Promise.all(
//     messages.map(async (msg) => {
//       const message = await gmail.users.messages.get({
//         userId: "me",
//         id: msg.id!,
//         format: "metadata",
//         metadataHeaders: ["Subject", "From", "Date"],
//       });

//       const headers = message.data.payload?.headers || [];
//       const body = message.data.snippet || "";
//       const subject = headers.find((h) => h.name === "Subject")?.value || "(no subject)";
//       const from = headers.find((h) => h.name === "From")?.value || "(no sender)";
//       const date = headers.find((h) => h.name === "Date")?.value;

//       return {
//         id: msg.id,
//         subject,
//         from,
//         date,
//         body
//       };
//     })
//   );

//   return { banks, results };
// }


import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { getBanks } from "@/actions";
import { cache } from "react";

// Throttle to avoid Gmail quota error
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getBankEmails =cache (async()=> {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    throw new Error("No access token in session");
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.accessToken });
  const gmail = google.gmail({ version: "v1", auth });

  // Get all bank mailIds (from DB)
  const banks = await getBanks();
  const bankEmails = banks?.map((bank: { mailId: string }) => `from:${bank.mailId}`).join(" OR ");

  if (!bankEmails) {
    return { banks: [], results: [], error: "No bank emails found" };
  }

  // Fetch matching emails (limit to avoid quota hit)
  const res = await gmail.users.messages.list({
    userId: "me",
    q: bankEmails,
    maxResults: 20, // 👈 decrease this to avoid Gmail quota errors
  });

  const messages = res.data.messages || [];

  const results = [];

  for (const msg of messages) {
    await sleep(150); // ⏳ throttle each request

    try {
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

      results.push({
        id: msg.id!,
        subject,
        from,
        date,
        body,
      });
    } catch (err) {
      console.error("Failed to fetch individual message:", err);
    }
  }

  return {
    banks,
    results,
    error: results.length === 0 ? "No bank emails found" : null,
  };
}
)