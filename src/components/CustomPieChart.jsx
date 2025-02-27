"use client";
import { Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const CustomPieChart = ({ data }) => {
  return (
    <ChartContainer
      config={{}}
      className="mx-auto aspect-square w-[162px] h-[162px] flex justify-center items-center"
    >
      <PieChart width={162} height={162}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={data}
          dataKey="percentage"
          nameKey="name"
          innerRadius={60}
          outerRadius={80}
          cornerRadius={10}
          stroke="white"
          strokeWidth={3}
        />
      </PieChart>
    </ChartContainer>
  );
};

export default CustomPieChart;
