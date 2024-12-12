import React, { memo } from "react";
import Loading from "../components/Loading";
import Grid2 from "@mui/material/Grid2";
import CompanyCard from "./CompanyCard";
import { useLocation } from "react-router";

const CompanyList = memo(
  ({ companiesLoading, filteredcompanies, handleOpen }) => {
    const location = useLocation();
    const isAdminHome = location.pathname === "/admin/home";
    return (
      <div>
        {companiesLoading ? (
          <div className="flex justify-center items-center h-[24rem]">
            <Loading otherClasses={"w-7 h-7"} />
          </div>
        ) : (
          <div
            className={`overflow-auto ${
              isAdminHome ? "max-h-[74vh]" : "max-h-[64vh]"
            } big:max-h-[73vh]`}
          >
            <Grid2 container rowSpacing={"10px"} columnSpacing={"10px"}>
              {filteredcompanies.length > 0 ? (
                filteredcompanies.map((company) => (
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
            </Grid2>
          </div>
        )}
      </div>
    );
  }
);

export default CompanyList;
