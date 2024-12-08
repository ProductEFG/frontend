import { Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import Price from "./Price";
import Return from "./Return";
import { useAuth } from "../providers/AuthProvider";
import { userProfitService } from "../services/userProfit.service";

const ProfitMade = ({ setSuccessRate }) => {
  const { user } = useAuth();

  const [userProfit, setUserProfit] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [profitReturn, setProfitReturn] = useState(0);

  const fetchUserProfits = async () => {
    try {
      const userProfits = await userProfitService.fetchUserProfit(user._id);

      // Sort the profits in descending order based on the profit amount
      const sortedUserProfits = userProfits.sort((a, b) => b.profit - a.profit);

      setUserProfit(sortedUserProfits);

      // Calculate the total profit and success rate
      let totalProfitCount = 0;
      let positiveProfitCount = 0;
      let totalInvestedAmount = 0;

      sortedUserProfits.forEach((element) => {
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
      const successRate =
        (positiveProfitCount / sortedUserProfits.length) * 100;

      setSuccessRate(successRate);
      setTotalProfit(totalProfitCount);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetchUserProfits();

    return () => {
      setUserProfit([]);
      controller.abort();
    };
  }, [user]);
  return (
    <Stack spacing={1} direction={"column"}>
      <h3 className="text-white-300 font-semibold tracking-wide text-3xl">
        Profit Made
      </h3>
      <div className="text-3xl relative w-[43%]">
        <div className="flex flex-row gap-8">
          <Price price={totalProfit} styles={"absolute w-5 -right-6 -top-1"} />
          <div className="-translate-y-3">
            <Return
              type={`${profitReturn >= 0 ? "positive" : "negative"}`}
              number={profitReturn ? profitReturn.toFixed(1) : 0}
            />
          </div>
        </div>
      </div>

      <div className="pt-4 flex flex-col">
        {userProfit.slice(0, 4).map((profit, index) => {
          // Define static background colors for each entry
          const bgColors = [
            "bg-red-600",
            "bg-[#256CB5]",
            "bg-[#00674E]",
            "bg-[#005198]",
          ];
          const bgColor = bgColors[index % bgColors.length];
          const widthPercentage = (profit.profit / totalProfit) * 100;
          const mappedWidth = 70 + (widthPercentage / 100) * 30;

          return (
            <div
              key={index}
              className={`
              rounded-full bg-[#D5F3F0] inline-flex flex-row h-[50px] items-center mb-3 gap-1 justify-between`}
              style={{
                width: `${
                  mappedWidth > 70 && mappedWidth < 95
                    ? Math.ceil(mappedWidth + 5)
                    : Math.ceil(mappedWidth)
                }%`,
              }}
            >
              <div
                className={`${bgColor} rounded-full h-[50px] pl-5 pt-1 pb-1 inline-flex flex-row items-center gap-2`}
                style={{
                  width: `${Math.ceil(mappedWidth)}%`,
                }}
              >
                <div className="bg-white rounded-full h-[40px] w-[40px] flex items-center justify-center p-1">
                  <img
                    src={`/images/logos/${profit.companyId.acronym}.svg`}
                    alt="Logo"
                  />
                </div>
                <p className="text-2xl text-white font-bold tracking-tight leading-5">
                  {profit.companyId.acronym}
                </p>
              </div>
              <div className="flex items-center gap-4 bg-white rounded-full p-2 h-[80%] m-2 justify-center">
                <Price
                  price={profit.profit.toFixed(0)}
                  styles={"absolute -right-4 -top-1 w-3.5"}
                />
                <span
                  className={`rounded-full py-1 font-bold text-sm ${
                    profit.ROI >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {profit.ROI > 0 ? "+" : "-"}
                  {profit.ROI.toFixed(0)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Stack>
  );
};

export default ProfitMade;
