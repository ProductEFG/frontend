import React, { useEffect, useState } from "react";
import StocksBought from "../components/StocksBought";
import { useAuth } from "../providers/AuthProvider";
import { userStocksService } from "../services/userStocks.service";
import { Stack } from "@mui/material";
import ProfitMade from "../components/ProfitMade";
import Price from "../components/Price";
import UserProfileInfo from "../components/UserProfileInfo";
import BalanceBreakdown from "../components/BalanceBreakdown";

const MyPortfolio = ({ withdrawHandle }) => {
  const { user } = useAuth();

  const [userStocks, setUserStocks] = useState([]);
  const [successRate, setSuccessRate] = useState(0);
  const [numberOfAssets, setNumberOfAssets] = useState(0);
  const [loadingUserStocks, setLoadingUserStocks] = useState(false);

  const fetchUserStocks = async () => {
    setLoadingUserStocks(true);
    try {
      const userStocksData = await userStocksService.getAllUserStocks(user._id);
      setUserStocks(userStocksData);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoadingUserStocks(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetchUserStocks();

    return () => {
      setUserStocks([]);
      controller.abort();
    };
  }, [user]);
  return (
    <section className="min-h-[70vh] p-5">
      <Stack direction={"row"} spacing={2}>
        <div className="w-[424px] h-[550px] bg-purple rounded-2xl">
          <BalanceBreakdown withdrawHandle={withdrawHandle} />
        </div>
        <Stack direction={"column"} spacing={2} className="w-[730px] h-[550px]">
          <div className="w-full h-[309px]">
            <StocksBought
              userStocks={userStocks}
              setNumberOfAssets={setNumberOfAssets}
            />
          </div>
          <div className="w-full h-[224px]">
            <UserProfileInfo
              successRate={successRate}
              numberOfAssets={numberOfAssets}
            />
          </div>
        </Stack>
      </Stack>
      {/* <div className="flex flex-row gap-5">
        <div className="w-[424px] h-[550px] bg-purple rounded-2xl">
          <BalanceBreakdown withdrawHandle={withdrawHandle} />
        </div>
        <div className="w-[730px] h-[550px] flex flex-col gap-5">
          <div className="h-[309px] w-full">
            <div className="bg-white rounded-2xl p-4 w-[375px]">
              <ProfitMade setSuccessRate={setSuccessRate} />
            </div>
            <div className="w-full p-5 pr-0 overflow-hidden">
              <StocksBought
                userStocks={userStocks}
                setNumberOfAssets={setNumberOfAssets}
              />
            </div>
          </div>
          <div className="h-[375px] w-full bg-white rounded-2xl flex items-center">
            <UserProfileInfo
              successRate={successRate}
              numberOfAssets={numberOfAssets}
            />
          </div>
        </div>
      </div> */}
    </section>
  );
};

export default MyPortfolio;
