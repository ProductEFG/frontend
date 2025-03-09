import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import MyPortfolio from "../sections/MyPortfolio";
import LeaderboardsTable from "../sections/LeaderboardsTable";
import WithdrawSection from "../sections/WithdrawSection";
import { tabs } from "../data/constants";
import MarketInsights from "../sections/MarketInsights";
import { useGlobal } from "@/providers/GlobalProvider";
import NavHexagon from "@/components/NavHexagon";
import Invest from "@/sections/Invest";
import BuyReturnsMade from "@/sections/BuyReturnsMade";
import SellReturnsMade from "@/sections/SellReturnsMade";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enabledTabs } = useGlobal();

  const getIcon = useCallback(
    (name, index) => {
      let finalName = name;
      if (index === enabledTabs) {
        finalName += "_selected";
      } else if (index < enabledTabs) {
        finalName += "_unlocked";
      }
      return finalName;
    },
    [enabledTabs]
  );

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user]);

  if (!user) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Loading otherClasses={"w-10 h-10"} />
      </div>
    );
  }

  return (
    <main className="w-screen h-screen overflow-hidden">
      <Navbar />
      <div className="mt-[16.5px] container bg-white rounded-xl flex justify-between items-center mx-auto w-full pt-[18px] pb-[9px] px-[56px] relative z-0">
        {tabs.map((label, index) => (
          <div
            className={`flex flex-col justify-center items-center relative h-full w-[108px]`}
            key={index}
          >
            <NavHexagon
              color={index < enabledTabs ? "#6143F0" : "#E9EBEB"}
              borderSize={index <= enabledTabs ? 5 : 0}
            >
              <img
                src={`/images/tab/${getIcon(label.icon, index)}.svg`}
                alt={`${label.name} icon`}
              />
            </NavHexagon>
            {index < tabs.length - 1 && (
              <div
                className={`lg:w-[120px] md:w-[70px] w-[90px] h-[5px] ${
                  index < enabledTabs || index === 0
                    ? "bg-purple"
                    : "bg-[#E9EBEB]"
                } absolute top-[35%] left-[80%] z-0`}
              />
            )}
            <span
              className={`text-sm font-medium text-nowrap ${
                index <= enabledTabs ? "text-purple" : "text-[#6E7191]"
              } mt-[5px]`}
            >
              {label.name}
            </span>
          </div>
        ))}
      </div>
      <div className="container mt-4">
        {enabledTabs === 0 && <MarketInsights />}
        {enabledTabs === 1 && <Invest />}
        {enabledTabs === 2 && <BuyReturnsMade />}
        {enabledTabs === 3 && <MyPortfolio />}
        {enabledTabs === 4 && <SellReturnsMade />}
        {enabledTabs === 5 && <WithdrawSection />}
        {enabledTabs === 6 && <LeaderboardsTable />}
      </div>
      {/* <Box
        sx={{
          width: "100%",
          padding: 4,
          paddingTop: 3,
        }}
      >
        <TabContext value={enabledTabs}>
          <Box
            sx={{
              maxWidth: "1150px",
              width: "100%",
              mx: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              paddingTop: "18px",
              paddingBottom: "9px",
              paddingRight: "56px",
              paddingLeft: "56px",
              borderRadius: "16px",
            }}
          >
            <TabList
              onChange={handleChange}
              aria-label="Home page views"
              TabIndicatorProps={{ style: { display: "none" } }}
              sx={{
                width: "100%",
                "& .MuiTabs-flexContainer": {
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                },
              }}
            >
              {tabs.map((label, index) => (
                <div
                  className={`flex flex-col justify-center items-center relative h-100`}
                  key={index}
                >
                  {index <= enabledTabs && (
                    <div className="w-[63px] h-[63px] bg-purple absolute hexagon top-[6.5px] scale-110 z-1" />
                  )}
                  {index < tabs.length - 1 && (
                    <div
                      className={`w-[100px] h-[5px] ${
                        index < enabledTabs ? "bg-purple" : "bg-[#E9EBEB]"
                      } absolute top-[35%] left-[80%] z-0`}
                    />
                  )}
                  <div
                    className={`w-[63px] h-[63px] hexagon ${
                      index < enabledTabs ? "bg-purple" : "bg-[#E9EBEB]"
                    } z-2`}
                  >
                    <img
                      src={`/images/tab/${getIcon(label.icon, index)}.svg`}
                      alt="Tab Icon"
                    />
                  </div>
                  <Tab
                    label={label.name}
                    value={index}
                    sx={{
                      fontSize: "14px",
                      color: "#4d4f66",
                      fontWeight: "semibold",
                      textTransform: "none",
                      transition: "all 0.3s ease",
                      padding: 0,
                      "&.Mui-selected": {
                        backgroundColor: "#6143F0",
                        color: "white",
                      },
                      "&.MuiButtonBase-root": {
                        paddingTop: "5px",
                        minHeight: "fit-content",
                      },
                      "&.Mui-disabled": {
                        color: "#4d4f66",
                      },
                    }}
                    disabled={true}
                  />
                </div>
              ))}
            </TabList>
          </Box>

          {tabs.map((tab, index) => (
            <TabPanel key={index} value={index} sx={{ padding: 0 }}>
              {index === 0 && <MarketInsights />}
            </TabPanel>
          ))}
          <TabPanel value={0} sx={{ padding: 0 }}>
            <MarketInsights handleChange={handleChange} />
          </TabPanel>
          <TabPanel value={1} sx={{ padding: 0 }}>
            <MarketOverview
              setCompanyBought={setCompanyBought}
              ReturnsMadeHandle={handleChange}
            />
          </TabPanel>
          <TabPanel value="Returns Made" sx={{ padding: 0, paddingTop: 2 }}>
            <ReturnsMade
              companyBought={companyBought}
              portfolioHandle={handleChange}
            />
          </TabPanel>
          <TabPanel
            value="Invest"
            sx={{ padding: 0, paddingTop: 2, height: "75vh" }}
          >
            <MyPortfolio withdrawHandle={handleChange} />
          </TabPanel>
          <TabPanel value="Withdraw" sx={{ padding: 0, paddingTop: 4 }}>
            <WithdrawSection navigationHandle={handleChange} />
          </TabPanel>
          <TabPanel value="Leaderboard" sx={{ padding: 0, paddingTop: 2 }}>
            <LeaderboardsTable />
          </TabPanel>
        </TabContext>
      </Box> */}
    </main>
  );
};

export default Home;
