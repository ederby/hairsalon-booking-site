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
  schedule: {
    [date: string]: string[];
  };
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
  observations: string;
};

export type BookingType = {
  id: number;
  created_at: Date;
  category: CategoryListType;
  service: ServicesType;
  extraServices: ExtraservicesType[] | [];
  staff_id: number;
  selectedDate: Date;
  selectedTime: string;
  guestInfo: GuestInfoType;
};

export type BookingInfoType = {
  price: number;
  id: number;
  serviceID: number;
  createdAt: Date;
  extraServices: ExtraservicesType[];
};

export interface EventTemplate {
  EndTime: Date;
  Guid: string;
  isAllDay: boolean;
  ResourceId: number;
  StaffColor: string;
  SecondStaffColor: string;
  StartTime: Date;
  Subject: string;
  GuestInfo: GuestInfoType;
  BookingInfo: BookingInfoType;
}

export type CalendarStaffMembers = {
  text: string;
  id: number;
  color: string[] | undefined;
  image: string;
};
