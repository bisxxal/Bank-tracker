'use client'
import { createBrrow, deleteBrrow, getBrrows } from '@/actions'
import Loading from '@/components/ui/loading'
import SwipeRevealActions from '@/components/ui/swipeToDelete'
import { toastError, toastSuccess } from '@/lib/toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'

const Borrow = () => {
    const [show, setShow] = useState(false);
    return (
        <>
            <div className='flex justify-between items-center w-fit overflow-hidden border border-[#cba6f788] rounded-full mx-auto mt-[100px] my-4'>
                <button onClick={() => setShow(true)} className={`${show ? "   buttonbg " : "  "} rounded-l-4xl px-4 py-2 `}>Create</button>
                <button onClick={() => setShow(false)} className={`${show ? "  " : "buttonbg  "} rounded-r-4xl px-4 py-2 `}>All List</button>
            </div>
            {!show ? <ListBorrow /> : <CreateBrrows />}
        </>
    )
}

export default Borrow


const ListBorrow = () => {
    const client = useQueryClient();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<string | null>(null);
    const { data, isLoading } = useQuery({
        queryKey: ['borrow'],
        queryFn: async () => await getBrrows()
    })
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
        setShowDeleteConfirmation(id);
    };


    const handleOpen = (id: string) => {
        setOpenItemId(id);
    };

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return await deleteBrrow(id);
        },
        onSuccess: (data) => {
            if (data?.status === 200) {
                toastSuccess('Transaction deleted successfully');
                client.invalidateQueries({ queryKey: ['borrow'] });
            }
            else {
                toastError('Failed to delete transaction');
            }
        },

        onError: (error) => {
        },
    });
    return (
        <div>
            {showDeleteConfirmation !== null && <div className=' bg-[#00000023] z-[10] top-10 fixed center backdrop-blur-[10px] w-full h-full'>
                <div className=' bg-[#26253897] w-fit mx-auto mt-20 p-6 rounded-3xl shadow-lg'>
                    <h2> Are you sure want to delete ?</h2>
                    <div className='flex justify-center gap-4 mt-4'>
                        <button
                            className='bg-red-600/20 border border-red-500 text-white px-4 py-2 rounded-lg'
                            onClick={() => {
                                deleteMutation.mutateAsync(showDeleteConfirmation!);
                                setShowDeleteConfirmation(null);
                            }}
                        >
                            Delete
                        </button>
                        <button
                            className='border border-gray-500 text-white px-4 py-2 rounded-lg'
                            onClick={() => setShowDeleteConfirmation(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>}
            <div className='flex flex-col gap-4 mt-4'>
                {isLoading ? (
                    <Loading boxes={5} child="h-32  w-1/2 max-md:w-full !rounded-none " parent="w-full px-0" />
                ) : (
                    !isLoading && data && data?.data?.length !== 0 ?
                        <div className=' w-1/2 max-md:w-full mx-auto'>
                            {
                                data?.data && data?.data?.map((item) => (
                                    <SwipeRevealActions
                                        editable={false}
                                        key={item.id}
                                        id={item.id}
                                        onDelete={handleDelete}
                                        onUpdate={null}
                                        isOpen={openItemId === item.id}
                                        onOpen={handleOpen}
                                        setRef={setItemRef}
                                    >
                                        <div key={item.id} className=' rounded-none bordercolor border p-4 card '>
                                            <h2 className='text-xl font-bold'>{item.type}</h2>
                                            <p>Amount: ₹{item.amount}</p>
                                            <p>Name: {item.name}</p>
                                            <p>Date: {moment(item.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
                                        </div>
                                    </SwipeRevealActions>
                                ))
                            }
                        </div> : <p className='mt-20 text-lg center '>No data found</p>)
                }
            </div>
        </div>
    )
}

const CreateBrrows = () => {
    const [type, setType] = useState<"To be received" | "To be paid" | null>(null)
    const client = useQueryClient();
    const handelFormSubmit = (fromData: FormData) => {
        CreateMutation.mutate(fromData);
    }

    const CreateMutation = useMutation({
        mutationFn: async (fromData: FormData) => {
            const amount = parseInt(fromData.get('amount') as string);
            if (!amount) {
                toastError('Amount is required');
            }
            return await createBrrow(fromData);
        },
        onSuccess: (data) => {
            if (data?.status === 200) {
                toastSuccess('Created successfully');
                client.invalidateQueries({ queryKey: ['borrow'] });
            }
        },

        onError: (error) => {
            toastError('Failed to create ');
        },
    });

    return (
        <div>
            <form className=' space-y-4  w-[70%] border bordercolor max-md:w-[95%] mx-auto py-5 rounded-2xl flex px-4 flex-col' action={handelFormSubmit}>
                <div>
                    <label className="block text-sm font-medium ">Type</label>
                    <select onChange={(e) => setType(e.target.value)} className='mt-1 block w-full border bordercolor card p-2 rounded-md shadow-sm' name="type" >
                        <option value="">Select</option>
                        <option value="To be received">To be received</option>
                        <option value="To be paid">To be Paid </option>
                    </select>
                </div>
                {type !== null && <div>
                    <label className="block text-sm font-medium ">{type !== 'To be paid' ? 'Name who will give you ' : 'Name you will send '}</label>
                    <input required
                        type="text"
                        name="name"
                        className='mt-1 block w-full border bordercolor card p-2 rounded-md shadow-sm  '
                        placeholder="Jhon Doe"
                    />
                </div>}
                <div className=''>
                    <label className="block text-sm font-medium ">Amount</label>
                    <input required
                        type="number"
                        name="amount"
                        className='mt-1 block w-full border bordercolor card p-2 rounded-md shadow-sm  '
                        placeholder="Enter amount"
                    />
                </div>
                <button
                    type="submit"
                    disabled={CreateMutation.isPending}
                    className=" disabled:opacity-[0.5] center  px-4 py-2 buttonbg text-white rounded-full transition duration-200"
                >
                    {CreateMutation.isPending ? <Loader className=' animate-spin ' /> : 'Create Transaction'}
                </button>

            </form>
        </div>
    )
}