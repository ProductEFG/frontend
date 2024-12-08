import { Box, Button, LinearProgress, Modal, Stack } from "@mui/material";
import React, { useState } from "react";
import Loading from "../Loading";
import ExcelJS from "exceljs";
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

const AdminUploadVisitors = ({
  open,
  handleClose,
  fetchAvailableCompanies,
}) => {
  const [sheet, setSheet] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (event) => {
    setLoading(true);
    const file = event.target.files[0];

    try {
      if (!file) {
        throw new Error("No file selected.");
      }

      const validExtensions = ["xlsx"];
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (!validExtensions.includes(fileExtension)) {
        throw new Error(
          "Unsupported file type. Please upload a valid spreadsheet."
        );
      }

      // Read the file as an ArrayBuffer
      const buffer = await file.arrayBuffer();

      // Load the file into ExcelJS
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);

      // Access the first worksheet
      const worksheet = workbook.getWorksheet(1);
      if (!worksheet) {
        throw new Error("Worksheet not found. Please check the file content.");
      }

      const processedData = {};

      // Iterate through the rows
      worksheet.eachRow((row, rowIndex) => {
        if (rowIndex === 1) {
          return;
        }

        const establishment = row.getCell(1).value; // Column A
        const visitors = row.getCell(2).value; // Column B

        if (establishment && !isNaN(visitors)) {
          processedData[establishment] = parseInt(visitors, 10);
        }
      });

      setProcessedData(processedData);
      setSheet(file);
      setError("");
    } catch (error) {
      setSheet(null);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (e) => {
    setComment(e.target.value);
  };

  const handleUpload = async (e) => {
    setUploading(true);
    e.preventDefault();
    try {
      await companyService.updateVisitors(processedData);

      fetchAvailableCompanies();
      setSuccess(true);
    } catch (error) {
      setError(true);
    } finally {
      setUploading(false);
      handleClose();
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
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 580,
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
                src={`/images/admin/document_upload.svg`}
                width={32}
                height={32}
              />
              <h3 className="font-semibold text-[24px]">
                Upload Visitors Sheet
              </h3>
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
          <form onSubmit={handleUpload} className="space-y-6">
            {uploading ? (
              <div className="text-xl font-semibold text-purple-500 space-y-3">
                <p>Uploading ...</p>
                <LinearProgress color="secondary" />
              </div>
            ) : (
              <div className="space-y-6">
                <Button
                  component="label"
                  sx={{
                    borderRadius: "10px",
                    bgcolor: "#EFECFE",
                    width: "538px",
                    height: "64px",
                    display: "relative",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "2px dashed #6143F0",
                  }}
                >
                  {sheet ? (
                    <div>{sheet.name}</div>
                  ) : (
                    <div className="flex flex-row justify-center items-center gap-2">
                      <img src="/images/admin/upload_square.svg" />
                      <p className="text-sm text-purple">Attach a file</p>
                    </div>
                  )}
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleFileChange}
                  />
                </Button>
                <textarea
                  type="text"
                  name="comment"
                  placeholder="Write any comments here"
                  value={comment}
                  onChange={handleValueChange}
                  className="w-[530px] h-[112px] bg-white-100 p-5 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple overflow-auto border-[1px] border-grey"
                />
              </div>
            )}
            <div className="flex flex-row items-center gap-3">
              <img src="/images/admin/image_upload_flag.svg" />
              <p className="text-white-200 text-[13px] tracking-wider leading-5">
                *Note: Uploading the visitors sheet changes the establishment
                visitors & share price for each company
              </p>
            </div>
            <div className="flex flex-row gap-5 justify-end items-center">
              {error.length > 0 && (
                <p className="text-sm text-red-500">{error}</p>
              )}
              <button
                type="submit"
                className={`flex justify-center items-center w-[136px] h-[56px] px-5 py-3 rounded-full focus:outline-none focus:ring-2 tracking-wider float-end ${
                  !(loading || uploading || !sheet)
                    ? "bg-purple text-white"
                    : "bg-purple-300 text-white cursor-not-allowed"
                }`}
                disabled={loading || uploading || !sheet}
              >
                {loading ? (
                  <Loading otherClasses={"w-4 h-4 border-[3px] border-white"} />
                ) : (
                  "Upload"
                )}
              </button>
            </div>
          </form>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AdminUploadVisitors;
