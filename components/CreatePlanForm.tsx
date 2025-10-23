"use client";
import { useState, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ChevronDownIcon } from "lucide-react";
import { wait } from "@/lib/utils";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  planName: z.string().min(2).max(50),
  planDescription: z.string().min(5).max(200).optional(),
  planType: z.enum(["daily", "target", "fixed"]),
  dailyAmount: z.coerce.number<number>().min(1).optional(),
  targetAmount: z.coerce.number<number>().min(1).optional(),
  fixedAmount: z.coerce.number<number>().min(1).optional(),
  maturityDate: z.date().optional(),
});

const CreatePlanForm = ({
  planType,
}: {
  planType: "daily" | "target" | "fixed";
}) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date(Date.now()));
  const [month, setMonth] = useState<Date | undefined>(date);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      planName: "",
      planDescription: "",
      planType,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      await wait(1000);
      toast.success("Plan created successfully!");
    });
    router.push("/dashboard/savings");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-md"
      >
        <FormField
          control={form.control}
          name="planName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan Name</FormLabel>
              <FormControl>
                <Input placeholder="Buy a house" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="planDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Add in a description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {planType == "daily" && (
          <FormField
            control={form.control}
            name="dailyAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter your dialy amount</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupInput {...field} />
                    <InputGroupAddon>&#8358;</InputGroupAddon>
                  </InputGroup>
                </FormControl>
                <FormDescription>
                  This is the amount that will be recored in your account daily
                  anytime you make a deposit
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {planType == "target" && (
          <FormField
            control={form.control}
            name="targetAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Amount</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupInput {...field} />
                    <InputGroupAddon>&#8358;</InputGroupAddon>
                  </InputGroup>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  This is the amount that you want to save towards your target
                  goal.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {planType == "fixed" && (
          <FormField
            control={form.control}
            name="fixedAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fixed Amount</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupInput {...field} />
                    <InputGroupAddon>&#8358;</InputGroupAddon>
                  </InputGroup>
                </FormControl>
                <FormDescription>
                  This is the amount that you want to save towards your fixed
                  goal.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {planType == "fixed" && (
          <FormField
            control={form.control}
            name="fixedAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maturity Date</FormLabel>
                <FormControl>
                  <div className="relative flex gap-2">
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date"
                          className="w-full justify-between font-normal"
                        >
                          {date ? date.toLocaleDateString() : "Select date"}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="end"
                        alignOffset={-8}
                        sideOffset={10}
                      >
                        <Calendar
                          mode="single"
                          selected={form.getValues("maturityDate")}
                          captionLayout="dropdown"
                          month={month}
                          onMonthChange={setMonth}
                          onSelect={(date) => {
                            form.setValue("maturityDate", date);
                            setDate(date);
                            setOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </FormControl>
                <FormDescription>
                  This is the date when you will receive your fixed amount.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={pending}>
          {pending && <Spinner />}
          Create Plan
        </Button>
      </form>
    </Form>
  );
};

export default CreatePlanForm;
