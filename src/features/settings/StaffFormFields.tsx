import TimePickerField from "@/components/layout/TimePickerField";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { FormLabel } from "@/components/ui/form";
import { useDebouncedTimeValidation } from "@/hooks/useDebouncedTimeValidation";
import { format } from "date-fns";
import { X } from "lucide-react";
import { useState } from "react";
import {
  FieldArrayWithId,
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form";
import CustomCalendar from "../calendar/CustomCalendar";

type StaffFormFieldsProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  i: number;
  field: FieldArrayWithId<
    { workdays: { startTime: string; endTime: string; date: Date }[] },
    "workdays",
    "id"
  >;
  remove: (index: number) => void;
  unavailabeDates: Date[];
  nextDate: Date;
};

export default function StaffFormFields<T extends FieldValues>({
  i,
  field,
  form,
  remove,
  unavailabeDates,
  nextDate,
}: StaffFormFieldsProps<T>): JSX.Element {
  const [formfield, setFormfield] = useState({
    startTime: "09:00",
    endTime: "17:00",
    date: nextDate,
  });

  // Make sure that the end time is always after the start time
  const { handleTyping } = useDebouncedTimeValidation({
    form,
    startTimeField: `workdays.${i}.startTime` as Path<T>,
    endTimeField: `workdays.${i}.endTime` as Path<T>,
  });

  return (
    <AccordionItem
      value={field.id}
      key={field.id}
      className="border rounded-md border-solid border-zinc-200 px-4"
    >
      <AccordionTrigger>
        <X
          className="text-red-500"
          strokeWidth={1.5}
          size={14}
          onClick={() => remove(i)}
        />
        {`Kl.${formfield.startTime}–${formfield.endTime} ${format(
          formfield.date,
          "yyyy-MM-dd"
        )}`}
      </AccordionTrigger>
      <AccordionContent>
        <Card className="p-4 space-y-4">
          <CustomCalendar
            control={form.control}
            name={`workdays.${i}.date` as Path<T>}
            unavailabeDates={unavailabeDates}
            onSelect={(selectedDate) => {
              if (selectedDate)
                setFormfield((prev) => ({ ...prev, date: selectedDate }));
            }}
          />
          <div className="space-y-2">
            <FormLabel htmlFor="startTime">Tid</FormLabel>
            <div className="flex w-full">
              <TimePickerField
                name={`workdays.${i}.startTime` as Path<T>}
                control={form.control}
                handleOnChange={(value: string) => {
                  handleTyping();
                  if (formfield.endTime !== value) {
                    setFormfield((prev) => ({ ...prev, startTime: value }));
                  }
                }}
              />
              <span className="mx-2 mt-1">{"–"}</span>
              <TimePickerField
                name={`workdays.${i}.endTime` as Path<T>}
                control={form.control}
                handleOnChange={(value: string) => {
                  handleTyping();
                  if (formfield.startTime !== value) {
                    setFormfield((prev) => ({ ...prev, endTime: value }));
                  }
                }}
              />
            </div>
          </div>
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
}
