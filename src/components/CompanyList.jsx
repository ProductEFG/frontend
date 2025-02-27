import React, { memo } from "react";
import Loading from "../components/Loading";
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
              isAdminHome ? "h-[calc(100vh-260px)]" : "max-h-[64vh]"
            } big:max-h-[73vh]`}
          >
            <div className="pl-[36px] pr-[32px] grid 2xl:grid-cols-4 grid-cols-3 gap-[28px] pb-[21px] h-[calc(100vh-290px)] overflow-y-scroll custom-scrollbar">
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
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default CompanyList;
