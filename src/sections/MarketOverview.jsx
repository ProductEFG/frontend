import React, { useCallback, useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import FormField from "../components/FormField.jsx";
import { companyService } from "../services/company.service";

import MetricsList from "../components/MetricsList.jsx";
import CompanyList from "../components/CompanyList.jsx";
import CompanyDetailsModal from "../components/CompanyDetailsModal.jsx";
import { useAuth } from "../providers/AuthProvider.jsx";

const MarketOverview = ({ balance }) => {
  const { user } = useAuth();

  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [filteredcompanies, setFilteredcompanies] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [companiesLoading, setCompaniesLoading] = useState(false);

  const [open, setOpen] = useState(false);
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

  const fetchAvailableCompanies = async () => {
    try {
      setCompaniesLoading(true);

      const companies = await companyService.getCompanies(balance);
      setAvailableCompanies(companies);
      setFilteredcompanies(companies);

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
  }, [user]);

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
    <section className="min-h-[70vh] pt-10">
      <Stack direction={{ md: "column", lg: "row" }} spacing={0}>
        <Stack spacing={2} className="mr-5 md:w-[51rem] md:h-[10rem]">
          <h3 className="text-xl font-bold">Interesting Metrics</h3>
          <MetricsList handleOpen={handleOpen} />
        </Stack>
        <Stack spacing={2} width={{ md: "100%", lg: "50%" }}>
          <h3 className="text-xl font-bold">Companies You Can Invest In</h3>
          <FormField
            type="text"
            startAdornmentUrl="/images/magnifying_glass.svg"
            placeholder="Search Companies"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            backgroundColor="#FFFFFF"
          />
          <CompanyList
            companiesLoading={companiesLoading}
            filteredcompanies={filteredcompanies}
            handleOpen={handleOpen}
          />
        </Stack>
      </Stack>
      {open && (
        <CompanyDetailsModal
          open={open}
          handleClose={handleClose}
          company={openedCompany}
        />
      )}
    </section>
  );
};

export default MarketOverview;
