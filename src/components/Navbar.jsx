import React, { useState } from "react";
import { Chip, Avatar, Box } from "@mui/material";
import { useAuth } from "../providers/AuthProvider";
import { useNavigate } from "react-router";

const Navbar = () => {
  const { user, setUser, backendUrl } = useAuth();
  const navigate = useNavigate();

  const [logoutClicked, setLogoutClicked] = useState(false);

  const logoutHandle = async () => {
    console.log("here");
    sessionStorage.removeItem("token");
    await setUser(null);
    navigate("/login");
  };
  return (
    <div className="relative flex flex-row justify-center items-center h-24 bg-white w-screen overflow-hidden">
      <div className="">
        <img src="/images/main_logos.jpg" />
      </div>
      {user && (
        <div className="pr-6 absolute right-0">
          <div className="h-16 rounded-full bg-white-100 flex flex-row justify-between items-center w-[100%] p-3">
            <div className="flex flex-row justify-center items-center pr-5">
              <div className="bg-[#D88EA9] rounded-full w-12 h-12 flex justify-center items-center">
                <Avatar
                  alt="avatar"
                  src={`/images/avatars/${user.avatar}.svg`}
                  sx={{ width: 46, height: 46 }}
                />
              </div>

              <div className="m-3 flex flex-col gap-1">
                <h6 className="">
                  Hi, {user.first_name} {user.last_name}!
                </h6>
                <p className="text-sm font-bold">
                  Wallet Balance:{" "}
                  <span className="font-normal text-white-200 relative">
                    {user.wallet_balance.toLocaleString()}{" "}
                    <img
                      src="/images/KidZosicon.svg"
                      alt="Kidzos coins"
                      className="absolute -top-0.5 -right-3"
                    />
                  </span>
                </p>
              </div>
            </div>
            <button onClick={() => setLogoutClicked((prev) => !prev)}>
              {" "}
              <img src="/images/tripledots.svg" className="mr-1" />
            </button>
          </div>
        </div>
      )}
      {logoutClicked && (
        <button
          className="flex flex-row justify-start items-center gap-3 absolute right-8 top-22 w-[246px] h-[67px] bg-white rounded-xl p-5 shadow-lg z-1"
          onClick={logoutHandle}
        >
          <img src="/images/logout.svg" alt="Logout" />
          <p className="text-[20px] tracking-wider">Logout</p>
        </button>
      )}
    </div>
  );
};

export default Navbar;
