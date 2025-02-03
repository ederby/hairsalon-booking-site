import { useBookings } from "@/features/calendar/useBookings";
import { useWorkdays } from "@/features/calendar/useWorkdays";
import { useStaff } from "@/hooks/useStaff";
import {
  CalendarStaffMembers,
  EditBookingType,
  FilteredEventsType,
  StaffType,
} from "@/services/types";
import { addMinutes, formatISO, parse, parseISO, subMinutes } from "date-fns";
import { createContext, useContext, useMemo, useRef, useState } from "react";

type CalendarContextType = {
  staffMembers: CalendarStaffMembers[] | undefined;
  filteredEvents: FilteredEventsType;
  selectedStaff: number;
  setSelectedStaff: (value: number) => void;
  currentBookingInfoInitialState: EditBookingType;
  currentBookingInfo: React.MutableRefObject<EditBookingType>;
  currentStaffMember: StaffType | undefined;
  fetchingStaff: boolean;
  isLoadingBookings: boolean;
};

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

const currentBookingInfoInitialState = {
  resourceID: 0,
  subject: "",
  guestInfo: {
    email: "",
    name: "",
    observations: "",
    phone: "",
  },
  startTime: "",
  endTime: "",
  extraServices: [],
  id: 0,
  serviceID: 0,
  date: new Date(),
  isBreak: false,
};

export default function CalendarProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const { staff, fetchingStaff } = useStaff();
  const { bookings, isLoadingBookings } = useBookings();
  const { workdays } = useWorkdays();

  const [selectedStaff, setSelectedStaff] = useState<number>(2);

  const currentBookingInfo = useRef<EditBookingType>(
    currentBookingInfoInitialState
  );

  const workdaysEvents = useMemo(() => {
    const startEvents =
      workdays?.map((day) => {
        return {
          Id: day.id,
          Subject: "Start av dagen",
          StartTime: subMinutes(
            formatISO(parse(day.startTime, "HH:mm", new Date(day.date))),
            7
          ).toISOString(),
          EndTime: formatISO(parse(day.startTime, "HH:mm", new Date(day.date))),
          IsAllDay: false,
          ResourceId: day.staffID,
        };
      }) || [];
    const endEvents =
      workdays?.map((day) => {
        return {
          Id: day.id,
          Subject: "Slutet av dagen",
          StartTime: formatISO(parse(day.endTime, "HH:mm", new Date(day.date))),
          EndTime: addMinutes(
            formatISO(parse(day.endTime, "HH:mm", new Date(day.date))),
            7
          ).toISOString(),
          IsAllDay: false,
          ResourceId: day.staffID,
        };
      }) || [];

    return [...startEvents, ...endEvents];
  }, [workdays]);

  // Transform staff to fit the scheduler
  const staffMembers: CalendarStaffMembers[] | undefined = useMemo(() => {
    return staff?.map((person) => {
      return {
        text: person.name,
        id: person.id,
        schedule: person.schedule,
      };
    });
  }, [staff]);

  // Transform bookings to fit the scheduler
  const transformedBookings =
    bookings
      ?.filter((booking) => !booking.canceled)
      .map((booking, index) => {
        const startDateTime = parseISO(
          `${booking.selectedDate}T${booking.startTime}:00`
        );
        const endDateTime = new Date(startDateTime);
        endDateTime.setMinutes(endDateTime.getMinutes() + booking.duration);

        return {
          Id: index + 1,
          Subject: booking.service?.title,
          StartTime: startDateTime.toISOString(),
          EndTime: endDateTime.toISOString(),
          IsAllDay: false,
          ResourceId: booking.staff_id,
          GuestInfo: booking.guestInfo,
          Break: booking.break,
          BookingInfo: {
            price: booking.service?.price ?? 0,
            id: booking.id,
            serviceID: booking.service?.id ?? 0,
            createdAt: booking.created_at.toString(),
            extraServices: booking.extraServices,
            startTime: booking.startTime,
            endTime: booking.endTime,
            duration: booking.duration,
          },
        };
      }) || [];

  const filteredAppointments = transformedBookings?.filter(
    (appointment) => selectedStaff === appointment.ResourceId
  );
  const filteredWorkdays = workdaysEvents?.filter(
    (workday) => selectedStaff === workday.ResourceId
  );
  const filteredEvents = [...filteredAppointments, ...filteredWorkdays];

  const currentStaffMember = staff?.find(
    (staffMember) => staffMember.id === selectedStaff
  );

  return (
    <CalendarContext.Provider
      value={{
        staffMembers,
        filteredEvents,
        selectedStaff,
        setSelectedStaff,
        currentBookingInfoInitialState,
        currentBookingInfo,
        currentStaffMember,
        fetchingStaff,
        isLoadingBookings,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar(): CalendarContextType {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
}
