import Spinner from "@/components/layout/Spinner";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCalendar } from "@/context/CalendarContext";
import { useStaff } from "@/hooks/useStaff";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import {
  differenceInMinutes,
  parse,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
} from "date-fns";
import { CalendarPlus, Loader2 } from "lucide-react";
import { useMemo } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import TimePickerField from "../../components/layout/TimePickerField";
import CustomCalendar from "./CustomCalendar";
import CustomStaffSelect from "./CustomStaffSelect";
import { useCreateBreak } from "./useCreateBreak";
import { useEditBreak } from "./useEditBreak";
import { useDebouncedTimeValidation } from "@/hooks/useDebouncedTimeValidation";

type OnSubmitType = z.infer<typeof formSchema>;

const formSchema = z.object({
  service: z.string().nonempty("Titel är obligatorisk"),
  staff: z.string().nonempty("Välj en person"),
  date: z.date({ required_error: "Välj ett datum" }),
  startTime: z.string().nonempty("Välj en starttid"),
  endTime: z.string().nonempty("Välj en sluttid"),
  notes: z.string().optional(),
  id: z.number(),
});

export default function AddBreakForm(): JSX.Element {
  const { isLoadingStaff } = useStaff();
  const { currentBookingInfo, currentStaffMember } = useCalendar();
  const bookingInfo = currentBookingInfo.current;

  const initialValues = useMemo(
    () => ({
      service: bookingInfo.subject || "",
      staff: currentStaffMember?.id.toString() || "",
      date: startOfDay(bookingInfo.date || new Date()),
      startTime: bookingInfo.startTime || "12:00",
      endTime: bookingInfo.endTime || "13:00",
      notes: bookingInfo.guestInfo.name || "",
      id: bookingInfo.id || 0,
    }),
    [bookingInfo, currentStaffMember]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });
  const { onCreateBreak, isCreatingBreak } = useCreateBreak();
  const { onEditBreak, isEditingBreak } = useEditBreak();

  function onSubmit(data: OnSubmitType) {
    const newBreak = {
      service: data.service,
      staff_id: +data.staff,
      selectedDate: setSeconds(setMinutes(setHours(data.date, 12), 0), 0)
        .toISOString()
        .split("T")[0],
      startTime: data.startTime,
      endTime: data.endTime,
      duration: differenceInMinutes(
        parse(data.endTime, "HH:mm", new Date()),
        parse(data.startTime, "HH:mm", new Date())
      ),
      notes: data.notes,
    };

    if (data.id === 0) onCreateBreak(newBreak);
    if (data.id !== 0)
      onEditBreak({ breakBooking: newBreak, id: data.id ?? 0 });
  }
  // Make sure that the end time is always after the start time
  const { handleTyping } = useDebouncedTimeValidation({
    form,
    startTimeField: "startTime",
    endTimeField: "endTime",
  });

  if (isLoadingStaff) return <Spinner />;

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 min-w-full"
      >
        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="service">Frånvaroorsak</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj en frånvaro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"Lunchrast"}>Lunchrast</SelectItem>
                    <SelectItem value={"Sjukdom"}>Sjukdom</SelectItem>
                    <SelectItem value={"Frånvaro"}>Annan frånvaro</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <CustomStaffSelect control={form.control} name="staff" />
        <CustomCalendar control={form.control} name="date" />

        <div className="space-y-2">
          <FormLabel htmlFor="startTime">Tid</FormLabel>
          <div className="flex w-full">
            <TimePickerField
              control={form.control}
              name="startTime"
              handleOnChange={handleTyping}
            />
            <span className="mx-2 mt-1">{"–"}</span>
            <TimePickerField
              control={form.control}
              name="endTime"
              handleOnChange={handleTyping}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="notes">Bokningsanteckningar</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Controller
          name="id"
          control={form.control}
          render={({ field }) => <input type="hidden" {...field} />}
        />

        <div className="w-full flex justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Stäng
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              disabled={!form.formState.isValid || !form.formState.isDirty}
              type="submit"
            >
              {isCreatingBreak || isEditingBreak ? (
                <Loader2 className="animate-spin" />
              ) : (
                <CalendarPlus strokeWidth={1.5} />
              )}
              {bookingInfo.id === 0
                ? isCreatingBreak || isEditingBreak
                  ? "Lägger till"
                  : "Lägg till"
                : isCreatingBreak || isEditingBreak
                ? "Uppdaterar"
                : "Uppdatera"}
            </Button>
          </DialogClose>
        </div>
      </form>
    </FormProvider>
  );
}
