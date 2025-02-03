import Spinner from "@/components/layout/Spinner";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { incrementTime } from "@/lib/helpers";
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
import { CalendarPlus, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import CustomCalendar from "./CustomCalendar";
import { useCreateBreak } from "./useCreateBreak";
import { useEditBreak } from "./useEditBreak";
import CustomStaffSelect from "./CustomStaffSelect";

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
  const { fetchingStaff } = useStaff();
  const { currentBookingInfo, currentStaffMember } = useCalendar();
  const bookingInfo = currentBookingInfo.current;

  const initialValues = {
    service: bookingInfo.subject || "",
    staff: currentStaffMember?.id.toString() || "",
    date: startOfDay(bookingInfo.date || new Date()),
    startTime: bookingInfo.startTime || "12:00",
    endTime: bookingInfo.endTime || "13:00",
    notes: bookingInfo.guestInfo.name || "",
    id: bookingInfo.id || 0,
  };

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

  if (fetchingStaff) return <Spinner />;

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
                <Select
                  value={field.value}
                  onValueChange={(e) => {
                    field.onChange(e);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Välj en frånvaro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"Lunchrast"}>
                      <span>Lunchrast</span>
                    </SelectItem>
                    <SelectItem value={"Sjukdom"}>
                      <span>Sjukdom</span>
                    </SelectItem>
                    <SelectItem value={"Frånvaro"}>
                      <span>Annan frånvaro</span>
                    </SelectItem>
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
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormControl>
                    <div className="flex">
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <span className="mx-2 mt-1">{"–"}</span>

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormControl>
                    <div className="flex items-center">
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
