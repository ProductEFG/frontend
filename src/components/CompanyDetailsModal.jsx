import React, { memo, useCallback, useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { useSpring, animated } from "@react-spring/web";

import Box from "@mui/material/Box";
import { Stack } from "@mui/material";
import { stocksHistoryService } from "../services/stocksHistory.service";
import Loading from "./Loading";
import DataChart from "./DataChart";
import BuyStockWindow from "./BuyStockWindow";
import { useAuth } from "../providers/AuthProvider";

const CompanyDetailsModal = memo(({ open, handleClose, company }) => {
  const { backendUrl } = useAuth();
  const [companyHistory, setCompanyHistory] = useState([]);
  const [monthlyVisitors, setMonthlyVisitors] = useState(0);
  const [loading, setLoading] = useState(false);
  const [buy, setBuy] = useState(false);

  // Animated spring for monthlyVisitors
  const { visitorsCount } = useSpring({
    from: { visitorsCount: 0 },
    visitorsCount: monthlyVisitors,
    config: { duration: 1000 }, // Adjust duration as needed
    reset: monthlyVisitors === 0,
  });

  // Transitions for the main Stack and BuyStockWindow
  const stackTransition = useSpring({
    transform: buy ? "translateX(-200%)" : "translateX(0%)",
    opacity: buy ? 0 : 1,
    config: { tension: 220, friction: 20 },
  });

  const buyWindowTransition = useSpring({
    transform: buy ? "translateX(-110%)" : "translateX(30%)",
    opacity: buy ? 1 : 0,
    config: { tension: 220, friction: 20 },
  });

  const chartTransition = useSpring({
    transform: buy ? "translateX(-54%)" : "translateX(0%)",
    config: { tension: 220, friction: 20 },
  });

  const fetchCompanyHistory = async () => {
    try {
      setLoading(true);

      const history = await stocksHistoryService.getCompanyHistory(company._id);
      setCompanyHistory(history);

      if (history.length > 0) {
        const totalMonthlyVisitors = history.reduce((total, entry) => {
          const entryDate = new Date(entry.date);
          const currentDate = new Date();

          if (
            entryDate.getMonth() === currentDate.getMonth() &&
            entryDate.getFullYear() === currentDate.getFullYear()
          ) {
            return total + entry.visitors;
          }
          return total;
        }, 0);

        setMonthlyVisitors(totalMonthlyVisitors);
      }

      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    company && fetchCompanyHistory();

    return () => {
      setCompanyHistory([]);
      setMonthlyVisitors(0);
      controller.abort();
    };
  }, [company]);

  if (loading) {
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
            width: 1064,
            height: 680,
            bgcolor: "white",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <div className="flex justify-center items-center h-[24rem]">
            <Loading otherClasses={"w-7 h-7"} />
          </div>
        </Box>
      </Modal>
    );
  }

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
          width: 1064,
          height: 680,
          bgcolor: "white",
          borderRadius: "10px",
          boxShadow: 24,
          p: 4,
        }}
      >
        <div className="flex flex-row mb-10">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-4 justify-center items-center">
              <img
                src={`${backendUrl}/images/logos/${company.logo}`}
                width={40}
                height={40}
              />
              <h3 className="font-semibold text-[28px]"> {company.name}</h3>
            </div>
          </div>
          <div
            className="flex flex-row items-center text-[21px] gap-2 ml-auto"
            onClick={handleClose}
          >
            Close <img src="/images/close.svg" alt="close" width={29} />
          </div>
        </div>
        <Stack direction={"row"} spacing={5} className="h-[510px]">
          <animated.div style={stackTransition}>
            <Stack spacing={5} className="flex justify-center items-center">
              <div className="company-card relative border-[2px] border-purple bg-white w-[300px] h-[224px] p-3">
                {company && company.description}
              </div>

              <div className="company-card relative border-[2px] border-purple bg-white w-[300px] h-[224px] p-3">
                <Stack
                  spacing={1}
                  textAlign={"center"}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <img
                    src="images/monthly_visitors.svg"
                    alt="Monthly Visitors Icon"
                    width={88}
                  />
                  <p className="font-semibold text-[37px]">
                    <animated.span>
                      {visitorsCount.to((val) =>
                        Math.floor(val).toLocaleString()
                      )}
                    </animated.span>
                  </p>
                  <p className="text-lg text-white-200">
                    Total Monthly Visitors
                  </p>
                </Stack>
              </div>
            </Stack>
          </animated.div>

          <animated.div
            className="w-[639px] h-[491px] "
            style={chartTransition}
          >
            <div className="company-card relative border-[2px] border-purple bg-white w-full h-full p-4">
              <DataChart history={companyHistory} />
            </div>
          </animated.div>

          <animated.div
            className="w-[328px] h-[491px]"
            style={buyWindowTransition}
          >
            <div className="company-card relative border-[2px] border-purple bg-white w-[328px] h-full p-4">
              <BuyStockWindow company={company} />
            </div>
          </animated.div>
        </Stack>
        <div className="w-full flex justify-end items-center pr-3">
          {company && buy === false && (
            <button
              href="/"
              className="border p-2 font-poppins text-normal bg-purple text-white w-[260px] h-[45px] text-center"
              onClick={() => setBuy(true)}
            >
              <div className="flex flex-row justify-center items-center gap-2">
                <p>Buy {company.name}</p>
                <img src="/images/back_arrow.svg" alt="back arrow" width={21} />
              </div>
            </button>
          )}
        </div>
      </Box>
    </Modal>
  );
});

export default CompanyDetailsModal;
