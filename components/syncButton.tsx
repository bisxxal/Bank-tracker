"use client";
 
import { syncBankEmails } from "@/actions/syncBank";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RefreshCcw } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export function SyncButton() {
  const queryClient = useQueryClient();

  const createSync = useMutation({
      mutationFn: async ( ) => {
        return await syncBankEmails( );
      },
      onSuccess: (data) => {
        if (data.status === 200) {
          toast.success('Synced! ✅ ');
          queryClient.invalidateQueries({ queryKey: ['trackerData'] });
        }
        if (data.status === 400) {
          toast.error(data.message);
        }
      },
  
      onError: ( ) => { 
      },
    });


  return (
    <div className="my-4 w-full flex items-center justify-between">
     <div>
       <button
        onClick={() => createSync.mutate() }
        disabled={createSync.isPending}
        className={` px-4 ${createSync.isPending ? ' brightness-50 ' : ' brightness-100 ' } py-2 buttonbg center gap-1  text-white rounded-full `}
      >
      
        {createSync.isPending ? "Syncing..." : "Sync"} <RefreshCcw className={` ${createSync.isPending ? ' animate-spin  ' : ' ' }`} size={20} />
      </button>
      {
        createSync.isPending && <p className="text-xs text-gray-600">Syncing Don't refresh page</p>
      }
     </div>
     <div> <Link className="px-4 py-2 flex rounded-full buttonbg" href={'/create'}>Create Transactions</Link> </div>
    </div>
  );
}

 