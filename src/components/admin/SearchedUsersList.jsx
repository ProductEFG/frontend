import React, { memo } from "react";
import Loading from "../Loading";
import Grid2 from "@mui/material/Grid2";
import UserEntity from "../../entities/userEntity";
import UserCard from "./UserCard";

const SearchedUsersList = memo(({ searchedUsers }) => {
  return (
    <div>
      {searchedUsers.length <= 0 ? (
        <div className="flex justify-center items-center h-[24rem]">
          No Users Found
        </div>
      ) : (
        <div className="overflow-auto max-h-[70vh]">
          <Grid2 container rowSpacing={2} columnSpacing={2}>
            {searchedUsers.length > 0 &&
              searchedUsers.map((user) => (
                <UserCard key={user._id} user={new UserEntity(user)} />
              ))}
          </Grid2>
        </div>
      )}
    </div>
  );
});
export default SearchedUsersList;
