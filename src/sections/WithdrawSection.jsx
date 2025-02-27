import { Slide, Slider, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import Price from "../components/Price";
import { styled } from "@mui/material/styles";
import { userWithdrawService } from "../services/userWithdraw.service";
import WithdrawTable from "../components/WithdrawTable";
import Loading from "../components/Loading";
import SuccessfulWithdrawModal from "../components/SuccessfulWithdrawModal";
import { useGlobal } from "@/providers/GlobalProvider";
import CustomSlider from "@/components/CustomSlider";

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

const WithdrawSection = () => {
  const { user } = useAuth();
  const { handleNav } = useGlobal();
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

  const adjustBalance = (walletBalance) => {
    const decimalPart = walletBalance % 1; // Get the decimal part
    return decimalPart <= 0.1
      ? Math.floor(walletBalance)
      : Math.ceil(walletBalance);
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
    <Stack spacing={2} direction={"row"}>
      <Stack direction={"column"} spacing={2} className="h-full w-[29%]">
        <div className="rounded-2xl bg-white p-4 flex flex-col gap-0 h-[39%] w-full">
          <div className="flex flex-row gap-2 justify-start items-center">
            <img
              src="/images/available_withdraw.svg"
              alt="Available to Withdraw"
              className="big:w-[35px] w-[24px]"
            />
            <h6 className="font-semibold big:text-lg text-sm">
              Available to withdraw
            </h6>
          </div>
          <div className="flex justify-center items-center pt-5">
            <Price
              price={adjustBalance(user.wallet_balance)}
              imgStyles={"w-5"}
              textStyles={"text-4xl gap-1"}
            />
          </div>
          <div className="flex justify-center">
            <img
              src="/images/money.svg"
              alt="Money"
              className="w-[122px] big:w-[200px] -translate-y-1"
            />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-2 pt-6 h-fit w-fit flex flex-col">
          <div className="flex justify-center items-center">
            <Price
              price={withdrawQuantity}
              imgStyles={"w-6"}
              textStyles={"text-5xl gap-1"}
            />
          </div>
          <div className="flex flex-col justify-center items-center">
            <p className="text-white-300 big:text-sm pt-2 pb-3 text-center text-[10px] big:pt-8">
              Move the Below slider to select a specific amount you want to
              withdraw
            </p>
            <div className="w-full pr-8 pt-0 pb-0 pl-10 mt-2">
              <CustomSlider
                value={withdrawQuantity}
                onChange={handleChange}
                max={adjustBalance(user.wallet_balance)}
                valueLabelDisplay="off"
              />
            </div>
          </div>
          <div className="flex items-center justify-center pb-2 pr-4 pl-4 mt-2">
            <button
              className="w-full flex items-center justify-center flex-row gap-2 bg-purple rounded-full text-white big:text-[18px] text-[10px] p-2"
              onClick={handleWithdraw}
              disabled={withdrawLoading}
            >
              {withdrawLoading ? (
                <Loading otherClasses={"w-5 h-5 border-white"} />
              ) : (
                <>
                  Withdraw{" "}
                  <img
                    src="/images/back_arrow.svg"
                    alt="back arrow"
                    className="w-[14px] big:w-[24px]"
                  />
                </>
              )}
            </button>
          </div>
        </div>
      </Stack>
      <div className="rounded-2xl bg-white flex flex-col gap-5 w-full">
        <div className="flex flex-row justify-between items-center pl-5 pt-5">
          <div className="flex flex-row gap-4 items-center justify-start">
            <img
              src="/images/withdraw_img.svg"
              alt="Withdraw Image"
              className="w-[44px]"
            />
            <p className="text-[24px]">Withdraw History</p>
          </div>
        </div>
        <div>
          {withdrawListLoading ? (
            <div className="flex justify-center items-center h-full">
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
        handleNavigate={handleNav}
      />
    </Stack>
  );
};

export default WithdrawSection;
