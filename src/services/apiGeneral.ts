import { supabase } from "./supabase";
import { CategoryListType, ExtraservicesType, StaffType } from "./types";

export async function getStaff(): Promise<StaffType[]> {
  const { data, error } = await supabase
    .from("staff")
    .select("*")
    .neq("id", -1)
    .order("name", { ascending: true });

  if (error) {
    console.error("Staff could not be loaded.");
    throw new Error("Personal kunde inte hämtas.");
  }

  return data;
}

export async function getCategories(): Promise<CategoryListType[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("order", { ascending: true });

  if (error) {
    console.error("Services could not be loaded.");
    throw new Error("Services could not be loaded.");
  }

  return data;
}

export async function getExtraServices(): Promise<ExtraservicesType[]> {
  const { data, error } = await supabase
    .from("extraservices")
    .select("*")
    .order("isActive", { ascending: false })
    .order("id", { ascending: true });

  if (error) {
    console.error("Tilläggstjänster kunde inte hämtas.");
    throw new Error("Tilläggstjänster kunde inte hämtas.");
  }

  return data;
}
