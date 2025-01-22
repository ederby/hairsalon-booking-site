import Spinner from "@/components/layout/Spinner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DialogClose } from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useStaff } from "@/hooks/useStaff";
import {
  formatCustomDate,
  incrementTime,
  isAfterTime,
  isBeforeTime,
  reduceExtraServicesDuration,
} from "@/lib/helpers";
import { cn } from "@/lib/utils";
import {
  BookingType,
  ExtraservicesType,
  GuestInfoType,
  StaffType,
} from "@/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { sv } from "date-fns/locale";
import {
  CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useCategories } from "../services/useCategories";
import { useExtraServices } from "../services/useExtraServices";
import { useCreateBooking } from "./useCreateBooking";
import { useEditBooking } from "./useEditBooking";
import { useServices } from "./useServices";
import { format, startOfDay } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type CalendarEditFormProps = {
  currentStaffMember: StaffType | undefined;
  setOpenDialog: (value: boolean) => void;
  bookingInfo: {
    id: number;
    serviceID: number;
    extraServices: ExtraservicesType[] | [];
    time: { startTime: string; endTime: string };
    subject: string;
    resourceID: number;
    guestInfo: GuestInfoType;
    date: Date;
  };
};

type OnSubmitType = {
  date: Date;
  email: string;
  endTime: string;
  extraservices?: number[] | undefined;
  name: string;
  phone: string;
  observations?: string;
  service: string;
  staff: string;
  startTime: string;
  id?: number;
};

const formSchema = z.object({
  service: z.string().nonempty("Titel är obligatorisk"),
  extraservices: z.array(z.number()).optional(),
  staff: z.string().nonempty("Välj en person"),
  date: z.date().refine((date) => date >= startOfDay(new Date()), {
    message: "Välj ett tillgängligt datum",
  }),
  startTime: z.string().nonempty("Välj en starttid"),
  endTime: z.string().nonempty("Välj en sluttid"),
  name: z.string().nonempty("Skriv kundens namn"),
  email: z.string().email().nonempty("Skriv en riktig emailadress"),
  phone: z.string().nonempty("Skriv ett telefonnummer"),
  observations: z.string().optional(),
  id: z.number().optional(),
});

export default function CalendarEditForm({
  currentStaffMember,
  setOpenDialog,
  bookingInfo,
}: CalendarEditFormProps): JSX.Element {
  const { services, isLoadingServices } = useServices();
  const { categories, isLoadingCategories } = useCategories();
  const { staff, fetchingStaff } = useStaff();
  const { extraServices, isLoadingExtraServices } = useExtraServices();
  const { onEditBooking, isEditingBooking } = useEditBooking();

  const [selectedExtraServices, setSelectedExtraServices] = useState<number[]>(
    bookingInfo?.extraServices?.map((extraService) => extraService.id) || []
  );
  const [selectedStaff, setSelectedStaff] = useState<number | null>(
    currentStaffMember?.id ?? null
  );
  const extraServicesDuration = reduceExtraServicesDuration(
    extraServices?.filter((service) =>
      selectedExtraServices.includes(service.id)
    )
  );
  const [isBeforeOpeningTime, setIsBeforeOpeningTime] =
    useState<boolean>(false);
  const [isAfterOpeningTime, setIsAfterOpeningTime] = useState<boolean>(false);
  const { onCreateBooking } = useCreateBooking();

  const initialValues = {
    service: bookingInfo ? bookingInfo.serviceID.toString() : "1",
    extraservices: bookingInfo
      ? bookingInfo.extraServices.map((extraService) => extraService.id)
      : [],
    staff: currentStaffMember?.id.toString() || "",
    date: bookingInfo ? new Date(bookingInfo.date) : new Date(),
    startTime: bookingInfo.time.startTime,
    endTime: bookingInfo.time.endTime,
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

  const staffSchedule: Record<string, string[]> =
    staff?.find((staffMember) => staffMember.id === selectedStaff)?.schedule ||
    {};

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
    const currentBooking: Omit<BookingType, "id" | "created_at"> = {
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

  function handleExtraServiceChange(value: string) {
    setSelectedExtraServices((s) => {
      const selectedOption = +value;
      if (s.includes(selectedOption)) {
        return [...s.filter((extraService) => extraService !== selectedOption)];
      } else {
        return [...s, selectedOption];
      }
    });
  }

  function deleteExtraService(id: number) {
    setSelectedExtraServices((s) =>
      s.filter((extraService) => extraService !== id)
    );
  }

  useEffect(() => {
    form.setValue("extraservices", selectedExtraServices, {
      shouldDirty: true,
    });
  }, [selectedExtraServices, form]);

  const serviceWatch = Number(form.watch("service"));
  const startTimeWatch = form.watch("startTime");
  const totalDuration =
    extraServicesDuration +
    (services?.find((services) => services.id === serviceWatch)?.duration || 0);

  useEffect(() => {
    if (serviceWatch) {
      form.setValue(
        "endTime",
        incrementTime(startTimeWatch, totalDuration || 0)
      );
    }
  }, [serviceWatch, form, startTimeWatch, services, totalDuration]);

  const { isValid } = form.formState;

  if (
    isLoadingServices ||
    isLoadingCategories ||
    isLoadingExtraServices ||
    fetchingStaff
  ) {
    return <Spinner />;
  }

  const availableDates = Object.keys(staffSchedule).map(
    (date) => new Date(date)
  );

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
              <FormLabel>Tjänst</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(e) => {
                    console.log(field.value);
                    field.onChange(e);
                  }}
                >
                  <SelectTrigger className="">
                    {field.value === "0" ? (
                      <span>Välj en tjänst</span>
                    ) : (
                      <SelectValue placeholder="Välj en tjänst" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectGroup key={category.id}>
                        <SelectLabel>{category.title}</SelectLabel>
                        {services
                          ?.filter(
                            (service) => service.categoryID === category.id
                          )
                          .map((service) => (
                            <SelectItem
                              key={service.id}
                              value={service.id.toString()}
                            >
                              <span>{service.title}</span>
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="staff"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personal</FormLabel>
              <FormControl>
                <Select
                  value={selectedStaff?.toString()}
                  onValueChange={(e) => {
                    setSelectedStaff(+e);
                    field.onChange(e);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Välj en person" />
                  </SelectTrigger>
                  <SelectContent>
                    {staff?.map((staffMember) => (
                      <SelectItem
                        key={staffMember.id}
                        value={staffMember.id.toString()}
                      >
                        <span>{staffMember.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full">
          <FormField
            control={form.control}
            name="extraservices"
            render={() => (
              <FormItem>
                <FormLabel>Tilläggstjänster</FormLabel>
                <FormControl>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between hover:bg-transparent hover:border-zinc-200 hover:text-zinc-900 py-1 h-9"
                      >
                        <span className="font-normal">
                          Välj{" "}
                          {`${
                            selectedExtraServices.length > 0
                              ? "(" + selectedExtraServices.length + " valda)"
                              : ""
                          }`}
                        </span>
                        <ChevronDown className="text-zinc-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="DropdownMenuContent"
                    >
                      {extraServices
                        ?.filter((extraService) => extraService.isActive)
                        .map((extraService) => {
                          return (
                            <DropdownMenuCheckboxItem
                              className="w-full"
                              key={extraService.id}
                              checked={selectedExtraServices.includes(
                                extraService.id
                              )}
                              onCheckedChange={() => {
                                handleExtraServiceChange(
                                  extraService.id.toString()
                                );
                              }}
                            >
                              {extraService.title}
                            </DropdownMenuCheckboxItem>
                          );
                        })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </FormControl>
              </FormItem>
            )}
          />
          <ul className="flex text-[11px] gap-1 flex-wrap mt-2">
            {extraServices
              ?.filter((service) => selectedExtraServices.includes(service.id))
              .map((service) => (
                <li
                  className="flex gap-1 bg-teal-600 text-teal-50 py-1 px-2 rounded font-semibold"
                  key={service.id}
                >
                  <X
                    size={16}
                    strokeWidth={1.5}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteExtraService(service.id);
                    }}
                  />
                  {service.title}
                </li>
              ))}
          </ul>
        </div>

        <FormField
          control={form.control}
          name="staff"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personal</FormLabel>
              <FormControl>
                <Select
                  value={selectedStaff?.toString()}
                  onValueChange={(e) => {
                    setSelectedStaff(+e);
                    field.onChange(e);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Välj en person" />
                  </SelectTrigger>
                  <SelectContent>
                    {staff?.map((staffMember) => (
                      <SelectItem
                        key={staffMember.id}
                        value={staffMember.id.toString()}
                      >
                        <span>{staffMember.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="mb-1">Datum</FormLabel>
              <FormControl>
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
                        formatCustomDate(field.value)
                      ) : (
                        <span>Välj ett datum</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(selectedDate) => {
                        field.onChange(selectedDate);
                      }}
                      initialFocus
                      locale={sv}
                      modifiers={{
                        available: (date) =>
                          availableDates.some(
                            (availableDate) =>
                              date.toISOString().split("T")[0] ===
                              availableDate.toISOString().split("T").at(0)
                          ),
                      }}
                      disabled={(date) =>
                        date < new Date() ||
                        !availableDates.some(
                          (availableDate) =>
                            availableDate.toDateString() === date.toDateString()
                        )
                      }
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Tid</FormLabel>
          <div>
            <div className="flex w-full mt-1.5">
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
                          onClick={() => {
                            field.onChange(incrementTime(field.value, -15));
                            form.setValue(
                              "endTime",
                              incrementTime(form.watch("endTime"), -15)
                            );

                            setIsAfterOpeningTime(
                              isAfterTime(form.watch("endTime"), "19:00")
                            );
                            setIsBeforeOpeningTime(
                              isBeforeTime(form.watch("startTime"), "08:00")
                            );
                          }}
                        >
                          <ChevronLeft size={16} strokeWidth={1.5} />
                        </Button>
                        <Input
                          className={`rounded-none shadow-none justify-center relative z-10 h-9 ${
                            isBeforeOpeningTime ? "text-red-500" : ""
                          }`}
                          type="time"
                          value={field.value}
                          onChange={(v) => {
                            field.onChange(v);

                            setIsAfterOpeningTime(
                              isAfterTime(form.watch("endTime"), "19:00")
                            );
                            setIsBeforeOpeningTime(
                              isBeforeTime(form.watch("startTime"), "08:00")
                            );
                          }}
                          step="900"
                        />
                        <Button
                          type="button"
                          className="rounded-l-none border-l-0 px-2 h-9 text-zinc-500"
                          variant="outline"
                          onClick={() => {
                            field.onChange(incrementTime(field.value, 15));
                            form.setValue(
                              "endTime",
                              incrementTime(form.watch("endTime"), 15)
                            );
                            setIsAfterOpeningTime(
                              isAfterTime(form.watch("endTime"), "19:00")
                            );
                            setIsBeforeOpeningTime(
                              isBeforeTime(form.watch("startTime"), "08:00")
                            );
                          }}
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
                          onClick={() => {
                            field.onChange(incrementTime(field.value, -15));
                            form.setValue(
                              "startTime",
                              incrementTime(form.watch("startTime"), -15)
                            );
                            setIsAfterOpeningTime(
                              isAfterTime(form.watch("endTime"), "19:00")
                            );
                            setIsBeforeOpeningTime(
                              isBeforeTime(form.watch("startTime"), "08:00")
                            );
                          }}
                        >
                          <ChevronLeft size={16} strokeWidth={1.5} />
                        </Button>
                        <Input
                          className={`rounded-none shadow-none justify-center relative z-10 h-9 ${
                            isAfterOpeningTime ? "text-red-500" : ""
                          }`}
                          type="time"
                          value={field.value}
                          onChange={(v) => {
                            field.onChange(v);

                            form.setValue(
                              "startTime",
                              incrementTime(
                                form.watch("endTime"),
                                -totalDuration
                              )
                            );

                            setIsAfterOpeningTime(
                              isAfterTime(form.watch("endTime"), "19:00")
                            );
                            setIsBeforeOpeningTime(
                              isBeforeTime(form.watch("startTime"), "08:00")
                            );
                          }}
                          step="900"
                        />
                        <Button
                          type="button"
                          className="rounded-l-none border-l-0 px-2 h-9 text-zinc-500"
                          variant="outline"
                          onClick={() => {
                            field.onChange(incrementTime(field.value, 15));
                            form.setValue(
                              "startTime",
                              incrementTime(form.watch("startTime"), 15)
                            );
                            setIsAfterOpeningTime(
                              isAfterTime(form.watch("endTime"), "19:00")
                            );
                            setIsBeforeOpeningTime(
                              isBeforeTime(form.watch("startTime"), "08:00")
                            );
                          }}
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
            {isBeforeOpeningTime && (
              <span className="text-red-500 text-xs">
                Obs! Starttiden är innan öppning.
              </span>
            )}
            {isAfterOpeningTime && (
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
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpenDialog(false)}
          >
            Stäng
          </Button>
          <DialogClose asChild>
            <Button
              type="submit"
              disabled={!form.formState.isDirty || !isValid}
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
