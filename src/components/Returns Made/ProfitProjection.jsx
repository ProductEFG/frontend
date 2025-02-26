import { useGlobal } from "@/providers/GlobalProvider";
import React, { useState } from "react";
import Price from "../Price";
import { Slider } from "@/components/ui/slider";

const ProfitProjection = () => {
  const { companyBought } = useGlobal();
  const [visitors, setVisitors] = useState(companyBought.current_visitors);
  const [price, setPrice] = useState(
    (companyBought.temp_price - companyBought.current_price).toFixed(2)
  );

  const upperLimit = companyBought.current_visitors * 1.5;
  const lowerLimit = companyBought.current_visitors * 0.5;

  const handleSliderChange = (value) => {
    const change = visitors - value[0];
    setVisitors(value[0]);

    setPrice((prev) => (prev - change / 100).toFixed(2));
  };
  return (
    <div className="flex justify-center items-center">
      <div className="bg-white rounded-xl py-[40px] px-3 w-[442px] flex flex-col justify-center items-center gap-[23px]">
        <h4 className="font-semibold text-[25px] text-center">
          Profit Projection
        </h4>
        <div className="flex flex-row gap-7 items-center">
          <div className="flex flex-col justify-center items-center">
            <img
              src="/images/visitors.svg"
              alt="Visitors"
              className="w-[47px] h-[47px]"
            />
            <div className="flex items-baseline gap-1">
              <span className="text-[25px] font-medium">
                {visitors.toLocaleString()}
              </span>
              <span className="text-xs text-[#6E7191]">Visitors</span>
            </div>
          </div>

          <div className="w-[42px] h-[42px] bg-[#EFECFE] text-purple flex justify-center items-center rounded-full text-3xl font-bold">
            =
          </div>

          <div className="w-fit">
            <Price
              price={price}
              imgStyles={"w-6"}
              textStyles={
                "text-[45px] font-semibold text-black items-center gap-1"
              }
            />
          </div>
        </div>

        <p className="text-sm text-[#6E7191] text-center">
          The Price of a share is determined by the number visitors an
          establishment receives each day at KidZania. Forecast future potential
          profits if the number of visitors visiting this establishment
          increases.
        </p>

        <div className="w-[380px]">
          <Slider
            value={[visitors]}
            max={upperLimit}
            min={lowerLimit}
            step={1}
            onValueChange={handleSliderChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfitProjection;
