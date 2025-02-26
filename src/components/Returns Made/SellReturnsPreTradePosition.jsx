import { useGlobal } from "@/providers/GlobalProvider";
import React from "react";
import Price from "../Price";

const SellReturnsPreTradePosition = () => {
  const { postSellPosition } = useGlobal();
  return (
    <div className="w-full h-full flex justify-between items-center py-[50px]">
      <div className="bg-white rounded-3xl p-7 flex flex-col gap-3 w-[32%]">
        <div className="w-[57px] h-[57px] bg-[#F7F7F7] rounded-full flex justify-center items-center">
          <img src="/images/shares-you-own.svg" alt="Shares You Own" />
        </div>
        <span className="text-[#6B6B6B] text-[22px] font-semibold">
          Shares you own
        </span>
        <div className="font-medium text-[48px] leading-[61px]">
          {postSellPosition?.sharesQuantity}{" "}
          <span className="text-sm text-[#6E7191] font-normal">Shares</span>
        </div>
      </div>
      <div className="bg-white rounded-3xl p-7 flex flex-col gap-3 w-[32%]">
        <div className="w-[57px] h-[57px] bg-[#F7F7F7] rounded-full flex justify-center items-center">
          <img src="/images/share-price.svg" alt="Shares You Own" />
        </div>
        <span className="text-[#6B6B6B] text-[22px] font-semibold">
          Share Price
        </span>
        <Price
          price={postSellPosition?.sharePrice.toFixed(2)}
          imgStyles={"w-[25px]"}
          textStyles={"font-medium text-[48px] leading-[61px]"}
        />
      </div>
      <div className="bg-white rounded-3xl p-7 flex flex-col gap-3 w-[32%]">
        <div className="w-[57px] h-[57px] bg-[#F7F7F7] rounded-full flex justify-center items-center">
          <img
            src="/images/total-value-of-shares.svg"
            alt="Total Value Of Shares"
          />
        </div>
        <span className="text-[#6B6B6B] text-[22px] font-semibold text-nowrap tracking-tighter">
          Total Value of Shares
        </span>
        <div className="font-medium text-[48px] leading-[61px]">
          <Price
            price={postSellPosition?.valueOfShares.toFixed(2)}
            imgStyles={"w-[25px]"}
            textStyles={"font-medium text-[48px] leading-[61px]"}
          />
        </div>
      </div>
    </div>
  );
};

export default SellReturnsPreTradePosition;
