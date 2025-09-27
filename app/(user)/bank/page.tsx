'use client'
import { AddBanks, deleteBank, getBanks } from '@/actions'
import Loading from '@/components/ui/loading'
import SwipeRevealActions from '@/components/ui/swipeToDelete'
import { toastError, toastSuccess } from '@/lib/toast'
import { banks } from '@/lib/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Landmark, Loader } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

const BankPage = () => {
    const [show, setShow] = useState(true);

    return (
        <div className=' min-h-screen border border-[#ffffff00] mt-20 w-full'>
            <div className='flex justify-between items-center border border-[#cba6f788] w-fit  overflow-hidden rounded-full mx-auto my-4'>
                <button onClick={() => setShow(true)} className={`${show ? " border-none buttonbg" : " "} rounded-l-4xl px-4 py-2 `}>Add Bank</button>
                <button onClick={() => setShow(false)} className={`${show ? " " : "buttonbg border-none  "} rounded-r-4xl px-4 py-2 `}>Bank List</button>
            </div>
            {show ? <AddBank />
                : <BankList />
            }
        </div>
    )
}

export default BankPage

const AddBank = () => {
    const queryClient = useQueryClient();
    const handelFormSubmit = (fromData: FormData) => {
        const name = fromData.get('name') as string;
        const email = fromData.get('email') as string;
        if (!name || !email) {
            toastError('Name and MailId are required');
        }
        CreateMutation.mutate(fromData);
    }

    const CreateMutation = useMutation({
        mutationFn: async (fromData: FormData) => {
            return await AddBanks(fromData);
        },
        onSuccess: (data) => {
            if (data.status === 200) {
                toastSuccess('Bank added successfully');
                queryClient.invalidateQueries({ queryKey: ['banks'] });
            }
            else {
                toastError(data.message || 'Failed to add bank');
            }
        },

        onError: (error) => {
            toastError('Failed to add bank');
        },
    });

    return (
        <form action={handelFormSubmit} className="space-y-4  mt-3 w-[70%] border bordercolor max-md:w-[95%] mx-auto py-5 rounded-2xl flex px-4 flex-col">
            <div>
                <label className="block text-sm font-medium ">Bank Name</label>
                <select required
                    name='name'
                    className="mt-1 block w-full border bordercolor card p-2 rounded-md shadow-sm "
                >
                    <option value="">Select a Bank</option>
                    {banks.map((bank) => (
                        <option key={bank.value} value={bank.value}>
                            {bank.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium ">Bank Mail ID </label>
                <input required
                    type="email"
                    name='email'
                    className="mt-1 block w-full border bordercolor card p-2 rounded-md shadow-sm  "
                    placeholder="Enter Bank mailId"
                />
            </div>

            <p className=' text-xs'> ⚠️ Note this Bank account email id is should able to do fetch transaction only </p>
            <button
                type="submit"
                disabled={CreateMutation.isPending}
                className=" disabled:opacity-[0.5] center  px-4 py-2 buttonbg text-white rounded-full transition duration-200"
            >
                {CreateMutation.isPending ? <Loader className=' animate-spin ' /> : 'Add Bank'}
            </button>
        </form>)
}

const BankList = () => {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ['banks'],
        queryFn: async () => {
            const response = await getBanks();
            return response
        },
    });
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return await deleteBank(id);
        },
        onSuccess: (data) => {
            if (data.status === 200) {
                toastSuccess('Bank deleted successfully');
                queryClient.invalidateQueries({ queryKey: ['banks'] });
            }
        },

        onError: (error) => {
            toastError('Failed to Bank transaction');
        },
    });
    const [openItemId, setOpenItemId] = useState<string | null>(null);
    const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const setItemRef = (id: string, ref: HTMLDivElement | null) => {
        itemRefs.current[id] = ref;
    };
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            if (!openItemId) return;

            const openRef = itemRefs.current[openItemId];
            if (openRef && !openRef.contains(e.target as Node)) {
                setOpenItemId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [openItemId]);

    const handleDelete = (id: string) => {
        deleteMutation.mutateAsync(id)
    };

    

    const handleOpen = (id: string) => {
        setOpenItemId(id);
    };


    return (
        <div className=' min-h-screen w-[70%] max-md:w-[95%] mx-auto'>
            <h1 className='text-center  center gap-2 text-2xl font-semibold mb-4'>Your Banks <Landmark /></h1>
            <div className=' flex flex-col '>
                {data && !isLoading ? data?.map((bank) => (
                    <SwipeRevealActions
                        key={bank.id}
                        id={bank.id}
                        onDelete={handleDelete}
                        onUpdate={null}
                        editable={false}
                        isOpen={openItemId === bank.id}
                        onOpen={handleOpen}
                        setRef={setItemRef}
                    >
                        <div key={bank.value} className=' cursor-pointer card p-3 border bordercolor rounded-lg shadow-md'>
                            <h2 className=' text-2xl font-semibold'>{bank.name}</h2>
                            <p className=' text-gray-400'>{bank.mailId}</p>
                        </div>
                    </SwipeRevealActions>
                )) : (
                    isLoading ? <Loading boxes={4} child="h  h-[80px] w-full !rounded-xl " parent="w-full px-0  " /> : <p className=' h-[50vh] center text-center'>No Banks Found</p>
                )}
            </div>
        </div>
    )
}