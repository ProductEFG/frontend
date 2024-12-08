import React, { memo, useState } from "react";
import Modal from "@mui/material/Modal";

import Box from "@mui/material/Box";
import { Grid2, Stack } from "@mui/material";
import Price from "./Price";
import { useSpring, animated } from "@react-spring/web";

import SellStockWindow from "./SellStockWindow";
import { useAuth } from "../providers/AuthProvider";

const CompanyCard = memo(({ stock, handleClick, selected }) => {
  const { backendUrl } = useAuth();
  return (
    <div
      key={stock.id}
      className={`bg-white rounded-2xl p-3 border max-h-[300px] ${
        selected ? "border-green-500 border-[2px]" : "border-[2px]"
      }`}
      style={{ boxSizing: "border-box" }}
    >
      <Stack spacing={2}>
        <div className="flex flex-row justify-between text-sm font-semibold">
          <div className="flex flex-row gap-3 justify-center items-center h-12">
            <img
              src={`${backendUrl}/images/logos/${stock.logo}`}
              alt="Logo"
              width="40px"
              height="40px"
            />
            {stock.company}
          </div>

          {stock.return > 0 ? (
            <img src="/images/positive_return.svg" alt="positive return" />
          ) : (
            <img src="/images/negative_return.svg" alt="negative return" />
          )}
        </div>
        <div className="flex flex-row justify-between pr-3 pt-3">
          <div className="flex flex-row gap-2 text-[#6E7191]">
            <img src="/images/stock_price.svg" alt="Stock Price" />
            Stock price
          </div>
          <Price
            price={stock.price.toLocaleString()}
            styles="absolute -right-3 top-0 w-3"
          />
        </div>
        <div className="flex flex-row justify-between pr-3">
          <div className="flex flex-row gap-1 text-[#6E7191]">
            <img src="/images/change.svg" alt="Change" />
            No. of Shares
          </div>
          <p className="font-semibold">{stock.quantity.toLocaleString()}</p>
        </div>
        <div className="flex flex-row justify-between pr-3">
          <div className="flex flex-row gap-3 justify-center items-center text-[#6E7191]">
            <img src="/images/visitors.svg" alt="Change" />
            Visitors
          </div>
          <p className="font-semibold">{stock.visitors.toLocaleString()}</p>
        </div>
        <div className="w-full flex justify-center items-center p-2">
          <button
            className="bg-[#31CFCB] text-white w-[240px] h-[44px] tracking-wider flex flex-row gap-1 justify-center items-center rounded-full"
            onClick={handleClick}
          >
            Sell Stock <img src="/images/back_arrow.svg" alt="topright arrow" />
          </button>
        </div>
      </Stack>
    </div>
  );
});

const SellStockModal = memo(({ open, handleClose, userStocksDetails }) => {
  const [sellingCompany, setSellingCompany] = useState(null);

  const sellWindowTransition = useSpring({
    transform: sellingCompany ? "translateX(0%)" : "translateX(30%)",
    opacity: sellingCompany ? 1 : 0,
    config: { tension: 220, friction: 20 },
  });

  return (
    <Modal
      keepMounted
      open={open}
      onClose={handleClose}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 1000,
          height: 766,
          bgcolor: "white",
          borderRadius: "10px",
          boxShadow: 24,
          p: 4,
        }}
      >
        <div className="flex flex-row mb-10">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-[32px]">Stocks you Own</h3>
          </div>
          <div
            className="flex flex-row items-center text-2xl gap-2 ml-auto"
            onClick={handleClose}
          >
            Close <img src="/images/close.svg" alt="close" />
          </div>
        </div>

        <Stack
          spacing={2}
          direction={"row"}
          className="flex justify-between p-0 m-0"
        >
          <Grid2
            container
            rowSpacing={4}
            columnSpacing={3}
            className="max-h-[620px] overflow-auto"
          >
            {userStocksDetails.length > 0 ? (
              userStocksDetails.map((stock) => (
                <CompanyCard
                  key={stock.id}
                  stock={stock}
                  handleClick={() => setSellingCompany(stock)}
                  selected={
                    sellingCompany && sellingCompany.id === stock.id
                      ? true
                      : false
                  }
                />
              ))
            ) : (
              <div className="flex justify-center items-center h-[24rem] w-full">
                <p className="text-xl">No companies available.</p>
              </div>
            )}
          </Grid2>
          {sellingCompany && (
            <animated.div
              className="w-[360px] h-[600px]"
              style={sellWindowTransition}
            >
              <div className="company-card-2 relative border-[2px] border-[#31CFCB] bg-white w-[360px] h-full p-4">
                <SellStockWindow company={sellingCompany} />
              </div>
            </animated.div>
          )}
        </Stack>
      </Box>
    </Modal>
  );
});

export default SellStockModal;
