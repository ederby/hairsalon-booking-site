import Spinner from "@/components/layout/Spinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarCog, Info, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useBookingSettings } from "./useBookingSettings";
import { useEditBookingSettings } from "./useEditBookingSettings";
import { Textarea } from "@/components/ui/textarea";

type FormSchema = z.infer<typeof formSchema>;

const weekdays: { day: keyof z.infer<typeof formSchema>; label: string }[] = [
  { day: "monday", label: "Måndag" },
  { day: "tuesday", label: "Tisdag" },
  { day: "wednesday", label: "Onsdag" },
  { day: "thursday", label: "Torsdag" },
  { day: "friday", label: "Fredag" },
  { day: "saturday", label: "Lördag" },
  { day: "sunday", label: "Söndag" },
];

const formSchema = z.object({
  monday: z.boolean(),
  tuesday: z.boolean(),
  wednesday: z.boolean(),
  thursday: z.boolean(),
  friday: z.boolean(),
  saturday: z.boolean(),
  sunday: z.boolean(),
  calendarViewStart: z.string(),
  calendarViewEnd: z.string(),
  timeslotInterval: z.string(),
  cancellationPolicy: z.string(),
});

export default function SettingsBookings() {
  const { bookingSettings, isLoadingBookingSettings } = useBookingSettings();
  const [dialogInfo, setDialogInfo] = useState({
    open: false,
    title: "",
    description: "",
  });
  const { onEditBookingSettings, isEditingBookingSettings } =
    useEditBookingSettings();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
      calendarViewStart: "",
      calendarViewEnd: "",
      timeslotInterval: "",
      cancellationPolicy: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (bookingSettings) {
      form.reset({
        monday: bookingSettings.calendarViewDays.includes(1),
        tuesday: bookingSettings.calendarViewDays.includes(2),
        wednesday: bookingSettings.calendarViewDays.includes(3),
        thursday: bookingSettings.calendarViewDays.includes(4),
        friday: bookingSettings.calendarViewDays.includes(5),
        saturday: bookingSettings.calendarViewDays.includes(6),
        sunday: bookingSettings.calendarViewDays.includes(0),
        calendarViewStart: bookingSettings.calendarViewHours.startTime,
        calendarViewEnd: bookingSettings.calendarViewHours.endTime,
        timeslotInterval: bookingSettings.timeslotInterval
          ? bookingSettings.timeslotInterval.toString()
          : "",
        cancellationPolicy: bookingSettings.cancellationPolicy,
      });
    }
  }, [bookingSettings, form]);

  function onSubmit(data: FormSchema) {
    const newSettings = {
      calendarViewDays: [
        data.monday && 1,
        data.tuesday && 2,
        data.wednesday && 3,
        data.thursday && 4,
        data.friday && 5,
        data.saturday && 6,
        data.sunday && 0,
      ].filter((day) => day !== false),
      calendarViewHours: {
        startTime: data.calendarViewStart,
        endTime: data.calendarViewEnd,
      },
      timeslotInterval: parseInt(data.timeslotInterval),
      cancellationPolicy: data.cancellationPolicy,
      id: 1,
    };
    onEditBookingSettings(newSettings);
  }

  if (isLoadingBookingSettings) return <Spinner />;

  return (
    <>
      <div>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <Card className="p-4 space-y-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between space-x-2">
                  <h4 className="scroll-m-20 text-md font-semibold tracking-tight text-[var(--primary-600)]">
                    Kalenderdagar
                  </h4>
                  <Info
                    className="cursor-pointer text-[var(--primary-700)]"
                    onClick={() =>
                      setDialogInfo({
                        open: true,
                        title: "Kalenderdagar",
                        description:
                          "Växla på de veckodagar du vill visa i bokningskalendern.",
                      })
                    }
                    strokeWidth={1.5}
                    size={16}
                  />
                </div>
                <div className="space-y-2">
                  {weekdays.map(({ day, label }, i) => (
                    <div key={day}>
                      <Controller
                        name={day}
                        control={form.control}
                        render={({ field }) => (
                          <div className="flex items-center space-x-2 justify-between">
                            <Label
                              htmlFor="monday"
                              className={`transition-colors ${
                                field.value ? "" : "text-zinc-400"
                              }`}
                            >
                              {label}
                            </Label>
                            <Switch
                              id={day}
                              checked={!!field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        )}
                      />
                      {i < weekdays.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            <Card className="p-4 space-y-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between space-x-2">
                  <h4 className="scroll-m-20 text-md font-semibold tracking-tight">
                    Kalendertimmar
                  </h4>
                  <Info
                    className="cursor-pointer text-[var(--primary-700)]"
                    onClick={() =>
                      setDialogInfo({
                        open: true,
                        title: "Kalendertimmar",
                        description:
                          "Välj vilka timmar som ska visas i bokningskalendern.",
                      })
                    }
                    strokeWidth={1.5}
                    size={16}
                  />
                </div>
                <div className="flex flex-wrap space-x-4">
                  <div className="flex-1">
                    <Controller
                      name="calendarViewStart"
                      control={form.control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Label htmlFor="calendarViewStart">Starttid</Label>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Välj en starttid" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from(
                                { length: 8 },
                                (_, i) => "0" + (i + 1)
                              ).map((hour) => (
                                <SelectItem key={hour} value={hour + ":00"}>
                                  {hour + ":00"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <Controller
                      name="calendarViewEnd"
                      control={form.control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Label htmlFor="calendarViewStart">Sluttid</Label>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Välj en sluttid" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 8 }, (_, i) => 16 + i).map(
                                (hour) => (
                                  <SelectItem key={hour} value={hour + ":00"}>
                                    {hour + ":00"}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 space-y-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between space-x-2">
                  <h4 className="scroll-m-20 text-md font-semibold tracking-tight">
                    Bokningsintervall
                  </h4>
                  <Info
                    className="cursor-pointer text-[var(--primary-700)]"
                    onClick={() =>
                      setDialogInfo({
                        open: true,
                        title: "Bokningsintervall",
                        description:
                          "Välj i vilket tidsintervall bokningsbara tider ska visas i.",
                      })
                    }
                    strokeWidth={1.5}
                    size={16}
                  />
                </div>
              </div>
              <div>
                <Controller
                  name="timeslotInterval"
                  control={form.control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="calendarViewStart">Sluttid</Label>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Välj ett tidsintervall" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="15">15</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="30">30</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
              </div>
            </Card>

            <Card className="p-4 space-y-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between space-x-2">
                  <h4 className="scroll-m-20 text-md font-semibold tracking-tight">
                    Avbokningspolicy
                  </h4>
                  <Info
                    className="cursor-pointer text-[var(--primary-700)]"
                    onClick={() =>
                      setDialogInfo({
                        open: true,
                        title: "Avbokningspolicy",
                        description:
                          "Fyll i din avbokningspolicy här. Den visas för kunderna när de bokar.",
                      })
                    }
                    strokeWidth={1.5}
                    size={16}
                  />
                </div>
              </div>
              <div>
                <Controller
                  name="cancellationPolicy"
                  control={form.control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      className="w-full h-32 p-2 border border-zinc-200 rounded-md"
                      placeholder="Skriv din avbokningspolicy här"
                    />
                  )}
                />
              </div>
            </Card>

            <div className="flex justify-end">
              <Button
                disabled={!form.formState.isValid || !form.formState.isDirty}
                type="submit"
              >
                {isEditingBookingSettings ? (
                  <>
                    <Loader2 className="animate-spin" /> <span>Sparar</span>
                  </>
                ) : (
                  <>
                    <CalendarCog strokeWidth={1.5} />{" "}
                    {!form.formState.isValid || !form.formState.isDirty
                      ? "Sparat"
                      : "Spara"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>

      <Dialog
        open={dialogInfo.open}
        onOpenChange={() =>
          setDialogInfo((prev) => ({ ...prev, open: !prev.open }))
        }
      >
        <DialogContent className="overflow-y-auto max-h-full">
          <DialogHeader>
            <DialogTitle>{dialogInfo.title}</DialogTitle>
            <DialogDescription>{dialogInfo.description}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
