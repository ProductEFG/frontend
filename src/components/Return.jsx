import clsx from "clsx";
import React from "react";

const Return = ({
  type,
  number,
  textStyles,
  imgStyles,
  imgType = "return",
}) => {
  return (
    <div
      className={clsx(
        `${
          type === "positive" ? "text-green-600" : "text-red-600"
        } flex flex-row items-center gap-1`,
        textStyles
      )}
    >
      <div className={imgStyles}>
        <img
          src={`/images/${imgType}_${type}.svg`}
          alt="type"
          className="w-full h-auto"
        />
      </div>
      {type === "positive" ? "+" : ""}
      {number}%
    </div>
  );
};

export default Return;
