import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormLabel } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatCustomDate } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { sv } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

type CustomCalendarProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  className?: string;
  label?: string;
};

export default function CustomCalendar<T extends FieldValues>({
  control,
  name,
  className = "w-full flex flex-col space-y-3",
  label = "Datum",
}: CustomCalendarProps<T>): JSX.Element {
  return (
    <div className={className}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "justify-start text-left font-normal h-9",
                  !field.value && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {field.value ? (
                  formatCustomDate(new Date(field.value))
                ) : (
                  <span>Välj ett datum</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value || new Date()}
                onSelect={(selectedDate) => {
                  field.onChange(selectedDate);
                }}
                initialFocus
                locale={sv}
              />
            </PopoverContent>
          </Popover>
        )}
      />
    </div>
  );
}
