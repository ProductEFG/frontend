import React from "react";

const Return = ({ type, number }) => {
  return (
    <div
      className={`${
        type === "positive" ? "text-green-600" : "text-red-600"
      } text-xs big:text-sm flex flex-row items-center`}
    >
      <img
        src={`/images/${
          type === "positive" ? "return_positive" : "return_negative"
        }.svg`}
        alt="type"
        className="w-4 big:w-5"
      />
      {type === "positive" ? "+" : "-"}
      {number}%
    </div>
  );
};

export default Return;
