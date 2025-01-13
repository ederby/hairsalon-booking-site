import {
  L10n,
  loadCldr,
  registerLicense,
  setCulture,
  setCurrencyCode,
} from "@syncfusion/ej2-base";
import {
  Agenda,
  Day,
  Inject,
  Month,
  PopupOpenEventArgs,
  ScheduleComponent,
  Week,
  WorkWeek,
} from "@syncfusion/ej2-react-schedule";
// import * as numberingSystems from "@syncfusion/ej2-cldr-data/numberingSystems.json";
import Spinner from "@/components/layout/Spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { useActiveBookings } from "@/features/calendar/useActiveBookings";
import { useStaff } from "@/hooks/useStaff";
import sv from "@/lib/sv.json";
import { CalendarStaffMembers, EventTemplate } from "@/services/types";
import * as svCalendars from "@syncfusion/ej2-cldr-data/main/sv/ca-gregorian.json";
import * as svNumbers from "@syncfusion/ej2-cldr-data/main/sv/numbers.json";
import * as svTimeZoneNames from "@syncfusion/ej2-cldr-data/main/sv/timeZoneNames.json";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { EventPopup } from "./ui/EventPopup";
import { useDeleteBooking } from "./useDeleteBooking";

loadCldr(svNumbers, svCalendars, svTimeZoneNames);
setCulture("sv");
setCurrencyCode("SEK");
L10n.load(sv);
const syncfusionKey = import.meta.env.VITE_SYNCFUSION_KEY;
registerLicense(syncfusionKey);
const staffColours = [
  ["#67e8f9", "#0e7490"],
  ["#fcd34d", "#b45309"],
  ["#c4b5fd", "#6d28d9"],
  ["#fda4af", "#be123c"],
];

interface CalendarEvent {
  Id: number;
  Subject: string;
  StartTime: Date;
  EndTime: Date;
  IsAllDay: boolean;
  ResourceId: number;
  StaffColor?: string;
}

const queryClient = new QueryClient();

export default function Scheduler() {
  const { staff, fetchingStaff } = useStaff();
  const { activeBookings, isLoadingactiveBookings } = useActiveBookings();
  const isFirstRender = useRef(true);
  const { onDeleteBooking } = useDeleteBooking();

  const staffMembers: CalendarStaffMembers[] | undefined = staff?.map(
    (person, i) => {
      return {
        text: person.name,
        id: person.id,
        color: staffColours.at(i),
        image: person.image,
      };
    }
  );

  const transformedBookings = activeBookings?.map((booking, index) => {
    const startDateTime = new Date(
      `${booking.selectedDate}T${booking.selectedTime}:00.000Z`
    );

    const extraServicesTotalDuration =
      booking.extraServices?.reduce(
        (acc, service) => acc + service.duration,
        0
      ) || 0;

    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(
      endDateTime.getMinutes() +
        booking.service.duration +
        extraServicesTotalDuration
    );

    const staffMember = staffMembers?.find((s) => s.id === booking.staff_id);

    return {
      Id: index + 1,
      Subject: booking.service.title,
      StartTime: startDateTime.toISOString(),
      EndTime: endDateTime.toISOString(),
      IsAllDay: false,
      ResourceId: booking.staff_id,
      StaffColor: staffMember?.color?.at(0),
      SecondStaffColor: staffMember?.color?.at(1),
      GuestInfo: booking.guestInfo,
      BookingInfo: {
        price: booking.service.price,
        id: booking.id,
        serviceID: booking.service.id,
        createdAt: booking.created_at,
        extraServices: booking.extraServices,
      },
    };
  });

  const [selectedStaff, setSelectedStaff] = useState<number[]>(
    staffMembers?.map((staff) => staff.id) || []
  );

  const handleCheckboxChange = (id: number) => {
    setSelectedStaff((prevSelectedStaff) =>
      Array.isArray(prevSelectedStaff)
        ? prevSelectedStaff.includes(id)
          ? prevSelectedStaff.filter((staffId) => staffId !== id)
          : [...prevSelectedStaff, id]
        : [id]
    );
  };

  const filteredAppointments = transformedBookings?.filter((appointment) =>
    selectedStaff?.includes(appointment.ResourceId)
  );

  useEffect(() => {
    if (isFirstRender.current && staffMembers && staffMembers.length > 0) {
      setSelectedStaff([staffMembers[0].id]);
      isFirstRender.current = false;
    }
  }, [staffMembers]);

  const eventTemplate = (props: EventTemplate) => {
    const formattedTime = `${format(
      new Date(props.StartTime),
      "HH:mm"
    )} - ${format(new Date(props.EndTime), "HH:mm")}`;

    return (
      <div
        className="p-1 py-2 whitespace-normal text-zinc-500"
        style={{
          color: props.SecondStaffColor,
        }}
      >
        <h4 className="font-semibold">{props.Subject}</h4>
        <p className="mt-1">{props.GuestInfo.name}</p>
        <p>{formattedTime}</p>
      </div>
    );
  };

  const eventSettings = {
    dataSource: filteredAppointments,
    template: eventTemplate,
  };

  const onEventRendered = (args: {
    element: HTMLElement;
    data: CalendarEvent;
  }) => {
    const { StaffColor } = args.data;
    if (StaffColor) {
      args.element.style.backgroundColor = StaffColor;
      args.element.style.borderColor = StaffColor;
    }
  };

  const onPopupOpen = (args: PopupOpenEventArgs) => {
    if (args.type === "QuickInfo" && args.element) {
      const root = createRoot(args.element);
      args.cancel = false;
      root.render(
        <QueryClientProvider client={queryClient}>
          <EventPopup
            data={args.data as EventTemplate}
            staff={staffMembers as CalendarStaffMembers[]}
            onDeleteBooking={onDeleteBooking}
          />
        </QueryClientProvider>
      );
    }
  };

  if (fetchingStaff || isLoadingactiveBookings) return <Spinner />;

  return (
    <>
      <div>
        {staffMembers?.map((staff) => (
          <div key={staff.id} className="flex items-center gap-2">
            <Checkbox
              id={`staff-${staff.id}`}
              checked={selectedStaff?.includes(staff.id)}
              onCheckedChange={() => handleCheckboxChange(staff.id)}
              className="border-0"
              style={{ backgroundColor: staff.color?.at(0) }}
            />
            <label htmlFor={`staff-${staff.id}`}>{staff.text}</label>
          </div>
        ))}
      </div>
      <ScheduleComponent
        locale="sv"
        currentView="Week"
        selectedDate={new Date()}
        startHour="08:00"
        endHour="19:00"
        eventSettings={eventSettings}
        eventRendered={onEventRendered}
        popupOpen={onPopupOpen}
      >
        <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
      </ScheduleComponent>
    </>
  );
}
