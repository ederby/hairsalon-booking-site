import { uploadImageToBucket } from "@/lib/helpers";
import { supabase } from "./supabase";
import {
  CategoryListType,
  CategoryEditType,
  CreateServiceType,
  ServicesType,
  ExtraservicesType,
} from "./types";

type ToggleServiceType = {
  id: number;
  isActive: boolean;
};
type CreateCategoryType = {
  title: string;
  description: string;
  image?: File | undefined;
  staff: number[];
};
type CreateCategoryDataType = {
  id: number;
  description: string;
  title: string;
  order: null;
  image: string | null;
};

export async function editCategories(
  category: CategoryEditType
): Promise<void> {
  const image = await uploadImageToBucket(category.image);

  const { error } = await supabase
    .from("categories")
    .update({
      title: category.title,
      description: category.description,
      image,
    })
    .eq("id", category.id);

  if (error) {
    console.error("Category could not be edited.");
    throw new Error("Category could not be edited.");
  }
}

export async function createCategory(
  category: CreateCategoryType
): Promise<void> {
  const image = await uploadImageToBucket(category.image);

  const { data, error } = await supabase
    .from("categories")
    .insert([
      { description: category.description, title: category.title, image },
    ])
    .select();

  if (error) {
    console.error("Category could not be uploaded.");
    throw new Error("Category could not be uploaded.");
  }

  const categoryData = data as unknown as CreateCategoryDataType[];
  category.staff.map((s) => setStaffCategory(s, categoryData[0].id));
  if (category.staff.length >= 2) setStaffCategory(-1, categoryData[0].id);
}

export async function deleteCategory(id: number): Promise<void> {
  const { error: servicesError } = await supabase
    .from("services")
    .delete()
    .eq("categoryID", id);

  if (servicesError) {
    console.error("Category could not be erased.");
    throw new Error("Category could not be erased.");
  }

  deleteStaffCategories(id);

  const { error: categoriesError } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (categoriesError) {
    console.error("Category could not be erased.");
    throw new Error("Category could not be erased.");
  }
}

export async function changeOrderCategories(
  categories: CategoryListType[]
): Promise<void> {
  const { error } = await supabase
    .from("categories")
    .upsert(categories.map((category, i) => ({ ...category, order: i })));

  if (error) {
    console.error("Kategorin kunde inte flyttas.");
    throw new Error("Kategorin kunde inte flyttas.");
  }
}

export async function getServicesByCategoryID(
  id: number
): Promise<ServicesType[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("categoryID", id)
    .order("order", { ascending: true });

  if (error) {
    console.error("Tjänsten kunde inte hämtas.");
    throw new Error("Tjänsten kunde inte hämtas.");
  }

  return data;
}

export async function editService(service: ServicesType): Promise<void> {
  const { error } = await supabase
    .from("services")
    .update({
      title: service.title,
      description: service.description,
      duration: service.duration,
      price: service.price,
    })
    .eq("id", service.id);

  if (error) {
    console.error("Tjänsten kunde inte laddas upp.");
    throw new Error("Tjänsten kunde inte laddas upp.");
  }
}

export async function deleteService(id: number): Promise<void> {
  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) {
    if (error.code === "23503") {
      throw new Error(
        "Tjänsten kunde inte raderas just nu. Det finns bokningar kopplade till denna tjänsten."
      );
    } else {
      console.error("Service could not be deleted.");
      throw new Error("Tjänsten kunde inte raderas.");
    }
  }
}

export async function toggleService({
  id,
  isActive,
}: ToggleServiceType): Promise<void> {
  const { error } = await supabase
    .from("services")
    .update({ isActive })
    .eq("id", id);

  if (error) {
    console.error("Service could not be updated.");
    throw new Error("Tjänsten kunde inte uppdateras.");
  }
}

export async function createService(service: CreateServiceType): Promise<void> {
  const readyService = {
    title: service.title,
    description: service.description,
    duration: service.duration,
    price: service.price,
    categoryID: service.categoryID,
    isActive: service.isActive,
  };

  const { error } = await supabase
    .from("services")
    .insert([{ ...readyService }])
    .select();
  if (error) {
    console.error("Tjänsten kunde inte skapas.");
    throw new Error("Tjänsten kunde inte skapas.");
  }
}

export async function changeOrderServices(
  services: ServicesType[]
): Promise<void> {
  const { error } = await supabase
    .from("services")
    .upsert(services.map((service, i) => ({ ...service, order: i })));

  if (error) {
    console.error("Tjänsten kunde inte flyttas.");
    throw new Error("Tjänsten kunde inte flyttas.");
  }
}

export async function getStaffIDByCategoryID(id: number): Promise<number[]> {
  const { data, error } = await supabase
    .from("staff_categories")
    .select("staff_id")
    .eq("category_id", id)
    .neq("staff_id", -1);

  if (error) {
    console.error("Personal kunde inte hämtas.");
    throw new Error("Personal kunde inte hämtas.");
  }

  const filteredData = data.map((d) => d.staff_id);

  return filteredData;
}

export async function editStaffCategories({
  isEditCategory,
  staff,
}: {
  isEditCategory: number;
  staff: number[];
}): Promise<void> {
  await deleteStaffCategories(isEditCategory);

  await Promise.all(staff.map((s) => setStaffCategory(s, isEditCategory)));
  if (staff.length >= 2) await setStaffCategory(-1, isEditCategory);
}

export async function createExtraService(
  extraService: Omit<ExtraservicesType, "id" | "isActive">
) {
  const { data, error } = await supabase
    .from("extraservices")
    .insert([{ ...extraService, isActive: true }])
    .select();

  if (error) {
    console.error("Tilläggstjänster kunde inte skapas.");
    throw new Error("Tilläggstjänster kunde inte skapas.");
  }

  return data;
}

export async function deleteExtraService(id: number): Promise<void> {
  const { error } = await supabase.from("extraservices").delete().eq("id", id);

  if (error) {
    console.error("Tilläggstjänster kunde inte raderas.");
    throw new Error("Tilläggstjänster kunde inte raderas.");
  }
}

export async function editExtraService(
  extraService: Omit<ExtraservicesType, "isActive">
): Promise<void> {
  const { title, price, duration, id, categoryIDs } = extraService;
  const { error } = await supabase
    .from("extraservices")
    .update({
      title,
      price,
      duration,
      categoryIDs,
    })
    .eq("id", id);

  if (error) {
    console.error("Tilläggstjänster kunde inte uppdateras.");
    throw new Error("Tilläggstjänster kunde inte uppdateras.");
  }
}

export async function toggleExtraService({
  id,
  toggle,
}: {
  id: number;
  toggle: boolean;
}): Promise<void> {
  const { error } = await supabase
    .from("extraservices")
    .update({ isActive: toggle })
    .eq("id", id);

  if (error) {
    console.error("Tilläggstjänster kunde inte uppdateras.");
    throw new Error("Tilläggstjänster kunde inte uppdateras.");
  }
}

//=HELP FUNCTIONS========================================================================

async function setStaffCategory(
  staff: number,
  categoryID: number
): Promise<void> {
  const { error } = await supabase
    .from("staff_categories")
    .insert([{ staff_id: staff, category_id: categoryID }])
    .select();

  if (error) {
    console.error("Category could not be uploaded.");
    throw new Error("Category could not be uploaded.");
  }
}

async function deleteStaffCategories(categoryID: number): Promise<void> {
  const { error } = await supabase
    .from("staff_categories")
    .delete()
    .eq("category_id", categoryID)
    .select();

  if (error) {
    console.error("Category could not be erased.");
    throw new Error("Category could not be erased.");
  }
}
