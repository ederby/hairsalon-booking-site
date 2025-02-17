import { uploadImageToBucket } from "@/lib/helpers";
import { supabase } from "./supabase";
import { StaffType, WorkdayType } from "./types";

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
