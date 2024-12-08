import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Input } from "@mui/material";

const FormField = React.forwardRef(
  (
    {
      type = "text",
      name,
      startAdornmentUrl,
      endAdornmentUrl,
      placeholder,
      value,
      onChange,
      onClick,
      error,
      errorMessage,
      success,
      successMessage,
      backgroundColor,
    },
    ref
  ) => {
    // state for password visibility toggle
    const [showPassword, setShowPassword] = React.useState(false);

    // Toggle password visibility
    const handleClickShowPassword = () => setShowPassword((prev) => !prev);

    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    return (
      <FormControl sx={{ m: 1, width: "100%" }}>
        <Input
          sx={{
            height: "51px",
            fontSize: "14px",
            padding: 2,
            fontFamily: "Poppins",
            borderRadius: "100px",
            backgroundColor:
              error || success
                ? "#FFF6F6"
                : backgroundColor
                ? backgroundColor
                : "#F8F9FA",
            border: success
              ? "2px solid #10BF0F"
              : error
              ? "2px solid red"
              : "none",
            boxShadow: "none",
            outline: "none",
            "&::before, &::after": {
              content: "none",
            },
            "&:hover:not(.Mui-disabled)::before": {
              content: "none",
            },
            "&.Mui-focused::after": {
              content: "none",
            },
          }}
          type={type === "password" && showPassword ? "text" : type}
          placeholder={placeholder}
          startAdornment={
            startAdornmentUrl && (
              <InputAdornment position="start">
                <img src={startAdornmentUrl} alt="start adornment" />
              </InputAdornment>
            )
          }
          endAdornment={
            <InputAdornment position="end">
              {type === "password" ? (
                <IconButton
                  aria-label={showPassword ? "hide password" : "show password"}
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ) : (
                endAdornmentUrl && (
                  <img src={endAdornmentUrl} alt="end adornment" />
                )
              )}
            </InputAdornment>
          }
          value={value}
          onChange={onChange}
          error={error}
          autoComplete="new-password"
          name={name}
          onClick={onClick}
          ref={ref}
        />
        {success && (
          <p className="text-[#10BF0F] mt-2 ml-2 text-sm">{successMessage}</p>
        )}
        {error && (
          <p className="text-red-500 mt-2 ml-2 text-sm">{errorMessage}</p>
        )}
      </FormControl>
    );
  }
);

export default FormField;
