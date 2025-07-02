import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken as string;

  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: 'v1', auth });

  const res = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 100,
  });

  const messages = await Promise.all(
    (res.data.messages || []).map(async (message) => {
      const msg = await gmail.users.messages.get({
        userId: 'me',
        id: message.id!,
        format: 'full',
      });
      return {
        id: msg.data.id,
        snippet: msg.data.snippet,
        subject: msg.data.payload?.headers?.find(h => h.name === 'Subject')?.value,
        body: msg.data.snippet || '',
      };
    })
  );

  return Response.json({ messages });
}
