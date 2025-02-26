import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "../components/Button.jsx";
import { useGlobal } from "@/providers/GlobalProvider.jsx";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 586,
  height: 477,
  bgcolor: "white",
  borderRadius: "20px",
  p: 4,
};

const SuccessfulWithdrawModal = ({ open, handleClose, handleNavigate }) => {
  const { enabledTabs } = useGlobal();
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="flex justify-center items-center gap-y-7 flex-col">
          <img
            src="/images/successful_withdraw.svg"
            alt="Successful Withdraw"
          />
          <div className="flex flex-col gap-3 justify-center items-center">
            <h3 className="text-[18px] tracking-wider">
              Your withdrawal is Completed!
            </h3>
            <p className="text-center text-[#BDC1C6] tracking-wider">
              We have completed your withdrawal. You can now collect it from
              kidzania_area
            </p>
          </div>
          <div className="flex flex-row gap-5">
            <Button
              name="Back to Portfolio"
              onClick={(e) => {
                const moveNumber = 3 - enabledTabs;
                handleNavigate(true, moveNumber);
              }}
              otherClasses="bg-white border border-[1px] border-purple text-purple w-[260px] h-[46px]"
            />
            <Button
              name="Check Leaderboard"
              onClick={() => {
                const moveNumber = 6 - enabledTabs;
                handleNavigate(true, moveNumber);
              }}
              otherClasses="bg-purple text-white w-[260px] h-[46px]"
            />
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default SuccessfulWithdrawModal;
