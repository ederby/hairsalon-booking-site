import Spinner from "@/components/layout/Spinner";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDebouncedTimeValidation } from "@/hooks/useDebouncedTimeValidation";
import { useStaff } from "@/hooks/useStaff";
import { incrementTime } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarPlus, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import CustomCalendar from "../../features/calendar/CustomCalendar";
import CustomStaffSelect from "../../features/calendar/CustomStaffSelect";
import { useCreateWorkday } from "../../hooks/useCreateWorkday";
import { useEditWorkday } from "@/features/settings/useEditWorkday";
import { WorkdayType } from "@/services/types";

type OnSubmitType = z.infer<typeof formSchema>;

type AddWorkDayFormProps = {
  currentWorkday?: WorkdayType;
};

const formSchema = z.object({
  staff: z.string().nonempty("Välj en person"),
  date: z.date({ required_error: "Välj ett datum" }),
  startTime: z.string().nonempty("Välj en starttid"),
  endTime: z.string().nonempty("Välj en sluttid"),
  id: z.number().optional(),
});

export function AddWorkDayForm({
  currentWorkday,
}: AddWorkDayFormProps): JSX.Element {
  const { isLoadingStaff } = useStaff();
  const { onCreateWorkday, isCreatingWorkday } = useCreateWorkday();
  const { onEditWorkday, isEditingWorkday } = useEditWorkday();
  const initialValues = {
    staff: currentWorkday?.staffID.toString() || "",
    date: currentWorkday?.date ? new Date(currentWorkday.date) : new Date(),
    startTime: currentWorkday?.startTime || "09:00",
    endTime: currentWorkday?.endTime || "17:00",
    id: currentWorkday?.id || 0,
  };
  const form = useForm<OnSubmitType>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  // Make sure that the end time is always after the start time
  const { handleTyping } = useDebouncedTimeValidation({
    form,
    startTimeField: "startTime",
    endTimeField: "endTime",
  });

  function onSubmit(data: OnSubmitType) {
    const workday = {
      date: format(data.date, "yyyy-MM-dd"),
      staffID: +data.staff,
      startTime: data.startTime,
      endTime: data.endTime,
    };

    if (data.id === 0) {
      onCreateWorkday(workday);
    } else {
      onEditWorkday({ ...workday, id: data.id ?? 0 });
    }
  }

  if (isLoadingStaff) return <Spinner />;

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 min-w-full"
      >
        {initialValues.id === 0 ? (
          <CustomStaffSelect control={form.control} name="staff" />
        ) : (
          <Controller
            name="staff"
            control={form.control}
            render={({ field }) => <input type="hidden" {...field} />}
          />
        )}
        <CustomCalendar control={form.control} name="date" />

        <div className="space-y-2">
          <FormLabel htmlFor="startTime">Tid</FormLabel>
          <div className="flex w-full">
            <Controller
              name="startTime"
              control={form.control}
              render={({ field }) => (
                <div className="flex w-full">
                  <Button
                    type="button"
                    className="rounded-r-none border-r-0 px-2 h-9 text-zinc-500"
                    variant="outline"
                    onClick={() =>
                      field.onChange(incrementTime(field.value, -15))
                    }
                  >
                    <ChevronLeft size={16} strokeWidth={1.5} />
                  </Button>
                  <Input
                    className="rounded-none shadow-none justify-center relative z-10 h-9 text-sm"
                    type="time"
                    value={field.value}
                    onChange={(v) => {
                      handleTyping();
                      field.onChange(v);
                    }}
                    step="900"
                  />
                  <Button
                    type="button"
                    className="rounded-l-none border-l-0 px-2 h-9 text-zinc-500"
                    variant="outline"
                    onClick={() =>
                      field.onChange(incrementTime(field.value, 15))
                    }
                  >
                    <ChevronRight size={16} strokeWidth={1.5} />
                  </Button>
                </div>
              )}
            />

            <span className="mx-2 mt-1">{"–"}</span>

            <Controller
              name="endTime"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-center w-full">
                  <Button
                    type="button"
                    className="rounded-r-none border-r-0 px-2 h-9 text-zinc-500"
                    variant="outline"
                    onClick={() =>
                      field.onChange(incrementTime(field.value, -15))
                    }
                  >
                    <ChevronLeft size={16} strokeWidth={1.5} />
                  </Button>
                  <Input
                    className="rounded-none shadow-none justify-center relative z-10 h-9 text-sm"
                    type="time"
                    value={field.value}
                    onChange={(v) => {
                      handleTyping();
                      field.onChange(v);
                    }}
                    step="900"
                  />
                  <Button
                    type="button"
                    className="rounded-l-none border-l-0 px-2 h-9 text-zinc-500"
                    variant="outline"
                    onClick={() =>
                      field.onChange(incrementTime(field.value, 15))
                    }
                  >
                    <ChevronRight size={16} strokeWidth={1.5} />
                  </Button>
                </div>
              )}
            />
          </div>
        </div>

        <Controller
          name="id"
          control={form.control}
          render={({ field }) => <input type="hidden" {...field} />}
        />

        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Stäng</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button disabled={!form.formState.isValid} type="submit">
              {isCreatingWorkday || isEditingWorkday ? (
                <Loader2 className="animate-spin" />
              ) : (
                <CalendarPlus strokeWidth={1.5} />
              )}
              {isCreatingWorkday || isEditingWorkday
                ? currentWorkday?.id
                  ? "Uppdaterar"
                  : "Lägger till"
                : currentWorkday?.id
                ? "Uppdatera"
                : "Lägg till"}
            </Button>
          </DialogClose>
        </div>
      </form>
    </FormProvider>
  );
}
