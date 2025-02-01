import { supabase } from "./supabase";
import { BookingType, BreakType, ServicesType } from "./types";

type EditNewBookingType = {
  booking: Omit<BookingType, "id" | "created_at" | "canceled" | "break">;
  id: number;
};
type EditNewBreakType = {
  breakBooking: BreakType;
  id: number;
};

export async function getActiveBookings(): Promise<BookingType[]> {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("canceled", false)
    .gte("selectedDate", today);

  if (error) {
    console.error("Bokningarna kunde inte hämtas.");
    throw new Error("Bokningarna kunde inte hämtas.");
  }

  return data;
}

export async function deleteBooking(id: number): Promise<void> {
  const { error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error("Bokningen kunde inte raderas.");
    throw new Error("Bokningen kunde inte raderas.");
  }
}

export async function getServices(): Promise<ServicesType[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("categoryID", { ascending: true });

  if (error) {
    console.error("Tjänsten kunde inte hämtas.");
    throw new Error("Tjänsten kunde inte hämtas.");
  }

  return data;
}

export async function editBooking({
  booking,
  id,
}: EditNewBookingType): Promise<void> {
  const { error } = await supabase
    .from("bookings")
    .update({ ...booking })
    .eq("id", id);

  if (error) {
    console.error("Bokningen kunde inte uppdateras.");
    throw new Error("Bokningen kunde inte uppdateras.");
  }
}

export async function createBooking({
  booking,
}: Omit<EditNewBookingType, "id" | "canceled" | "break">): Promise<void> {
  const { error } = await supabase
    .from("bookings")
    .insert([{ ...booking, canceled: false, break: false }]);

  if (error) {
    console.error("Bokningen kunde inte skapas.");
    throw new Error("Bokningen kunde inte skapas.");
  }
}

export async function getAllBookings(): Promise<BookingType[]> {
  const { data, error } = await supabase.from("bookings").select("*");

  if (error) {
    console.error("Bokningarna kunde inte hämtas.");
    throw new Error("Bokningarna kunde inte hämtas.");
  }

  return data;
}

export async function cancelBooking(id: number): Promise<void> {
  const { error } = await supabase
    .from("bookings")
    .update({ canceled: true })
    .eq("id", id);

  if (error) {
    console.error("Bokningen kunde inte avbokas.");
    throw new Error("Bokningen kunde inte avbokas.");
  }
}

export async function createBreak(breakBooking: BreakType): Promise<void> {
  const newBreak = {
    duration: breakBooking.duration,
    startTime: breakBooking.startTime,
    endTime: breakBooking.endTime,
    staff_id: breakBooking.staff_id,
    service: { title: breakBooking.service },
    selectedDate: breakBooking.selectedDate,
    category: {},
    extraServices: [],
    guestInfo: {
      name: breakBooking.notes,
      email: "",
      phone: "",
      observation: "",
    },
    canceled: false,
    break: true,
  };
  const { error } = await supabase.from("bookings").insert([
    {
      ...newBreak,
    },
  ]);

  if (error) {
    console.error("Bokningen kunde inte skapas.");
    throw new Error("Bokningen kunde inte skapas.");
  }
}

export async function editBreak({
  breakBooking,
  id,
}: EditNewBreakType): Promise<void> {
  const editedBreak = {
    duration: breakBooking.duration,
    endTime: breakBooking.endTime,
    guestInfo: { name: breakBooking.notes },
    selectedDate: breakBooking.selectedDate,
    service: { title: breakBooking.service },
    staff_id: breakBooking.staff_id,
    startTime: breakBooking.startTime,
  };

  const { error } = await supabase
    .from("bookings")
    .update({ ...editedBreak })
    .eq("id", id);

  if (error) {
    console.error("Bokningen kunde inte uppdateras.");
    throw new Error("Bokningen kunde inte uppdateras.");
  }
}
