import AlertDialogCustom from "@/components/layout/AlertDialogCustom";
import Spinner from "@/components/layout/Spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCalendar } from "@/context/CalendarContext";
import { EventTemplate, FilteredAppointments } from "@/services/types";
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
  PopupOpenEventArgs,
  ScheduleComponent,
  ToolbarItemDirective,
  ToolbarItemsDirective,
  ViewDirective,
  ViewsDirective,
  Week,
  WorkWeek,
} from "@syncfusion/ej2-react-schedule";
import { format } from "date-fns";
import { useEffect, useRef } from "react";
import BookingPersonelDropdown from "./BookingStaffDropdown";
import CalendarBreakAppointment from "./CalendarBreakAppointment";
import CalendarEditForm from "./CalendarEditForm";
import SchedulerContent from "./SchedulerContent";
import SchedulerFooter from "./SchedulerFooter";
import SchedulerHeader from "./SchedulerHeader";
import { useCancelBooking } from "./useCancelBooking";

loadCldr(svNumbers, svCalendars, svTimeZoneNames);
setCulture("sv");
setCurrencyCode("SEK");
L10n.load({
  sv: {
    schedule: {
      day: "Dag",
      week: "Vecka",
      workWeek: "Arbetsvecka",
      month: "Månad",
      agenda: "Agenda",
    },
  },
});
const syncfusionKey = import.meta.env.VITE_SYNCFUSION_KEY;
registerLicense(syncfusionKey);

export default function Schedule(): JSX.Element {
  const scheduleRef = useRef<ScheduleComponent>(null);
  const { onCancelBooking } = useCancelBooking();
  const {
    filteredAppointments,
    currentBookingInfo,
    currentBookingInfoInitialState,
    fetchingStaff,
    isLoadingactiveBookings,
    openDialog,
    setOpenDialog,
    openAlertDialog,
    setOpenAlertDialog,
    setOpenBreakDialog,
  } = useCalendar();

  function eventTemplate(props: EventTemplate) {
    const formattedTime = `${format(
      new Date(props.StartTime),
      "HH:mm"
    )} - ${format(new Date(props.EndTime), "HH:mm")}`;

    return (
      <div
        className={`p-1 py-2 whitespace-normal ${
          props.Break ? "text-zinc-600" : "text-teal-600"
        }`}
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
    data: FilteredAppointments;
  }) {
    args.element.style.backgroundColor = args.data.Break
      ? "#d4d4d8"
      : "#CCFBF1";
    args.element.style.borderColor = args.data.Break ? "#d4d4d8" : "#CCFBF1";
  }

  function handleDialogClose(isOpen: boolean) {
    if (!isOpen) {
      currentBookingInfo.current = currentBookingInfoInitialState;
    }
    setOpenDialog(isOpen);
  }

  function QuickInfoHeaderTemplate(props: EventTemplate) {
    if (props.elementType === "cell") return null;

    return (
      <SchedulerHeader
        breakBooking={props.Break}
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
      startTime: props.StartTime.toString(),
      endTime: props.EndTime.toString(),
      extraServices: props.BookingInfo?.extraServices || [],
      price: props.BookingInfo?.price || 0,
      breakBooking: props.Break,
    };

    return <SchedulerContent bookingInfo={bookingInfo} />;
  }

  function QuickInfoFooterTemplate(props: EventTemplate) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const bookingInfo = {
      resourceID: props.ResourceId || 0,
      subject: props.Subject || "",
      startTime: format(props.StartTime, "HH:mm"),
      endTime: format(props.EndTime, "HH:mm"),
      extraServices: props.BookingInfo?.extraServices || [],
      id: props.BookingInfo?.id || 0,
      serviceID: props.BookingInfo?.serviceID || 0,
      date: new Date(props.StartTime),
      guestInfo: props.GuestInfo || {
        email: "",
        name: "",
        observations: "",
        phone: "",
      },
    };

    useEffect(() => {
      currentBookingInfo.current = bookingInfo;
    }, [bookingInfo]);

    if (props.elementType === "cell") return null;

    console.log(props.Break);

    return (
      <SchedulerFooter
        closePopup={() => scheduleRef.current?.closeQuickInfoPopup()}
        setOpenAlertDialog={setOpenAlertDialog}
        setOpenDialog={props.Break ? setOpenBreakDialog : setOpenDialog}
      />
    );
  }

  // Prevent creating new events on double click
  function onPopupOpen(args: PopupOpenEventArgs) {
    if (args.type === "Editor") {
      args.cancel = true;
    }
  }

  if (fetchingStaff || isLoadingactiveBookings) return <Spinner />;

  return (
    <>
      <div className="flex justify-between mb-2">
        <BookingPersonelDropdown />
        <CalendarBreakAppointment />
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
        popupOpen={onPopupOpen}
        currentView="WorkWeek"
        quickInfoTemplates={{
          header: QuickInfoHeaderTemplate,
          content: QuickInfoContentTemplate,
          footer: QuickInfoFooterTemplate,
        }}
        cellClick={(args) => {
          currentBookingInfo.current = {
            ...currentBookingInfoInitialState,
            startTime: format(args.startTime, "HH:mm"),
            endTime: format(args.endTime, "HH:mm"),
            date: args.startTime,
          };
          setOpenDialog(true);
        }}
      >
        <ViewsDirective>
          <ViewDirective option="Day" />
          <ViewDirective option="Week" />
          <ViewDirective option="WorkWeek" />
          <ViewDirective option="Month" />
          <ViewDirective option="Agenda" />
        </ViewsDirective>

        <Inject services={[WorkWeek, Week, Day, Month, Agenda]} />

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
          <CalendarEditForm />
        </DialogContent>
      </Dialog>

      <AlertDialogCustom
        title="Är du helt säker?"
        description="Du håller på att avboka denna bokning. Du kan boka om den i historien."
        open={openAlertDialog}
        setOpen={setOpenAlertDialog}
        onClick={() =>
          onCancelBooking(
            currentBookingInfo ? currentBookingInfo.current.id : 0
          )
        }
        actionText="Avboka"
      />
    </>
  );
}
