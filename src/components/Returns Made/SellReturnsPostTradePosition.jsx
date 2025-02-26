import { useGlobal } from "@/providers/GlobalProvider";
import React from "react";
import Price from "../Price";

const SellReturnsPostTradePosition = () => {
  const { postSellPosition, companySold } = useGlobal();

  const valueOfShares =
    postSellPosition?.valueOfShares -
    companySold?.sold_quantity * companySold?.temp_price;
  return (
    <div className="w-full h-full flex justify-between items-center py-[50px]">
      <div className="bg-white rounded-3xl p-7 flex flex-col gap-3 w-[32%]">
        <div className="w-[57px] h-[57px] bg-[#F7F7F7] rounded-full flex justify-center items-center">
          <img src="/images/shares-you-own.svg" alt="Shares You Own" />
        </div>
        <span className="text-[#6B6B6B] text-[22px] font-semibold">
          You Sold
        </span>
        <div className="font-medium text-[48px] leading-[61px]">
          {companySold?.sold_quantity}{" "}
          <span className="text-sm text-[#6E7191] font-normal">Shares</span>
        </div>
      </div>
      <div className="bg-white rounded-3xl p-7 flex flex-col gap-3 w-[32%]">
        <div className="w-[57px] h-[57px] bg-[#F7F7F7] rounded-full flex justify-center items-center">
          <img src="/images/shares-you-own.svg" alt="Shares You Own" />
        </div>
        <span className="text-[#6B6B6B] text-[22px] font-semibold">
          You Still have
        </span>
        <div className="font-medium text-[48px] leading-[61px]">
          {companySold?.quantity - companySold?.sold_quantity}{" "}
          <span className="text-sm text-[#6E7191] font-normal">Shares</span>
        </div>
      </div>
      <div className="bg-white rounded-3xl p-7 flex flex-col w-[32%] ">
        <div className="w-[57px] h-[57px] bg-[#F7F7F7] rounded-full flex justify-center items-center mb-3">
          <img
            src="/images/total-value-of-shares.svg"
            alt="Total Value Of Shares"
          />
        </div>
        <span className="text-[#6B6B6B] text-[19px] font-semibold tracking-tighter leading-tight">
          Total Value of Remaining Shares
        </span>
        <div className="font-medium text-[48px] leading-[61px]">
          <Price
            price={valueOfShares.toFixed(2)}
            imgStyles={"w-[25px]"}
            textStyles={"font-medium text-[48px] leading-[61px]"}
          />
        </div>
      </div>
    </div>
  );
};

export default SellReturnsPostTradePosition;
