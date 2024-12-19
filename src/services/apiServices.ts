import { supabase } from "./supabase";
import { CategoryUpdateType } from "./types";

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
  let imagePath: string | undefined;

  if (category.image) {
    const imageName: string = `${Math.random()}-${
      category.image?.name
    }`.replace(/\//g, "");
    imagePath = `${
      import.meta.env.VITE_SUPABASE_URL as string
    }/storage/v1/object/public/images/${imageName}`;

    const { error: storageError } = await supabase.storage
      .from("images")
      .upload(imageName, category.image);

    if (storageError) {
      console.error("Category could not be edited.");
      throw new Error("Category could not be edited.");
    }
  }

  const { error } = await supabase
    .from("categories")
    .update({
      title: category.title,
      description: category.description,
      image: imagePath,
    })
    .eq("id", category.id)
    .select();

  if (error) {
    console.error("Category could not be edited.");
    throw new Error("Category could not be edited.");
  }
}
