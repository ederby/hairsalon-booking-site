import { uploadImageToBucket } from "@/lib/helpers";
import { supabase } from "./supabase";
import {
  BookingSettingsType,
  CompanySettingsType,
  GeneralSettingsType,
  StaffType,
  WorkdayType,
} from "./types";

type EditStaffType = Omit<StaffType, "image" | "created_at" | "isActive"> & {
  image?: File | undefined;
};
type ToggleActiveStaffProps = {
  isActive: boolean;
  id: number;
};

export async function editStaff(staff: EditStaffType): Promise<void> {
  const image = await uploadImageToBucket(staff.image);

  const { error } = await supabase
    .from("staff")
    .update({ ...staff, image })
    .eq("id", staff.id);

  if (error) {
    console.error("Informationen kunde inte uppdateras.");
    throw new Error("Informationen kunde inte uppdateras.");
  }
}

export async function toggleActiveStaff({
  isActive,
  id,
}: ToggleActiveStaffProps): Promise<void> {
  const { error } = await supabase
    .from("staff")
    .update({ isActive })
    .eq("id", id);

  if (error) {
    console.error("Informationen kunde inte uppdateras.");
    throw new Error("Informationen kunde inte uppdateras.");
  }
}

export async function deleteWorkday(id: number): Promise<void> {
  const { error } = await supabase.from("workdays").delete().eq("id", id);

  if (error) {
    console.error("Arbetsdagen kunde inte raderas.");
    throw new Error("Arbetsdagen kunde inte raderas.");
  }
}

export async function editWorkday(workday: WorkdayType): Promise<void> {
  const { error } = await supabase
    .from("workdays")
    .update({ ...workday })
    .eq("id", workday.id);

  if (error) {
    console.error("Arbetsdagen kunde inte uppdateras.");
    throw new Error("Arbetsdagen kunde inte uppdateras.");
  }
}

export async function deleteWorkdays(id: number[]): Promise<void> {
  const { error } = await supabase.from("workdays").delete().in("id", id);

  if (error) {
    console.error("Arbetsdagarna kunde inte raderas.");
    throw new Error("Arbetsdagarna kunde inte raderas.");
  }
}

export async function getBookingSettings(): Promise<BookingSettingsType> {
  const { data, error } = await supabase.from("booking_settings").select();

  if (error) {
    console.error("Inställningarna kunde inte hämtas.");
    throw new Error("Inställningarna kunde inte hämtas.");
  }

  return data.at(0);
}

export async function editBookingSettings(
  settings: BookingSettingsType
): Promise<void> {
  const { id, ...newSettings } = settings;
  const { error } = await supabase
    .from("booking_settings")
    .update({ ...newSettings })
    .eq("id", id);

  if (error) {
    console.error("Inställningarna kunde inte uppdateras.");
    throw new Error("Inställningarna kunde inte uppdateras.");
  }
}

export async function getCompanySettings(): Promise<CompanySettingsType> {
  const { data, error } = await supabase.from("company_settings").select();

  if (error) {
    console.error("Inställningarna kunde inte hämtas.");
    throw new Error("Inställningarna kunde inte hämtas.");
  }

  return data.at(0);
}

export async function editCompanySettings(
  settings: Omit<CompanySettingsType, "companyLogo"> & { companyLogo?: File }
): Promise<void> {
  const { id, ...newSettings } = settings;
  const image = await uploadImageToBucket(newSettings.companyLogo);

  const { error } = await supabase
    .from("company_settings")
    .update({ ...newSettings, companyLogo: image })
    .eq("id", id);

  if (error) {
    console.error("Inställningarna kunde inte uppdateras.");
    throw new Error("Inställningarna kunde inte uppdateras.");
  }
}

export async function getGeneralSettings(): Promise<GeneralSettingsType> {
  const { data, error } = await supabase.from("general_settings").select();

  if (error) {
    console.error("Inställningarna kunde inte hämtas.");
    throw new Error("Inställningarna kunde inte hämtas.");
  }

  return data.at(0);
}

export async function editGeneralSettings(
  settings: Omit<GeneralSettingsType, "id">
): Promise<void> {
  const { error } = await supabase
    .from("general_settings")
    .update({ ...settings })
    .eq("id", 1);

  if (error) {
    console.error("Inställningarna kunde inte uppdateras.");
    throw new Error("Inställningarna kunde inte uppdateras.");
  }
}
