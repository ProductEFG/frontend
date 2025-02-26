import React, { useEffect, useState } from "react";
import Price from "../Price";
import { useGlobal } from "@/providers/GlobalProvider";

const SellReturnsTradePerformance = () => {
  const [company, setCompany] = useState({
    sell_buy: 0,
    price_change: 0,
    worth: 0,
  });
  const [isNegativeTransaction, setIsNegativeTransaction] = useState(false);
  const { companySold } = useGlobal();

  useEffect(() => {
    setIsNegativeTransaction(
      !(companySold.buy_price - companySold.sell_price > 0)
    );
    const newCompany = {
      sell_buy: companySold.sell_price,
      price_change: companySold.buy_price - companySold.sell_price,
      worth: companySold.buy_price,
    };
    setCompany(newCompany);
  }, []);

  return (
    <div className="flex flex-col gap-4 py-[20px]">
      <div className="relative w-full flex justify-center items-center">
        <div className="w-[100px] h-[100px] bg-white p-3 flex justify-center items-center rounded-full">
          <img
            src={`/images/trade-performance-sell.svg`}
            alt="Buy Returns"
            className=""
          />
        </div>
        <div className="flex items-center gap-1 absolute -top-3 left-[14%]">
          <div className="rounded-[20px] bg-white p-[25px] pb-[12px] w-[222px] h-[120px]">
            <span className="text-[#6E7191] font-semibold text-[20px]">
              You Sold at
            </span>
            <Price
              price={company.sell_buy.toFixed(2)}
              imgStyles={"w-[20px]"}
              textStyles={"font-medium text-[45px] leading-[55px]"}
            />
          </div>
          <div className="rounded-full w-[24px] h-[24px] bg-gray-300 flex justify-center items-center">
            <div className="rounded-full w-[14px] h-[14px] bg-purple" />
          </div>
        </div>
      </div>
      <div className="relative w-full flex justify-center items-center">
        <div className="w-[100px] h-[100px] bg-white p-3 flex justify-center items-center rounded-full">
          <img src="/images/price-change.svg" alt="Buy Returns" className="" />
        </div>
        <div className="flex items-center gap-1 absolute -top-3 right-[14%]">
          <div className="rounded-full w-[24px] h-[24px] bg-gray-300 flex justify-center items-center">
            <div
              className={`rounded-full w-[14px] h-[14px] ${
                isNegativeTransaction ? "bg-red-500" : "bg-[#34C759]"
              }`}
            />
          </div>
          <div className="rounded-[20px] bg-white p-[25px] pb-[12px] w-[222px] h-[120px]">
            <span className="text-[#6E7191] font-semibold text-[20px]">
              Price Change
            </span>
            <div
              className={`font-medium text-[45px] leading-[55px] flex ${
                isNegativeTransaction ? "text-red-500" : "text-[#34C759]"
              }`}
            >
              {isNegativeTransaction ? "" : "+"}
              <Price
                price={company.price_change.toFixed(2)}
                imgStyles={"w-[20px] ml-1"}
                textStyles={"font-medium text-[45px] leading-[55px]"}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full flex justify-center items-center">
        <div className="w-[100px] h-[100px] bg-white p-3 flex justify-center items-center rounded-full">
          <img src="/images/money.svg" alt="Buy Returns" className="" />
        </div>
        <div className="flex items-center gap-1 absolute -top-3 left-[14%]">
          <div className="rounded-[20px] bg-white p-[25px] pb-[12px] w-[222px] h-[120px]">
            <span className="text-[#6E7191] font-semibold text-[20px]">
              Now it’s worth
            </span>
            <Price
              price={company.worth.toFixed(2)}
              imgStyles={"w-[20px]"}
              textStyles={"font-medium text-[45px] leading-[55px]"}
            />
          </div>
          <div className="rounded-full w-[24px] h-[24px] bg-gray-300 flex justify-center items-center">
            <div className="rounded-full w-[14px] h-[14px] bg-purple" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellReturnsTradePerformance;
