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
import { EventTemplate, FilteredEventsType } from "@/services/types";
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
import { useEffect, useRef, useState } from "react";
import StaffDropdown from "../../components/layout/StaffDropdown";
import AddBookingForm from "./AddBookingForm";
import AddBreakForm from "./AddBreakForm";
import CalendarFeatures from "./CalendarFeatures";
import SchedulerContent from "./SchedulerContent";
import SchedulerFooter from "./SchedulerFooter";
import SchedulerHeader from "./SchedulerHeader";
import { useCancelBooking } from "./useCancelBooking";
import { useBookingSettings } from "../settings/useBookingSettings";

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
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
  const [openBreakDialog, setOpenBreakDialog] = useState<boolean>(false);
  const scheduleRef = useRef<ScheduleComponent>(null);
  const { onCancelBooking } = useCancelBooking();
  const {
    filteredEvents,
    currentBookingInfo,
    currentBookingInfoInitialState,
    isLoadingStaff,
    isLoadingBookings,
    selectedStaff,
    setSelectedStaff,
  } = useCalendar();
  const { bookingSettings, isLoadingBookingSettings } = useBookingSettings();

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
        {props.GuestInfo && <p className="mt-1">{props.GuestInfo.name}</p>}
        <p>{formattedTime}</p>
      </div>
    );
  }

  const eventSettings = {
    dataSource: filteredEvents,
    template: eventTemplate,
  };

  function onEventRendered(args: {
    element: HTMLElement;
    data: FilteredEventsType;
  }) {
    const isBreak = "Break" in args.data && args.data.Break;
    const subject = "Subject" in args.data && args.data.Subject;

    args.element.style.backgroundColor = isBreak
      ? "#d4d4d8"
      : subject === "Start av dagen" || subject === "Slutet av dagen"
      ? "#0D9488"
      : "#CCFBF1";

    args.element.style.borderColor = isBreak
      ? "#d4d4d8"
      : subject === "Start av dagen" || subject === "Slutet av dagen"
      ? "#0D9488"
      : "#CCFBF1";
  }

  function handleDialogClose(isOpen: boolean) {
    if (!isOpen) {
      currentBookingInfo.current = currentBookingInfoInitialState;
    }
    setOpenDialog(false);
    setOpenBreakDialog(false);
  }

  function QuickInfoHeaderTemplate(props: EventTemplate) {
    if (props.elementType === "cell") return null;

    return (
      <SchedulerHeader
        bookingInfo={props}
        closePopup={() => scheduleRef.current?.closeQuickInfoPopup()}
      />
    );
  }

  function QuickInfoContentTemplate(props: EventTemplate) {
    if (props.elementType === "cell") return null;

    const bookingInfo = {
      resourceID: props.ResourceId,
      subject: props.Subject,
      guestInfo: props.GuestInfo || {},
      startTime: props.StartTime.toString(),
      endTime: props.EndTime.toString(),
      extraServices: props.BookingInfo?.extraServices || [],
      price: props.BookingInfo?.price || 0,
      breakBooking: props.Break || false,
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
      isBreak: props.Break || false,
    };

    useEffect(() => {
      currentBookingInfo.current = bookingInfo;
    }, [bookingInfo]);

    if (props.elementType === "cell") return null;

    return (
      <SchedulerFooter
        closePopup={() => scheduleRef.current?.closeQuickInfoPopup()}
        setOpenAlertDialog={setOpenAlertDialog}
        setOpenDialog={props.Break ? setOpenBreakDialog : setOpenDialog}
        isWorkday={
          props.Subject === "Start av dagen" ||
          props.Subject === "Slutet av dagen"
        }
        isBreak={props.Break}
      />
    );
  }

  // Prevent creating new events on double click
  function onPopupOpen(args: PopupOpenEventArgs) {
    if (args.type === "Editor") {
      args.cancel = true;
    }
  }

  if (isLoadingStaff || isLoadingBookings || isLoadingBookingSettings)
    return <Spinner />;

  return (
    <>
      <div className="flex justify-between mb-2">
        <StaffDropdown
          selectedStaff={selectedStaff}
          onSelect={setSelectedStaff}
        />
        <div className="flex space-x-2">
          <CalendarFeatures />
        </div>
      </div>

      <ScheduleComponent
        ref={scheduleRef}
        locale="sv"
        selectedDate={calendarDate}
        startHour={bookingSettings?.calendarViewHours?.startTime || "08:00"}
        endHour={bookingSettings?.calendarViewHours?.endTime || "18:00"}
        eventSettings={eventSettings}
        eventRendered={onEventRendered}
        workDays={bookingSettings?.calendarViewDays || [0, 1, 2, 3, 4, 5, 6]}
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
        actionComplete={(args) => {
          if (
            args.requestType === "eventCreated" ||
            args.requestType === "eventChanged"
          ) {
            setCalendarDate(args.data.StartTime);
          }
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
            <DialogTitle>
              {currentBookingInfo.current.id === 0
                ? "Lägg till bokning"
                : "Redigera bokning"}
            </DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </DialogHeader>
          <AddBookingForm />
        </DialogContent>
      </Dialog>

      <Dialog open={openBreakDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="overflow-y-auto max-h-full">
          <DialogHeader>
            <DialogTitle>{currentBookingInfo.current.subject}</DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </DialogHeader>
          <AddBreakForm />
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
        actionText={currentBookingInfo.current.isBreak ? "Ta bort" : "Avboka"}
      />
    </>
  );
}
