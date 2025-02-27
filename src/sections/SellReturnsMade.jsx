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
import React, { useEffect, useState } from "react";
import SellReturnsTradePerformance from "@/components/Returns Made/SellReturnsTradePerformance";
import SellReturnsPreTradePosition from "@/components/Returns Made/SellReturnsPreTradePosition";
import SellReturnsPostTradePosition from "@/components/Returns Made/SellReturnsPostTradePosition";
import SellReturnsWithdrawEarnings from "@/components/Returns Made/SellReturnsWithdrawEarnings";

const SellReturnsMade = () => {
  const { handleNav, companySold } = useGlobal();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);

  const changeSlide = (value) => {
    if (currentSlide + value > 5) {
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
              <SellReturnsTradePerformance />
            </ReturnsMadeSlide>
          </CarouselItem>
          <CarouselItem>
            <ReturnsMadeSlide title="Pre-Trade Position">
              <SellReturnsPreTradePosition />
            </ReturnsMadeSlide>
          </CarouselItem>
          <CarouselItem>
            <ReturnsMadeSlide title="Post-Trade Position">
              <SellReturnsPostTradePosition />
            </ReturnsMadeSlide>
          </CarouselItem>
          <CarouselItem>
            <ReturnsMadeSlide title="Profit You Achieved">
              <ProfitAchieved profit={companySold.profit} />
            </ReturnsMadeSlide>
          </CarouselItem>
          <CarouselItem>
            <ReturnsMadeSlide
              title="What’s Next For Your Stock?"
              dialog={false}
            >
              <SellReturnsWithdrawEarnings />
            </ReturnsMadeSlide>
          </CarouselItem>
        </CarouselContent>
        <CarouselNext changeSlide={changeSlide} />
      </Carousel>
    </section>
  );
};

export default SellReturnsMade;
