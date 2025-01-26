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

  const handleChange = (event, newView, index) => {
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
          <Box>
            <TabList
              onChange={handleChange}
              aria-label="Home page views"
              sx={{
                "& .MuiTabs-indicator": {
                  display: "none", // Hide default indicator
                },
              }}
            >
              {tabs.map(
                (label, index) =>
                  (label !== "Returns Made" || view === "Returns Made") && (
                    <Tab
                      key={label}
                      label={label}
                      value={label}
                      sx={{
                        fontSize: "20px",
                        color: "#9AA0A6",
                        fontWeight: "normal",
                        textTransform: "none",
                        transition: "all 0.3s ease",
                        cursor: enabledTabs[index] ? "not-allowed" : "pointer",
                        opacity: enabledTabs[index] ? 0.5 : 1,
                        "&.Mui-selected": {
                          backgroundColor: "#6143F0",
                          color: "white",
                        },
                      }}
                      disabled={enabledTabs[index]}
                    />
                  )
              )}
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
