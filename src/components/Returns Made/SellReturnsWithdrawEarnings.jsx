import React, { useState } from "react";
import Price from "@/components/Price";
import { userWithdrawService } from "@/services/userWithdraw.service";
import Loading from "@/components/Loading";
import SuccessfulWithdrawModal from "@/components/SuccessfulWithdrawModal";
import { useGlobal } from "@/providers/GlobalProvider";
import CustomSlider from "@/components/CustomSlider";
import { useAuth } from "@/providers/AuthProvider";

const SellReturnsWithdrawEarnings = () => {
  const { user } = useAuth();
  const { handleNav } = useGlobal();
  const [withdrawQuantity, setWithdrawQuantity] = useState(0);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

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
        setOpen(true);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setWithdrawLoading(false);
    }
  };

  const adjustBalance = (walletBalance) => {
    const decimalPart = walletBalance % 1; // Get the decimal part
    return decimalPart <= 0.1
      ? Math.floor(walletBalance)
      : Math.ceil(walletBalance);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="rounded-2xl bg-white p-2 pt-6 h-fit flex flex-col py-[20px] px-5 w-[442px]">
        <div className="flex flex-row gap-2 justify-center items-center">
          <h6 className="font-semibold text-[25px] mb-6">
            Withdraw Available Earnings
          </h6>
        </div>
        <div className="flex justify-center items-center mb-2">
          <Price
            price={withdrawQuantity}
            imgStyles={"w-8"}
            textStyles={"text-[55px] gap-1 font-bold"}
          />
        </div>
        <hr />
        <div className="flex flex-col justify-center items-center">
          <p className="text-white-300 big:text-sm pb-3 text-center text-[13px] mt-4">
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
            className="flex items-center justify-center flex-row gap-2 bg-purple rounded-full text-white text-[10px] px-[90px] py-3 text-sm"
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
                  className="w-[18px]"
                />
              </>
            )}
          </button>
        </div>
        <SuccessfulWithdrawModal
          open={open}
          handleClose={handleClose}
          handleNavigate={handleNav}
        />
      </div>
    </div>
  );
};

export default SellReturnsWithdrawEarnings;
