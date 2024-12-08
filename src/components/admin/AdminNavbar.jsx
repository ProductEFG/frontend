import React, { useState } from "react";
import { Avatar } from "@mui/material";
import { useAuth } from "../../providers/AuthProvider";
import FormField from "../FormField";
import { useNavigate } from "react-router";

const AdminNavbar = () => {
  const { admin, setAdmin, backendUrl } = useAuth();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [logoutClicked, setLogoutClicked] = useState(false);

  const logoutHandle = async () => {
    sessionStorage.removeItem("admintoken");
    await setAdmin(null);
    navigate("/admin/login");
  };
  return (
    <div className="flex flex-row items-center h-24 bg-white w-screen overflow-hidden justify-between p-5">
      <div className="flex flex-row items-center gap-5">
        <img src="/images/main_logos.jpg" />
        {/* <div className="w-[600px]">
          <FormField
            type="text"
            startAdornmentUrl="/images/magnifying_glass.svg"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div> */}
      </div>
      {admin && (
        <div className="flex flex-row justify-center items-center gap-5">
          <div className="flex flex-row gap-5 justify-center items-center border-r border-r-[#C9C9CC] w-[100px] h-10 pr-10">
            <img
              src="/images/admin/notification.svg"
              alt="Notification"
              width={40}
              height={40}
            />

            <img
              src={`/images/admin/country/${admin.country}.svg`}
              alt="Notification"
              width={40}
              height={40}
            />
          </div>
          <div className="h-16 rounded-full bg-white-100 flex flex-row justify-between items-center w-[100%] p-3">
            <div className="flex flex-row justify-center items-center">
              <div className="rounded-full w-12 h-12 flex justify-center items-center">
                <Avatar
                  alt="avatar"
                  src={`/images/admin/${admin.avatar}.svg`}
                  sx={{ width: 46, height: 46 }}
                />
              </div>

              <div className="m-3 flex flex-col">
                <h6 className="">Hi, {admin.getFullName()}!</h6>
                <p className="text-sm text-white-200">{admin.role}</p>
              </div>
            </div>
            <button onClick={() => setLogoutClicked((prev) => !prev)}>
              {" "}
              <img src="/images/admin/arrow_down.svg" className="mr-1" />
            </button>
          </div>
        </div>
      )}
      {logoutClicked && (
        <button
          className="flex flex-row justify-start items-center gap-3 absolute right-8 top-22 w-[210px] h-[55px] bg-white rounded-xl p-5 shadow-lg z-1"
          onClick={logoutHandle}
        >
          <img src="/images/logout.svg" alt="Logout" />
          <p className="text-[20px] tracking-wider">Logout</p>
        </button>
      )}
    </div>
  );
};

export default AdminNavbar;
