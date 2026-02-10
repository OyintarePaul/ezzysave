import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { ComponentProps } from "react";
import AsyncSelect from "react-select/async";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FormInputProps extends ComponentProps<typeof Input> {
  label: string;
  icon?: React.ReactNode;
  error?: string | null;
}

export const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  icon,
  error,
  ...props
}) => {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </Label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <Input
          {...props}
          id={id}
          className={`w-full rounded-lg ${icon ? "pl-10" : "pl-4"} ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
      </div>

      {error && (
        <p className="mt-1 flex items-center text-xs text-red-500">
          <AlertCircle className="h-3 w-3 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

// Reusable checkbox component
export interface FormCheckboxProps {
  id: string;
  name: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (name: string, checked: boolean) => void;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  id,
  name,
  label,
  description,
  checked,
  onChange,
}) => (
  <div className="flex items-start space-x-3">
    <Checkbox
      id={id}
      name={name}
      checked={checked}
      onCheckedChange={() => onChange(name, !checked)}
      className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary mt-0.5"
    />
    <div>
      <Label htmlFor={id} className="font-medium">
        {label}
      </Label>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  </div>
);

interface FormSelectProps
  extends Omit<ComponentProps<typeof Select>, "onValueChange"> {
  error?: string | null;
  label: string;
  icon?: React.ReactNode;
  // react hook form onChange handler signature: (name: string, value: string) => void
  onChange: (value: string) => void;
  options: { label: string; value: string; key: string | number }[];
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  options,
  error,
  icon,
  onChange,
  ...props
}) => {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={props.name}
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </Label>
      <Select
        name={props.name}
        value={props.value}
        onValueChange={(value) => onChange(value)}
      >
        <SelectTrigger className="w-full rounded-lg h-20">
          <div className="flex gap-2 items-center">
            {icon}
            <SelectValue placeholder="Select an option" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {options.map((option) => (
              <SelectItem key={option.key} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && (
        <p className="mt-1 flex items-center text-xs text-red-500">
          <AlertCircle className="h-3 w-3 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};
