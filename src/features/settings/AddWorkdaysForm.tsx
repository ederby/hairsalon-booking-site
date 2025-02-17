import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { WorkdayType } from "@/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { format } from "date-fns";
import { CalendarPlus } from "lucide-react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateWorkday } from "../../hooks/useCreateWorkday";
import StaffFormFields from "./StaffFormFields";
import { useState } from "react";

type OnSubmitType = z.infer<typeof formSchema>;

const formSchema = z.object({
  workdays: z.array(
    z.object({
      date: z.date({ required_error: "Välj ett datum" }),
      startTime: z.string().nonempty("Välj en starttid"),
      endTime: z.string().nonempty("Välj en sluttid"),
    })
  ),
});

export default function AddWorkdaysForm({
  staffID,
}: {
  staffID: number;
}): JSX.Element {
  const [nextDate, setNextDate] = useState(new Date());
  const form = useForm<OnSubmitType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workdays: [
        {
          date: new Date(),
          startTime: "09:00",
          endTime: "17:00",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "workdays",
  });

  const unavailabeDates = fields.map((field) => field.date);

  const { onCreateWorkday } = useCreateWorkday();

  function onSubmit(data: OnSubmitType) {
    const newWorkdays: Omit<WorkdayType, "id">[] = data.workdays.map(
      (workday) => ({
        ...workday,
        date: format(new Date(workday.date), "yyyy-MM-dd"),
        staffID,
      })
    );
    newWorkdays.forEach((workday) => onCreateWorkday(workday));
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 min-w-full"
      >
        <Accordion type="single" className="space-y-2" collapsible>
          {fields.map((field, index) => (
            <StaffFormFields
              key={field.id}
              form={form}
              field={field}
              i={index}
              remove={remove}
              unavailabeDates={unavailabeDates}
              nextDate={nextDate}
            />
          ))}
          <Button
            className="w-full"
            variant="outline"
            type="button"
            onClick={() => {
              const lastWorkday = form.getValues(
                `workdays.${form.getValues("workdays").length - 1}`
              );
              const nextDate = lastWorkday
                ? new Date(
                    new Date(lastWorkday.date).setDate(
                      new Date(lastWorkday.date).getDate() + 1
                    )
                  )
                : new Date();
              setNextDate(nextDate);
              append({
                date: nextDate,
                startTime: "09:00",
                endTime: "17:00",
              });
            }}
          >
            <CalendarPlus strokeWidth={1.5} />
            Lägg till datum
          </Button>
        </Accordion>
        <div className="flex justify-end gap-4">
          <DialogClose asChild>
            <Button variant="outline">Stäng</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="submit">
              <CalendarPlus strokeWidth={1.5} />
              Lägg till
            </Button>
          </DialogClose>
        </div>
      </form>
    </FormProvider>
  );
}
