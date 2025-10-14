'use server'

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
 
export async function getTransactionsBySelected(startDate: Date, endDate: Date) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { status: 400, message: "User not authenticated" };
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
    return { status: 400, message: "User not authenticated" };
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
    return { status: 400, message: "User not authenticated" };
  }
  const amount = parseInt(formData.get('amount') as string);
  const type = formData.get('type') as string;
  const bank = formData.get('bank') as string;
  const category = formData.get('category') as string;
  const spendsOn = formData.get('spendsOn') as string;
  const send = formData.get('send') as string;
  const date = new Date(formData.get('date2') as string);

  if (!amount || !type || !bank || !date) {
    return { status: 400 };
  }

  const transaction = await prisma.transaction.create({
    data: {
      type,
      bank,
      amount,
      date,
      userId: session.user.id,
      category,
      send,
    },
  });
  if (!transaction) {
    return { status: 500, message: "Failed to create transaction" };
  }

    // console.log( send);
  return { status: 200 };
}

export async function getTransactionById(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { status: 400 };
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

export async function updateTransaction(formData: FormData, id: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { status: 400 };
  }
  const amount = parseInt(formData.get('amount') as string);
  const type = formData.get('type') as string;
  const bank = formData.get('bank') as string;
  const category = formData.get('category') as string;
  const spendsOn = formData.get('spendsOn') as string;
  const send = formData.get('send') as string;
  const date = new Date(formData.get('date2') as string);

  if (!amount || !type || !bank || !date) {
    return { status: 400 };
  }

  const transaction = await prisma.transaction.update({
    where: {
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
  return { status: 200 };
}

export async function getBanks() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { status: 400, message: "User not authenticated" };
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

export async function AddBanks(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return { status: 401, message: "User not authenticated" };
  }

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  if (!name || !email) {
    return { status: 400, message: "Bank name and at least one email are required" };
  }
  //   if bank already exists
  const existingBank = await prisma.bank.findFirst({
    where: {
      name,
      userId: session.user.id,
    },
  });
  if (existingBank) {
    return {
      status: 202,
      message: "Bank already exists for this user",
      bankId: existingBank.id,
    };
  }
  const addBank = await prisma.bank.create({
    data: {
      name,
      userId: session.user.id,
      mailId: email
    },
  })
  return {
    status: 200,
    message: "New bank created and linked to user",
    bankId: addBank.id,
  };

}


export async function deleteBank(bankId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return { status: 401, message: "User not authenticated" };
  }

  try {
    const existingBank = await prisma.bank.findFirst({
      where: {
        id: bankId,
      },
    });
    if (!existingBank) {
      return { status: 404, message: "Bank not found" };
    }

    await prisma.bank.delete({
      where: {
        id: bankId,
      },
    });

    return {
      status: 200,
      message: "Bank disconnected ",
    };
  } catch (error) {
    return { status: 500, message: "Failed to disconnect bank from user" };
  }
}

export async function getTransactionsBySelectedMonth(month: number, year: number) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { status: 400, message: "User not authenticated" };
  }

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999); 

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
    orderBy: { date: "desc" },
  });

  return transactions;
}

export async function getBrrows(){
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { status: 400, message: "User not authenticated" };
    }
  
    const brrows = await prisma.brrow.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        amount: true,
        name: true,
        type: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  
    if(brrows){
      return { status: 200, data: brrows };
    }
    return { status: 404, message: "No brrows found" };
  } catch (error) {
    
  }
}

export async function createBrrow(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { status: 400, message: "User not authenticated" };
    }
    const amount = parseInt(formData.get('amount') as string);
    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
  
    if (!amount  ) {
      return { status: 400, message: "Amount and name are required" };
    }
  
    const brrow = await prisma.brrow.create({
      data: {
        amount,
        name,
        userId: session.user.id,
        type,
      },
    });
    if(!brrow) {  
      return { status: 500, message: "Failed to create brrow" };
    }
  
    return { status: 200, message: "Brrow created successfully", brrow };
  } catch (error) {
    
  }
}

export async function deleteBrrow(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { status: 400, message: "User not authenticated" };
    }
  
    const deletedBrrow = await prisma.brrow.delete({
      where: {
        id: id,
      },
    });
  
    if (!deletedBrrow) {
      return { status: 500, message: "Failed to delete brrow" };
    }
    return { status: 200, message: "Brrow deleted successfully" };
  } catch (error) {
    
  }
}