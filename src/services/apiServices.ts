import { supabase } from "./supabase";
import { CategoryUpdateType } from "./types";

async function uploadImageToBucket(image: File | undefined) {
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

export async function getCategories() {
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

export async function updateCategories(category: CategoryUpdateType) {
  const image = await uploadImageToBucket(category.image);

  console.log(image);

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

export async function createCategory(category: CreateCategoryType) {
  const image = await uploadImageToBucket(category.image);

  const { error } = await supabase
    .from("categories")
    .insert([{ ...category, image }]);

  if (error) {
    console.error("Category could not be uploaded.");
    throw new Error("Category could not be uploaded.");
  }
}

export async function deleteCategory(id: number) {
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    console.error("Category could not be erased.");
    throw new Error("Category could not be erased.");
  }
}
