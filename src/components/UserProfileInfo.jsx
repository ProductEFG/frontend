import React from "react";
import { useAuth } from "../providers/AuthProvider";
import Price from "./Price";
import { Button, IconButton, Stack, Tooltip } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const UserProfileInfo = () => {
  const { user } = useAuth();
  return (
    <Stack direction={"row"}>
      {/* 1st Section */}
      <div className="flex flex-col items-center py-2 px-7 gap-6 relative after:content-[''] after:absolute after:right-0 after:top-5 after:bottom-0 after:w-[1px] after:bg-gray-200 after:h-[92%]">
        <div className="bg-white-100 rounded-full p-4 w-[100px] h-[100px] overflow-hidden flex justify-center items-center">
          <img
            src={`/images/avatars/${user.avatar}.svg`}
            alt="Avatar"
            className="bg-[#342BB5] bg-opacity-10 rounded-full w-full h-full object-cover object-top"
          />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-black text-[17px]">
            {user.getFullName()}
          </h3>
          <p className="text-sm text-white-300">
            Joined {user.getCreatedDate()}
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center pl-5 pt-[10px] flex-1">
        <div className="w-full">
          <h2 className="font-medium">Your Achieved Badges</h2>
        </div>
        <div className="flex flex-col justify-start items-center">
          <div className="w-[120px] h-[120px] flex justify-center items-center">
            <img
              src="/images/coming-soon-portfolio.svg"
              alt="Coming Soon"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-[10px]  text-white-300">
            You have not engaged in enough trading activity to achieve a badge.
          </p>
        </div>
      </div>
    </Stack>
  );
};

export default UserProfileInfo;
