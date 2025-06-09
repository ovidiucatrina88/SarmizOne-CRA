import React from "react";

export const BarLoader = () => {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-16 h-1 bg-primary/20 rounded-full overflow-hidden relative">
        <div className="w-16 h-1 bg-primary rounded-full absolute left-0 animate-[loader_1s_ease-in-out_infinite]"></div>
      </div>
    </div>
  );
};