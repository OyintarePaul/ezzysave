import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { ComponentProps } from "react";
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
  id: string;
  label: string;
  type?: string;
  value?: string | number;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  icon?: React.ReactNode;
  placeholder?: string;
  as?: "textarea";
  error?: string | null;
}

export const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  icon,
  placeholder,
  error,
  as,
  readOnly,
  ...props
}) => {
  const commonClasses = "w-full rounded-lg";

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
        {as === "textarea" ? (
          <Textarea
            readOnly={readOnly}
            id={id}
            name={id}
            value={value as string}
            onChange={onChange}
            placeholder={placeholder}
            className={`${commonClasses} ${icon ? "pl-10" : "pl-4"} min-h-32`}
          />
        ) : (
          <Input
            {...props}
            id={id}
            name={id}
            type={type}
            value={value}
            readOnly={readOnly}
            onChange={onChange}
            placeholder={placeholder}
            className={`${commonClasses} ${icon ? "pl-10" : "pl-4"} ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
        )}
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

export const FormSelect: React.FC<{
  name: string;
  label: string;
  value?: string;
  className?: string;
  icon?: React.ReactNode;
  options: { label: string; value: string, key: string | number }[];
  onChange?: (value: string) => void;
}> = ({ name, label, value, onChange, options, className, icon }) => {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={name}
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </Label>
      <Select name={name} value={value} onValueChange={onChange}>
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
    </div>
  );
};
