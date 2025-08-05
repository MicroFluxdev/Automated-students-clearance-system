import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipDemoProps {
  children: React.ReactNode;
  isSelected?: boolean;
}

export default function TooltipDemo({
  children,
  isSelected,
}: TooltipDemoProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        {isSelected === true ? (
          <p className="text-white">Unselect All</p>
        ) : isSelected === false ? (
          <p className="text-white">Select All</p>
        ) : null}
      </TooltipContent>
    </Tooltip>
  );
}
