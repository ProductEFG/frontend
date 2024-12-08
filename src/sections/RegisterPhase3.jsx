import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/material";
import Button from "../components/Button";
import FormField from "../components/FormField";
import { userService } from "../services/user.service";

const RegisterPhase3 = ({ data, updateData, onNext, onBack }) => {
  const [passwordError, setPasswordError] = useState(false);
  const [passwordAcceptable, setPasswordAcceptable] = useState(false);
  const [typing, setTyping] = useState(false);

  const handleInputChange = (e) => {
    updateData({ ...data, [e.target.name]: e.target.value });
  };

  const checkPasswordAcceptable = async () => {
    const hasUpperCase = /[A-Z]/.test(data.password);
    const hasDigit = /\d/.test(data.password);
    const isAcceptable = hasUpperCase && hasDigit;
    setPasswordError(!isAcceptable);
    setPasswordAcceptable(isAcceptable);

    return isAcceptable;
  };

  useEffect(() => {
    setPasswordAcceptable(false);
    setPasswordError(false);
    setTyping(true);
    const timer = setTimeout(() => {
      if (data.password) {
        checkPasswordAcceptable();
      }
      setTyping(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [data.password]);
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
            src="/images/password_security.svg"
            alt="password security"
            className="pb-6"
            width={115}
            height={115}
          />
          <div className="text-center pb-5">
            <h6 className="font-semibold text-[21px] pb-2">Choose Password</h6>
            <p className="text-white-200 text-sm">
              Please enter a unique password to secure your account
            </p>
          </div>
          <div className="w-[100%] flex justify-center">
            <FormField
              type="password"
              name="password"
              startAdornmentUrl="/images/password.svg"
              endAdornmentUrl={passwordAcceptable ? "/images/success.svg" : ""}
              placeholder="Password"
              value={data.password}
              onChange={handleInputChange}
              error={passwordError}
              errorMessage="Password should include a capital letter and numerical characters"
              success={passwordAcceptable ? true : false}
              successMessage={passwordAcceptable ? "Good to go" : ""}
              backgroundColor="#FFFFFF"
            />
          </div>
          <Button
            name="Next"
            onClick={onNext}
            disabled={passwordError || data.password === "" || typing}
            otherClasses={`text-white w-full ${
              passwordError || data.password === "" || typing
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

export default RegisterPhase3;
