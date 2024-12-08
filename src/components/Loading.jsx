import clsx from "clsx";
import React from "react";

const Loading = ({ otherClasses }) => {
  return (
    <div
      className={clsx(
        "border-4 border-t-transparent border-black rounded-full animate-spin",
        otherClasses
      )}
    ></div>
  );
};

export default Loading;
