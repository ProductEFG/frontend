import { Stack } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import FormField from "../../components/FormField";
import CompanyList from "../../components/CompanyList";
import { companyService } from "../../services/company.service";
import AdminCompanyDetailsModal from "../../components/admin/AdminCompanyDetailsModal";
import AdminAddCompany from "../../components/admin/AdminAddCompany";
import AdminUploadVisitors from "../../components/admin/AdminUploadVisitors";

const AdminCompanies = () => {
  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [filteredcompanies, setFilteredcompanies] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [companiesLoading, setCompaniesLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [openedCompany, setOpenedCompany] = useState(null);

  const handleOpen = useCallback(
    async (company) => {
      if (openedCompany !== company) {
        setOpenedCompany(company);
        setOpen(true);
      }
    },
    [openedCompany]
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    setOpenedCompany(null);
  }, []);

  const handleAddClose = useCallback(() => {
    setOpenAdd(false);
  }, []);

  const handleUploadClose = useCallback(() => {
    setOpenUpload(false);
  }, []);

  const fetchAvailableCompanies = async () => {
    try {
      setCompaniesLoading(true);

      const companies = await companyService.getCompanies(1000000);

      // Sort companies alphabetically by their name
      const sortedCompanies = companies.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setAvailableCompanies(sortedCompanies);
      setFilteredcompanies(sortedCompanies);

      setCompaniesLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetchAvailableCompanies();

    return () => {
      setAvailableCompanies([]);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const newCompanies = availableCompanies.filter(
      (company) =>
        company.name.toLowerCase().includes(searchText.toLowerCase()) ||
        company.acronym.toLowerCase().includes(searchText.toLowerCase())
    );

    setFilteredcompanies(newCompanies);

    return () => {};
  }, [searchText]);
  return (
    <div className="container h-[50vh]">
      <Stack spacing={2}>
        <h3 className="text-2xl font-bold">All Companies</h3>
        <div className="flex flex-row justify-between items-center gap-5">
          <div className="w-[40%]">
            <FormField
              type="text"
              startAdornmentUrl="/images/magnifying_glass.svg"
              placeholder="Search Companies"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              backgroundColor="#FFFFFF"
            />
          </div>
          <div className="flex flex-row justify-end items-center gap-2">
            <button
              className="bg-purple rounded-3xl text-white flex flex-row justify-center items-center gap-2 p-3 pr-5 pl-5"
              onClick={() => setOpenAdd(true)}
            >
              <img src="/images/admin/add_company.svg" alt="Add New Company" />{" "}
              Add New Company
            </button>
            <button
              className="bg-[#31CFCB] rounded-3xl text-white flex flex-row justify-center items-center gap-2 p-3 pr-5 pl-5"
              onClick={() => setOpenUpload(true)}
            >
              <img
                src="/images/admin/upload_company.svg"
                alt="Add New Company"
              />{" "}
              Upload Company Data
            </button>
          </div>
        </div>
        <CompanyList
          companiesLoading={companiesLoading}
          filteredcompanies={filteredcompanies}
          handleOpen={handleOpen}
        />
      </Stack>
      {open && (
        <AdminCompanyDetailsModal
          open={open}
          handleClose={handleClose}
          company={openedCompany}
          fetchAvailableCompanies={fetchAvailableCompanies}
        />
      )}
      {openAdd && (
        <AdminAddCompany
          open={openAdd}
          handleClose={handleAddClose}
          fetchAvailableCompanies={fetchAvailableCompanies}
        />
      )}
      {openUpload && (
        <AdminUploadVisitors
          open={openUpload}
          handleClose={handleUploadClose}
          fetchAvailableCompanies={fetchAvailableCompanies}
        />
      )}
    </div>
  );
};

export default AdminCompanies;
