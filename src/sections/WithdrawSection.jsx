import { Slide, Slider, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import Price from "../components/Price";
import { styled } from "@mui/material/styles";
import { userWithdrawService } from "../services/userWithdraw.service";
import WithdrawTable from "../components/WithdrawTable";
import Loading from "../components/Loading";
import SuccessfulWithdrawModal from "../components/SuccessfulWithdrawModal";

const columns = [
  {
    width: 130,
    label: "Cash Balance",
    dataKey: "opening_balance",
  },
  {
    width: 130,
    label: "Withdrawal Amount",
    dataKey: "withdraw_amount",
  },
  {
    width: 130,
    label: "Remaining",
    dataKey: "closing_balance",
    numeric: true,
  },
  {
    width: 200,
    label: "Time",
    dataKey: "date",
  },
  {
    width: 100,
    label: "Withdraw ID",
    dataKey: "_id",
  },
];

// Custom Styled Slider
const CustomSlider = styled(Slider)({
  color: "#6143F0", // Purple color for filled area
  width: "100%",
  height: "95%", // Height of the slider track
  "& .MuiSlider-track": {
    backgroundColor: "#6143F0", // Purple color for the filled track
  },
  "& .MuiSlider-rail": {
    background: "linear-gradient(135deg, #ECEDED, #919DB0)",
  },
  "& .MuiSlider-thumb": {
    width: 34,
    height: 40,
    borderRadius: 4,
    backgroundColor: "#fff",
    border: "2px solid #6143F0",
  },
  "& .MuiSlider-thumb:hover": {
    boxShadow: "0px 0px 0px 8px rgba(156, 39, 176, 0.16)", // Hover effect
  },
});

const WithdrawSection = ({ navigationHandle }) => {
  const { user } = useAuth();
  const [withdrawListLoading, setWithdrawListLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawQuantity, setWithdrawQuantity] = useState(0);
  const [withdrawList, setWithdrawList] = useState([]);

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  // Handle slider change
  const handleChange = (event, newValue) => {
    setWithdrawQuantity(newValue);
  };

  const handleWithdraw = async () => {
    setWithdrawLoading(true);
    try {
      const updatedUser = await userWithdrawService.withdrawFunds(
        user._id,
        withdrawQuantity
      );

      if (updatedUser) {
        updatedUser && user.updateBalance(updatedUser.wallet_balance);
        sessionStorage.setItem("token", JSON.stringify(updatedUser));
        fetchWithdrawList();
        setOpen(true);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setWithdrawLoading(false);
    }
  };

  const fetchWithdrawList = async () => {
    setWithdrawListLoading(true);
    try {
      const withdraws = await userWithdrawService.getOneUserWithdraws(user._id);
      setWithdrawList(withdraws);
    } catch (error) {
      console.log(error.message);
    } finally {
      setWithdrawListLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetchWithdrawList();

    return () => {
      setWithdrawList([]);
      controller.abort();
    };
  }, []);

  return (
    <Stack spacing={3}>
      <Stack direction={"row"} spacing={3} className="w-full">
        <div className="rounded-2xl bg-white p-4 flex flex-col gap-5 w-[25%]">
          <div className="flex flex-row gap-3 justify-start items-center">
            <img
              src="/images/available_withdraw.svg"
              alt="Available to Withdraw"
              width={35}
              height={35}
            />
            <h6 className="font-semibold text-lg">Available to withdraw</h6>
          </div>
          <div className="flex justify-center items-center">
            <Price
              price={Math.floor(user.wallet_balance)}
              styles={"absolute -top-3 -right-8 w-8"}
              textStyles={"text-5xl"}
            />
          </div>
          <div className="flex justify-center h-[200px]">
            <img src="/images/money.svg" alt="Money" width={200} height={200} />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-8 pl-10 w-[75%] space-y-4">
          <div className="flex justify-center items-center">
            <Price
              price={withdrawQuantity}
              textStyles={"text-7xl"}
              styles={"absolute -top-2 -right-14 w-14"}
            />
          </div>
          <div className="flex flex-col justify-center items-center gap-3">
            <p className="text-white-300 text-sm p-4 pt-5 tracking-wider">
              Move the Below slider to select a specific amount you want to
              withdraw
            </p>
            <CustomSlider
              value={withdrawQuantity}
              onChange={handleChange}
              max={Math.floor(user.wallet_balance)}
              valueLabelDisplay="on"
            />
          </div>
          <div className="flex items-center justify-end">
            <button
              className="flex items-center justify-center flex-row gap-2 bg-purple w-[206px] h-[51px] rounded-full text-white text-[18px] font-extralight tracking-wider"
              onClick={handleWithdraw}
              disabled={withdrawLoading}
            >
              {withdrawLoading ? (
                <Loading otherClasses={"w-5 h-5 border-white"} />
              ) : (
                <>
                  Withdraw <img src="/images/back_arrow.svg" alt="back arrow" />
                </>
              )}
            </button>
          </div>
        </div>
      </Stack>
      <div className="w-[1352px] h-[376px] rounded-2xl bg-white p-5 flex flex-col gap-5">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-4 items-center justify-start">
            <img src="/images/withdraw_img.svg" alt="Withdraw Image" />
            <p className="text-[24px] tracking-wider">Withdraw History</p>
          </div>
        </div>
        <div>
          {withdrawListLoading ? (
            <div className="flex justify-center items-center h-[20vh]">
              <Loading otherClasses={"w-10 h-10"} />
            </div>
          ) : (
            <WithdrawTable columns={columns} rows={withdrawList} />
          )}
        </div>
      </div>
      <SuccessfulWithdrawModal
        open={open}
        handleClose={handleClose}
        handleNavigate={navigationHandle}
      />
    </Stack>
  );
};

export default WithdrawSection;
