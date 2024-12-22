import { Stack } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import FormField from "../../components/FormField";
import UsersList from "../../components/admin/UsersList";
import { userService } from "../../services/user.service";
import { debounce } from "lodash";
import SearchedUsersList from "../../components/admin/SearchedUsersList";

const AdminUsers = () => {
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [usersLoading, setUsersLoading] = useState(false);

  const fetchSearchUsers = useCallback(
    debounce(async () => {
      try {
        setUsersLoading(true);

        const users = await userService.getUsers(1, searchText);
        setSearchUsers(users.users);
      } catch (error) {
        console.log(error.message);
      } finally {
        setUsersLoading(false);
      }
    }, 500),
    [searchText]
  );

  useEffect(() => {
    if (searchText.length > 0) {
      fetchSearchUsers();
    } else {
      setSearchUsers([]);
    }

    return () => {
      fetchSearchUsers.cancel();
    };
  }, [searchText, fetchSearchUsers]);

  return (
    <div className="w-full h">
      {" "}
      <Stack spacing={1}>
        <h3 className="text-xl font-bold">All Users</h3>
        <div className="flex flex-row justify-between items-center">
          <div className="w-[40%]">
            <FormField
              type="text"
              startAdornmentUrl="/images/magnifying_glass.svg"
              placeholder="Search Users"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              backgroundColor="#FFFFFF"
            />
          </div>
        </div>
        {searchText.length > 0 ? (
          <SearchedUsersList searchedUsers={searchUsers} />
        ) : (
          <UsersList />
        )}
      </Stack>
    </div>
  );
};

export default AdminUsers;
