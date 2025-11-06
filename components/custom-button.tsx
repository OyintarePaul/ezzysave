import { ComponentProps } from "react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils";

const CustomButton = ({className, children, ...props}: ComponentProps<typeof Button>) => {
  return (
    <Button {...props} className={cn("px-6 py-2.5 font-semibold h-auto cursor-pointer", className)}>
      {children}
    </Button>
  );
}

export default CustomButton