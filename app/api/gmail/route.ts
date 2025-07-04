// import { authOptions } from '@/lib/auth';
// import { google } from 'googleapis';
// import { getServerSession } from 'next-auth';

// export async function GET() {
//   const session = await getServerSession(authOptions);

//   const accessToken = session?.accessToken as string;
//   console.log(" in gmail" , accessToken)
//   if (!accessToken) {
//     return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
//   }

//   const auth = new google.auth.OAuth2();
//   auth.setCredentials({ access_token: accessToken });

//   const gmail = google.gmail({ version: 'v1', auth });

//   const res = await gmail.users.messages.list({
//     userId: 'me',
//     maxResults: 100,
//   });

//   const messages = await Promise.all(
//     (res.data.messages || []).map(async (message) => {
//       const msg = await gmail.users.messages.get({
//         userId: 'me',
//         id: message.id!,
//         format: 'full',
//       });
//       return {
//         id: msg.data.id,
//         snippet: msg.data.snippet,
//         subject: msg.data.payload?.headers?.find(h => h.name === 'Subject')?.value,
//         body: msg.data.snippet || '',
//       };
//     })
//   );

//   return Response.json({ messages });
// }


import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { google } from 'googleapis';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return new Response(JSON.stringify({ error: 'No access token in session' }), { status: 401 });
  }

  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });

    const gmail = google.gmail({ version: 'v1', auth });

    const res = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10,
      q: 'from:alerts@hdfcbank.net OR from:no-reply@kotak.com',
    });

    const messages = await Promise.all(
      (res.data.messages || []).map(async (message) => {
        const msg = await gmail.users.messages.get({
          userId: 'me',
          id: message.id!,
          format: 'metadata',
          metadataHeaders: ['Subject', 'From', 'Date'],
        });

        const headers = msg.data.payload?.headers || [];
        return {
          id: msg.data.id,
          subject: headers.find(h => h.name === 'Subject')?.value,
          from: headers.find(h => h.name === 'From')?.value,
          date: headers.find(h => h.name === 'Date')?.value,
          snippet: msg.data.snippet,
        };
      })
    );

    return Response.json({ messages });
  } catch (error: any) {
    console.error("🔴 Gmail API error", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to fetch emails" }), { status: 500 });
  }
}
