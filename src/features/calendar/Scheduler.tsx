import AlertDialogCustom from "@/components/layout/AlertDialogCustom";
import Spinner from "@/components/layout/Spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActiveBookings } from "@/features/calendar/useActiveBookings";
import { useStaff } from "@/hooks/useStaff";
import sv from "@/lib/sv.json";
import Calendar from "@/pages/Calendar";
import {
  CalendarStaffMembers,
  EventTemplate,
  ExtraservicesType,
  GuestInfoType,
} from "@/services/types";
import {
  L10n,
  loadCldr,
  registerLicense,
  setCulture,
  setCurrencyCode,
} from "@syncfusion/ej2-base";
import * as svCalendars from "@syncfusion/ej2-cldr-data/main/sv/ca-gregorian.json";
import * as svNumbers from "@syncfusion/ej2-cldr-data/main/sv/numbers.json";
import * as svTimeZoneNames from "@syncfusion/ej2-cldr-data/main/sv/timeZoneNames.json";
import {
  Agenda,
  Day,
  Inject,
  Month,
  ScheduleComponent,
  ToolbarItemDirective,
  ToolbarItemsDirective,
  ViewDirective,
  ViewsDirective,
  WorkWeek,
} from "@syncfusion/ej2-react-schedule";
import { format, parseISO } from "date-fns";
import { useEffect, useRef, useState } from "react";
import BookingHistory from "./BookingHistory";
import BookingPersonelDropdown from "./BookingPersonelDropdown";
import CalendarEditForm from "./CalendarEditForm";
import SchedulerContent from "./SchedulerContent";
import SchedulerFooter from "./SchedulerFooter";
import SchedulerHeader from "./SchedulerHeader";
import { useDeleteBooking } from "./useDeleteBooking";

loadCldr(svNumbers, svCalendars, svTimeZoneNames);
setCulture("sv");
setCurrencyCode("SEK");
L10n.load(sv);
const syncfusionKey = import.meta.env.VITE_SYNCFUSION_KEY;
registerLicense(syncfusionKey);
const staffColours = [
  ["#D7ECFF", "#1F5ABB"],
  ["#FDF0C2", "#DEAC29"],
  ["#D7FFE0", "#42AB57"],
  ["#FCE7E8", "#A83735"],
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

type CurrentBookingInfoType = {
  resourceID: number;
  subject: string;
  guestInfo: GuestInfoType;
  time: { startTime: string; endTime: string };
  extraServices: ExtraservicesType[] | [];
  id: number;
  serviceID: number;
  date: Date;
};

const CurrentBookingInfoInitialState = {
  resourceID: 0,
  subject: "",
  guestInfo: {
    email: "",
    name: "",
    observations: "",
    phone: "",
  },
  time: {
    startTime: "",
    endTime: "",
  },
  extraServices: [],
  id: 0,
  serviceID: 0,
  date: new Date(),
};

export default function Scheduler() {
  const { staff, fetchingStaff } = useStaff();
  const { activeBookings, isLoadingactiveBookings } = useActiveBookings();
  const isFirstRender = useRef(true);
  const { onDeleteBooking } = useDeleteBooking();
  const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedStaff, setSelectedStaff] = useState<number[]>([]);

  const currentBookingInfo = useRef<CurrentBookingInfoType>(
    CurrentBookingInfoInitialState
  );

  const currentStaffMember = staff?.find(
    (member) => member.id === currentBookingInfo.current.resourceID
  );

  // Transform staff to fit the scheduler
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

  // Transform bookings to fit the scheduler
  const transformedBookings = activeBookings?.map((booking, index) => {
    const startDateTime = parseISO(
      `${booking.selectedDate}T${booking.startTime}:00`
    );

    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + booking.duration);

    const staffMember = staffMembers?.find((s) => s.id === booking.staff_id);

    return {
      Id: index + 1,
      Subject: booking.service?.title,
      StartTime: startDateTime.toISOString(),
      EndTime: endDateTime.toISOString(),
      IsAllDay: false,
      ResourceId: booking.staff_id,
      StaffColor: staffMember?.color?.at(0),
      SecondStaffColor: staffMember?.color?.at(1),
      GuestInfo: booking.guestInfo,
      BookingInfo: {
        price: booking.service?.price,
        id: booking.id,
        serviceID: booking.service?.id,
        createdAt: booking.created_at,
        extraServices: booking.extraServices,
        startTime: booking.startTime,
        endTime: booking.endTime,
        duration: booking.duration,
      },
    };
  });

  const filteredAppointments = transformedBookings?.filter((appointment) =>
    selectedStaff?.includes(appointment.ResourceId)
  );

  // Set default selected staff
  useEffect(() => {
    if (isFirstRender.current && staffMembers && staffMembers.length > 0) {
      setSelectedStaff([staffMembers[2].id]);
      isFirstRender.current = false;
    }
  }, [staffMembers]);

  function eventTemplate(props: EventTemplate) {
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
  }

  const eventSettings = {
    dataSource: filteredAppointments,
    template: eventTemplate,
  };

  function onEventRendered(args: {
    element: HTMLElement;
    data: CalendarEvent;
  }) {
    const { StaffColor } = args.data;
    if (StaffColor) {
      args.element.style.backgroundColor = StaffColor;
      args.element.style.borderColor = StaffColor;
    }
  }

  function handleDialogClose(isOpen: boolean) {
    console.log("handleDialogClose");
    if (!isOpen) {
      currentBookingInfo.current = CurrentBookingInfoInitialState;
    }
    setOpenDialog(isOpen);
  }

  const scheduleRef = useRef<ScheduleComponent>(null);

  function QuickInfoHeaderTemplate(props: EventTemplate) {
    if (props.elementType === "cell") return null;

    return (
      <SchedulerHeader
        color={{ primary: props.StaffColor, secondary: props.SecondStaffColor }}
        createdDate={props.BookingInfo?.createdAt as string}
        closePopup={() => scheduleRef.current?.closeQuickInfoPopup()}
      />
    );
  }

  function QuickInfoContentTemplate(props: EventTemplate) {
    if (props.elementType === "cell") return null;

    const bookingInfo = {
      resourceID: props.ResourceId,
      subject: props.Subject,
      guestInfo: props.GuestInfo,
      time: {
        startTime: props.StartTime.toString(),
        endTime: props.EndTime.toString(),
      },
      extraServices: props.BookingInfo?.extraServices || [],
      price: props.BookingInfo?.price || 0,
    };

    return <SchedulerContent bookingInfo={bookingInfo} />;
  }

  function QuickInfoFooterTemplate(props: EventTemplate) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const bookingInfo = {
      resourceID: props.ResourceId || 0,
      subject: props.Subject || "",
      guestInfo: props.GuestInfo || {
        email: "",
        name: "",
        observations: "",
        phone: "",
      },
      time: {
        startTime: format(props.StartTime, "HH:mm"),
        endTime: format(props.EndTime, "HH:mm"),
      },
      extraServices: props.BookingInfo?.extraServices || [],
      id: props.BookingInfo?.id || 0,
      serviceID: props.BookingInfo?.serviceID || 0,
      date: new Date(props.StartTime),
    };

    useEffect(() => {
      currentBookingInfo.current = bookingInfo;
    }, [bookingInfo]);

    if (props.elementType === "cell") return null;

    return (
      <SchedulerFooter
        closePopup={() => scheduleRef.current?.closeQuickInfoPopup()}
        setOpenAlertDialog={setOpenAlertDialog}
        setOpenDialog={setOpenDialog}
      />
    );
  }

  if (fetchingStaff || isLoadingactiveBookings) return <Spinner />;

  return (
    <>
      <div className="flex justify-between mb-2">
        <BookingPersonelDropdown
          selectedStaff={selectedStaff}
          setSelectedStaff={setSelectedStaff}
          staffMembers={staffMembers}
        />
        <BookingHistory />
      </div>

      <ScheduleComponent
        ref={scheduleRef}
        locale="sv"
        selectedDate={new Date()}
        startHour="08:00"
        endHour="19:00"
        eventSettings={eventSettings}
        eventRendered={onEventRendered}
        workDays={[1, 2, 3, 4, 5, 6]}
        currentView="WorkWeek"
        quickInfoTemplates={{
          header: QuickInfoHeaderTemplate,
          content: QuickInfoContentTemplate,
          footer: QuickInfoFooterTemplate,
        }}
        cellClick={(args) => {
          currentBookingInfo.current = {
            ...CurrentBookingInfoInitialState,
            time: {
              startTime: format(args.startTime, "HH:mm"),
              endTime: format(args.endTime, "HH:mm"),
            },
            date: args.startTime,
          };
          setOpenDialog(true);
        }}
      >
        <ViewsDirective>
          <ViewDirective option="Day" />
          <ViewDirective option="WorkWeek" />
          <ViewDirective option="Month" />
          <ViewDirective option="Agenda" />
        </ViewsDirective>
        <Inject services={[WorkWeek, Day, Month, Agenda]} />
        <ToolbarItemsDirective>
          <ToolbarItemDirective
            name="Previous"
            align="Left"
          ></ToolbarItemDirective>
          <ToolbarItemDirective name="Next" align="Left"></ToolbarItemDirective>
          <ToolbarItemDirective
            name="DateRangeText"
            align="Left"
          ></ToolbarItemDirective>
          <ToolbarItemDirective
            name="Views"
            align="Right"
          ></ToolbarItemDirective>
        </ToolbarItemsDirective>
      </ScheduleComponent>

      <Dialog open={openDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="overflow-y-auto max-h-full">
          <DialogHeader>
            <DialogTitle className="hidden">
              {currentBookingInfo.current.subject}
            </DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </DialogHeader>
          <CalendarEditForm
            bookingInfo={currentBookingInfo.current}
            currentStaffMember={currentStaffMember}
            setOpenDialog={setOpenDialog}
          />
        </DialogContent>
      </Dialog>

      <AlertDialogCustom
        title="Är du helt säker?"
        description="Du håller på att radera denna bokning. Du kan inte ångra detta när den har raderats."
        open={openAlertDialog}
        setOpen={setOpenAlertDialog}
        onClick={() =>
          onDeleteBooking(
            currentBookingInfo ? currentBookingInfo.current.id : 0
          )
        }
        actionText="Radera"
      />
    </>
  );
}
