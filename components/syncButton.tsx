"use client";
 
import { syncBank } from "@/actions/syncBank";
import { useTransition, useState } from "react";

export function SyncButton() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState("");

  return (
    <div className="my-4">
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
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isPending ? "Syncing..." : "Sync Bank Emails"}
      </button>
      <p className="mt-2 text-sm text-gray-600">{status}</p>
    </div>
  );
}
