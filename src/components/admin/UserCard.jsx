import { Stack } from "@mui/material";
import React, { useState } from "react";
import Button from "../Button";
import Price from "../Price";
import UserProfileModal from "./UserProfileModal";

const UserCard = ({ user }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleClose = () => {
    setSelectedUser(null);
  };
  return (
    <div className="border p-4 rounded-xl shadow-md cursor-pointer min-w-[242px] max-w-[242px]">
      <Stack
        direction={"column"}
        spacing={1}
        className="flex justify-center items-center"
      >
        <div className="rounded-full bg-gray-100 p-4 w-[7rem] h-[7rem]">
          <img
            src={`/images/avatars/${user.avatar}.svg`}
            className="rounded-full bg-[#D88EA9] max-w-[100%] max-h-[100%]"
          />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-black text-xl pb-1">
            {user.getFullName()}
          </h3>
          <p className="text-lg text-white-300">
            Joined {user.getCreatedDate()}
          </p>
        </div>

        <div className="flex flex-row items-center gap-2 justify-center">
          <p className=" text-purple font-bold text-sm">Current Portfolio:</p>
          <Price
            price={user.getTotalBalance().toFixed(2)}
            styles={"absolute -right-2.5 top-0 w-2.5"}
            textStyles={"text-sm"}
          />
        </div>
        <Button
          name="View Profile"
          otherClasses="bg-purple text-white w-full tracking-widest"
          onClick={() => setSelectedUser(user)}
        />
      </Stack>
      {selectedUser && (
        <UserProfileModal
          open={selectedUser ? true : false}
          handleClose={handleClose}
          selectedUser={selectedUser}
        />
      )}
    </div>
  );
};

export default UserCard;
