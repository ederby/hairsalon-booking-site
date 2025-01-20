import { supabase } from "./supabase";
import { BookingType, ServicesType } from "./types";

export async function getActiveBookings(): Promise<BookingType[]> {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
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

type EditNewBookingType = {
  booking: Omit<BookingType, "id" | "created_at">;
  id: number;
};
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
}: Omit<EditNewBookingType, "id">): Promise<void> {
  const { error } = await supabase.from("bookings").insert([booking]);

  if (error) {
    console.error("Bokningen kunde inte skapas.");
    throw new Error("Bokningen kunde inte skapas.");
  }
}
