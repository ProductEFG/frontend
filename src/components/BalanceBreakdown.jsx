import { Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import Button from "./Button";
import { useAuth } from "../providers/AuthProvider";
import { userProfitService } from "../services/userProfit.service";
import Price from "./Price";

const BalanceBreakdown = ({ withdrawHandle }) => {
  const { user } = useAuth();
  const [prevReturn, setPrevReturn] = useState(0);
  const added_amount = user.getTotalBalance() - user.previous_balance;

  const [totalProfit, setTotalProfit] = useState(0);
  const [profitReturn, setProfitReturn] = useState(0);

  const fetchUserProfits = async () => {
    try {
      const userProfits = await userProfitService.fetchUserProfit(user._id);

      // Calculate the total profit and success rate
      let totalProfitCount = 0;
      let positiveProfitCount = 0;
      let totalInvestedAmount = 0;

      userProfits.forEach((element) => {
        totalProfitCount += element.profit;
        totalInvestedAmount += element.investedAmount;

        // Count if profit is positive
        if (element.profit > 0) {
          positiveProfitCount++;
        }
      });

      const totalProfitReturn = (totalProfitCount / totalInvestedAmount) * 100;
      setProfitReturn(totalProfitReturn);

      // Calculate success rate as a percentage
      const successRate = (positiveProfitCount / userProfits.length) * 100;

      setTotalProfit(totalProfitCount);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    user && fetchUserProfits();
    const returnValue = (user.previous_balance / user.getTotalBalance()) * 100;
    setPrevReturn(100 - returnValue);

    return () => {
      controller.abort();
    };
  }, [user]);

  return (
    <div className="relative p-4 big:p-5">
      <Stack direction={"column"}>
        <h1 className="text-[37px] text-white big:text-5xl">Total Balance</h1>
        <div className="flex flex-row items-center gap-1">
          <p className="text-white text-[35px] big:text-[44px]">
            {user.getTotalBalance().toFixed(2)}
          </p>

          <div className="flex flex-col items-start">
            <img
              src="/images/KidZosicon2.svg"
              alt="KidZos Icon"
              className="w-4 -translate-y-1 big:w-6"
            />
            <div className="big:text-sm text-xs flex flex-row items-center justify-center text-[#00ECA5]">
              {prevReturn >= 0 ? (
                <img
                  src="/images/return_balance.svg"
                  alt="return balance"
                  className="mr-1 w-4 big:w-6" 
                />
              ) : (
                <img
                  src="/images/return_balance.svg"
                  alt="return balance"
                  className="mr-1 w-4 rotate-90 big:w-6"
                />
              )}
              {prevReturn >= 0 ? "+" : ""}
              {prevReturn.toFixed(1)}%
            </div>
          </div>
        </div>
      </Stack>
      {added_amount >= 0 ? (
        <p className="text-[#31CFCB] pt-1 text-sm big:text-[16px]">
          You have added{" "}
          <Price
            price={added_amount.toFixed(2)}
            styles={"absolute -right-2 top-0 w-3"}
            textStyles={"text-sm big:text-[16px]"}
            type="2"
            font="normal"
          />{" "}
          &nbsp;&nbsp;&nbsp;to your portfolio{" "}
        </p>
      ) : (
        <p className="text-[#31CFCB] pt-1 text-sm big:text-[16px]">
          You have lost{" "}
          <Price
            price={Math.abs(added_amount).toFixed(2)}
            styles={"absolute -right-2 top-0 w-3 big:w-3.5 big:-top-1 big:-right-3"}
            textStyles={"text-sm big:text-[16px]"}
            type="2"
            font="normal"
          />{" "}
          &nbsp;&nbsp;&nbsp;from your portfolio{" "}
        </p>
      )}
      <Stack direction={"column"} spacing={2} className="pt-5 big:flex big:space-y-6">
        <div className="space-y-1 big:space-y-3">
          <h6 className="text-[#31CFCB] big:text-xl">Available Cash Balance</h6>
          <div className="flex items-start gap-1 w-full relative">
            <p className="text-white text-2xl big:text-3xl">
              {user.wallet_balance.toLocaleString()}
            </p>
            <img
              src="/images/KidZosicon2.svg"
              alt="KidZos Icon"
              className="w-3 big:w-5"
            />
          </div>
        </div>
        <div className="space-y-1 big:space-y-3">
          <h6 className="text-[#31CFCB] big:text-xl">Invested Amount</h6>
          <div className="flex items-start gap-1 w-full relative">
            <p className="text-white text-2xl big:text-3xl">
              {user.total_invested_amount.toLocaleString()}
            </p>
            <img
              src="/images/KidZosicon2.svg"
              alt="KidZos Icon"
              className="w-3 big:w-5" // Adjust width as needed
            />
          </div>
        </div>
        <div className="space-y-1 big:space-y-3">
          <h6 className="text-[#31CFCB] big:text-xl">Profit Made</h6>
          <div className="flex items-start gap-1 w-full relative">
            <p className="text-white text-2xl big:text-3xl">
              {totalProfit.toLocaleString()}
            </p>
            <img
              src="/images/KidZosicon2.svg"
              alt="KidZos Icon"
              className="w-3 big:w-5" // Adjust width as needed
            />
          </div>
        </div>
        <div className="space-y-1 big:space-y-3">
          <h6 className="text-[#31CFCB] big:text-xl">Value of Stocks Bought</h6>
          <div className="flex items-start gap-1 w-full relative">
            <p className="text-white text-2xl big:text-3xl">
              {user.stock_balance.toLocaleString()}
            </p>
            <img
              src="/images/KidZosicon2.svg"
              alt="KidZos Icon"
              className="w-3 big:w-5" // Adjust width as needed
            />
          </div>
        </div>
        <img
          src="/images/bag_of_money.svg"
          alt="Bag of Money"
          className="absolute -right-[8%] top-[26%] big:-right-[9%] w-[220px] big:w-[300px]"
        />
      </Stack>
      <Button
        name="Withdraw"
        onClick={withdrawHandle}
        otherClasses="bg-[#31CFCB] text-white w-[148px] my-5 big:w-[240px] big:text-lg flex items-center justify-center big:mt-16"
      />
    </div>
  );
};

export default BalanceBreakdown;
