export type CategoryListType = {
  description: string;
  id: number;
  image: string;
  title: string;
  order: number;
};

export type CategoryEditType = {
  description: string;
  image?: File | undefined;
  id?: number | undefined;
  title: string;
  order?: number;
  staff: number[];
};

export type ServicesType = {
  categoryID?: number;
  description: string;
  duration: number;
  id: number;
  price: number;
  title: string;
  isActive: boolean;
  order: number;
};

export type CreateServiceType = {
  title: string;
  description: string;
  duration: number;
  price: number;
  categoryID: number | undefined;
  isActive: boolean;
};

export type StaffType = {
  id: number;
  created_at: Date;
  name: string;
  role: string;
  image: string;
  email: string;
  phone: string;
  isActive: boolean;
};

export type ExtraservicesType = {
  id: number;
  title: string;
  duration: number;
  price: number;
  isActive: boolean;
  categoryIDs: number[];
};

export type GuestInfoType = {
  name: string;
  email: string;
  phone: string;
  observations?: string;
};

export type FilteredEventsType = (
  | FilteredAppointmentsType
  | FilteredWorkdaysType
)[];

export type FilteredAppointmentsType = {
  Id: number;
  Subject: string | undefined;
  StartTime: string;
  EndTime: string;
  IsAllDay: boolean;
  ResourceId: number;
  Break: boolean;
  GuestInfo: GuestInfoType;
  BookingInfo: BookingInfoType;
};
export type FilteredWorkdaysType = {
  Id: number;
  EndTime: string;
  IsAllDay: boolean;
  ResourceId: number;
  StartTime: string;
  Subject: string;
};

export type BookingType = {
  id: number;
  created_at: Date;
  category?: CategoryListType;
  service?: ServicesType;
  extraServices: ExtraservicesType[] | [];
  staff_id: number;
  selectedDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  guestInfo: GuestInfoType;
  canceled: boolean;
  break: boolean;
};

export type EditBookingType = {
  id: number;
  serviceID: number;
  extraServices: ExtraservicesType[] | [];
  startTime: string;
  endTime: string;
  subject: string;
  resourceID: number;
  guestInfo: GuestInfoType;
  date: Date;
  isBreak: boolean;
};

export type BreakType = {
  duration: number;
  startTime: string;
  endTime: string;
  staff_id: number;
  service: string;
  selectedDate: string;
  notes: string | undefined;
};

export type BookingInfoType = {
  price: number;
  id: number;
  serviceID: number;
  createdAt: string;
  extraServices: ExtraservicesType[] | [];
  startTime: string;
  endTime: string;
  duration: number;
};

export interface EventTemplate {
  EndTime: Date;
  Guid: string;
  isAllDay: boolean;
  ResourceId: number;
  StartTime: Date;
  Subject: string;
  GuestInfo: GuestInfoType;
  BookingInfo?: BookingInfoType;
  Break: boolean;
  elementType: string;
}

export type CalendarStaffMembers = {
  text: string;
  id: number;
};

export type WorkdayType = {
  id: number;
  staffID: number;
  date: string;
  startTime: string;
  endTime: string;
};

export type BookingSettingsType = {
  id: number;
  timeslotInterval: number;
  calendarViewHours: {
    endTime: string;
    startTime: string;
  };
  calendarViewDays: number[];
  cancellationPolicy: string;
};

export type CompanySettingsType = {
  id: number;
  companyName: string;
  companyLogo: string;
};

export type GeneralSettingsType = {
  id: number;
  colorScheme: string;
};
