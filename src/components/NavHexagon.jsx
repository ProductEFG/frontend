import React from "react";

const NavHexagon = ({
  size = "w-[70px]",
  color = "#E9EBEB",
  borderSize = 5,
  children,
}) => {
  return (
    <div className={`relative ${size} z-2`}>
      <svg viewBox="-5 -5 110 110" className="w-full h-full">
        <path
          d="M50 0
             L100 25
             L100 75
             L50 100
             L0 75
             L0 25
             Z"
          className={`${color} stroke-purple transition-colors duration-300`}
          strokeWidth={borderSize}
          strokeLinejoin="round"
          fill={color}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default NavHexagon;
