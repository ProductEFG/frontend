import clsx from "clsx";
import React from "react";

const Button = ({ name, onClick, otherClasses, loading, disabled }) => {
  return (
    <button
      type="submit"
      className={clsx(
        "border rounded-[100px] p-3 font-poppins text-sm h-[44px]",
        otherClasses
      )}
      onClick={onClick}
      disabled={loading || disabled}
    >
      {!loading ? (
        name
      ) : (
        <div className="flex justify-center items-center">
          <div className="w-5 h-5 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        </div>
      )}
    </button>
  );
};

export default Button;
