import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/material";
import Button from "../components/Button";
import FormField from "../components/FormField";
import { userService } from "../services/user.service";

const RegisterPhase2 = ({ data, updateData, onNext, onBack }) => {
  const [usernameError, setUsernameError] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [typing, setTyping] = useState(false);

  const handleInputChange = (e) => {
    updateData({ ...data, [e.target.name]: e.target.value });
  };

  const checkUsernameUnique = async () => {
    const isAvailable = await userService.isUsernameAvailable(data.username);
    setUsernameError(isAvailable);
    setUsernameAvailable(!isAvailable);

    return isAvailable;
  };

  useEffect(() => {
    setUsernameAvailable(false);
    setUsernameError(false);
    setTyping(true);
    const timer = setTimeout(() => {
      if (data.username) {
        checkUsernameUnique();
      }
      setTyping(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [data.username]);
  return (
    <div className="flex justify-center items-center h-[80vh]">
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
            width: "422px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="/images/login_security.svg"
            alt="login security"
            className="pb-8"
            width={105}
            height={90}
          />
          <div className="text-center pb-4">
            <h6 className="font-semibold text-[21px] pb-2">Choose Username</h6>
            <p className="text-white-200 text-sm">
              Choose a unique name to represent you during trading
            </p>
          </div>
          <div className="w-[100%] flex justify-center">
            <FormField
              type="text"
              name="username"
              startAdornmentUrl="/images/profile.svg"
              endAdornmentUrl={usernameAvailable ? "/images/success.svg" : ""}
              placeholder="Username"
              value={data.username}
              onChange={handleInputChange}
              error={usernameError}
              errorMessage="username is not available"
              success={usernameAvailable ? true : false}
              successMessage={usernameAvailable ? "username is available" : ""}
              backgroundColor="#FFFFFF"
            />
          </div>
          <Button
            name="Next"
            onClick={onNext}
            disabled={usernameError || data.username === "" || typing}
            otherClasses={`text-white w-full ${
              usernameError || data.username.length <= 0 || typing
                ? "bg-[#9D8CF4]"
                : "bg-purple"
            }`}
          />
          <Button
            name="Back"
            onClick={onBack}
            otherClasses="bg-white text-black w-full"
          />
        </Stack>
      </Box>
    </div>
  );
};

export default RegisterPhase2;
