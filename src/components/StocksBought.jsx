import { Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import Price from "../components/Price";
import Button from "../components/Button";
import SellStockModal from "./SellStockModal";
import { useAuth } from "../providers/AuthProvider";
import Return from "./Return";
import CustomPieChart from "./CustomPieChart";

const StocksBought = ({ userStocks, setNumberOfAssets, withdrawHandle }) => {
  const { user } = useAuth();
  const [totalValue, setTotalValue] = useState(0);
  const [totalReturn, setTotalReturn] = useState(0);
  const [companySpendDetails, setCompanySpendDetails] = useState([]);
  const [open, setOpen] = useState(false);

  const [chartData, setChartData] = useState(null);

  const handleOpen = async () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Helper function to generate a random color in hex format
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const calcUserStocks = async () => {
    try {
      // Calculate the total amount spent
      let totalStockValue = 0;
      let totalSpent = 0;
      const companySpends = {};

      userStocks.forEach((stock) => {
        const id = stock.companyId._id;
        const companyName = stock.companyId.name;
        const companyLogo = stock.companyId.logo;
        const companyAcronym = stock.companyId.acronym;
        let stockValue = 0;
        if (
          new Date(stock.createdAt).toDateString() === new Date().toDateString()
        ) {
          stockValue = stock.quantity * stock.companyId.temp_price;
        } else {
          stockValue = stock.quantity * stock.companyId.current_price;
        }
        const spent = stock.quantity * stock.buy_price;
        totalStockValue += stockValue;
        totalSpent += spent;

        // Accumulate spending per company
        if (companySpends[companyName]) {
          companySpends[companyName].value += stockValue;
          companySpends[companyName].quantity += stock.quantity;
        } else {
          companySpends[companyName] = {
            id: id,
            logo: companyLogo,
            acronym: companyAcronym,
            visitors: stock.companyId.current_visitors,
            price: stock.companyId.current_price,
            temp_price: stock.companyId.temp_price,
            return: stock.companyId.current_return,
            value: stockValue,
            quantity: stock.quantity,
          };
        }
      });

      setTotalValue(totalStockValue);
      const returnValue =
        ((totalStockValue - totalSpent) / totalStockValue) * 100;
      setTotalReturn(returnValue);

      // Calculate the percentage spent per company
      const companyDetails = Object.entries(companySpends)
        .map(([companyName, data]) => ({
          id: data.id,
          company: companyName,
          logo: data.logo,
          acronym: data.acronym,
          visitors: data.visitors,
          price: data.price,
          temp_price: data.temp_price,
          return: data.return,
          totalSpent: data.value,
          quantity: data.quantity,
          percentage: ((data.value / totalStockValue) * 100).toFixed(0),
          color: getRandomColor(),
        }))
        .sort((a, b) => b.percentage - a.percentage);

      const chartData = companyDetails.map((entry) => ({
        name: entry.company,
        percentage: parseInt(entry.percentage),
        fill: entry.color,
      }));

      setChartData(chartData);
      setNumberOfAssets(companyDetails.length);
      setCompanySpendDetails(companyDetails);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    userStocks && calcUserStocks();

    return () => {
      setCompanySpendDetails([]);
      controller.abort();
    };
  }, [userStocks, user]);

  return (
    <div className="p-4">
      <div className="flex flex-row justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-2xl text-[#6E7191] font-semibold">
            Current Stock Value
          </h1>
          <div className={`relative w-[60%]`}>
            <div className="flex flex-row gap-1 items-start">
              <Price
                price={totalValue.toLocaleString()}
                imgStyles={"w-4"}
                textStyles="text-2xl"
              />
              <div className="">
                <Return
                  type={`${totalReturn >= 0 ? "positive" : "negative"}`}
                  number={totalReturn ? totalReturn.toFixed(1) : 0}
                  textStyles="text-sm"
                  imgStyles={"w-4"}
                />
              </div>
            </div>
          </div>
        </div>
        <Button
          name={
            <div className="flex flex-row gap-2 justify-center items-center">
              Sell Stock{" "}
              <img src="/images/back_arrow.svg" alt="Next Arrow" width={19} />
            </div>
          }
          onClick={handleOpen}
          otherClasses="bg-[#31CFCB] text-white w-[260px] font-light text-[16px]"
        />
      </div>
      {companySpendDetails.length > 0 ? (
        <div className="flex flex-row w-full justify-between">
          <div className="flex justify-center items-center w-fit">
            {chartData && <CustomPieChart data={chartData} />}
          </div>
          <div className="flex flex-col gap-0 items-center w-full mt-2 ml-10">
            <h3 className="text-center font-semibold mb-4">Share Breakdown</h3>
            <div className="flex flex-row justify-between gap-4">
              <div className="flex flex-col overflow-y-auto text-sm overflow-x-hidden gap-6">
                {companySpendDetails.slice(0, 3).map((company) => (
                  <div
                    key={"text" + company.company}
                    className="flex flex-row gap-2 items-center"
                  >
                    <div
                      className={`w-2 h-2 rounded-full`}
                      style={{ backgroundColor: `${company.color}` }}
                    />
                    <p
                      className="text-[#A0A3BD] w-[30%] overflow-hidden"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        maxWidth: "50px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <span
                        style={{ textOverflow: "ellipsis", overflow: "hidden" }}
                      >
                        {company.company}
                      </span>
                    </p>
                    <div className="w-[30px] h-[30px] rounded-full bg-[#F8F9FA] flex justify-center items-center">
                      <img
                        src={company.logo}
                        className="w-full h-auto max-h-full object-contain"
                      />
                    </div>
                    <Price
                      price={company.totalSpent.toLocaleString()}
                      textStyles={"w-[25%]"}
                    />
                    <p className="font-medium text-sm">
                      ({company.percentage.toLocaleString()}%)
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col overflow-y-auto text-sm overflow-x-hidden gap-6">
                {companySpendDetails.slice(3, 6).map((company) => (
                  <div
                    key={"text" + company.company}
                    className="flex flex-row gap-3 items-center"
                  >
                    <div
                      className={`w-2 h-2 rounded-full`}
                      style={{ backgroundColor: `${company.color}` }}
                    />
                    <p
                      className="text-[#A0A3BD] w-[30%] overflow-hidden"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        maxWidth: "50px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <span
                        style={{ textOverflow: "ellipsis", overflow: "hidden" }}
                      >
                        {company.company}
                      </span>
                    </p>
                    <div className="w-[30px] h-[30px] rounded-full bg-[#F8F9FA] flex justify-center items-center">
                      <img
                        src={company.logo}
                        className="w-full h-auto max-h-full object-contain"
                      />
                    </div>
                    <Price
                      price={company.totalSpent.toLocaleString()}
                      textStyles={"w-[25%]"}
                    />
                    <p className="font-medium text-sm">
                      ({company.percentage.toLocaleString()}%)
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-[60%] flex justify-center items-center font-semibold text-xl">
          No Stocks to View
        </div>
      )}
      {open && (
        <SellStockModal
          open={open}
          handleClose={handleClose}
          userStocksDetails={companySpendDetails}
          withdrawHandle={withdrawHandle}
        />
      )}
    </div>
  );
};

export default StocksBought;
