import React from "react";
import Navbar from "../components/Navbar";
import LeaderboardsTable from "../sections/LeaderboardsTable";
import { useNavigate, useLocation } from "react-router-dom";

const Leaderboards = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const cameFromLogin = location.state?.from === "/login";
    const cameFromRegister = location.state?.from === "/register";

    if (cameFromLogin) {
      navigate("/login");
    } else if (cameFromRegister) {
      navigate("/register");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="relative">
      <Navbar />
      <button
        onClick={handleBack}
        className="flex flex-row text-[20px] items-center justify-center p-8 gap-1 font-[150px] pt-16"
      >
        <img src="/images/back_button.svg" alt="Back Button" />
        Back
      </button>
      <LeaderboardsTable />
    </div>
  );
};

export default Leaderboards;
