import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import Loading from "../components/Loading";
import AdminNavbar from "../components/admin/AdminNavbar";
import { Stack } from "@mui/material";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminDashboard from "../sections/admin/AdminDashboard";
import AdminCompanies from "../sections/admin/AdminCompanies";
import AdminUsers from "../sections/admin/AdminUsers";
import AdminTransactions from "../sections/admin/AdminTransactions";

const AdminHome = () => {
  const navigate = useNavigate();
  const { admin } = useAuth();
  const [selectedPage, setSelectedPage] = useState("Dashboard"); // Track the selected page

  useEffect(() => {
    if (!admin) {
      navigate("/admin/login");
    }
  }, [navigate, admin]);

  if (!admin) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Loading otherClasses={"w-10 h-10"} />
      </div>
    );
  }

  const handlePageChange = (page) => {
    setSelectedPage(page);
  };

  let content;
  switch (selectedPage) {
    case "Companies":
      content = <AdminCompanies />;
      break;
    case "Users":
      content = <AdminUsers />;
      break;
    case "Transactions":
      content = <AdminTransactions />;
      break;
    default:
      content = <AdminCompanies />;
  }

  return (
    <section className="overflow-hidden max-h-[100vh]">
      <AdminNavbar />
      <Stack direction={"row"}>
        <AdminSidebar onPageChange={handlePageChange} />
        <div className="flex-1 p-5">{content}</div>
      </Stack>
    </section>
  );
};

export default AdminHome;
