import { supabase } from "./supabase";
import {
  CategoryListType,
  CategoryEditType,
  CreateServiceType,
  ServicesType,
  ExtraservicesType,
} from "./types";

async function uploadImageToBucket(
  image: File | undefined
): Promise<string | undefined> {
  let imagePath: string | undefined;

  if (image) {
    const imageName: string = `${Math.random()}-${image?.name}`.replace(
      /\//g,
      ""
    );
    imagePath = `${
      import.meta.env.VITE_SUPABASE_URL as string
    }/storage/v1/object/public/images/${imageName}`;

    const { error: storageError } = await supabase.storage
      .from("images")
      .upload(imageName, image);

    if (storageError) {
      console.error("Category could not be edited.");
      throw new Error("Category could not be edited.");
    }
  }

  return imagePath;
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
    .eq("id", category.id)
    .select();

  if (error) {
    console.error("Category could not be edited.");
    throw new Error("Category could not be edited.");
  }
}

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

type ToggleServiceType = {
  id: number;
  isActive: boolean;
};
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

export async function getExtraServices(): Promise<ExtraservicesType[]> {
  const { data, error } = await supabase.from("extraservices").select("*");

  if (error) {
    console.error("Tilläggstjänster kunde inte hämtas.");
    throw new Error("Tilläggstjänster kunde inte hämtas.");
  }

  return data;
}

export async function createExtraService(
  extraService: Omit<ExtraservicesType, "id">
) {
  const { data, error } = await supabase
    .from("extraservices")
    .insert([{ ...extraService }])
    .select();

  if (error) {
    console.error("Tilläggstjänster kunde inte skapas.");
    throw new Error("Tilläggstjänster kunde inte skapas.");
  }

  return data;
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
