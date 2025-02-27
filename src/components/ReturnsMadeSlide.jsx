import React, { memo, useState } from "react";
import CardBackground from "./CardBackground";
import { Button } from "./ui/button";
import InfoDialog from "./InfoDialog";
import { dialogs } from "@/data/constants";

const ReturnsMadeSlide = memo(({ title, dialog = true, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative w-full h-full pb-[12px]">
      <div className="bg-[#e1dcfa] w-full h-full flex flex-col rounded-3xl">
        <div className="p-[18px] bg-purple rounded-t-3xl flex flex-row gap-2 items-center">
          <p className="text-white text-[30px] leading-[29px] font-semibold">
            {title}
          </p>
          {dialog && (
            <Button
              className="w-[30px] h-[30px] bg-white rounded-full flex justify-center items-center text-black hover:bg-white text-lg"
              onClick={() => setOpen(true)}
            >
              !
            </Button>
          )}
        </div>
        <div className="p-[18px]">{children}</div>
      </div>
      <CardBackground />
      {dialog && (
        <InfoDialog
          open={open}
          setOpen={setOpen}
          title={dialogs[title].title}
          image={dialogs[title].image}
          paragraph1={dialogs[title].paragraph1}
          paragraph2={dialogs[title].paragraph2}
        />
      )}
    </div>
  );
});

export default ReturnsMadeSlide;
