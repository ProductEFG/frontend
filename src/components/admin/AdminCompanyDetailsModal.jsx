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
          company._id
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
      }
    };

    const handleDelete = async () => {
      try {
        await companyService.deleteCompany(company._id);

        fetchAvailableCompanies();
        handleClose();
      } catch (error) {
        console.error("Error deleting company:", error.response?.data);
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
            transform: "translate(-50%, -50%)",
            width: 1200,
            bgcolor: "white",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <div className="flex flex-row mb-10">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-4 justify-center items-center">
                <img
                  src={`${backendUrl}/images/logos/${company.logo}`}
                  width={53}
                  height={53}
                />
                <h3 className="font-semibold text-[32px]"> {company.name}</h3>
              </div>
            </div>
            <div
              className="flex flex-row items-center text-2xl gap-2 ml-auto"
              onClick={handleClose}
            >
              Close <img src="/images/close.svg" alt="close" />
            </div>
          </div>
          <div className="flex flex-row justify-end items-center w-full gap-5 pb-4 tracking-wider">
            <button
              className="w-[173px] h-[40px] bg-[#FEECEE] p-2 rounded-xl text-[#EB3D4D] font-semibold text-sm flex flex-row gap-2 items-center justify-center"
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
                className="w-[141px] h-[40px] bg-[#31CFCB] p-2 rounded-xl text-white text-sm flex flex-row gap-2 items-center justify-center"
                onClick={handleEdit}
              >
                <img src="/images/admin/editing_icon.svg" />
                Save Details
              </button>
            ) : (
              <button
                className="w-[207px] h-[40px] bg-[#F0F1F3] p-2 rounded-xl text-[#1D1F2C] font-semibold text-sm flex flex-row gap-2 items-center justify-center"
                onClick={() => setEditing(true)}
              >
                <img src="/images/admin/edit_icon.svg" />
                Edit Company Details
              </button>
            )}
          </div>
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
                    <img src={`${backendUrl}/images/logos/${company.logo}`} />
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
                <div className="pt-8 flex flex-row items-center gap-3">
                  <img src="/images/admin/image_upload_flag.svg" />
                  <p className="text-white-200 text-sm w-[300px] tracking-wider leading-6">
                    *Note: If you want to update the number of establishment
                    visitors of this company, please do it from the companies
                    page by clicking the “Upload Visitors Sheet” button.
                  </p>
                </div>
              </div>
              <Stack spacing={2} className="flex justify-center items-center">
                {/* Company Name */}
                <input
                  name="name"
                  value={companyInfo.name}
                  onChange={handleValueChange}
                  placeholder="Enter company name"
                  className="w-[583px] h-[62px] p-5 border bg-white-100 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple"
                />
                {/* Company acronym */}
                <input
                  name="acronym"
                  value={companyInfo.acronym}
                  onChange={handleValueChange}
                  placeholder="Enter company acronym"
                  className="w-[583px] h-[62px] p-5 border bg-white-100 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple"
                />
                {/* Company establishment type */}
                <input
                  name="establishment_type"
                  value={companyInfo.establishment_type}
                  onChange={handleValueChange}
                  placeholder="Enter establishment type"
                  className="w-[583px] h-[62px] p-5 border bg-white-100 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple"
                />

                {/* Company Description */}
                <textarea
                  name="description"
                  value={companyInfo.description}
                  onChange={handleValueChange}
                  placeholder="Enter company description"
                  rows="6"
                  className="w-[583px] h-[200px] p-5 border bg-white-100 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple"
                />
                {deleting && (
                  <div className="w-[583px] flex flex-col gap-2">
                    <p className="text-sm font-semibold">
                      You are about to delete {company.name} as company in the
                      Kidzania trading app. Are you sure you want to do this?{" "}
                    </p>
                    <div className="flex justify-end items-center gap-5 p-5">
                      <button
                        className="w-[78px] h-[40px] bg-[#31CFCB] rounded-xl text-white text-sm tracking-wider flex flex-row justify-center items-center gap-1"
                        onClick={handleDelete}
                      >
                        <img src="/images/admin/yes.svg" alt="Yes" />
                        Yes
                      </button>
                      <button
                        className="w-[78px] h-[40px] bg-[#FEECEE] rounded-xl text-[#EB3D4D] text-sm tracking-wider flex flex-row justify-center items-center gap-1"
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
            <Stack direction={"row"} spacing={5}>
              <div className="relative border border-white-200 rounded-2xl bg-white w-[790px] h-[535px] p-4">
                <DataChart history={companyHistory} />
              </div>
              <Stack spacing={5} className="flex justify-center items-center">
                <div className="relative border border-white-200 rounded-2xl bg-white w-[330px] h-[240px] p-3">
                  {company && company.description}
                </div>

                <div className="relative border border-white-200 rounded-2xl bg-white w-[330px] h-[240px] p-3">
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
                    />
                    <p className="font-semibold text-5xl">
                      <animated.span>
                        {visitorsCount.to((val) =>
                          Math.floor(val).toLocaleString()
                        )}
                      </animated.span>
                    </p>
                    <p className="text-2xl text-white-200">
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
