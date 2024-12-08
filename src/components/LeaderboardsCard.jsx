import React from "react";
import { useAuth } from "../providers/AuthProvider";
import { Stack } from "@mui/material";
import { useLocation } from "react-router";

const LeaderboardsCard = ({ title, image, description, list }) => {
  const { backendUrl } = useAuth();
  const location = useLocation();
  const isAdminHome = location.pathname === "/admin/home";
  return (
    <div
      className={`${
        isAdminHome ? "min-h-[755px]" : "min-h-[680px]"
      } min-w-[410px] bg-white p-5`}
    >
      <Stack spacing={isAdminHome ? 0 : 4.5}>
        <div
          className={`flex justify-center items-center ${
            isAdminHome ? "w-[370px]" : ""
          }`}
        >
          <img src={`/images/${title}.svg`} />
        </div>
        {!isAdminHome && (
          <div className="flex justify-center items-center w-full">
            <img
              src={`/images/${image}.svg`}
              alt="Leaderboard Image"
              className="w-[270px] h-[190px]"
            />
          </div>
        )}
        <div className="p-2 gap-y-3 flex flex-col">
          <div
            className={`text-center ${
              isAdminHome ? "text-sm" : "text-[20px]"
            } border-b border-b-black-200 p-2 pb-3`}
          >
            {description}
          </div>

          <Stack spacing={2} className="p-2">
            {list.slice(0, list.length).map((item, index) => (
              <div
                key={index}
                className={`flex flex-row justify-between items-center ${
                  isAdminHome ? "gap-[7rem]" : "gap-[10rem]"
                }`}
              >
                {isAdminHome ? (
                  <div className="flex justify-center items-center w-[10%]">
                    <p className="font-planet text-[24px] text-[#6143F0]">
                      {index + 1}
                    </p>
                  </div>
                ) : (
                  <img
                    src={`/images/number${index + 1}.svg`}
                    alt={`Number ${index + 1}`}
                    style={{ flexShrink: 0 }} // Prevent shrinking of the rank image
                  />
                )}
                <div
                  className="flex flex-row gap-3 items-center"
                  style={{ flexGrow: 1 }}
                >
                  <img
                    src={`/images/avatars/${item.avatar}.svg`}
                    width={48}
                    height={48}
                    className="rounded-full"
                    style={{ flexShrink: 0 }} // Prevent shrinking of avatar
                  />
                  <p
                    style={{
                      whiteSpace: "nowrap", // Prevent wrapping
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      minWidth: "0", // Prevent flexbox issues with overflow
                      flexGrow: 1, // Allow the text to take remaining space
                    }}
                  >
                    {item.first_name} {item.last_name}
                  </p>
                </div>
              </div>
            ))}
          </Stack>
        </div>
      </Stack>
    </div>
  );
};

export default LeaderboardsCard;
