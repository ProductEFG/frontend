import { useGlobal } from "@/providers/GlobalProvider";
import { ArrowRight } from "lucide-react";
import React from "react";

const LeaderboardsTable = () => {
  const { handleNav, enabledTabs } = useGlobal();
  return (
    <div className="w-full bg-white rounded-xl p-5">
      <div className="flex justify-between border-b border-gray-300">
        <div className="flex flex-row gap-3">
          <img
            src="/images/leaderboard-title.svg"
            alt="Leader Board Title"
            width={100}
            height={100}
          />
          <div className="flex flex-col justify-center text-start gap-2">
            <h3 className="font-semibold text-xl">Leaderboard</h3>
            <p className="text-white-200 text-xs">
              See how you rank among other traders. The trades with highest
              amount of profit made, ranks the highest.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 justify-center items-end">
          <button
            className="text-[20px] text-purple flex gap-2 items-center justify-center"
            onClick={() => {
              const moveNumber = 3 - enabledTabs;
              handleNav(true, moveNumber);
            }}
          >
            Go to Portfolio
            <ArrowRight />
          </button>
          <button
            className="text-[20px] text-purple flex gap-2 items-center justify-center"
            onClick={handleNav}
          >
            Go to Market Insights
            <ArrowRight />
          </button>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center">
        <img
          src="/images/coming-soon-leaderboard.svg"
          alt="Leader Board Coming Soon"
          width={320}
          height={320}
        />
        <p className="text-white-300 font-medium">
          Not Enough Trading Activity to form a leaderboard yet
        </p>
      </div>
    </div>
  );
};

export default LeaderboardsTable;
