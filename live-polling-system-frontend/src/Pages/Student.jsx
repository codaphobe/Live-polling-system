import React from "react";

export const Student = () => {
  return (
    <div className="bg-white w-screen min-h-screen relative">
      {/* Intervue Poll Badge */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex w-[134px] h-[31px] items-center justify-center gap-[7px] px-[9px] py-0 rounded-3xl bg-[linear-gradient(90deg,rgba(117,101,217,1)_0%,rgba(77,10,205,1)_100%)]">
          <img
            className="relative w-[14.66px] h-[14.65px]"
            alt="Vector"
            src="/vector.svg"
          />
          <span className="relative flex items-center justify-center w-fit font-['Sora'] font-semibold text-white text-sm">
            Intervue Poll
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-4">
        <div className="text-center">
          <h1 className="font-['Sora'] font-bold text-black text-[32px] leading-normal mb-4">
            Student Dashboard
          </h1>
          <p className="font-['Sora'] font-normal text-[#666666] text-lg">
            Waiting for questions from your teacher...
          </p>
        </div>
      </div>
    </div>
  );
};