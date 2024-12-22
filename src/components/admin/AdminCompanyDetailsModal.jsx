import React, { memo, useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { useSpring, animated } from "@react-spring/web";

import Box from "@mui/material/Box";
import { Stack } from "@mui/material";
import { stocksHistoryService } from "../../services/stocksHistory.service";
import Loading from "../Loading";
import DataChart from "../DataChart";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useAuth } from "../../providers/AuthProvider";
import { companyService } from "../../services/company.service";

const AdminCompanyDetailsModal = memo(
  ({ open, handleClose, company, fetchAvailableCompanies }) => {
    const { backendUrl } = useAuth();

    const [companyHistory, setCompanyHistory] = useState([]);
    const [monthlyVisitors, setMonthlyVisitors] = useState(0);
    const [loading, setLoading] = useState(false);

    const [companyInfo, setCompanyInfo] = useState({
      name: company.name,
      acronym: company.acronym,
      establishment_type: company.establishment_type,
      description: company.description,
      image: null,
    });
    const [preview, setPreview] = useState(null);
    const [editing, setEditing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [operationLoading, setOperationLoading] = useState(false);
    const [error, setError] = useState("");

    // Animated spring for monthlyVisitors
    const { visitorsCount } = useSpring({
      from: { visitorsCount: 0 },
      visitorsCount: monthlyVisitors,
      config: { duration: 1000 }, // Adjust duration as needed
      reset: monthlyVisitors === 0,
    });

    const fetchCompanyHistory = async () => {
      try {
        setLoading(true);

        const history = await stocksHistoryService.getCompanyHistory(
          company._id,
          365
        );
        setCompanyHistory(history);

        if (history.length > 0) {
          const totalMonthlyVisitors = history.reduce((total, entry) => {
            const entryDate = new Date(entry.date);
            const currentDate = new Date();

            if (
              entryDate.getMonth() === currentDate.getMonth() &&
              entryDate.getFullYear() === currentDate.getFullYear()
            ) {
              return total + entry.visitors;
            }
            return total;
          }, 0);

          setMonthlyVisitors(totalMonthlyVisitors);
        }

        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };

    useEffect(() => {
      const controller = new AbortController();
      const signal = controller.signal;

      company && fetchCompanyHistory();

      return () => {
        setCompanyHistory([]);
        setMonthlyVisitors(0);
        controller.abort();
      };
    }, [company]);

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setCompanyInfo((prev) => ({
          ...prev,
          image: file,
        }));
        setPreview(URL.createObjectURL(file));
      }
    };

    const handleValueChange = (e) => {
      const { name, value } = e.target;
      setCompanyInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleEdit = async () => {
      setOperationLoading(true);
      const formData = new FormData();

      formData.append("companyId", company._id);
      formData.append("name", companyInfo.name || "");
      formData.append("description", companyInfo.description || "");
      formData.append("acronym", companyInfo.acronym || "");
      formData.append(
        "establishment_type",
        companyInfo.establishment_type || ""
      );

      if (companyInfo.image) {
        formData.append("logo", companyInfo.image);
      }

      try {
        await companyService.updateCompany(formData);

        fetchAvailableCompanies();
        handleClose();
      } catch (error) {
        console.error("Error updating company:", error.response?.data);
        setError(
          "Failed to Update company, please contact the admins for support"
        );
      } finally {
        setOperationLoading(false);
      }
    };

    const handleDelete = async () => {
      setOperationLoading(true);
      try {
        await companyService.deleteCompany(company._id);

        fetchAvailableCompanies();
        handleClose();
      } catch (error) {
        console.error("Error deleting company:", error.response?.data);
        setError(
          "Failed to Delete company, please contact the admins for support"
        );
      } finally {
        setOperationLoading(false);
      }
    };

    const VisuallyHiddenInput = ({ ...props }) => (
      <input
        {...props}
        style={{
          position: "absolute",
          opacity: 0,
          width: 0,
          height: 0,
        }}
      />
    );

    if (loading) {
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
              width: 1200,
              bgcolor: "white",
              borderRadius: "10px",
              boxShadow: 24,
              p: 4,
            }}
          >
            <div className="flex justify-center items-center h-[24rem]">
              <Loading otherClasses={"w-7 h-7"} />
            </div>
          </Box>
        </Modal>
      );
    }

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
            width: "80%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <div className="flex flex-row mb-6">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-4 justify-center items-center">
                <img src={`${company.logo}`} width={40} height={40} />
                <h3 className="font-semibold text-2xl"> {company.name}</h3>
              </div>
            </div>
            <div
              className="flex flex-row items-center text-xl gap-2 ml-auto"
              onClick={handleClose}
            >
              Close <img src="/images/close.svg" alt="close" className="w-6" />
            </div>
          </div>
          {operationLoading ? (
            <div className="flex justify-end items-center pb-4 pr-[12%]">
              <Loading otherClasses={"w-5 h-5"} />
            </div>
          ) : (
            <div className="flex flex-row justify-end items-center w-full gap-5 pb-4 tracking-wider">
              {error.length > 0 && (
                <p className="text-red-500 font-semibold p-2 text-xs">
                  {error}
                </p>
              )}
              <button
                className="bg-[#FEECEE] p-2 pr-4 pl-4 rounded-xl text-[#EB3D4D] font-semibold text-xs flex flex-row gap-2 items-center justify-center"
                onClick={() => {
                  setEditing(true);
                  setDeleting(true);
                }}
              >
                <img src="/images/admin/delete_icon.svg" />
                Delete Company
              </button>
              {editing ? (
                <button
                  className="bg-[#31CFCB] p-2 pr-4 pl-4 rounded-xl text-white text-xs flex flex-row gap-2 items-center justify-center"
                  onClick={handleEdit}
                >
                  <img src="/images/admin/editing_icon.svg" />
                  Save Details
                </button>
              ) : (
                <button
                  className="bg-[#F0F1F3] p-2 pr-4 pl-4 rounded-xl text-[#1D1F2C] font-semibold text-xs flex flex-row gap-2 items-center justify-center"
                  onClick={() => setEditing(true)}
                >
                  <img src="/images/admin/edit_icon.svg" />
                  Edit Company Details
                </button>
              )}
            </div>
          )}
          {/* General Company Info  VS Editing Mode*/}
          {editing ? (
            <Stack direction={"row"} spacing={5}>
              <div className="flex flex-col items-center gap-4 w-[50%]">
                <Button
                  component="label"
                  variant="contained"
                  sx={{
                    borderRadius: "100px",
                    bgcolor: "#F7F7F7",
                    boxShadow: "none",
                    width: "130px",
                    height: "130px",
                    display: "relative",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      style={{
                        objectFit: "fit",
                        borderRadius: "100px",
                      }}
                    />
                  ) : (
                    <img src={`${company.logo}`} />
                  )}
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleFileChange}
                  />
                  <img
                    src="/images/admin/image_edit.svg"
                    alt="Image Upload"
                    className="absolute right-0 bottom-0"
                  />
                </Button>
                <div className="pt-8 flex flex-row items-center gap-3 w-full">
                  <img src="/images/admin/image_upload_flag.svg" />
                  <p className="text-white-200 text-xs tracking-wider leading-6">
                    *Note: If you want to update the number of establishment
                    visitors of this company, please do it from the companies
                    page by clicking the “Upload Visitors Sheet” button.
                  </p>
                </div>
              </div>
              <Stack
                spacing={2}
                className="flex justify-center items-center w-[50%]"
              >
                {/* Company Name */}
                <input
                  name="name"
                  value={companyInfo.name}
                  onChange={handleValueChange}
                  placeholder="Enter company name"
                  className="w-full p-5 border bg-white-100 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple"
                />
                {/* Company acronym */}
                <input
                  name="acronym"
                  value={companyInfo.acronym}
                  onChange={handleValueChange}
                  placeholder="Enter company acronym"
                  className="w-full p-5 border bg-white-100 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple"
                />
                {/* Company establishment type */}
                <input
                  name="establishment_type"
                  value={companyInfo.establishment_type}
                  onChange={handleValueChange}
                  placeholder="Enter establishment type"
                  className="w-full p-5 border bg-white-100 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple"
                />

                {/* Company Description */}
                <textarea
                  name="description"
                  value={companyInfo.description}
                  onChange={handleValueChange}
                  placeholder="Enter company description"
                  rows="6"
                  className="w-full h-full p-5 border bg-white-100 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple"
                />
                {deleting && !operationLoading && (
                  <div className="w-full flex flex-col gap-5">
                    <p className="text-sm font-semibold">
                      You are about to delete {company.name} as company in the
                      Kidzania trading app. Are you sure you want to do this?{" "}
                    </p>
                    <div className="flex justify-end items-center gap-5">
                      <button
                        className="bg-[#31CFCB] rounded-xl text-white text-sm tracking-wider flex flex-row justify-center items-center gap-1 p-2 pr-4 pl-4"
                        onClick={handleDelete}
                      >
                        <img src="/images/admin/yes.svg" alt="Yes" />
                        Yes
                      </button>
                      <button
                        className="bg-[#FEECEE] rounded-xl text-[#EB3D4D] text-sm tracking-wider flex flex-row justify-center items-center gap-1 p-2 pr-4 pl-4"
                        onClick={() => setDeleting(false)}
                      >
                        <img src="/images/admin/close_square.svg" alt="Yes" />
                        No
                      </button>
                    </div>
                  </div>
                )}
              </Stack>
            </Stack>
          ) : (
            <Stack direction={"row"} spacing={2}>
              <div className="relative border border-white-200 rounded-2xl bg-white p-4 w-[70%]">
                <DataChart history={companyHistory} />
              </div>
              <Stack
                spacing={2}
                className="flex justify-center items-center w-[30%]"
              >
                <div className="relative border border-white-200 rounded-2xl bg-white w-[280px] h-[240px] p-3 overflow-hidden overflow-y-auto text-sm">
                  {company && company.description}
                </div>

                <div className="relative border border-white-200 rounded-2xl bg-white p-8">
                  <Stack
                    spacing={2}
                    textAlign={"center"}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <img
                      src="/images/monthly_visitors.svg"
                      alt="Monthly Visitors Icon"
                      className="w-20"
                    />
                    <p className="font-semibold text-4xl">
                      <animated.span>
                        {visitorsCount.to((val) =>
                          Math.floor(val).toLocaleString()
                        )}
                      </animated.span>
                    </p>
                    <p className="text-xl text-white-200">
                      Total Monthly Visitors
                    </p>
                  </Stack>
                </div>
              </Stack>
            </Stack>
          )}
        </Box>
      </Modal>
    );
  }
);

export default AdminCompanyDetailsModal;
