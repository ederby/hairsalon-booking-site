import { toast } from "@/hooks/use-toast";
import { supabase } from "./supabase";
import {
  CategoryListType,
  ExtraservicesType,
  StaffType,
  WorkdayType,
} from "./types";

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

export async function getWorkdays(): Promise<WorkdayType[]> {
  const { data, error } = await supabase
    .from("workdays")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    console.error("Arbetsdagarna kunde inte hämtas.");
    throw new Error("Arbetsdagarna kunde inte hämtas.");
  }

  return data;
}

export async function createWorkday(
  workday: Omit<WorkdayType, "id">
): Promise<boolean> {
  const { data } = await supabase
    .from("workdays")
    .select("*")
    .eq("staffID", workday.staffID)
    .eq("date", workday.date);

  if (data?.length === 0) {
    const { error } = await supabase.from("workdays").insert([{ ...workday }]);

    if (error) {
      console.error("Arbetsdagen kunde inte skapas.");
      throw new Error("Arbetsdagen kunde inte skapas.");
    }
    return true;
  } else {
    toast({
      title: "Obs!",
      description: "Arbetsdagen är redan tillagd",
      onSuccess: false,
    });
    return false;
  }
}
