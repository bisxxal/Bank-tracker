'use server'

import { authOptions } from "@/lib/auth";
import { getBankEmails } from "@/lib/gmail";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function syncBankEmails(accessToken: string) {
    const emails = await getBankEmails(accessToken);
    const session = await getServerSession(authOptions);

    if(!session || emails.length === 0) {
        return { message: "No emails to sync or user not authenticated." };
    }
    for (const email of emails) {
        // Avoid duplicate entries by Gmail message ID
        const existing = await prisma.transaction.findUnique({
            where: { id: email.id! },
        });


        if (!existing) {
            const lowerBody = email.body.toLowerCase();

            const isCredit = /(credited|deposit(ed)?|received|added)/i.test(lowerBody);
            const isDebit = /(debited|withdrawn|spent|deducted|paid|successful|purchase)/i.test(lowerBody);

            const amountRegex = /\b(rs\.?|₹|inr)\s?([\d,]+(\.\d{1,2})?)/i;
            const amountMatch = email.body.match(amountRegex);
            
            const isUnknown = !isCredit && !isDebit;

           if(!isUnknown && amountMatch) {
                const amount = parseFloat(amountMatch[2].replace(/,/g, ''));
 
                 await prisma.transaction.create({
                data: {
                    id: email.id!,
                    type: isCredit ? 'credit' : isDebit ? 'debit' : 'unknown', 
                    bank: email.from,
                    amount: amount,
                    userId: session?.user?.id!,
                    date: new Date(email.date!),
                },
            });
            }
        }
    }

    return { message: `Saved ${emails.length} emails (with deduplication).` };
}

export async function getTransactions() {
    const session = await getServerSession(authOptions);
    if (!session) {
        throw new Error("User not authenticated");
    }

    const transactions = await prisma.transaction.findMany({
        where: { userId: session.user.id },
        orderBy: { date: "desc" },
    });

    return transactions;
}