import React, { useEffect, useRef, useState } from "react";
import { Slider } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import Return from "../components/Return";
import Price from "../components/Price";
import Loading from "../components/Loading";
import { styled } from "@mui/material/styles";
import { subDays, format, isSameDay } from "date-fns";
import { stocksHistoryService } from "../services/stocksHistory.service";
import Button from "../components/Button";

const CustomTick = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={3}
        dx={-16}
        textAnchor="middle"
        fill="#9AA0A6"
        fontSize={13}
      >
        {payload.value}
      </text>
      <image
        x={-10}
        y={-10}
        width={11}
        height={11}
        href="/images/KidZosicon.svg"
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload, type }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value; // Access the y value
    const date = payload[0].payload.x; // Access the x value for date
    return (
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "5px",
          padding: "10px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
        }}
      >
        <Price
          price={value}
          styles={"absolute -right-3 -top-1 w-3"}
          textStyles={"text-lg"}
        />
        <p className="text-sm">{date}</p>
      </div>
    );
  }
  return null;
};

const CustomSlider = styled(Slider)({
  color: "#6143F0", // Purple color for filled area
  width: "100%",
  height: "30px",
  borderRadius: 4,
  "& .MuiSlider-track": {
    backgroundColor: "#6143F0", // Purple color for the filled track
  },
  "& .MuiSlider-rail": {
    background: "#3D424A",
    opacity: 0.1,
  },
  "& .MuiSlider-thumb": {
    width: 30,
    height: 30,
    borderRadius: 4,
    backgroundColor: "#fff",
    border: "2px solid #6143F0",
    transition: "width 0.3s, height 0.3s",
  },
  "& .MuiSlider-thumb:hover": {
    boxShadow: "0px 0px 0px 8px rgba(156, 39, 176, 0.16)", // Hover effect
  },
  // Media query for specific resolution
  "@media (min-width: 1440px) and (min-height: 1028px)": {
    "& .MuiSlider-thumb": {
      width: 32,
      height: 38,
    },
  },
});

const CustomValueLabel = ({ children, value, className }) => {
  const referenceElementRef = useRef(null);
  const [leftPosition, setLeftPosition] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      if (referenceElementRef.current) {
        const spanElement = referenceElementRef.current.querySelector("span");
        if (spanElement) {
          const computedStyle = window.getComputedStyle(spanElement);
          const left = parseFloat(computedStyle.left);
          setLeftPosition(left);
        }
      }
    };

    updatePosition();

    const observer = new MutationObserver(updatePosition);
    observer.observe(referenceElementRef.current, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [children]);

  return (
    <div className={className}>
      <div
        className={`flex flex-col gap-[6px] justify-center items-center absolute`}
        style={{ top: "-85%", left: `${leftPosition - 15}px` }} // Position the label dynamically
      >
        <div className="w-8">
          <img
            src="images/monthly_visitors.svg"
            alt="Monthly Visitors Icon"
            className="max-w-[100%] max-h-[100%] object-cover"
          />
        </div>
        <div className="w-8 flex justify-center items-center">
          <img
            src="images/admin/arrow_down_returns.svg"
            alt="Monthly Visitors Icon"
            className="max-w-[100%] max-h-[100%] object-cover"
          />
        </div>
        <p className="text-sm font-semibold text-black">
          {value.toLocaleString()}
        </p>
      </div>
      <div ref={referenceElementRef}>
        {children} {/* Children contain the span with changing left value */}
      </div>
    </div>
  );
};

const ReturnsMade = ({ portfolioHandle }) => {
  const [companyBought, setCompanyBought] = useState(null);
  const [data, setData] = useState([]);
  const [yDomain, setYDomain] = useState([0, 100]);
  const [chartLoading, setChartLoading] = useState(false);
  const [visitors, setVisitors] = useState(0);
  const [predictedProfit, setPredictedProfit] = useState(0);

  const handleChange = (event, newValue) => {
    setVisitors(newValue);
    setPredictedProfit(newValue / 100);
  };

  const generateData = async (companyId) => {
    setChartLoading(true);
    try {
      const history = await stocksHistoryService.getCompanyHistory(
        companyId,
        7
      );

      const startDate = subDays(new Date(), 1);
      const result = [];
      let minY = Infinity;
      let maxY = -Infinity;

      for (let i = 0; i < 7; i++) {
        const date = subDays(startDate, i);
        const formattedDate = format(date, "dd MMM");

        const matchingHistory = history.find((entry) => {
          return isSameDay(new Date(entry.date), date);
        });
        console.log(matchingHistory);
        const value = matchingHistory ? matchingHistory.shares_price : 0;
        result.push({
          x: formattedDate,
          y: value,
        });
        if (value !== undefined) {
          minY = Math.min(minY, value);
          maxY = Math.max(maxY, value);
        }
      }
      setYDomain([Math.floor(minY), Math.ceil(maxY)]);
      setData(result.reverse());
    } catch {
      console.log("Error retrieving chart data");
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const company = JSON.parse(sessionStorage.getItem("companyBought"));
    if (company) {
      setCompanyBought(company);
      setVisitors(company.visitors);
      setPredictedProfit(company.profit_made);
      generateData(company.companyId);
    }

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <section>
      {companyBought ? (
        <div className="flex flex-row gap-5 w-full h-full">
          <div className="bg-white rounded-xl w-[70%] h-full">
            <div className="flex flex-row justify-between items-center p-5">
              <div className="flex flex-row justify-center items-center gap-3 text-[34px] font-medium">
                <img
                  src={`${companyBought.companyLogo}`}
                  alt="Logo"
                  className="w-[55px]"
                />
                {companyBought.companyName}
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-xs text-white-200 flex flex-row gap-2">
                  {" "}
                  Current Stock Value{" "}
                  <Return
                    type={
                      companyBought.companyReturn >= 0 ? "positive" : "negative"
                    }
                    number={companyBought.companyReturn}
                  />
                </div>
                <div>
                  <Price
                    price={
                      companyBought.invested_amount + companyBought.profit_made
                    }
                    styles={"absolute -right-4 top-0 w-4"}
                    textStyles={"text-[24px]"}
                  />
                </div>
              </div>
            </div>
            {chartLoading ? (
              <div className="flex justify-center items-center pt-20">
                <Loading otherClasses={"w-6 h-6 text-center"} />
              </div>
            ) : (
              <LineChart
                width={880}
                height={450}
                data={data}
                className="p-2 -translate-x-8"
              >
                <div className="recharts-tooltip-cursor" />
                <CartesianGrid strokeDasharray="5 5" />
                <XAxis
                  dataKey="x"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    dy: 6,
                    fontSize: 12,
                    fill: "#9AA0A6",
                  }}
                />
                <YAxis
                  domain={yDomain}
                  axisLine={false}
                  tickLine={false}
                  tick={<CustomTick />}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="linear"
                  dataKey="y"
                  stroke="#6143F0"
                  strokeWidth={4}
                  dot={{
                    fill: "#FFFFFF",
                    stroke: "#6143F0",
                    strokeWidth: 4,
                    r: 8,
                  }}
                  activeDot={{
                    r: 8,
                    fill: "#6143F0",
                    strokeWidth: 4,
                  }}
                />
              </LineChart>
            )}
          </div>
          <div className="flex flex-col gap-5 w-[30%]">
            <div className="p-5 bg-white flex flex-col justify-center items-center gap-4 rounded-xl">
              <div className="flex justify-between items-center w-[85%]">
                <p className="text-[15px] font-medium">
                  What you’ve invested in
                </p>
                <Price
                  price={companyBought.invested_amount.toFixed(2)}
                  styles={"absolute -right-3.5 top-0 w-3"}
                  font={"medium"}
                />
              </div>
              <div className="flex justify-between items-center w-[85%]">
                <p className="text-[15px] font-medium">Profit Made</p>
                <Price
                  price={companyBought.profit_made.toFixed(2)}
                  styles={"absolute -right-3.5 top-0 w-3"}
                  font={"medium"}
                />
              </div>
              <div className="flex justify-between items-center w-[85%]">
                <p className="text-[15px] font-medium">Total Value</p>
                <Price
                  price={(
                    companyBought.invested_amount + companyBought.profit_made
                  ).toFixed(2)}
                  styles={"absolute -right-3.5 top-0 w-3"}
                  font={"medium"}
                />
              </div>
            </div>
            <div className="p-5 pt-4 bg-white flex flex-col rounded-xl">
              <p className="text-lg font-medium mb-3">
                Forecast Potential Profits
              </p>
              <div className="relative w-fit mx-auto mb-4">
                <Price
                  price={predictedProfit}
                  styles={"absolute -right-5 top-0.5 w-5"}
                  textStyles={"text-[36px]"}
                  font={"medium"}
                />
              </div>
              <div className="mt-12">
                <CustomSlider
                  value={visitors}
                  onChange={handleChange}
                  min={Math.floor(companyBought.visitors * 0.5)}
                  max={Math.floor(companyBought.visitors * 1.5)}
                  valueLabelDisplay="on"
                  slots={{ valueLabel: CustomValueLabel }}
                />
              </div>
              <p className="text-xs text-center font-light leading-[23px] text-[#595D62]">
                Forecast future potential profits if the number of visitors
                visiting this establishment increases.
              </p>
            </div>
            <Button
              name={
                <div className="flex gap-3 justify-center items-center">
                  Check Portfolio{" "}
                  <img
                    src="/images/back_arrow.svg"
                    alt="Arrow"
                    className="w-5"
                  />
                </div>
              }
              onClick={portfolioHandle}
              otherClasses="bg-purple text-white w-full"
            />
          </div>
        </div>
      ) : (
        <div className="w-screen h-[calc(100vh-300px)] flex justify-center items-center">
          <p className="font-medium text-lg">
            Buy stocks to see your returns made
          </p>
        </div>
      )}
    </section>
  );
};

export default ReturnsMade;
