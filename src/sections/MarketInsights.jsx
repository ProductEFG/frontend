import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import React, { memo, useEffect, useState } from "react";

import { companyService } from "../services/company.service.js";
import Loading from "@/components/Loading.jsx";
import MetricItem from "@/components/MetricItem.jsx";
import { useGlobal } from "@/providers/GlobalProvider.jsx";

const MarketInsights = memo(() => {
  const { handleNav } = useGlobal();

  const [metrics, setMetrics] = useState({
    trending_now: [],
    most_traded: [],
    highest_return: [],
    most_visited: [],
  });
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);

  const changeSlide = (value) => {
    if (currentSlide + value > metricItems.length) {
      handleNav();
    } else {
      setCurrentSlide((prev) => prev + value);
    }
  };

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
    fetchMetricsData();
  }, []);

  useEffect(() => {
    if (currentSlide === 1) {
      setCanScrollPrev(false);
    } else {
      setCanScrollPrev(true);
    }
  }, [currentSlide]);

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
      description: "Most Kids are investing in this stock right now!",
      data: metrics.trending_now,
    },
    {
      title: "Most Traded",
      tableHeader: "Number of Trades",
      icon: "most_traded",
      description: "This Stock has the highest Number of Trades",
      data: metrics.most_traded,
    },
    {
      title: "Highest Return",
      tableHeader: "Return %",
      icon: "highest_return",
      description: "This Stock Made the highest Profit for Investors",
      data: metrics.highest_return,
    },
    {
      title: "Most Visited",
      tableHeader: "Visitors",
      icon: "most_visited",
      description: "This Stock Has The Highest Number of Visitors in Kidzania.",
      data: metrics.most_visited,
    },
  ];

  return (
    <section className="relative">
      <Carousel>
        <CarouselPrevious
          canScrollPrev={canScrollPrev}
          changeSlide={changeSlide}
        />
        <CarouselContent>
          {metricItems.map((item, index) => (
            <CarouselItem key={index}>
              <MetricItem
                key={index}
                title={item.title}
                tableHeader={item.tableHeader}
                icon={item.icon}
                description={item.description}
                name={item.data[0]?.name}
                acronym={item.data[0]?.acronym}
                logo={item.data[0]?.logo}
                price={item.data[0]?.current_price}
                current_return={item.data[0]?.current_return}
                number={
                  item.title === "Most Visited"
                    ? item.data[0]?.current_visitors
                    : item.data[0]?.number_of_trades
                }
                companyList={item.data}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext changeSlide={changeSlide} />
      </Carousel>
    </section>
  );
});

export default MarketInsights;
