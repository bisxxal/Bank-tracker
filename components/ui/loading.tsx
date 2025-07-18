import React from 'react'
const Loading = ({ boxes, child, parent }: { boxes: number, child?: string, parent?: string }) => {
  return (
    <div className={`!${parent} w-full items-center justify-center flex flex-col   gap-4 `}>
      {Array.from({ length: boxes }).map((_, index) => (
        <div key={index} className={`${child} h-14   backdrop-blur-[10px] relative overflow-hidden`}>
          <div className={` w-full h-full absolute top-0 left-0 bg-gradient-to-r from-[#27273c] via-[#585b70] to-[#27273c] backdrop-saturate-[180%] animate-[pulseShimmer_12s_infinite_linear]`}></div>
        </div>
      ))}
    </div>
  );
};

export default Loading;