import React, { useEffect } from "react";
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

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [view, setView] = React.useState("Market Overview");

  const handleChange = (event, newView) => {
    setView(newView);
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
              {[
                "Market Overview",
                "My Portfolio",
                "Withdraw",
                "Leaderboard",
              ].map((label) => (
                <Tab
                  key={label}
                  label={label}
                  value={label}
                  sx={{
                    fontSize: "20px",
                    color: "#9AA0A6",
                    fontWeight: "normal",
                    textTransform: "none", // Prevents automatic capitalization
                    transition: "all 0.3s ease",
                    "&.Mui-selected": {
                      backgroundColor: "#6143F0",
                      color: "white",
                    },
                  }}
                />
              ))}
            </TabList>
          </Box>
          <TabPanel value="Market Overview" sx={{ padding: 0 }}>
            <MarketOverview balance={user.wallet_balance} />
          </TabPanel>
          <TabPanel
            value="My Portfolio"
            sx={{ padding: 0, paddingTop: 2, height: "75vh" }}
          >
            <MyPortfolio withdrawHandle={(e) => handleChange(e, "Withdraw")} />
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
