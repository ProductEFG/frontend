import React, { useEffect, useState } from "react";
import { femaleAvatars, maleAvatars } from "../data/constants";
import { Box, Stack } from "@mui/material";
import Button from "../components/Button";
import { userService } from "../services/user.service";
import { useAuth } from "../providers/AuthProvider";

const RegisterPhase4 = ({ data, updateData, onNext, onBack }) => {
  const [gender, setGender] = useState("male");
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedList, setSelectedList] = useState(maleAvatars);

  const handleToggle = (selectedGender) => {
    setGender(selectedGender);
  };

  const register = async () => {
    setLoading(true);
    try {
      // First, ensure data is updated with the selected avatar
      await updateData({ ...data, avatar: selectedAvatar });

      // Now that data is updated, call the register function
      await userService.register({
        ...data,
        avatar: selectedAvatar,
      });

      onNext();
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (gender === "male") {
      setSelectedList(maleAvatars);
    } else {
      setSelectedList(femaleAvatars);
    }
  }, [gender]);
  return (
    <div className="flex flex-col items-center h-[90vh] mt-5 mb-5 overflow-hidden">
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack
          spacing={2}
          sx={{
            width: "495px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="text-center">
            <h6 className="font-semibold text-[21px] pb-2">
              Choose Your Avatar
            </h6>
            <p className="text-white-200 text-sm">
              Please choose an avatar to represent you when trading
            </p>
          </div>

          <div className="flex items-center justify-center bg-white rounded-full w-[112px] h-[27px] p-1 shadow-md text-[12px]">
            <button
              className={`px-2 py-1 rounded-full transition-colors duration-300 ${
                gender === "male" ? "bg-purple text-white" : "bg-transparent"
              }`}
              onClick={() => handleToggle("male")}
            >
              Male
            </button>
            <button
              className={`px-2 py-1 rounded-full transition-colors duration-300 ${
                gender === "female" ? "bg-purple text-white" : "bg-transparent"
              }`}
              onClick={() => handleToggle("female")}
            >
              Female
            </button>
          </div>
        </Stack>
      </Box>
      <div className="grid grid-cols-5 w-[886px] gap-x-3 gap-y-3 mt-5 overflow-y-auto">
        {selectedList.slice(0, 15).map((avatar, index) => (
          <div
            key={index}
            onClick={() => setSelectedAvatar(avatar)}
            className={`relative w-[160px] h-[147px] p-4 pt-5 rounded-2xl border ${
              avatar === selectedAvatar && "border-purple"
            } cursor-pointer`}
          >
            <img
              key={index}
              src={`/images/avatars/${avatar}.svg`}
              alt={`Avatar ${index + 1}`}
              className={`border-[2px] border-transparent`}
            />
            {avatar === selectedAvatar && (
              <img
                src="/images/check.svg"
                alt="selected"
                className="absolute right-4 top-4 w-6"
              />
            )}
          </div>
        ))}
      </div>
      {selectedAvatar && (
        <Button
          name="Continue"
          onClick={register}
          loading={loading}
          otherClasses="bg-purple text-white w-[220px] absolute right-10 bottom-10"
        />
      )}
    </div>
  );
};

export default RegisterPhase4;
