"use client";
import { syncBankEmails } from "@/actions/syncBank";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const SyncMailPage = () => {
    const [limit, setLimit] = useState<number>(10);
    const queryClient = useQueryClient();
    const createSync = useMutation({
        mutationFn: async (limit: number) => {
            return await syncBankEmails(limit);
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

        onError: () => {
        },
    });
    return (
        <div className=' w-full h-screen'>
            <h2 className=' text-center text-4xl font-bold'> Sync Mail </h2>
            <p className=' text-sm mt-2 text-gray-500 text-center'>Sync Transaction by mail</p>

            <div className="my-4 flex items-center w-1/2 mx-auto max-md:w-[80%] mt-20 justify-between">
                <select onChange={(e) => setLimit(Number(e?.target?.value))} className="px-4 py-2 rounded-2xl border bordercolor card ">
                    <option value="10">previous 10</option>
                    <option value="20">previous 20</option>
                    <option value="30">previous 30</option>
                    <option value="50">previous 50</option>
                    <option value="100">previous 100</option>
                    <option value="200">previous 200</option>
                </select>
                <div>
                    <button
                        onClick={() => createSync.mutate(limit)}
                        disabled={createSync.isPending}
                        className={` px-4 ${createSync.isPending ? ' brightness-50 ' : ' brightness-100 '} py-2 buttonbg center gap-1  text-white rounded-full `}
                    >
                    {createSync.isPending ? "Syncing..." : "Sync"} <RefreshCcw className={` ${createSync.isPending ? ' animate-spin  ' : ' '}`} size={20} />
                    </button>
                    {
                        createSync.isPending && <p className="text-xs text-gray-600">Syncing Don't refresh page</p>
                    }
                </div>
            </div>
        </div>
    )
}

export default SyncMailPage