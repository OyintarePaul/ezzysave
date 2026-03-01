import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, KeySquare } from "lucide-react";

interface ErrorState {
  type: "error" | "success" | "info";
  message: string;
}

export function AlertMessage({ error }: { error: ErrorState }) {
  if (!error.message) return null;

  // Map your internal types to the Shadcn variants
  const variantMap = {
    error: "destructive",
    success: "success",
    info: "info",
  } as const;

  // Map icons to the types
  const IconMap = {
    error: AlertCircle,
    success: CheckCircle,
    info: KeySquare,
  } as const;

  const Icon = IconMap[error.type] || AlertCircle;
  const variant = variantMap[error.type] || "default";

  return (
    <Alert variant={variant}>
      <Icon className="h-4 w-4" />
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
}
