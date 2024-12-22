import { Box, Button, Modal, Stack } from "@mui/material";
import React, { useState } from "react";
import Loading from "../Loading";
import FormField from "../FormField";
import { companyService } from "../../services/company.service";

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

const AdminAddCompany = ({ open, handleClose, fetchAvailableCompanies }) => {
  const [data, setData] = useState({
    name: "",
    acronym: "",
    establishment_type: "",
    description: "",
    logo: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const isAllDataAvailable = () => {
    if (
      data.name &&
      data.acronym &&
      data.establishment_type &&
      data.description &&
      data.logo
    ) {
      return true;
    }
    return false;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setData((prev) => ({
        ...prev,
        logo: file,
      }));
    }
  };

  const handleValueChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("acronym", data.acronym);
    formData.append("establishment_type", data.establishment_type);
    formData.append("description", data.description);
    formData.append("logo", data.logo);

    try {
      await companyService.addCompany(formData);

      fetchAvailableCompanies();
      setSuccess(true);
    } catch (error) {
      setError(true);
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
      {success ? (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Stack spacing={4} className="flex justify-center items-center">
            <img
              src="/images/admin/add_company_success.svg"
              alt="Add Company Success"
              width={235}
              height={170}
            />
            <div className="flex justify-center items-center flex-col">
              <p className="text-[20px] font-semibold">
                You have successfully submitted your New Company!
              </p>
              <p className="text-[15px] text-white-200 pt-4">
                Please go back to the companies page to view the company you
                just created!
              </p>
            </div>
            <button
              className="w-[138px] h-[56px] bg-purple rounded-xl text-white text-[15px]"
              onClick={handleClose}
            >
              Done
            </button>
          </Stack>
        </Box>
      ) : (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
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
                  src={`/images/admin/add_new_company.svg`}
                  width={24}
                  height={24}
                />
                <h3 className="font-semibold text-xl">Add New Company</h3>
              </div>
            </div>
            <div
              className="flex flex-row items-center text-2xl gap-2 ml-auto"
              onClick={handleClose}
            >
              <img src="/images/admin/close_noborder.svg" alt="close" />
            </div>
          </div>
          <Stack spacing={4} className="flex items-center justify-center">
            <Button
              component="label"
              sx={{
                borderRadius: "100px",
                bgcolor: "#F7F7F7",
                boxShadow: "none",
                width: "120px",
                height: "120px",
                display: "relative",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid grey",
              }}
            >
              {data.logo ? (
                <img
                  src={URL.createObjectURL(data.logo)}
                  alt="Preview"
                  style={{
                    objectFit: "fit",
                    borderRadius: "100px",
                  }}
                />
              ) : (
                <img
                  src={`/images/admin/add_new_company_black.svg`}
                  alt="Upload Placeholder"
                />
              )}
              <VisuallyHiddenInput type="file" onChange={handleFileChange} />
              <img
                src="/images/admin/image_edit.svg"
                alt="Image Upload"
                className="absolute -right-1 -bottom-1"
              />
            </Button>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Company Name"
                value={data.name}
                onChange={handleValueChange}
                className="w-full bg-white-100 pl-5 p-3 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple border-[1px] border-grey"
              />
              <input
                type="text"
                name="acronym"
                placeholder="Company Acronym"
                value={data.acronym}
                onChange={handleValueChange}
                className="w-full bg-white-100 pl-5 p-3 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple border-[1px] border-grey"
              />
              <input
                type="text"
                name="establishment_type"
                placeholder="Establishment Type"
                value={data.establishment_type}
                onChange={handleValueChange}
                className="w-full bg-white-100 pl-5 p-3 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple border-[1px] border-grey"
              />
              <textarea
                type="text"
                name="description"
                placeholder="Company Description"
                value={data.description}
                onChange={handleValueChange}
                className="w-full h-full bg-white-100 pl-5 p-3 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple overflow-auto border-[1px] border-grey"
              />
              <div className="flex flex-row items-center gap-3">
                <img src="/images/admin/image_upload_flag.svg" />
                <p className="text-white-200 text-[13px] tracking-wider leading-5">
                  *Note: Company info will be visible from the company profile
                  in the trading app.
                </p>
              </div>
              <div className="flex flex-row gap-5 justify-end items-center">
                {error && (
                  <p className="text-sm text-red-500">Invalid Company data</p>
                )}
                <button
                  type="submit"
                  className={`text-sm flex justify-center items-center px-10 py-3 rounded-full focus:outline-none focus:ring-2 tracking-wider float-end ${
                    isAllDataAvailable()
                      ? "bg-purple text-white"
                      : "bg-purple-300 text-white cursor-not-allowed"
                  }`}
                  disabled={!isAllDataAvailable || loading}
                >
                  {loading ? (
                    <Loading
                      otherClasses={"w-4 h-4 border-[3px] border-white"}
                    />
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </Stack>
        </Box>
      )}
    </Modal>
  );
};

export default AdminAddCompany;
