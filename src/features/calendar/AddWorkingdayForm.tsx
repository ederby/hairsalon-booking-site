import Spinner from "@/components/layout/Spinner";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCalendar } from "@/context/CalendarContext";
import { useStaff } from "@/hooks/useStaff";
import { incrementTime } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarPlus, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import CustomCalendar from "./CustomCalendar";
import CustomStaffSelect from "./CustomStaffSelect";
import { useCreateWorkday } from "./useCreateWorkday";
import { toast } from "@/hooks/use-toast";

type OnSubmitType = z.infer<typeof formSchema>;

const formSchema = z.object({
  staff: z.string().nonempty("Välj en person"),
  date: z.date({ required_error: "Välj ett datum" }),
  startTime: z.string().nonempty("Välj en starttid"),
  endTime: z.string().nonempty("Välj en sluttid"),
});

export function AddWorkingDayForm(): JSX.Element {
  const { fetchingStaff } = useStaff();
  const { onCreateWorkday, isCreatingWorkday } = useCreateWorkday();
  const { currentStaffMember, filteredEvents } = useCalendar();
  const initialValues = {
    staff: currentStaffMember?.id.toString() || "",
    date: new Date(),
    startTime: "09:00",
    endTime: "17:00",
  };
  const form = useForm<OnSubmitType>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  function onSubmit(data: OnSubmitType) {
    const workdayAlreadyExists = filteredEvents.some((event) => {
      return (
        format(new Date(event.StartTime), "yyyy-MM-dd") ===
          format(data.date, "yyyy-MM-dd") &&
        event.Subject === "Start av dagen" &&
        event.ResourceId === +data.staff
      );
    });

    const workday = {
      date: format(data.date, "yyyy-MM-dd"),
      staffID: +data.staff,
      startTime: data.startTime,
      endTime: data.endTime,
    };

    if (workdayAlreadyExists) {
      toast({
        title: "Obs!",
        description: "Arbetsdagen är redan tillagd",
        onSuccess: false,
      });
    } else {
      onCreateWorkday(workday);
    }
  }

  if (fetchingStaff) return <Spinner />;

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 min-w-full"
      >
        <CustomStaffSelect control={form.control} name="staff" />
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
                    onChange={(v) => field.onChange(v)}
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
                    onChange={(v) => field.onChange(v)}
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

        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Stäng</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              disabled={!form.formState.isValid || !form.formState.isDirty}
              type="submit"
            >
              {isCreatingWorkday ? (
                <Loader2 className="animate-spin" />
              ) : (
                <CalendarPlus strokeWidth={1.5} />
              )}
              {isCreatingWorkday ? "Lägger till" : "Lägg till"}
            </Button>
          </DialogClose>
        </div>
      </form>
    </FormProvider>
  );
}
