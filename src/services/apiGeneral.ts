import { supabase } from "./supabase";
import { StaffType } from "./types";

export async function getStaff(): Promise<StaffType[]> {
  const { data, error } = await supabase.from("staff").select("*");

  if (error) {
    console.error("Staff could not be loaded.");
    throw new Error("Personal kunde inte hämtas.");
  }

  return data;
}
