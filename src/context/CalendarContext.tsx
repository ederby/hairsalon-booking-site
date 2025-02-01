import { useActiveBookings } from "@/features/calendar/useActiveBookings";
import { useStaff } from "@/hooks/useStaff";
import {
  CalendarStaffMembers,
  EditBookingType,
  FilteredAppointments,
  StaffType,
} from "@/services/types";
import { parseISO } from "date-fns";
import { createContext, useContext, useMemo, useRef, useState } from "react";

type CalendarContextType = {
  staffMembers: CalendarStaffMembers[] | undefined;
  filteredAppointments: FilteredAppointments[] | undefined;
  selectedStaff: number;
  setSelectedStaff: (value: number) => void;
  currentBookingInfoInitialState: EditBookingType;
  currentBookingInfo: React.MutableRefObject<EditBookingType>;
  currentStaffMember: StaffType | undefined;
  fetchingStaff: boolean;
  isLoadingactiveBookings: boolean;
  openDialog: boolean;
  setOpenDialog: (value: boolean) => void;
  openAlertDialog: boolean;
  setOpenAlertDialog: (value: boolean) => void;
  openBreakDialog: boolean;
  setOpenBreakDialog: (value: boolean) => void;
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
};

export default function CalendarProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const { staff, fetchingStaff } = useStaff();
  const { activeBookings, isLoadingactiveBookings } = useActiveBookings();
  const [selectedStaff, setSelectedStaff] = useState<number>(2);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
  const [openBreakDialog, setOpenBreakDialog] = useState<boolean>(false);

  const currentBookingInfo = useRef<EditBookingType>(
    currentBookingInfoInitialState
  );

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
  const transformedBookings = activeBookings?.map((booking, index) => {
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
  });

  const filteredAppointments = transformedBookings?.filter(
    (appointment) => selectedStaff === appointment.ResourceId
  );

  const currentStaffMember = staff?.find(
    (staffMember) => staffMember.id === selectedStaff
  );

  return (
    <CalendarContext.Provider
      value={{
        staffMembers,
        filteredAppointments,
        selectedStaff,
        setSelectedStaff,
        currentBookingInfoInitialState,
        currentBookingInfo,
        currentStaffMember,
        fetchingStaff,
        isLoadingactiveBookings,
        openDialog,
        setOpenDialog,
        openAlertDialog,
        setOpenAlertDialog,
        openBreakDialog,
        setOpenBreakDialog,
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
