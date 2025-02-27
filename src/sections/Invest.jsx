import React, { useCallback, useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import FormField from "../components/FormField.jsx";
import { companyService } from "../services/company.service";

import MetricsList from "../components/MetricsList.jsx";
import CompanyList from "../components/CompanyList.jsx";
import CompanyDetailsModal from "../components/CompanyDetailsModal.jsx";
import { useAuth } from "../providers/AuthProvider.jsx";
import CompanyCard from "@/components/CompanyCard.jsx";
import { useGlobal } from "@/providers/GlobalProvider.jsx";
import Loading from "@/components/Loading.jsx";

const Invest = () => {
  const { user } = useAuth();
  const { openedCompany, setOpenedCompany, setCompanyBought } = useGlobal();

  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);

  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    if (!!openedCompany) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [openedCompany]);

  const fetchAvailableCompanies = async () => {
    try {
      setCompaniesLoading(true);

      const companies = await companyService.getCompanies(10000000);

      // Sort companies alphabetically by their name
      const sortedCompanies = companies.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setAvailableCompanies(sortedCompanies);
    } catch (error) {
      console.log(error.message);
    } finally {
      setCompaniesLoading(false);
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

  if (companiesLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-300px)]">
        <Loading otherClasses="w-5 h-5 border-purple" />
      </div>
    );
  }

  return (
    <section className="relative bg-white rounded-[31px] pt-[21px] pr-[29px]">
      <div className="pl-[36px] pr-[32px] grid grid-cols-4 gap-[28px] pb-[21px] h-[calc(100vh-290px)] overflow-y-scroll custom-scrollbar">
        {availableCompanies.length > 0 ? (
          availableCompanies.map((company) => (
            <CompanyCard
              key={company._id}
              company={company}
              handleOpen={() => handleOpen(company)}
            />
          ))
        ) : (
          <div className="flex justify-center items-center h-[24rem] w-full">
            <p className="text-xl">No companies available.</p>
          </div>
        )}
      </div>
      {open && (
        <CompanyDetailsModal
          open={open}
          handleClose={handleClose}
          company={openedCompany}
          setCompanyBought={setCompanyBought}
        />
      )}
    </section>
  );
};

export default Invest;
