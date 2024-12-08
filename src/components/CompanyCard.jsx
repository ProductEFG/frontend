import React, { memo } from "react";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid2";
import Price from "../components/Price";
import { useLocation } from "react-router";
import { useAuth } from "../providers/AuthProvider";

const CompanyCard = memo(({ company, handleOpen }) => {
  const { backendUrl } = useAuth();
  const location = useLocation();
  const isAdminHome = location.pathname === "/admin/home";
  return (
    <Grid
      key={company._id}
      size={isAdminHome ? 4 : 6}
      className="bg-white rounded-xl p-2"
    >
      <Stack spacing={1}>
        <div className="flex flex-row justify-between text-sm font-semibold">
          <div
            className="flex flex-row gap-3 justify-center items-center h-12"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              maxWidth: "150px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <img
              src={`${backendUrl}/images/logos/${company.logo}`}
              alt="Logo"
              width="35px"
              height="35px"
            />
            <span
              style={{ textOverflow: "ellipsis", overflow: "hidden" }}
              className="text-sm"
            >
              {company.name}
            </span>
          </div>

          {company.current_return >= 0 ? (
            <img
              src="/images/positive_return.svg"
              alt="positive return"
              width={77}
            />
          ) : (
            <img
              src="/images/negative_return.svg"
              alt="negative return"
              width={77}
            />
          )}
        </div>
        <div className="flex flex-row justify-between pr-3 pt-3">
          <div className="flex flex-row gap-2 text-[#6E7191] font-semibold text-sm">
            <img src="/images/stock_price.svg" alt="Stock Price" width={24} />
            Stock price
          </div>
          <Price
            price={company.current_price}
            styles="absolute -right-3 -top-0.5 w-3"
            textStyles={"text-sm"}
          />
        </div>
        <div className="flex flex-row justify-between pr-1">
          <div className="flex flex-row gap-1 text-[#6E7191] font-semibold text-sm">
            <img src="/images/change.svg" alt="Change" width={31} />
            Change
          </div>
          <div className="flex flex-row gap-3 justify-center items-center">
            <Price
              price={`${
                company.current_change < 0 ? "" : "+"
              }${company.current_change.toFixed(2)}`}
              styles="absolute -right-3 top-0 w-3"
              textStyles={`text-sm ${
                company.current_change < 0 ? "text-red-600" : "text-green-500"
              }`}
            />
            <p
              className={`text-xs tracking-wider ${
                company.current_return < 0 ? "text-red-600" : "text-green-500"
              }`}
            >
              ({company.current_return >= 0 && "+"}
              {company.current_return.toFixed(2)}%)
            </p>
          </div>
        </div>
        <div className="flex flex-row justify-between pr-2">
          <div className="flex flex-row gap-3 justify-center items-center text-[#6E7191] font-semibold text-sm">
            <img src="/images/visitors.svg" alt="Change" width={24} />
            Visitors
          </div>
          <p className="font-semibold text-sm">
            {company.current_visitors.toLocaleString()}
          </p>
        </div>
        <button
          className="text-xs text-[#0086FF] flex flex-row gap-1 justify-end items-center"
          onClick={() => handleOpen(company)}
        >
          View Company Details{" "}
          <img src="/images/topright_arrow.svg" alt="topright arrow" />
        </button>
      </Stack>
    </Grid>
  );
});

export default CompanyCard;
