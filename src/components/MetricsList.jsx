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

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";

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
      <div className="bg-white rounded-xl flex flex-row p-4 relative w-full z-0">
        <Stack direction={"column"} className="flex flex-col gap-3 relative">
          <div className="flex flex-row gap-5 justify-between items-center">
            <h4 className="flex flex-row items-center gap-2 big:text-xl">
              <img
                src={`/images/${icon}.svg`}
                className="w-[32px] big:w-[44px]"
              />
              {title}
            </h4>
            <p className="text-xs big:text-sm">Last 24h</p>
          </div>
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
          <div className="flex flex-col gap-1 items-end">
            <p className="font-semibold">
              {name ? `${name} (${acronym})` : "No Company Yet"}
            </p>
            {(title === "Trending Now" || title === "Highest Return") && (
              <h1 className="big:text-3xl text-2xl flex flex-row gap-4 items-center">
                <Price
                  price={price && price.toFixed(2)}
                  styles="absolute -right-4 top-0 w-4"
                />
                <Return
                  type={current_return > 0 ? "positive" : "negative"}
                  number={current_return && Math.abs(current_return).toFixed(2)}
                />
              </h1>
            )}
            {(title === "Most Traded" || title === "Most Visited") && (
              <div className="big:text-3xl ext-2xl flex flex-row gap-2 items-center -translate-y-1">
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
          {/* Background Image */}
          {logo && (
            <div className="absolute w-[50%] top-5 right-5 -z-1">
              <img
                src={`${logo}`}
                alt={`${name} logo`}
                className="opacity-10 object-cover max-w-[100%] max-h-[100%]"
              />
            </div>
          )}
        </Stack>

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
  const [numberPerPage, setNumberPerPage] = useState(2);

  const fetchMetricsData = async () => {
    setMetricsLoading(true);
    try {
      const metrics = await companyService.getMetrics();
      await setMetrics(metrics);
    } catch (error) {
      console.log(error.message);
    } finally {
      setMetricsLoading(false);
    }
  };

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerHeight >= 1028) {
        setNumberPerPage(3);
      } else if (window.innerHeight >= 750) {
        setNumberPerPage(2);
      } else {
        setNumberPerPage(1);
      }
    };

    updateItemsPerPage();

    window.addEventListener("resize", updateItemsPerPage);

    return () => {
      window.removeEventListener("resize", updateItemsPerPage);
    };
  }, []);

  useEffect(() => {
    fetchMetricsData();
  }, []);

  if (metricsLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loading otherClasses={"w-8 h-8"} />
      </div>
    );
  }

  const metricItems = [
    {
      title: "Trending Now",
      tableHeader: "Current Number of Investors",
      icon: "trending_now",
      description:
        "A stock that is trending right means that many kids in Kidzania are starting to invest in it right now.",
      data: metrics.trending_now,
    },
    {
      title: "Most Traded",
      tableHeader: "Number of Trades",
      icon: "most_traded",
      description:
        "A stock that is most traded means that it has received the highest number of trades out of all other stocks.",
      data: metrics.most_traded,
    },
    {
      title: "Highest Return",
      tableHeader: "Return %",
      icon: "highest_return",
      description:
        "A stock with the highest return means that it made the biggest profit for investors compared to all other stocks.",
      data: metrics.highest_return,
    },
    {
      title: "Most Visited",
      tableHeader: "Visitors",
      icon: "most_visited",
      description:
        "A stock that is most visited means that it has received the highest number of visitors to its establishment in Kidzania.",
      data: metrics.most_visited,
    },
  ];

  return (
    <div className="relative">
      <Swiper
        slidesPerView={"auto"}
        spaceBetween={16}
        pagination={{
          clickable: true,
          el: ".swiper-pagination",
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {metricItems
          .reduce((acc, item, index) => {
            // Only push an array when the current index is divisible by `numberPerPage`
            if (index % numberPerPage === 0) {
              // Slice the `metricItems` array from the current index to `numberPerPage` items ahead
              acc.push(metricItems.slice(index, index + numberPerPage));
            }
            return acc;
          }, [])
          .map((item, index) => (
            <SwiperSlide key={index} className="flex flex-col gap-4">
              {item.map(
                (metric, index) =>
                  metric && (
                    <MetricsItem
                      key={index}
                      title={metric.title}
                      tableHeader={metric.tableHeader}
                      icon={metric.icon}
                      description={metric.description}
                      name={metric.data[0]?.name}
                      acronym={metric.data[0]?.acronym}
                      logo={metric.data[0]?.logo}
                      price={metric.data[0]?.current_price}
                      current_return={metric.data[0]?.current_return}
                      number={
                        metric.title === "Most Visited"
                          ? metric.data[0]?.current_visitors
                          : metric.data[0]?.number_of_trades
                      }
                      companyList={metric.data}
                      openCompany={handleOpen}
                    />
                  )
              )}
            </SwiperSlide>
          ))}
        <div className="flex w-full justify-center items-center mt-8">
          <div className="flex flex-row justify-center items-center w-fit">
            <div className="swiper-button-prev relative p-5 pb-4"></div>
            <div className="swiper-pagination relative"></div>
            <div className="swiper-button-next relative p-5 pb-4"></div>
          </div>
        </div>
      </Swiper>
    </div>
  );
});

export default MetricsList;
