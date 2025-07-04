'use server'

import { authOptions } from "@/lib/auth";
import { getBankEmails } from "@/lib/gmail";
import prisma from "@/lib/prisma";
import { extractFromEmail } from "@/lib/utils";
import { getServerSession } from "next-auth";

export async function syncBankEmails(accessToken: string) {
    const session = await getServerSession(authOptions);
    const emails = await getBankEmails(accessToken);

    if (!session || emails.length === 0) {
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
 
}

export async function getTransactions() {
    const session = await getServerSession(authOptions);
    if (!session) {
        throw new Error("User not authenticated");
    }

    const transactions = await prisma.transaction.findMany({
        where: { userId: session.user.id },
        select: {
            id: true,
            type: true,
            bank: true,
            amount: true,
            date: true,
        },
        take: 20,
        orderBy: { date: "desc" },
    });

    return transactions;
}
export async function getTransactionsBySelected(startDate: Date, endDate: Date) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return { status:400, message: "User not authenticated" };   
    }

    const transactions = await prisma.transaction.findMany({
        where: {
            userId: session.user.id,

            date: {
                gte: startDate,
                lte: endDate,
            },
        },

        select: {
            id: true,
            type: true,
            bank: true,
            amount: true,
            date: true,
            send: true,
            spendsOn: true,
            category: true,
            
        },
        // take: 20,
        orderBy: { date: "desc" },
    });

    return transactions;
}

export async function deleteTransaction(id: string) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return { status:400, message: "User not authenticated" };   
    }

    const deletedTransaction = await prisma.transaction.delete({
        where: {
            id: id,

        },
    });
 
    if (!deletedTransaction) {
        return { status: 500, message: "Failed to delete transaction" };
    }
    return { status: 200, message: "Transaction deleted successfully" };
}   

export async function createTransaction(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return { status:400, message: "User not authenticated" };   
    }
    const amount = parseInt(formData.get('amount') as string);
    const type = formData.get('type') as string;
    const bank = formData.get('bank') as string;
    const category = formData.get('category') as string;
    const spendsOn = formData.get('spendsOn') as string;
    const send = formData.get('send') as string;
    const date = new Date(formData.get('date') as string);

    console.log(amount, type, bank, category, spendsOn, send, date)
    if (!amount || !type || !bank || !date) {
        return { status:400};   
    }

    const transaction = await prisma.transaction.create({
        data: {
            type,
            bank,
            amount,
            date,
            userId: session.user.id,
            category,
            spendsOn,
            send,
        },
    });
    if (!transaction) {
        return { status: 500, message: "Failed to create transaction" };
    }
    return { status: 200  };
}

export async function getTransactionById(id: string) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return { status:400};
    }
    const transaction = await prisma.transaction.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            type: true,
            bank: true,
            amount: true,
            date: true,
            send: true,
            spendsOn: true,
            category: true,
        },
    });
    return transaction;
}

export async function updateTransaction(formData: FormData ,id:string) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return { status:400};   
    }
    const amount = parseInt(formData.get('amount') as string);
    const type = formData.get('type') as string;
    const bank = formData.get('bank') as string;
    const category = formData.get('category') as string;
    const spendsOn = formData.get('spendsOn') as string;
    const send = formData.get('send') as string;
    const date = new Date(formData.get('date') as string);

    console.log(amount, type, bank, category, spendsOn, send, date)
    if (!amount || !type || !bank || !date) {
        return { status:400};   
    }

    const transaction = await prisma.transaction.update({
        where:{
            id: id,
        },
        data: {
            type,
            bank,
            amount,
            date,
            userId: session.user.id,
            category,
            spendsOn,
            send,
        },
    });
    if (!transaction) {
        return { status: 500, message: "Failed to create transaction" };
    }
    return { status: 200  };
}

export async function getBanks() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return { status:400, message: "User not authenticated" };   
    } 
   try {
     const userWithBanks = await prisma.user.findUnique({
         where: { id: session.user.id },
         select: {
             bank: {
                 select: {
                     id: true,
                     name: true,
                     mailId: true,
                 },
                 orderBy: { createdAt: "desc" },
             },
         },
     });
     return JSON.parse(JSON.stringify(userWithBanks?.bank || []));
   } catch (error) {
    
   }

}
export async function AddBanks(fromData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return { status:400, message: "User not authenticated" };   
    }

    const name = fromData.get('name') as string;
    const email = fromData.get('email') as string;
    if (!name || !email) {
        return { status:400, message: "Name and email are required" };   
    }
    const banks = await prisma.bank.create({
        data: {
            name,
            mailId: email,
            user:{
                connect: {
                    id: session.user.id,
                },
            }
        },
    });

    if (!banks) {
        return { status: 500, message: "Failed to create bank" };
    }
    return { status: 200, message: "Bank created successfully" };
}