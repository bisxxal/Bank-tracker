'use server'
import { authOptions } from "@/lib/auth";
import { getBankEmails } from "@/lib/gmail";
import prisma from "@/lib/prisma";
import { extractFromEmail } from "@/lib/utils";
import { getServerSession } from "next-auth";

export async function syncBankEmails(limit: number = 10) {
  const session = await getServerSession(authOptions);
  const accessToken = (session as any)?.accessToken;
  if (!accessToken) throw new Error("No access token");

  const emails = await getBankEmails(limit);

  if (!session) {
    return { status: 400, message: " user not authenticated." };
  }
  if (emails.results.length === 0 && emails.error) {
    return { status: 400, message: "No bank found. Please add bank" };
  }
  if (emails.results.length === 0) {
    return { status: 400, message: "No Mail found " };
  }
  for (const email of emails.results) {
    const existing = await prisma.transaction.findUnique({
      where: { id: email.id! },
    });
    if (!existing) {
      const lowerBody = email.body.toLowerCase();
      const isCredit = /(credited|deposit(ed)?|received|added)/i.test(lowerBody);
      const isDebit = /(debited|withdrawn|Debit|spent|deducted|paid|successful|purchase)/i.test(lowerBody);

      const amountRegex = /\b(rs\.?|₹|inr)\s?([\d,]+(\.\d{1,2})?)/i;
      const amountMatch = email.body.match(amountRegex);

      const isUnknown = !isCredit && !isDebit;

      if (!isUnknown && amountMatch) {
        const amount = parseFloat(amountMatch[2].replace(/,/g, ''));

        await prisma.transaction.create({
          data: {
            id: email.id!,
            type: isCredit ? 'credit' : isDebit ? 'debit' : 'unknown',
            bank: extractFromEmail(email.from),
            amount: amount,
            userId: session?.user?.id!,
            date: new Date(email.date!),
          },
        });
      }
    }
  }
  return { status: 200, message: "No new emails to sync." };
}
