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
import {
  subMonths,
  subDays,
  format,
  startOfMonth,
  isSameMonth,
  isSameDay,
} from "date-fns";
import Loading from "./Loading";

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
          {value} {type === "price" ? "Kz" : "Sold"}
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
    } else if (period === "1M") {
      // Generate the previous 30 days
      for (let i = 0; i < 30; i++) {
        const date = subDays(startDate, i);
        const formattedDate = format(date, "dd MMM");
        const matchingHistory = history.find(
          (entry) => new Date(entry.date).toDateString() === date.toDateString()
        );
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
    } else if (period === "1Y") {
      for (let i = 0; i < 12; i++) {
        const date = subMonths(startDate, i);
        const formattedDate = format(date, "MMM");
        const monthStart = startOfMonth(date);

        // Filter all history entries that belong to the current month
        const monthlyEntries = history.filter((entry) =>
          isSameMonth(new Date(entry.date), monthStart)
        );

        // Calculate the average value for the month
        const totalValue = monthlyEntries.reduce((sum, entry) => {
          const value =
            type === "sales" ? entry.number_of_sells : entry.shares_price;
          return sum + (value || 0); // Ensure no undefined values
        }, 0);

        const averageValue =
          monthlyEntries.length > 0 ? totalValue / monthlyEntries.length : 0;

        // Round the average value to the nearest tens
        const roundedValue = parseFloat(averageValue.toPrecision(4));

        result.push({
          x: formattedDate,
          y: roundedValue,
        });

        if (monthlyEntries.length > 0) {
          minY = Math.min(minY, roundedValue);
          maxY = Math.max(maxY, roundedValue);
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
    <Stack spacing={2}>
      <div className="flex flex-row gap-2 items-center pl-4 pt-4">
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
          width={650}
          height={300}
          data={data}
          className="-translate-x-7"
          margin={{ right: 20, left: 10, bottom: 20, top: 20 }}
        >
          <div className="recharts-tooltip-cursor" />
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis
            dataKey="x"
            axisLine={false}
            tickLine={false}
            interval={period === "1M" ? 1 : 0}
            tick={{
              angle: -45,
              dy: 15,
              fontSize: 15,
              fill: "#9AA0A6",
            }}
          />
          <YAxis
            domain={yDomain} // Set the Y-axis domain here
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
            activeDot={{
              r: 8,
              fill: "#6143F0",
              strokeWidth: 4,
            }}
          />
        </AreaChart>
      )}
    </Stack>
  );
};

export default DataChart;
