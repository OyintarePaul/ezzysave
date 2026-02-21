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
  disabled,
  ...props
}: CustomButtonProps) => {
  return (
    <Button
      {...props}
      disabled={isPending || disabled}
      className={cn("px-6 py-3 font-semibold h-auto cursor-pointer", className)}
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
