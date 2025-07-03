"use client";
 
import { syncBank } from "@/actions/syncBank";
import Link from "next/link";
import { useTransition, useState } from "react";

export function SyncButton() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState("");

  return (
    <div className="my-4 w-full flex items-center justify-between">
     <div>
       <button
        onClick={() => {
          setStatus("Syncing please wait don't refresh page...");
          startTransition(async () => {
            try {
              await syncBank();
              setStatus("✅ Synced!");
            } catch (err) {
              setStatus("❌ Failed to sync");
            }
          });
        }}
        className="px-4 py-2 buttonbg   text-white rounded-full"
      >
        {isPending ? "Syncing..." : "Sync Bank Emails"}
      </button>
      <p className="mt-2 text-sm text-gray-600">{status}</p>
     </div>
     <div> <Link className="px-4 py-2 rounded-full buttonbg" href={'/create'}>Create Transactions</Link> </div>
    </div>
  );
}
