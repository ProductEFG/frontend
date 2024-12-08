import React, { memo, useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
} from "recharts";
import { Stack } from "@mui/material";
import { format, subDays, subMonths } from "date-fns";
import Loading from "./Loading";

const CustomDot = (props) => {
  const { cx, cy, value } = props;
  return <circle cx={cx} cy={cy} r={8} stroke="#6143F0" fill="#fff" />;
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
        <p className="font-semibold text-xl">
          {value} {type === "price" ? "EGP" : "Sold"}
        </p>
        <p className="">{date}</p>
      </div>
    );
  }
  return null;
};

const DataChart = ({ history }) => {
  const [type, setType] = useState("price");
  const [period, setPeriod] = useState("1M");
  const [data, setData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [yDomain, setYDomain] = useState([0, 100]); // Default domain

  const handleToggle = (selectedGender) => {
    setType(selectedGender);
  };

  const generateData = () => {
    const startDate = subDays(new Date(), 1); // Starting point is yesterday
    const result = [];
    let minY = Infinity; // Initialize minY to the largest possible number
    let maxY = -Infinity; // Initialize maxY to the smallest possible number

    // Create an array for the desired period
    if (period === "7D") {
      // Generate the previous 7 days
      for (let i = 0; i < 7; i++) {
        const date = subDays(startDate, i);
        const formattedDate = format(date, "dd MMM");
        const matchingHistory = history.find(
          (entry) => new Date(entry.date).toDateString() === date.toDateString()
        );
        const value = matchingHistory
          ? type === "sales"
            ? matchingHistory.number_of_sells
            : matchingHistory.shares_price
          : undefined;
        result.push({
          x: formattedDate,
          y: value,
        });
        if (value !== undefined) {
          minY = Math.min(minY, value);
          maxY = Math.max(maxY, value);
        }
      }
    } else if (period === "1M") {
      // Generate the previous 30 days
      for (let i = 0; i < 30; i++) {
        const date = subDays(startDate, i);
        const formattedDate = format(date, "dd MMM");
        const matchingHistory = history.find(
          (entry) => new Date(entry.date).toDateString() === date.toDateString()
        );
        const value = matchingHistory
          ? type === "sales"
            ? matchingHistory.number_of_sells
            : matchingHistory.shares_price
          : undefined;
        result.push({
          x: formattedDate,
          y: value,
        });
        if (value !== undefined) {
          minY = Math.min(minY, value);
          maxY = Math.max(maxY, value);
        }
      }
    } else if (period === "1Y") {
      // Generate the previous 12 months
      for (let i = 0; i < 12; i++) {
        const date = subMonths(startDate, i);
        const formattedDate = format(date, "MMM yyyy");
        const matchingHistory = history.find(
          (entry) => new Date(entry.date).toDateString() === date.toDateString()
        );
        const value = matchingHistory
          ? type === "sales"
            ? matchingHistory.number_of_sells
            : matchingHistory.shares_price
          : undefined;
        result.push({
          x: formattedDate,
          y: value,
        });
        if (value !== undefined) {
          minY = Math.min(minY, value);
          maxY = Math.max(maxY, value);
        }
      }
    }
    setYDomain([Math.floor(minY), Math.ceil(maxY)]);

    return result.reverse();
  };

  useEffect(() => {
    setChartLoading(true);
    setData(generateData());
    setChartLoading(false);
  }, [period, history, type]); // Add history to the dependency array

  return (
    <Stack spacing={3}>
      <div className="flex flex-row gap-2 items-center">
        <img src="/images/chart_logo.svg" alt="Chart Logo" width={34} />
        <p className="">Chart</p>
      </div>
      <div className="flex items-center justify-center bg-white-100 rounded-full w-[221px] h-[34px] p-1">
        <button
          className={`flex-1 py-2 rounded-full transition-colors duration-300 ${
            type === "price" ? "bg-white" : "bg-transparent"
          } h-[34px] flex items-center justify-center`}
          onClick={() => handleToggle("price")}
        >
          Price Chart
        </button>
        <button
          className={`flex-1 py-2 rounded-full transition-colors duration-300 ${
            type === "sales" ? "bg-white" : "bg-transparent"
          }`}
          disabled
          onClick={() => handleToggle("sales")}
        >
          Sales Chart
        </button>
      </div>
      <div className="flex items-center justify-center w-full p-1 gap-5">
        <button
          className={`flex  py-2 justify-center items-center rounded-full transition-colors duration-300 h-[34px] w-[140px] ${
            period === "7D" ? "bg-purple text-white" : "bg-white-100"
          }`}
          onClick={() => setPeriod("7D")}
        >
          7D
        </button>
        <button
          className={`flex py-2 justify-center items-center rounded-full transition-colors duration-300 h-[34px] w-[140px] ${
            period === "1M" ? "bg-purple text-white" : "bg-white-100"
          }`}
          onClick={() => setPeriod("1M")}
        >
          1M
        </button>
        <button
          className={`flex  py-2 justify-center items-center rounded-full transition-colors duration-300 h-[34px] w-[140px] ${
            period === "1Y" ? "bg-purple text-white" : "bg-white-100"
          }`}
          onClick={() => setPeriod("1Y")}
        >
          1Y
        </button>
      </div>
      {chartLoading ? (
        <div className="flex justify-center items-center pt-20">
          <Loading otherClasses={"w-6 h-6 text-center"} />
        </div>
      ) : (
        <AreaChart
          width={610}
          height={270}
          data={data}
          className="-translate-x-10"
          margin={{ right: 10, left: 10, bottom: 20 }}
        >
          <XAxis
            dataKey="x"
            padding={{ left: 10, right: 10 }}
            axisLine={false}
            tickLine={false}
            interval={period === "1M" ? 1 : 0}
            tick={{
              angle: -45,
              dy: 10,
              fontSize: 15,
              fill: "#9AA0A6",
            }}
          />
          <YAxis
            domain={yDomain} // Set the Y-axis domain here
            padding={{ top: 10, bottom: 10 }}
            axisLine={false}
            tickLine={false}
            interval={0}
            tick={{
              fontSize: 15,
              fill: "#9AA0A6",
            }}
          />
          <Tooltip content={<CustomTooltip type={type} />} />
          <Area
            type="monotone"
            dataKey="y"
            stroke="#6143F0"
            strokeWidth={4}
            fill="rgba(97, 67, 240, 0.3)"
            dot={<CustomDot />}
          />
        </AreaChart>
      )}
    </Stack>
  );
};

export default DataChart;
