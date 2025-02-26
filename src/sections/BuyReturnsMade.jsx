import Price from "@/components/Price";
import ProfitProjection from "@/components/Returns Made/ProfitProjection";
import BuyReturnsTradePerformance from "@/components/Returns Made/BuyReturnsTradePerformance";
import BuyReturnsCurrentPosition from "@/components/Returns Made/BuyReturnsCurrentPosition";
import ProfitAchieved from "@/components/Returns Made/ProfitAchieved";
import ReturnsMadeSlide from "@/components/ReturnsMadeSlide";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useGlobal } from "@/providers/GlobalProvider";
import styled from "@emotion/styled";
import { Slider } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

const BuyReturnsMade = () => {
  const { handleNav, companyBought } = useGlobal();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);

  const changeSlide = (value) => {
    if (currentSlide + value > 4) {
      handleNav();
    } else {
      setCurrentSlide((prev) => prev + value);
    }
  };

  useEffect(() => {
    if (currentSlide === 1) {
      setCanScrollPrev(false);
    } else {
      setCanScrollPrev(true);
    }
  }, [currentSlide]);

  return (
    <section className="relative">
      <Carousel>
        <CarouselPrevious
          canScrollPrev={canScrollPrev}
          changeSlide={changeSlide}
        />
        <CarouselContent>
          <CarouselItem>
            <ReturnsMadeSlide title="Trade Performance">
              <BuyReturnsTradePerformance />
            </ReturnsMadeSlide>
          </CarouselItem>
          <CarouselItem>
            <ReturnsMadeSlide title="Current Position">
              <BuyReturnsCurrentPosition />
            </ReturnsMadeSlide>
          </CarouselItem>
          <CarouselItem>
            <ReturnsMadeSlide title="Profit You Achieved">
              <ProfitAchieved
                profit={
                  (companyBought.temp_price - companyBought.current_price) *
                  companyBought.quantity
                }
              />
            </ReturnsMadeSlide>
          </CarouselItem>
          <CarouselItem>
            <ReturnsMadeSlide
              title="What’s Next For Your Stock?"
              dialog={false}
            >
              <ProfitProjection />
            </ReturnsMadeSlide>
          </CarouselItem>
        </CarouselContent>
        <CarouselNext changeSlide={changeSlide} />
      </Carousel>
    </section>
  );
};

export default BuyReturnsMade;
