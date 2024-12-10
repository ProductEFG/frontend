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
      <div className="flex flex-col items-center p-5 pr-0 big:p-10 big:pr-3 gap-6 w-[38%] relative after:content-[''] after:absolute after:right-0 after:top-5 after:bottom-0 after:w-[1px] after:bg-gray-200 after:h-[92%] big:after:top-7">
        <div className="bg-white-100 rounded-full p-4 flex justify-center items-center">
          <img
            src={`/images/avatars/${user.avatar}.svg`}
            alt="Avatar"
            className="bg-[#342BB5] bg-opacity-10 rounded-full w-[5rem] big:w-[120px]"
          />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-black big:text-2xl text-[17px] pb-1">
            {user.getFullName()}
          </h3>
          <p className="big:text-xl text-sm text-white-300">
            Joined {user.getCreatedDate()}
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center w-[650px] p-5">
        <div className="w-full">
          <h2 className="big:text-2xl font-semibold">Your Achieved Badges</h2>
        </div>
        <div className="flex flex-col justify-start items-center">
          <img
            src="/images/coming-soon-portfolio.svg"
            alt="Coming Soon"
            className="normal:w-[130px]"
          />
          <p className="text-xs big:text-sm text-white-300">
            You have not engaged in enough trading activity to achieve a badge.
          </p>
        </div>
      </div>
    </Stack>
  );
};

export default UserProfileInfo;
