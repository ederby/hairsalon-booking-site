import { supabase } from "./supabase";
import {
  CategoryListType,
  CategoryUpdateType,
  CreateServiceType,
  ServicesType,
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
    .order("id", { ascending: true });

  if (error) {
    console.error("Services could not be loaded.");
    throw new Error("Services could not be loaded.");
  }

  return data;
}

export async function updateCategories(
  category: CategoryUpdateType
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
};

export async function createCategory(
  category: CreateCategoryType
): Promise<void> {
  const image = await uploadImageToBucket(category.image);

  const { error } = await supabase
    .from("categories")
    .insert([{ ...category, image }]);

  if (error) {
    console.error("Category could not be uploaded.");
    throw new Error("Category could not be uploaded.");
  }
}

export async function deleteCategory(id: number): Promise<void> {
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    console.error("Category could not be erased.");
    throw new Error("Category could not be erased.");
  }
}

export async function getServicesByCategoryID(
  id: number
): Promise<ServicesType[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("categoryID", id)
    .order("id", { ascending: true });

  if (error) {
    console.error("Service could not be uploaded.");
    throw new Error("Service could not be uploaded.");
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
    console.error("Service could not be uploaded.");
    throw new Error("Service could not be uploaded.");
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
    throw new Error("Service could not be updated.");
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
    console.log(error.message);
    console.error("Service could not be created.");
    throw new Error("Service could not be created.");
  }
}
