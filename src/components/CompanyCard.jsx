import React, { memo } from "react";
import { useLocation } from "react-router";

const CompanyCard = memo(({ company, handleOpen }) => {
  const isNegativeChange = !(company.current_change > 0);
  const location = useLocation();
  const isAdminHome = location.pathname === "/admin/home";
  return (
    <div
      className="company-card-bg pt-2 px-2 pb-3 rounded-[19px] max-h-fit flex flex-col justify-center items-center gap-3 cursor-pointer"
      onClick={() => handleOpen(company)}
    >
      <div className="bg-white rounded-2xl w-full px-3 py-4">
        {/* Title */}
        <div className="flex justify-between items-center gap-5 w-full mb-[18px]">
          <div className="flex gap-2 w-[50%]">
            <div className="w-[30px] h-[30px] rounded-full bg-[#F8F9FA] flex justify-center items-center">
              <img
                src={`${company.logo}`}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-[19px] font-semibold truncate w-full">
              {company.name}
            </span>
          </div>

          <div
            className={`w-[28px] h-[28px] flex justify-center items-center shadow-lg border rounded-full ${
              isNegativeChange ? "border-[#FF413D]" : "border-[#0CAD13]"
            }`}
          >
            <img
              src={`/images/stock_${
                isNegativeChange ? "negative" : "positive"
              }.svg`}
              alt="Stock Trend"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2 mb-3">
          {/* Stock Price */}
          <div className="bg-[#FDF3DF] rounded-xl flex justify-between items-center p-2">
            <div className="flex flex-col">
              <span className="text-[#8F8F8F] text-sm font-semibold">
                Stock Price
              </span>
              <span className="font-semibold text-[24px] text-[#E27500]">
                {company.current_price}
              </span>
            </div>
            <div className="w-[34px] h-[34px]">
              <img
                src="/images/kidzos-coin.svg"
                alt="KidZos Icon"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          {/* Price Diff */}
          <div className="bg-[#EAF5FF] rounded-xl flex justify-between items-center p-2">
            <div className="flex flex-col">
              <span className="text-[#8F8F8F] text-sm font-semibold">
                Price Difference
              </span>
              <span
                className={`font-semibold text-[24px] ${
                  isNegativeChange ? "text-[#F12705]" : "text-[#0B880B]"
                }`}
              >
                {isNegativeChange ? "" : "+"}
                {company.current_change.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="w-[34px] h-[34px]">
              <img
                src="/images/rocket.svg"
                alt="KidZos Icon"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        {/* Visitors */}
        <div className="flex flex-row gap-1 justify-center items-center">
          <div className="min-w-[31px] h-[31px]">
            <img
              src="/images/visitors.svg"
              alt="Visitors"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="font-semibold text-[13px] text-[#A1A1A1] leading-[15px] w-fit">
            {company.current_visitors} Visitors are visiting this Establishment
            now.
          </p>
        </div>
      </div>
      <p className="font-semibold text-white text-[17px]">
        {isAdminHome ? "View Company Information" : "Invest in this Stock 🚀"}
      </p>
    </div>
  );
});

export default CompanyCard;
