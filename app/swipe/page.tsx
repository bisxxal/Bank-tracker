'use client'
import SwipeRevealActions from '@/components/ui/swipeToDelete';
import React, { useEffect, useRef, useState } from 'react'
interface Item {
    id: string;
    text: string;
}
const Swipe = () => {
    const [items, setItems] = useState<Item[]>([
        { id: '1', text: 'Swipe me 1' },
        { id: '2', text: 'Swipe me 2' },
        { id: '3', text: 'Swipe me 3' },
    ]);

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
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const handleUpdate = (id: string) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, text: item.text + ' (updated)' } : item))
        );
    };

    const handleOpen = (id: string) => {
        setOpenItemId(id);
    };
    return (
        <div className=' w-full min-h-screen'>
            <div style={{ padding: 20 }}>
                <h2>iOS-style Swipe Actions</h2>
                {items.map((item) => (
                    <SwipeRevealActions
                        key={item.id}
                        id={item.id}
                        onDelete={handleDelete}
                        onUpdate={handleUpdate}
                        isOpen={openItemId === item.id}
                        onOpen={handleOpen}
                        setRef={setItemRef}
                    >
                        {item.text}
                    </SwipeRevealActions>
                ))}

            </div>
        </div>
    )
}

export default Swipe