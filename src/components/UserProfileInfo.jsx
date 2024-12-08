import React from "react";
import { useAuth } from "../providers/AuthProvider";
import Price from "./Price";
import { Button, IconButton, Stack, Tooltip } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const UserProfileInfo = ({ successRate, numberOfAssets }) => {
  const { user, backendUrl } = useAuth();
  return (
    <Stack direction={"row"}>
      {/* 1st Section */}
      <div className="flex flex-col items-center w-[300px] p-1 border-r-[1px] border-[#120804] h-[300px] gap-6">
        <div className="bg-white-100 rounded-full w-[205px] h-[205px] flex justify-center items-center">
          <img
            src={`/images/avatars/${user.avatar}.svg`}
            alt="Avatar"
            className="bg-[#D88EA9] rounded-full w-[150px] h-[150px]"
          />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-black text-3xl pb-1">
            {user.getFullName()}
          </h3>
          <p className="text-2xl text-white-300">
            Joined {user.getCreatedDate()}
          </p>
        </div>
      </div>
      {/* 2nd Section
      <div className="flex flex-col items-center justify-between w-[250px] p-1 border-r-[1px] border-[#120804] h-[300px] gap-6">
        <div className="flex flex-row">
          <img src="/images/total_balance.svg" alt="Total Balance" />
          <div className="text-center">
            <p className=" text-white-300">Total Balance</p>
            <Price
              price={(
                user.wallet_balance + user.stock_balance
              ).toLocaleString()}
              styles={"absolute -top-1 -right-5 w-5"}
              textStyles={"text-[24px]"}
            />
          </div>
        </div>
        <div className="flex flex-row">
          <img src="/images/profit_made.svg" alt="Profit Made" />
          <div className="text-center">
            <p className=" text-white-300">Profit Made</p>
            <Price
              price={user.total_profit.toLocaleString()}
              styles={"absolute -top-1 -right-5 w-5"}
              textStyles={"text-[24px]"}
            />
          </div>
        </div>
        <div className="flex flex-row">
          <img src="/images/stocks_owned.svg" alt="Stocks Owned" />
          <div className="text-center">
            <p className=" text-white-300">Value of Stocks Owned</p>
            <Price
              price={user.stock_balance.toLocaleString()}
              styles={"absolute -top-1 -right-5 w-5"}
              textStyles={"text-[24px]"}
            />
          </div>
        </div>
      </div>
      3rd Section
      <div className="flex flex-col items-center justify-center w-[400px] h-[300px] px-5 py-2">
        <div className="w-full bg-[#F7F7F7] h-full rounded-2xl pt-5 pl-2 text-lg">
          <Stack spacing={2}>
            <div className="flex flex-row justify-between items-center">
              <p className="font-semibold">Total Number of Assets:</p>
              <p className="text-white-300 flex items-center">
                {numberOfAssets}
                <Tooltip disableFocusListener disableTouchListener title="Add">
                  <IconButton>
                    <HelpOutlineIcon className="text-black" />
                  </IconButton>
                </Tooltip>
              </p>
            </div>
            <div className="flex flex-row justify-between items-center">
              <p className="font-semibold">Total Invested Amount:</p>
              <div className="flex items-center">
                <Price
                  price={user.total_invested_amount.toLocaleString()}
                  styles={"absolute -right-2 top-0 w-4"}
                  textStyles={"text-white-300 pr-2 text-lg"}
                />
                <Tooltip disableFocusListener disableTouchListener title="Add">
                  <IconButton className="p-0 m-0">
                    <HelpOutlineIcon className="text-black" />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
            <div className="flex flex-row justify-between items-center">
              <p className="font-semibold">Number of Trades:</p>
              <p className="text-white-300 flex items-center">
                {user.number_of_trades}{" "}
                <Tooltip disableFocusListener disableTouchListener title="Add">
                  <IconButton className="p-0 m-0">
                    <HelpOutlineIcon className="text-black" />
                  </IconButton>
                </Tooltip>
              </p>
            </div>
            <div>
              <p className="font-semibold mb-2 flex items-center">
                Success Rate{" "}
              </p>
              <div className="flex flex-row items-center justify-between pr-2">
                <div className="w-[85%] h-3 bg-[#E7ECE9] rounded-full">
                  <div
                    className="h-3 bg-[#239A3C] rounded-full"
                    style={{ width: `${successRate.toFixed(0)}%` }}
                  />
                </div>
                <p className={`${successRate > 0 && "text-[#239A3C]"}`}>
                  {successRate ? successRate.toFixed(0) : 0}%
                </p>
              </div>
            </div>
          </Stack>
        </div>
      </div> */}
      <div className="flex flex-col justify-center items-center w-[650px] p-5">
        <div className="w-full -translate-y-8">
          <h2 className="text-2xl font-semibold">Your Achieved Badges</h2>
        </div>
        <div className="flex flex-col justify-start items-center">
          <img src="/images/coming-soon-portfolio.svg" />
          <p className="text-sm text-white-200">
            You have not engaged in enough trading activity to achieve a badge.
          </p>
        </div>
      </div>
    </Stack>
  );
};

export default UserProfileInfo;
