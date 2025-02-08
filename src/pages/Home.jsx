import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import Navbar from "../components/Navbar";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import MarketOverview from "../sections/MarketOverview";
import Loading from "../components/Loading";
import MyPortfolio from "../sections/MyPortfolio";
import LeaderboardsTable from "../sections/LeaderboardsTable";
import WithdrawSection from "../sections/WithdrawSection";
import ReturnsMade from "../sections/ReturnsMade";
import { tabs } from "../data/constants";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [view, setView] = useState("Market Overview");
  const [companyBought, setCompanyBought] = useState({
    companyId: "",
    companyLogo: "",
    companyName: "",
    companyReturn: 0,
    invested_amount: 0,
    profit_made: 0,
  });
  const [enabledTabs, setEnabledTabs] = useState(() => {
    const savedState = sessionStorage.getItem("enabledTabs");
    return savedState ? JSON.parse(savedState) : { count: 0 };
  });

  const handleChange = (newView, index) => {
    setView(newView);
    const newEnabledTabs = enabledTabs;
    newEnabledTabs[index] = false;
    setEnabledTabs(newEnabledTabs);
    sessionStorage.setItem("enabledTabs", JSON.stringify(newEnabledTabs));
  };

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
    <section className="w-screen h-screen overflow-hidden">
      <Navbar />
      <Box
        sx={{
          width: "100%",
          padding: 4,
          paddingTop: 3,
        }}
      >
        <TabContext value={view}>
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
              gap: 2,
            }}
          >
            <TabList
              onChange={handleChange}
              aria-label="Home page views"
              sx={{
                width: "100%",
                "& .MuiTabs-indicator": {
                  display: "none",
                },
                "& .MuiTabs-flexContainer": {
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                },
              }}
            >
              {tabs.map((label, index) => (
                <div className={`flex flex-col justify-center items-center`}>
                  <div className="w-[63px] h-[63px] bg-[#E9EBEB] hexagon"></div>
                  <Tab
                    key={label}
                    label={label}
                    value={label}
                    sx={{
                      fontSize: "14px",
                      color: "#6E7191",
                      fontWeight: "500",
                      textTransform: "none",
                      transition: "all 0.3s ease",
                      padding: 0,
                      // cursor: enabledTabs[index] ? "not-allowed" : "pointer",
                      // opacity: enabledTabs[index] ? 0.5 : 1,
                      height: "fit-content",
                      "&.Mui-selected": {
                        backgroundColor: "#6143F0",
                        color: "white",
                      },
                      "&.MuiButtonBase-root": {
                        paddingTop: "5px",
                        minHeight: "fit-content",
                      },
                    }}
                    // disabled={enabledTabs[index]}
                  />
                </div>
              ))}
            </TabList>
          </Box>
          <TabPanel value="Market Overview" sx={{ padding: 0 }}>
            <MarketOverview
              setCompanyBought={setCompanyBought}
              ReturnsMadeHandle={(e) => handleChange(e, "Returns Made", 1)}
            />
          </TabPanel>
          <TabPanel value="Returns Made" sx={{ padding: 0, paddingTop: 2 }}>
            <ReturnsMade
              companyBought={companyBought}
              portfolioHandle={(e) => handleChange(e, "My Portfolio", 2)}
            />
          </TabPanel>
          <TabPanel
            value="My Portfolio"
            sx={{ padding: 0, paddingTop: 2, height: "75vh" }}
          >
            <MyPortfolio
              withdrawHandle={(e) => handleChange(e, "Withdraw", 3)}
            />
          </TabPanel>
          <TabPanel value="Withdraw" sx={{ padding: 0, paddingTop: 4 }}>
            <WithdrawSection navigationHandle={handleChange} />
          </TabPanel>
          <TabPanel value="Leaderboard" sx={{ padding: 0, paddingTop: 2 }}>
            <LeaderboardsTable />
          </TabPanel>
        </TabContext>
      </Box>
    </section>
  );
};

export default Home;
