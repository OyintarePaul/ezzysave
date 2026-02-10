import { ComponentProps } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Spinner } from "./ui/spinner";

type CustomButtonProps = ComponentProps<typeof Button> & {
  isPending?: boolean;
};

const CustomButton = ({
  className,
  children,
  isPending,
  ...props
}: CustomButtonProps) => {
  return (
    <Button
      {...props}
      className={cn(
        "px-6 py-2.5 font-semibold h-auto cursor-pointer",
        className,
      )}
    >
      {isPending ? (
        <span className="flex items-center gap-2">
          <Spinner />
          {children}
        </span>
      ) : (
        <span className="flex items-center gap-2">{children}</span>
      )}
    </Button>
  );
};

export default CustomButton;
