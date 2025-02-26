import React, { memo, useCallback, useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import Price from "../components/Price";
import Return from "../components/Return";

import Box from "@mui/material/Box";
import DataTable from "../components/DataTable.jsx";
import { ArrowRight } from "lucide-react";
import CardBackground from "./CardBackground";
import { useGlobal } from "@/providers/GlobalProvider";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 960,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

const MetricItem = memo(
  ({
    title,
    tableHeader,
    icon,
    description,
    name,
    acronym,
    logo,
    price,
    current_return,
    number,
    companyList,
  }) => {
    const { setOpenedCompany, handleNav } = useGlobal();

    const [open, setOpen] = useState(false);
    const handleOpen = useCallback(() => setOpen(true), []);
    const handleClose = useCallback(() => setOpen(false), []);

    const handleViewStock = useCallback((company) => {
      handleClose();
      setOpenedCompany(company);
      handleNav();
    }, []);

    return (
      <div className="relative w-full h-full font-onest pb-[12px]">
        <div className="bg-white w-full h-full pt-[43px] pb-[20px] pl-[61px] pr-[36px] flex flex-col gap-9 rounded-3xl">
          <div className="flex justify-between gap-5 items-start">
            <div className="flex flex-row items-center gap-6">
              <img src={`/images/${icon}.svg`} className="w-[67px]" />
              <h4 className="font-bold text-[33px]">{title}</h4>
            </div>
            {companyList.length > 0 && (
              <button onClick={handleOpen}>
                <p className="flex flex-row gap-2 justify-center items-center underline text-purple text-[20px]">
                  View {title} Stocks <ArrowRight />
                </p>
              </button>
            )}
          </div>
          <div className="flex gap-14">
            <div className="w-[165px] h-[165px] flex justify-center items-center bg-gray-100 rounded-full p-3">
              <img
                src={`${logo}`}
                alt={`${name} logo`}
                className="w-full h-auto max-h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="uppercase font-medium text-xl tracking-widest">
                {name ? `${name} (${acronym})` : "No Company Yet"}
              </span>
              {(title === "Trending Now" || title === "Highest Return") && (
                <div className="flex gap-3">
                  <Price
                    price={price && price.toFixed(2)}
                    imgStyles={"w-[50px]"}
                    textStyles={
                      "font-extrabold text-[112px] leading-[140px] text-purple"
                    }
                  />
                  <Return
                    type={current_return > 0 ? "positive" : "negative"}
                    number={current_return?.toFixed(2)}
                    textStyles={"font-medium text-[29px]"}
                    imgStyles={"w-[35px]"}
                    imgType="stock"
                  />
                </div>
              )}
              {(title === "Most Traded" || title === "Most Visited") && (
                <div className="flex gap-3 justify-center items-baseline">
                  <p className="font-extrabold text-[112px] leading-[140px] text-purple">
                    {number?.toLocaleString()}
                  </p>
                  <span className="text-white-200 text-[29px] font-medium">
                    {title === "Most Traded" ? "Trades" : "Visitors"}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="text-[35px] text-[#666666] text-center">
            {description}
          </div>
        </div>
        <CardBackground />
        <Modal
          keepMounted
          open={open}
          onClose={handleClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={style}>
            <div className="flex flex-row mb-5">
              <div className="flex flex-col gap-4">
                <h3 className="font-medium text-3xl">{title}</h3>
                <p className="text-sm text-[#6E7191] pl-1">{description}</p>
              </div>
              <div
                className="flex flex-row items-center text-2xl gap-2 ml-auto"
                onClick={handleClose}
              >
                Close <img src="/images/close.svg" alt="close" width={33} />
              </div>
            </div>
            <DataTable
              data={companyList}
              thirdColumn={tableHeader}
              onViewStock={handleViewStock}
            />
          </Box>
        </Modal>
      </div>
    );
  }
);

export default MetricItem;
