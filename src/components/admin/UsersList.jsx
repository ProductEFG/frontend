import React, { memo, useEffect, useState, useRef } from "react";
import Loading from "../../components/Loading";
import Grid2 from "@mui/material/Grid2";
import { userService } from "../../services/user.service";
import { Stack } from "@mui/material";
import UserEntity from "../../entities/userEntity";
import Price from "../Price";
import Button from "../Button";
import UserCard from "./UserCard";

const UsersList = memo(({ handleOpen }) => {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [lastElement, setLastElement] = useState(null);

  const observer = useRef(
    new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        setPage((no) => no + 1);
      }
    })
  );

  const fetchUsers = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await userService.getUsers(page, "");
      const newUsers = response.users;

      setUsers((prevUsers) => [...prevUsers, ...newUsers]);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page <= totalPages) {
      fetchUsers();
    }
  }, [page]);

  useEffect(() => {
    const currentElement = lastElement;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [lastElement]);

  return (
    <div>
      {loading && page === 1 ? (
        <div className="flex justify-center items-center h-[24rem]">
          <Loading otherClasses={"w-7 h-7"} />
        </div>
      ) : (
        <div className="overflow-auto max-h-[70vh]">
          <Grid2 container rowSpacing={2} columnSpacing={2}>
            {users.length > 0 &&
              users.map((user, i) => {
                return i === users.length - 1 &&
                  !loading &&
                  page <= totalPages ? (
                  <div key={user._id} ref={setLastElement}>
                    <UserCard user={new UserEntity(user)} />;
                  </div>
                ) : (
                  <UserCard key={user._id} user={new UserEntity(user)} />
                );
              })}
          </Grid2>
        </div>
      )}
      {loading && <p className="text-center">loading...</p>}
    </div>
  );
});
export default UsersList;
