import React from "react";
import Price from "../Price";

const ProfitAchieved = ({ profit }) => {
  return (
    <div className="flex justify-center items-center font-onest pt-[20px]">
      <div className="bg-white rounded-2xl pl-[45px] pr-[69px] pt-[45px] pb-[65px] flex gap-5">
        <div className="w-[92px] h-[92px] bg-[#F7F7F7] rounded-full flex justify-center items-center">
          <img
            src="/images/profit-you-achieved.svg"
            alt="Profit You Achieved"
          />
        </div>
        <div className="">
          <span className="text-[71px] text-[#6E7191] font-semibold tracking-tight leading-[71px]">
            You made a {profit > 0 ? "profit" : "loss"}
          </span>
          <Price
            price={profit.toFixed(2)}
            imgStyles={"w-[60px] translate-x-5"}
            textStyles={`font-semibold text-[160px] leading-[160px] ${
              profit < 0 && "text-red-500"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfitAchieved;
