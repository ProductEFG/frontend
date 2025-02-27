import styled from "@emotion/styled";
import { Slider } from "@mui/material";

const CustomSlider = styled(Slider)({
  color: "#6143F0", // Purple color for filled area
  width: "100%",
  height: "50%",
  borderRadius: 4,
  "& .MuiSlider-track": {
    backgroundColor: "#6143F0", // Purple color for the filled track
  },
  "& .MuiSlider-rail": {
    background: "#3D424A",
    opacity: 0.1,
  },
  "& .MuiSlider-thumb": {
    width: 20,
    height: 22,
    borderRadius: 4,
    backgroundColor: "#fff",
    border: "2px solid #6143F0",
    transition: "width 0.3s, height 0.3s",
  },
  "& .MuiSlider-thumb:hover": {
    boxShadow: "0px 0px 0px 8px rgba(156, 39, 176, 0.16)", // Hover effect
  },
  // Media query for specific resolution
  "@media (min-width: 1440px) and (min-height: 1028px)": {
    "& .MuiSlider-thumb": {
      width: 32,
      height: 38,
    },
  },
});

export default CustomSlider;
