import React from 'react'
const Loading = ({ boxes, child, parent }: { boxes: number, child?: string, parent?: string }) => {
  return (
    <div className={`!${parent} w-full items-center justify-center flex flex-col   gap-4 `}>
      {Array.from({ length: boxes }).map((_, index) => (
        <div key={index} className={`${child} h-14 rounded-xl backdrop-blur-[10px] relative overflow-hidden`}>
          <div className={` w-full h-full absolute top-0 left-0 bg-gradient-to-r from-[#585b70]   via-[#cdd6f4b9] to-[#585b70] pulseShimmer`}></div>
        </div>
      ))}
    </div>
  );
};

export default Loading;