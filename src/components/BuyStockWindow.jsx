import { Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import Price from "./Price";
import { useAuth } from "../providers/AuthProvider.jsx";
import Button from "../components/Button.jsx";
import { userStocksService } from "../services/userStocks.service.js";
import { userService } from "../services/user.service.js";
import UserEntity from "../entities/userEntity.js";

const BuyStockWindow = ({ company }) => {
  const { user, setUser, backendUrl } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userStocks, setUserStocks] = useState([]);
  const [sharesQuantity, setSharesQuantity] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleBuyStocks = async () => {
    setLoading(true);

    try {
      // Validate quantity
      if (quantity < 1) {
        throw new Error("Quantity must be greater than 0!");
      }
      if (!Number.isInteger(quantity)) {
        throw new Error("Quantity must be a whole number!");
      }

      // Check if user has enough balance
      const totalCost = quantity * company.current_price;
      if (totalCost > user.wallet_balance) {
        throw new Error("Not enough kidzos!");
      }

      const userStocksData = {
        userId: user._id,
        companyId: company._id,
        quantity: quantity,
        buy_price: company.current_price,
      };

      const updatedUser = await userStocksService.buyStocks(userStocksData);

      setUser(new UserEntity(updatedUser));
      sessionStorage.setItem("token", JSON.stringify(updatedUser));
      setSuccess("Stocks have been bought successfully");
      fetchUserStocks();
      setError("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStocks = async () => {
    setLoading(true);
    try {
      const userStocks = await userStocksService.getUserStocksByCompany(
        user._id,
        company._id
      );

      setUserStocks(userStocks);

      let userStocksQuantity = 0;
      userStocks.forEach((stock) => {
        userStocksQuantity += stock.quantity;
      });

      setSharesQuantity(userStocksQuantity);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    company && fetchUserStocks();

    return () => {
      setUserStocks([]);
      controller.abort();
    };
  }, [company]);

  return (
    <Stack spacing={2}>
      <div className="flex flex-row gap-2 items-center justify-start font-medium">
        <img src="images/trade.svg" alt="Trade" width={36} /> Trade
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="flex flex-row gap-2 items-center justify-start text-[24px] font-semibold">
          {" "}
          Buy {company.acronym}{" "}
          <img
            src={`${backendUrl}/images/logos/${company.logo}`}
            width={30}
            height={30}
          />
        </h3>
        <p className="flex flex-row items-center text-xs">
          <img src="/images/stock_arrow.svg" alt="Stock" /> 1 ={" "}
          <Price
            price={company.current_price}
            styles={"absolute -right-2.5 top-0 w-2"}
            textStyles="pl-2"
          />
        </p>
      </div>
      <div className=" flex flex-col gap-3 relative">
        <div className="h-[97px] bg-white-100 rounded-2xl">
          <Stack spacing={1} className="p-3 pl-4">
            <div>
              <h3 className="text-xs">Current Ownership</h3>
              <p className="text-xs text-white-200">{sharesQuantity} Shares</p>
            </div>
            <div className="flex flex-row justify-between items-center">
              {" "}
              <input
                type="number"
                value={quantity}
                min={1}
                onChange={(e) => {
                  if (e.target.value < 0) {
                    setError("");
                    setQuantity(1);
                  } else {
                    setError("");
                    setQuantity(e.target.value);
                  }
                }}
                className="bg-white-100 text-lg w-[40%]"
              />
              <p className="text-white-200 tracking-wider">Shares</p>
            </div>
          </Stack>
        </div>
        <div className="h-[97px] bg-white-100 rounded-2xl">
          <Stack spacing={1} className="p-3 pl-4">
            <div>
              <h3 className="text-xs">Available Balance</h3>
              {user && (
                <Price
                  price={user.wallet_balance.toLocaleString()}
                  styles="absolute -right-3.5 -top-0.5 w-3"
                  textStyles={"text-white-200 text-xs"}
                />
              )}
            </div>
            <div className="flex flex-row justify-between items-center">
              {" "}
              <input
                value={quantity * company.current_price}
                className="bg-white-100 text-lg w-[50%]"
                disabled
              />
              <p className="text-white-200">KIDZOS</p>
            </div>
          </Stack>
        </div>
        <img
          src="/images/trade_between.svg"
          alt="Trade Between"
          width={42}
          height={42}
          className="absolute left-[45%] top-[40%]"
        />
        {error.length > 0 && (
          <p className="text-red-600 text-center">{error}</p>
        )}
        {success.length > 0 && (
          <p className="text-green-500 text-center">{success}</p>
        )}
      </div>
      <div
        className={`text-xs ${
          error.length > 0 || success.length > 0 ? "pt-0" : "pt-8"
        }`}
      >
        <Button
          name="Buy"
          onClick={handleBuyStocks}
          loading={loading}
          otherClasses={`${
            quantity * company.current_price > user.wallet_balance &&
            "opacity-[0.7]"
          } bg-purple text-white w-full`}
          disabled={quantity * company.current_price > user.wallet_balance}
        />
      </div>
    </Stack>
  );
};

export default BuyStockWindow;
