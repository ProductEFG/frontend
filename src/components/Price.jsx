import clsx from "clsx";
import React from "react";

const Price = ({ price, styles, textStyles, type, font }) => {
  return (
    <span
      className={clsx(
        `relative ${font ? `font-${font}` : "font-semibold"}`,
        textStyles
      )}
    >
      {price}{" "}
      {type ? (
        <img
          src="/images/KidZosicon2.svg"
          alt="Kidzos coins"
          className={styles}
        />
      ) : (
        <img
          src="/images/KidZosicon.svg"
          alt="Kidzos coins"
          className={styles}
        />
      )}
    </span>
  );
};

export default Price;
