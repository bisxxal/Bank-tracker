 
import { Pencil, Trash } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';

interface Props {
  id: string;
  onDelete: (id: string) => void;
  onUpdate: (id: string) => void;
  isOpen: boolean;
  onOpen: (id: string) => void;
  children: React.ReactNode;
  setRef: (id: string, ref: HTMLDivElement | null) => void;
}

const SwipeRevealActions: React.FC<Props> = ({
  id,
  onDelete,
  onUpdate,
  isOpen,
  onOpen,
  setRef,
  children,
}) => {
  const maxSwipe = 70;
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handlers = useSwipeable({
    onSwiping: ({ deltaX }) => {
      if (deltaX < 0) setTranslateX(Math.max(deltaX, -maxSwipe));
      else setTranslateX(Math.min(deltaX, maxSwipe));
    },
    onSwiped: ({ deltaX }) => {
      if (deltaX <= -50) {
        onOpen(id);
        setTranslateX(-maxSwipe);
      } else if (deltaX >= 50) {
        onOpen(id);
        setTranslateX(maxSwipe);
      } else {
        setTranslateX(0);
      }
    },
    trackMouse: true,
    trackTouch: true,
  });

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
      {/* Action buttons */}
      <div className="absolute inset-0 flex items-center justify-between">
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 flex items-center -end py-2 w-1/2 h-full rounded-3xl "
        >
          <Trash  />
        </button>
        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white px-4 flex items-center justify-end  w-1/2 h-full py-2 -pr-5 rounded-3xl"
        >
        <Pencil />
        </button>
      </div>

      {/* Swipeable content */}
      <div
        {...handlers}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: 'transform 0.2s ease-out',
        }}
        className="relative z-1 rounded-3xl overflow-hidden "
      >
        {children}
      </div>
    </div>
  );
};

export default SwipeRevealActions;
