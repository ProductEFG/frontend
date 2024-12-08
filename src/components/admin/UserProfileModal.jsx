import { Box, Modal, Stack } from "@mui/material";
import React, { useState } from "react";
import Price from "../Price";
import Loading from "../Loading";
import FormField from "../FormField";
import { userService } from "../../services/user.service.js";

const UserProfileModal = ({ open, handleClose, selectedUser }) => {
  const [addedBalance, setAddedBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleAddFunds = async () => {
    setLoading(true);
    try {
      if (!addedBalance) {
        setAddedBalance(0);
        return;
      }

      const user = await userService.updateBalance(
        addedBalance,
        selectedUser._id
      );
      selectedUser.wallet_balance = user.wallet_balance;
    } catch (error) {
      console.log("an error has occurred while adding user balance");
    } finally {
      setLoading(false);
    }
  };
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
          width: 900,
          bgcolor: "white",
          borderRadius: "10px",
          boxShadow: 24,
          p: 4,
        }}
      >
        <div className="flex flex-row mb-10">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-4 justify-center items-center">
              <h3 className="font-semibold text-[32px]">
                {" "}
                {selectedUser.getFullName()} Profile
              </h3>
            </div>
          </div>
          <div
            className="flex flex-row items-center text-2xl gap-2 ml-auto"
            onClick={handleClose}
          >
            Close <img src="/images/close.svg" alt="close" />
          </div>
        </div>
        <Stack
          direction={"column"}
          spacing={2}
          className="flex justify-center items-center"
        >
          <div className="rounded-full bg-gray-100 p-4 w-[8rem] h-[8rem]">
            <img
              src={`/images/avatars/${selectedUser.avatar}.svg`}
              width={100}
              height={100}
              className="rounded-full bg-[#D88EA9]"
            />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-black text-2xl pb-1">
              {selectedUser.getFullName()}
            </h3>
            <p className="text-xl text-white-300">
              Joined {selectedUser.getCreatedDate()}
            </p>
          </div>
          <div className="flex flex-row justify-between items-center w-[90%] pt-5">
            <div className="p-5 border border-gray-400 rounded-xl flex flex-row gap-3 justify-center items-center">
              <img src="/images/total_balance.svg" />
              <div className="flex flex-col gap-2 pr-2">
                <p className="text-sm text-white-200">Total Balance</p>
                <div>
                  <Price
                    price={selectedUser.getTotalBalance().toFixed(2)}
                    styles={"absolute -right-5 -top-1 w-4"}
                    textStyles={"text-3xl font-light"}
                    type={true}
                  />
                </div>
              </div>
            </div>
            <div className="p-5 border border-gray-400 rounded-xl flex flex-row gap-3 justify-center items-center">
              <img src="/images/profit_made.svg" />
              <div className="flex flex-col gap-2 pr-2">
                <p className="text-sm text-white-200">Profit Made</p>
                <div>
                  <Price
                    price={selectedUser.total_profit.toFixed(2)}
                    styles={"absolute -right-5 -top-1 w-4"}
                    textStyles={"text-3xl font-light"}
                    type={true}
                  />
                </div>
              </div>
            </div>
            <div className="p-5 border border-gray-400 rounded-xl flex flex-row gap-3 justify-center items-center">
              <img src="/images/stocks_owned.svg" />
              <div className="flex flex-col gap-2 pr-2">
                <p className="text-sm text-white-200">Value of Stocks Owned</p>
                <div>
                  <Price
                    price={selectedUser.stock_balance.toFixed(2)}
                    styles={"absolute -right-5 -top-1 w-4"}
                    textStyles={"text-3xl font-light"}
                    type={true}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="p-5 border border-gray-400 rounded-xl flex flex-row gap-3 justify-between items-center w-[90%]">
            <div className="flex flex-row gap-3 items-center">
              <img
                src="/images/total_money.svg"
                alt="Wallet Balance"
                width={140}
                height={140}
              />
              <div className="flex flex-col gap-2 pr-2 justify-center">
                <p className="text-sm text-white-200">Wallet Balance</p>
                <div>
                  <Price
                    price={selectedUser.wallet_balance.toFixed(2)}
                    styles={"absolute -right-5 -top-1 w-4"}
                    textStyles={"text-3xl font-light"}
                    type={true}
                  />
                </div>
              </div>
            </div>
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3">
                <Loading otherClasses={"w-5 h-5 p-2 mr-22"} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-1">
                <div className="w-[90%] flex items-center justify-center">
                  <FormField
                    type="text"
                    value={addedBalance}
                    onChange={(e) => setAddedBalance(e.target.value)}
                  />
                </div>
                <button
                  className="w-[207px] h-[40px] bg-[#F0F1F3] p-2 rounded-xl text-[#1D1F2C] font-semibold text-sm flex flex-row gap-2 items-center justify-center"
                  onClick={handleAddFunds}
                >
                  <img src="/images/admin/edit_icon.svg" />
                  Add Wallet Balance
                </button>
              </div>
            )}
          </div>
        </Stack>
      </Box>
    </Modal>
  );
};

export default UserProfileModal;
