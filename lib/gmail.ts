import { google } from "googleapis";

export async function getBankEmails(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  const gmail = google.gmail({ version: "v1", auth });
  const query = [
    'from:alerts@hdfcbank.net', 
    'from:no-reply@kotak.com',
  ].join(' OR ');

  const res = await gmail.users.messages.list({
    userId: "me",
    q: query,
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

  return results;
}
