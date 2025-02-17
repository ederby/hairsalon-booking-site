import Spinner from "@/components/layout/Spinner";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCalendar } from "@/context/CalendarContext";
import { useStaff } from "@/hooks/useStaff";
import {
  incrementTime,
  isAfterTime,
  isBeforeTime,
  reduceExtraServicesDuration,
} from "@/lib/helpers";
import { BookingType, GuestInfoType } from "@/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Controller,
  ControllerRenderProps,
  FormProvider,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import { useCategories } from "../services/useCategories";
import { useExtraServices } from "../services/useExtraServices";
import CustomCalendar from "./CustomCalendar";
import CustomExtraservicesDropdown from "./CustomExtraservicesDropdown";
import CustomServiceSelect from "./CustomServiceSelect";
import CustomStaffSelect from "./CustomStaffSelect";
import { useCreateBooking } from "./useCreateBooking";
import { useEditBooking } from "./useEditBooking";
import { useServices } from "./useServices";

type CalendarEditFormProps = {
  bookAgain?: boolean;
};
type OnSubmitType = z.infer<typeof formSchema>;

const formSchema = z.object({
  service: z.string().nonempty("Titel är obligatorisk"),
  extraservices: z.array(z.number()).optional(),
  staff: z.string().nonempty("Välj en person"),
  date: z.date({ required_error: "Välj ett datum" }),
  startTime: z.string().nonempty("Välj en starttid"),
  endTime: z.string().nonempty("Välj en sluttid"),
  name: z.string().nonempty("Skriv kundens namn"),
  email: z.string().email().nonempty("Skriv en riktig emailadress"),
  phone: z.string().nonempty("Skriv ett telefonnummer"),
  observations: z.string().optional(),
  id: z.number().optional(),
});

export default function AddBookingForm({
  bookAgain = false,
}: CalendarEditFormProps): JSX.Element {
  const { currentBookingInfo, currentStaffMember } = useCalendar();
  const bookingInfo = currentBookingInfo.current;

  const { services, isLoadingServices } = useServices();
  const { categories, isLoadingCategories } = useCategories();
  const { isLoadingStaff } = useStaff();
  const { extraServices, isLoadingExtraServices } = useExtraServices();
  const { onEditBooking, isEditingBooking } = useEditBooking();

  const [selectedExtraServices, setSelectedExtraServices] = useState<number[]>(
    bookingInfo?.extraServices?.map((extraService) => extraService.id) || []
  );
  const extraServicesDuration = reduceExtraServicesDuration(
    extraServices?.filter((service) =>
      selectedExtraServices.includes(service.id)
    )
  );

  const [timeValidation, setTimeValidation] = useState({
    isBeforeOpeningTime: false,
    isAfterOpeningTime: false,
  });

  const { onCreateBooking } = useCreateBooking();

  const initialValues = {
    service: bookingInfo ? bookingInfo.serviceID.toString() : "1",
    extraservices: bookingInfo
      ? bookingInfo.extraServices.map((extraService) => extraService.id)
      : [],
    staff: currentStaffMember?.id.toString() || "",
    date: bookingInfo ? new Date(bookingInfo.date) : new Date(),
    startTime: bookingInfo.startTime,
    endTime: bookingInfo.endTime,
    name: bookingInfo ? bookingInfo.guestInfo.name : "",
    email: bookingInfo ? bookingInfo.guestInfo.email : "",
    phone: bookingInfo ? bookingInfo.guestInfo.phone : "",
    observations: bookingInfo ? bookingInfo.guestInfo.observations || "" : "",
    id: bookingInfo.id,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const serviceWatch = Number(form.watch("service"));
  const startTimeWatch = form.watch("startTime");

  const totalDuration =
    extraServicesDuration +
    (services?.find((services) => services.id === serviceWatch)?.duration || 0);

  function handleTimeChange(
    field: ControllerRenderProps<OnSubmitType, "startTime" | "endTime">,
    increment: number
  ) {
    field.onChange(incrementTime(field.value, increment));
    form.setValue("endTime", incrementTime(form.watch("endTime"), increment));
    setTimeValidation({
      isBeforeOpeningTime: isBeforeTime(form.watch("startTime"), "08:00"),
      isAfterOpeningTime: isAfterTime(form.watch("endTime"), "19:00"),
    });
  }

  function onSubmit(data: OnSubmitType) {
    const newService = services?.find(
      (service) => service.id === Number(data.service)
    );
    const newCategory = categories?.find(
      (category) => category.id === newService?.categoryID
    );
    const newExtraServices = extraServices?.filter((extraService) =>
      selectedExtraServices.includes(extraService.id)
    );
    const newStaff = +data.staff;
    const newDate = format(data.date, "yyyy-MM-dd");
    const newDuration = (newService?.duration || 0) + extraServicesDuration;
    const newGuestInfo: GuestInfoType = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      observations: data.observations,
    };
    const currentBooking: Omit<
      BookingType,
      "id" | "created_at" | "canceled" | "break"
    > = {
      category: newCategory,
      service: newService,
      extraServices: newExtraServices || [],
      staff_id: newStaff,
      selectedDate: newDate,
      startTime: data.startTime,
      endTime: data.endTime,
      duration: newDuration,
      guestInfo: newGuestInfo,
    };

    if (data.id === 0) onCreateBooking({ booking: currentBooking });
    if (data.id !== 0)
      onEditBooking({ booking: currentBooking, id: data.id ?? 0 });
  }

  useEffect(() => {
    form.setValue("extraservices", selectedExtraServices, {
      shouldDirty: true,
    });
  }, [selectedExtraServices, form]);

  useEffect(() => {
    if (serviceWatch) {
      form.setValue(
        "endTime",
        incrementTime(startTimeWatch, totalDuration || 0)
      );
    }
  }, [serviceWatch, form, startTimeWatch, services, totalDuration]);

  if (
    isLoadingServices ||
    isLoadingCategories ||
    isLoadingExtraServices ||
    isLoadingStaff
  ) {
    return <Spinner />;
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 min-w-full"
      >
        <CustomServiceSelect control={form.control} name="service" />
        <CustomExtraservicesDropdown
          selectedExtraServices={selectedExtraServices}
          setSelectedExtraServices={setSelectedExtraServices}
          control={form.control}
          name="extraservices"
        />
        <CustomStaffSelect control={form.control} name="staff" />
        <CustomCalendar control={form.control} name="date" />

        <div>
          <FormLabel>Tid</FormLabel>
          <div>
            <div className="flex w-full mt-1.5">
              <Controller
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <div className="flex w-full">
                    <Button
                      type="button"
                      className="rounded-r-none border-r-0 px-2 h-9 text-zinc-500"
                      variant="outline"
                      onClick={() => handleTimeChange(field, -15)}
                    >
                      <ChevronLeft size={16} strokeWidth={1.5} />
                    </Button>
                    <Input
                      className={`rounded-none shadow-none justify-center relative z-10 h-9 ${
                        timeValidation.isBeforeOpeningTime ? "text-red-500" : ""
                      }`}
                      type="time"
                      value={field.value}
                      onChange={(v) => {
                        field.onChange(v);
                        setTimeValidation({
                          isAfterOpeningTime: isAfterTime(
                            form.watch("endTime"),
                            "19:00"
                          ),
                          isBeforeOpeningTime: isBeforeTime(
                            form.watch("startTime"),
                            "08:00"
                          ),
                        });
                      }}
                      step="900"
                    />
                    <Button
                      type="button"
                      className="rounded-l-none border-l-0 px-2 h-9 text-zinc-500"
                      variant="outline"
                      onClick={() => handleTimeChange(field, 15)}
                    >
                      <ChevronRight size={16} strokeWidth={1.5} />
                    </Button>
                  </div>
                )}
              />

              <span className="mx-2 mt-1">{"–"}</span>

              <Controller
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <div className="flex w-full">
                    <Button
                      type="button"
                      className="rounded-r-none border-r-0 px-2 h-9 text-zinc-500"
                      variant="outline"
                      onClick={() => handleTimeChange(field, -15)}
                    >
                      <ChevronLeft size={16} strokeWidth={1.5} />
                    </Button>
                    <Input
                      className={`rounded-none shadow-none justify-center relative z-10 h-9 ${
                        timeValidation.isAfterOpeningTime ? "text-red-500" : ""
                      }`}
                      type="time"
                      value={field.value}
                      onChange={(v) => {
                        field.onChange(v);
                        form.setValue(
                          "startTime",
                          incrementTime(form.watch("endTime"), -totalDuration)
                        );
                        setTimeValidation({
                          isAfterOpeningTime: isAfterTime(
                            form.watch("endTime"),
                            "19:00"
                          ),
                          isBeforeOpeningTime: isBeforeTime(
                            form.watch("startTime"),
                            "08:00"
                          ),
                        });
                      }}
                      step="900"
                    />
                    <Button
                      type="button"
                      className="rounded-l-none border-l-0 px-2 h-9 text-zinc-500"
                      variant="outline"
                      onClick={() => handleTimeChange(field, 15)}
                    >
                      <ChevronRight size={16} strokeWidth={1.5} />
                    </Button>
                  </div>
                )}
              />
            </div>
            {timeValidation.isBeforeOpeningTime && (
              <span className="text-red-500 text-xs">
                Obs! Starttiden är innan öppning.
              </span>
            )}
            {timeValidation.isAfterOpeningTime && (
              <span className="text-red-500 text-xs">
                Obs! Sluttiden är efter öppning.
              </span>
            )}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kund</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-post</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefon</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="observations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bokningsanteckningar</FormLabel>
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
        </div>
        <div className="w-full flex justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Stäng
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="submit"
              disabled={
                form.formState.isValid && bookAgain
                  ? false
                  : !form.formState.isDirty || !form.formState.isValid
              }
            >{`${
              form.formState.isSubmitting || isEditingBooking
                ? bookingInfo.id !== 0
                  ? "Uppdaterar bokning..."
                  : "Skapar bokning"
                : bookingInfo.id !== 0
                ? "Uppdatera bokning"
                : "Skapa bokning"
            }`}</Button>
          </DialogClose>
        </div>
      </form>
    </FormProvider>
  );
}
