import { Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import Price from "../components/Price";
import Button from "../components/Button";
import SellStockModal from "./SellStockModal";
import { useAuth } from "../providers/AuthProvider";
import Return from "./Return";

const Images = ({ image1, image2, image3, image4 }) => {
  const { backendUrl } = useAuth();
  return (
    <div className="flex justify-center items-center relative w-[150px]">
      {/* main Image (Highest Percentage) */}
      <div
        className="bg-white w-[87px] h-[87px] rounded-full flex justify-center items-center overflow-hidden p-2 z-3"
        style={{
          boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <img
          src={`${backendUrl}/images/logos/${image1}`}
          className="w-full h-full object-fit"
        />
      </div>

      {/* 2nd Image (2nd Highest Percentage) */}
      {image2 && (
        <div
          className="bg-white w-[74px] h-[74px] rounded-full flex justify-center items-center overflow-hidden p-2 absolute -right-7 z-2"
          style={{
            boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <img
            src={`${backendUrl}/images/logos/${image2}`}
            className="w-full h-full object-fit"
          />
        </div>
      )}
      {/* 3rd Image (3rd Highest Percentage) */}
      {image3 && (
        <div
          className="bg-white w-[57px] h-[57px] rounded-full flex justify-center items-center overflow-hidden p-2 absolute -bottom-9 right-3 z-1"
          style={{
            boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <img
            src={`${backendUrl}/images/logos/${image3}`}
            className="w-full h-full object-fit"
          />
        </div>
      )}
      {/* 4th Image (4th Highest Percentage) */}
      {image4 && (
        <div
          className="bg-white w-[57px] h-[57px] rounded-full flex justify-center items-center overflow-hidden p-2 absolute -top-5 left-1 z-1"
          style={{
            boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <img
            src={`${backendUrl}/images/logos/${image4}`}
            className="w-full h-full object-fit"
          />
        </div>
      )}
    </div>
  );
};

const StocksBought = ({ userStocks, setNumberOfAssets }) => {
  const { user } = useAuth();
  const [totalValue, setTotalValue] = useState(0);
  const [totalReturn, setTotalReturn] = useState(0);
  const [companySpendDetails, setCompanySpendDetails] = useState([]);
  const [open, setOpen] = useState(false);

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
        const stockValue = stock.quantity * stock.companyId.current_price;
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
            returns: stock.companyId.current_return,
            visitors: stock.companyId.current_visitors,
            price: stock.companyId.current_price,
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
          returns: data.returns,
          visitors: data.visitors,
          price: data.price,
          return: data.return,
          totalSpent: data.value,
          quantity: data.quantity,
          percentage: ((data.value / totalStockValue) * 100).toFixed(2),
          color: getRandomColor(),
        }))
        .sort((a, b) => b.percentage - a.percentage);

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
    <Stack spacing={7} className="bg-white rounded-xl p-4 w-full h-full">
      <div className="flex flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl text-[#6E7191] font-semibold">
            Current Stock Value
          </h1>
          <div className={`relative w-[60%]`}>
            <div className="flex flex-row gap-4 items-start">
              <Price
                price={totalValue.toLocaleString()}
                styles="absolute -right-4 -top-0.5 w-4"
                textStyles="text-2xl"
              />
              <div className="">
                <Return
                  type={`${totalReturn >= 0 ? "positive" : "negative"}`}
                  number={totalReturn ? totalReturn.toFixed(1) : 0}
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
          <Images
            image1={companySpendDetails[0]?.logo}
            image2={companySpendDetails[1]?.logo}
            image3={companySpendDetails[2]?.logo}
            image4={companySpendDetails[3]?.logo}
          />
          <div className="flex flex-col gap-3 justify-center items-center w-[75%] h-[200px]">
            {/* <h3 className="text-center pt-10 font-semibold">Share Breakdown</h3>
            <div className="w-[265px] h-4 flex overflow-hidden rounded-full">
              {companySpendDetails.map((company) => (
                <div
                  key={"color" + company.company}
                  style={{
                    width: `${company.percentage}%`,
                    backgroundColor: `${company.color}`,
                  }}
                  className="h-full rounded-full mr-0.5 ml-0.5"
                  title={`${company.company}: ${company.percentage}%`}
                />
              ))}
            </div> */}
            {/* <div className="flex flex-col overflow-y-auto justify-center items-center overflow-x-hidden">
              {companySpendDetails.slice(0, 2).map((company) => (
                <div
                  key={"text" + company.company}
                  className="flex flex-row p-2 gap-2 pt-4 items-center"
                >
                  <div
                    className={`w-3 h-3 rounded-full`}
                    style={{ backgroundColor: `${company.color}` }}
                  />
                  <p
                    className="text-[#A0A3BD] w-[45%] overflow-hidden"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      maxWidth: "150px",
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
                  <Price
                    price={company.totalSpent.toLocaleString()}
                    styles={"absolute -right-5 -top-0.5 w-4"}
                  />
                  <p className="w-[20%] pl-4 font-semibold">
                    ({company.percentage.toLocaleString()}%)
                  </p>
                </div>
              ))}
            </div> */}
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
        />
      )}
    </Stack>
  );
};

export default StocksBought;
