 
'use client';
import { MoveUpLeft, MoveUpRight } from "lucide-react";
import { useEffect, useState } from "react";

const Transations = ({ body }: { body: string }) => {
  const [credit, setCredit] = useState(0);
  const [debit, setDebit] = useState(0);

  useEffect(() => {
    const lowerBody = body.toLowerCase();
 
    const isCredit = /(credited|deposit(ed)?|received|added)/i.test(lowerBody);
    const isDebit = /(debited|withdrawn|spent|debit|deducted|paid|successful|purchase)/i.test(lowerBody);
 
    const amountRegex = /\b(rs\.?|₹|inr)\s?([\d,]+(\.\d{1,2})?)/i;
    const amountMatch = body.match(amountRegex);

    if (amountMatch) {
      const amount = parseFloat(amountMatch[2].replace(/,/g, ''));

      if (isCredit) {
        setCredit(amount);
      } else if (isDebit) {
        setDebit(amount);
      }
    }
  }, [body]);

  return (
    <div className={` ${credit ? ' border-green-500/80 bg-green-400/10 ' : 'border-red-600/80 bg-red-400/10 '} max-md:w-full  border-2 rounded-3xl p-4 `}>
      <h2 className=" font-semibold mb-2">Transaction </h2>
      { credit  ? <p className=" flex items-center justify-center gap-1">  <strong>Credit:</strong> ₹{credit.toFixed(2)}<MoveUpRight /></p>
    :  <p className=" flex items-center justify-center gap-1"> <strong>Debit:</strong> ₹{debit.toFixed(2)} <MoveUpLeft /></p>
    }
    </div>
  );
};

export default Transations;
