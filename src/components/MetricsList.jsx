import React, { memo, useCallback, useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import Price from "../components/Price";
import Return from "../components/Return";

import Box from "@mui/material/Box";
import DataTable from "../components/DataTable.jsx";
import { companyService } from "../services/company.service.js";
import Loading from "./Loading.jsx";
import { useAuth } from "../providers/AuthProvider.jsx";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 960,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

const MetricsItem = memo(
  ({
    title,
    tableHeader,
    icon,
    description,
    name,
    acronym,
    logo,
    price,
    current_return,
    number,
    companyList,
    openCompany,
  }) => {
    const { backendUrl } = useAuth();
    const [open, setOpen] = useState(false);
    const handleOpen = useCallback(() => setOpen(true), []);
    const handleClose = useCallback(() => setOpen(false), []);

    const handleViewStock = useCallback((company) => {
      handleClose();
      openCompany(company);
    }, []);

    return (
      <div className="bg-white relative rounded-xl flex flex-row p-4">
        <Stack className="w-[70%] gap-5">
          <h4 className="flex flex-row items-center gap-2 big:text-xl">
            <img src={`/images/${icon}.svg`} className="w-[32px] big:w-[44px]" />
            {title}
          </h4>
          <p className="text-xs leading-6 big:text-sm">
            {description}{" "}
            {companyList.length > 0 && (
              <button onClick={handleOpen}>
                <p className="flex flex-row gap-2 justify-center items-center underline text-purple">
                  View Rankings <img src="/images/expand.svg" alt="Expand" />
                </p>
              </button>
            )}
          </p>
        </Stack>

        <div className="relative w-[30%]">
          {/* Background Image */}
          {logo && (
            <img
              src={`${backendUrl}/images/logos/${logo}`}
              alt={`${name} logo`}
              className="absolute inset-0 opacity-10 w-full h-full object-contain"
              style={{ right: 0, top: 0 }}
            />
          )}

          <Stack className="relative text-right gap-6">
            <p className="text-xs big:text-sm">Last 24h</p>
            <div className="flex flex-col gap-1">
              <p className="font-semibold">
                {name ? `${name} (${acronym})` : "No Company Yet"}
              </p>
              {(title === "Trending Now" || title === "Highest Return") && (
                <h1 className="big:text-3xl text-2xl flex flex-row gap-4 items-center justify-end">
                  <Price price={price} styles="absolute -right-4 top-0 w-4" />
                  <Return
                    type={current_return > 0 ? "positive" : "negative"}
                    number={Math.abs(current_return)}
                  />
                </h1>
              )}
              {(title === "Most Traded" || title === "Most Visited") && (
                <div className="big:text-3xl ext-2xl flex flex-row gap-2 items-center justify-end -translate-y-1">
                  {title === "Most Traded" ? (
                    <img
                      src="/images/most_traded_icon.svg"
                      alt="Change"
                      className="w-[34px] big:w-[44px]"
                    />
                  ) : (
                    <img
                      src="/images/visitors.svg"
                      alt="Change"
                      width={34}
                      height={34}
                    />
                  )}
                  <div className="flex flex-col gap-0 justify-center">
                    <p className="font-semibold h-6 text-lg">
                      {" "}
                      {number && number.toLocaleString()}
                    </p>
                    <span className="text-white-300 text-xs">
                      {title === "Most Traded" ? "Trades" : "Visitors"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Stack>
        </div>

        <Modal
          keepMounted
          open={open}
          onClose={handleClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={style}>
            <div className="flex flex-row mb-5">
              <div className="flex flex-col gap-4">
                <h3 className="font-medium text-3xl">{title}</h3>
                <p className="text-sm text-[#6E7191] pl-1">{description}</p>
              </div>
              <div
                className="flex flex-row items-center text-2xl gap-2 ml-auto"
                onClick={handleClose}
              >
                Close <img src="/images/close.svg" alt="close" width={33} />
              </div>
            </div>
            <DataTable
              data={companyList}
              thirdColumn={tableHeader}
              onViewStock={handleViewStock}
            />
          </Box>
        </Modal>
      </div>
    );
  }
);

const MetricsList = React.memo(({ handleOpen }) => {
  const [metrics, setMetrics] = useState({
    trending_now: [],
    most_traded: [],
    highest_return: [],
    most_visited: [],
  });
  const [metricsLoading, setMetricsLoading] = useState(false);

  const fetchMetricsData = async () => {
    setMetricsLoading(true);
    try {
      const metrics = await companyService.getMetrics();
      setMetrics(metrics);
    } catch (error) {
      console.log(error.message);
    } finally {
      setMetricsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetchMetricsData();

    return () => {
      controller.abort();
    };
  }, []);

  if (metricsLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loading otherClasses={"w-8 h-8"} />
      </div>
    );
  }

  return (
    <div>
      <Stack spacing={2} className="overflow-y-auto max-h-[60vh]">
        <MetricsItem
          title="Trending Now"
          tableHeader="Current Number of Investors"
          icon="trending_now"
          description="A stock that is trending right means that many kids in Kidzania are starting to invest in it right now."
          name={metrics.trending_now[0]?.name}
          acronym={metrics.trending_now[0]?.acronym}
          logo={metrics.trending_now[0]?.logo}
          price={metrics.trending_now[0]?.current_price}
          current_return={metrics.trending_now[0]?.current_return}
          companyList={metrics.trending_now}
          openCompany={handleOpen}
        />
        <MetricsItem
          title="Most Traded"
          tableHeader="Number of Trades"
          icon="most_traded"
          description="A stock that is most traded means that it has received the highest number of trades out all other stocks."
          name={metrics.most_traded[0]?.name}
          acronym={metrics.most_traded[0]?.acronym}
          logo={metrics.most_traded[0]?.logo}
          number={metrics.most_traded[0]?.number_of_trades}
          companyList={metrics.most_traded}
          openCompany={handleOpen}
        />
        <MetricsItem
          title="Highest Return"
          tableHeader="Return %"
          icon="highest_return"
          description="A stock with the highest return means that it made made the biggest profit for investors compared to all other stocks."
          name={metrics.highest_return[0]?.name}
          acronym={metrics.highest_return[0]?.acronym}
          logo={metrics.highest_return[0]?.logo}
          price={metrics.highest_return[0]?.current_price}
          current_return={metrics.highest_return[0]?.current_return}
          companyList={metrics.highest_return}
          openCompany={handleOpen}
        />
        <MetricsItem
          title="Most Visited"
          tableHeader="Visitors"
          icon="most_visited"
          description="A stock that is most visited means that it has received has the highest number of visitors to its establishment in Kidzania."
          name={metrics.most_visited[0]?.name}
          acronym={metrics.most_visited[0]?.acronym}
          logo={metrics.most_visited[0]?.logo}
          number={metrics.most_traded[0]?.current_visitors}
          companyList={metrics.most_visited}
          openCompany={handleOpen}
        />
      </Stack>
    </div>
  );
});

export default MetricsList;
