import { Pencil, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';

interface Props {
  id: string;
  onDelete: (id: string) => void;
  onUpdate: (id: string) => void | null;
  isOpen: boolean;
  onOpen: (id: string) => void;
  children: React.ReactNode;
  setRef: (id: string, ref: HTMLDivElement | null) => void;
  editable ?:boolean
}

const SwipeRevealActions: React.FC<Props> = ({
  id,
  onDelete,
  onUpdate,
  isOpen,
  onOpen,
  setRef,
  children,
  editable  
}) => {
  const maxSwipe = 70;
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handlers = useSwipeable({
  onSwiping: ({ deltaX }) => {
    if (deltaX < 0) {
      // Swiping left (delete) is always allowed
      setTranslateX(Math.max(deltaX, -maxSwipe));
    } else if (editable) {
      // Only allow swiping right (edit) if editable is true
      setTranslateX(Math.min(deltaX, maxSwipe));
    } else {
      // Prevent swiping right when not editable
      setTranslateX(0);
    }
  },
  onSwiped: ({ deltaX }) => {
    if (deltaX <= -50) {
      // Confirm left swipe
      onOpen(id);
      setTranslateX(-maxSwipe);
    } else if (deltaX >= 50 && editable) {
      // Confirm right swipe only if editable
      onOpen(id);
      setTranslateX(maxSwipe);
    } else {
      // Reset position
      setTranslateX(0);
    }
  },
  trackMouse: true,
  trackTouch: true,
});

  // const handlers = useSwipeable({
  //   onSwiping: ({ deltaX }) => {
      
  //     // if (deltaX < 0) setTranslateX(Math.max(deltaX, -maxSwipe));
  //     // else setTranslateX(Math.min(deltaX, maxSwipe));
  //       if (deltaX < 0) {
  //     // Allow swipe left (delete)
  //     setTranslateX(Math.max(deltaX, -maxSwipe));
  //   } else if (editable) {
  //     // Allow swipe right (edit) only if editable
  //     setTranslateX(Math.min(deltaX, maxSwipe));
  //   }
  //   },
  //   onSwiped: ({ deltaX }) => {
  //     if (deltaX <= -50) {
  //       onOpen(id);
  //       setTranslateX(-maxSwipe);
  //     } else if (deltaX >= 50) {
  //       onOpen(id);
  //       setTranslateX(maxSwipe);
  //     } else {
  //       setTranslateX(0);
  //     }
  //   },
  //   trackMouse: true,
  //   trackTouch: true,
  // });

  useEffect(() => {
    if (!isOpen) setTranslateX(0);
  }, [isOpen]);

  useEffect(() => {
    setRef(id, containerRef.current);
    return () => setRef(id, null);
  }, [id, setRef]);

  const handleDelete = () => {
    onDelete(id);
    setTranslateX(0);
  };

  const handleUpdate = () => {
    onUpdate(id);
    setTranslateX(0);
  };

  return (
    <div ref={containerRef} className="relative overflow-hidden mb-3">
      <div className="absolute inset-0 flex items-center justify-between">
       
        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white px-4 flex items-center   w-1/2 h-full py-2 -pr-5 rounded-3xl"
        >
        <Pencil />
        </button>
      
         <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 flex items-center justify-end  py-2 w-1/2 h-full rounded-3xl "
        >
          <Trash2  />
        </button>
      </div>
      <div
        {...handlers}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: 'transform 0.2s ease-out',
        }}
        className="relative z-1 rounde d-3xl overflow-hidden "
      >
        {children}
      </div>
    </div>
  );
};

export default SwipeRevealActions;
