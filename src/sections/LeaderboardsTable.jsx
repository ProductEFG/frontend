import React, { useEffect, useState } from "react";
import { userService } from "../services/user.service";
import { Stack } from "@mui/material";
import LeaderboardsCard from "../components/LeaderboardsCard";
import Loading from "../components/Loading";
import { useLocation } from "react-router-dom";

const LeaderboardsTable = () => {
  // const [currentCard, setCurrentCard] = useState(1);
  // const [leaderboards, setLeaderboards] = useState({
  //   highestNumberOfTrades: [],
  //   highestReturn: [],
  //   biggestInvestment: [],
  // });
  // const [loading, setLoading] = useState(true);
  // const [isAdminHome, setIsAdminHome] = useState(null);

  // const location = useLocation();

  // useEffect(() => {
  //   setIsAdminHome(location.pathname === "/admin/home");
  // }, [location]);

  // const fetchLeaderboards = async () => {
  //   try {
  //     const limit = isAdminHome ? 10 : 4;
  //     const leaderboards = await userService.fetchLeaderboards(limit);
  //     setLeaderboards(leaderboards);
  //   } catch (error) {
  //     console.log(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   // Fetch data only after isAdminHome is resolved
  //   if (isAdminHome !== null) {
  //     fetchLeaderboards();
  //   }
  // }, [isAdminHome]);

  // const onClickHandle = (direction) => {
  //   setCurrentCard((prev) => {
  //     if (direction === "next") {
  //       return (prev + 1) % cards.length;
  //     }
  //     return (prev - 1 + cards.length) % cards.length;
  //   });
  // };

  // const cards = [
  //   {
  //     title: "trailblazers_title",
  //     image: "trailblazers",
  //     description: "Traders with the highest number of trades",
  //     list: leaderboards.highestNumberOfTrades,
  //   },
  //   {
  //     title: "investment_masters_title",
  //     image: "investment_masters",
  //     description: "Traders with the biggest Investments",
  //     list: leaderboards.biggestInvestment,
  //   },
  //   {
  //     title: "king_of_profits_title",
  //     image: "king_of_profits",
  //     description: "Traders who achieved the most return",
  //     list: leaderboards.highestReturn,
  //   },
  // ];

  // if (isAdminHome === null || loading) {
  //   return (
  //     <div className="flex justify-center items-center h-[60vh]">
  //       <Loading otherClasses={"w-10 h-10"} />
  //     </div>
  //   );
  // }

  // return (
  //   <>
  //     {isAdminHome ? (
  //       <div className="relative w-full h-[80vh] flex flex-col justify-center items-center gap-5 pt-8">
  //         <Stack direction="row" spacing={3}>
  //           <LeaderboardsCard {...cards[currentCard]} />
  //         </Stack>
  //         {leaderboards && (
  //           <div className="flex flex-col gap-6 pt-2">
  //             <div className="flex flex-row gap-2 h-[10px] justify-center items-center">
  //               {cards.map((_, index) => (
  //                 <div
  //                   key={index}
  //                   className={`w-3 h-3 ${
  //                     currentCard === index ? "bg-purple" : "bg-white"
  //                   } rounded-full`}
  //                 />
  //               ))}
  //             </div>

  //             <div className="flex flex-row w-[177px] justify-between items-center">
  //               <button
  //                 className="bg-purple w-[39px] h-[36px]  flex justify-center items-center"
  //                 onClick={() => onClickHandle("previous")}
  //               >
  //                 <img src="/images/back_arrow.svg" className="rotate-180" />
  //               </button>
  //               <button
  //                 className="bg-purple w-[39px] h-[36px] flex justify-center items-center"
  //                 onClick={() => onClickHandle("next")}
  //               >
  //                 <img src="/images/back_arrow.svg" />
  //               </button>
  //             </div>
  //           </div>
  //         )}
  //       </div>
  //     ) : (
  //       <Stack
  //         direction={"row"}
  //         spacing={2}
  //         className={"flex justify-center h-[70vh] pt-10"}
  //       >
  //         <LeaderboardsCard {...cards[0]} />
  //         <LeaderboardsCard {...cards[1]} />
  //         <LeaderboardsCard {...cards[2]} />
  //       </Stack>
  //     )}
  //   </>
  // );

  return (
    <div className="w-full h-[74vh] bg-white rounded-xl p-5">
      <div className="flex flex-row gap-3 border-b border-gray-300">
        <img
          src="/images/leaderboard-title.svg"
          alt="Leader Board Title"
          width={100}
          height={100}
        />
        <div className="flex flex-col justify-center text-start gap-2">
          <h3 className="font-semibold text-2xl">Leaderboard</h3>
          <p className="text-white-200 text-sm">
            See how you rank among other traders. The Trades with highest amount
            of profit made, ranks the highest.
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center h-[80%]">
        <img
          src="/images/coming-soon-leaderboard.svg"
          alt="Leader Board Coming Soon"
          width={350}
          height={350}
        />
        <p className="text-white-300 font-semibold text-xl">
          Not Enough Trading Activity to form a leaderboard yet
        </p>
      </div>
    </div>
  );
};

export default LeaderboardsTable;
