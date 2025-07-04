"use client";
 
import { syncBank } from "@/actions/syncBank";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useTransition, useState } from "react";

export function SyncButton() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState("");
  const queryClient = useQueryClient();
  return (
    <div className="my-4 w-full flex items-center justify-between">
     <div>
       <button
        onClick={() => {
          setStatus("Syncing don't refresh page...");
          startTransition(async () => {
            try {
              await syncBank();
              setStatus("✅ Synced!");
               queryClient.invalidateQueries({ queryKey: ['trackerData'] });
              setTimeout(() => {
                setStatus("");
              }, 3000);
            } catch (err) {
              setStatus("❌ Failed to sync");
            }
          });
        }}
        disabled={isPending}
        className={` px-4 ${isPending ? ' brightness-50 ' : ' brightness-100 ' } py-2 buttonbg center gap-1  text-white rounded-full `}
      >
      
        {isPending ? "Syncing..." : "Sync"} <RefreshCcw className={` ${isPending ? ' animate-spin  ' : ' ' }`} size={20} />
      </button>
      <p className="mt-2 text-xs text-gray-600">{status}</p>
     </div>
     <div> <Link className="px-4 py-2 flex rounded-full buttonbg" href={'/create'}>Create Transactions</Link> </div>
    </div>
  );
}
