import clsx from "clsx";
import React from "react";

const Price = ({ price, imgStyles, textStyles, type, change }) => {
  return (
    <div className={clsx(`flex`, textStyles)}>
      <span>{price}</span>
      <div className={imgStyles}>
        {type && (
          <img
            src="/images/KidZosicon2.svg"
            alt="Kidzos coins"
            className="w-full h-auto"
          />
        )}
        {change === "positive" && (
          <img
            src="/images/kidzos-green.svg"
            alt="Kidzos coins"
            className="w-full h-auto"
          />
        )}
        {!type && !change && (
          <img
            src="/images/KidZosicon.svg"
            alt="Kidzos coins"
            className="w-full h-auto"
          />
        )}
      </div>
    </div>
  );
};

export default Price;
