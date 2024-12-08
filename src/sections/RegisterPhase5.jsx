import React from "react";
import { Box, Stack } from "@mui/material";
import { useAuth } from "../providers/AuthProvider";
import UserEntity from "../entities/userEntity";
import { userService } from "../services/user.service";
import { useNavigate } from "react-router-dom";

const RegisterPhase5 = ({ data }) => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleClick = async () => {
    const user = await userService.fetchUser(data.username);
    await setUser(new UserEntity(user));
    sessionStorage.setItem("token", JSON.stringify(user));

    navigate("/");
  };
  return (
    <div className="overflow-hidden">
      <Box
        sx={{
          width: "100%",
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack
          spacing={2}
          sx={{
            width: "750px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="text-center">
            <h6 className="font-semibold text-2xl pb-2">
              Congrats! You won some kidZoS!
            </h6>
            <p className="text-white-200 text-sm">
              You won 15 KidZoS that you can use as a starting balance to trade
              with
            </p>
          </div>

          <img
            src="images/mobile_money.svg"
            alt="15 Kidzos Recieved"
            width={540}
          />
        </Stack>
      </Box>
      <button
        onClick={handleClick}
        className="border rounded-[100px] p-3 font-poppins text-normal bg-purple text-white w-[220px] h-[45px] absolute right-10 bottom-10 text-center"
      >
        <div className="flex flex-row justify-center items-center gap-2 text-sm">
          <p>Start Trading</p>
          <img src="/images/back_arrow.svg" alt="back arrow" width={21} />
        </div>
      </button>
    </div>
  );
};

export default RegisterPhase5;
