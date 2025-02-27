import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const InfoDialog = ({
  open,
  setOpen,
  title,
  image,
  paragraph1,
  paragraph2,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[586px] p-6">
        <DialogTitle className="hidden">Info Dialogbox</DialogTitle>
        <div className="flex flex-col justify-center items-center mb-[36px]">
          <div className="w-[222px] h-[222px] flex justify-center items-center mb-[36px]">
            <img
              src={`/images/${image}.png`}
              alt="Dialog Image"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="font-medium">{title}</h2>
          <div className="text-[16px] text-[#BDC1C6] text-center mt-2 space-y-5">
            <p>{paragraph1}</p>
            <p>{paragraph2}</p>
          </div>
        </div>
        <DialogFooter>
          <Button
            className="w-full bg-purple rounded-full font-light tracking-wider hover:bg-purple-700"
            onClick={() => setOpen(false)}
          >
            Got it!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InfoDialog;
