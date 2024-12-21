import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CategoryUpdateType } from "@/services/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type CategoryEditFormProps = {
  categoryToEdit?: {
    title?: string;
    description?: string;
    id?: number;
  };
  onHandleCategory: (category: CategoryUpdateType) => void;
};
type FormSchema = z.infer<typeof formSchema>;

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z
    .instanceof(File)
    .optional()
    .refine((file) => file === undefined || file.size <= 5 * 1024 * 1024, {
      message: "File size should be less than 5MB",
    })
    .refine(
      (file) =>
        file === undefined || ["image/jpeg", "image/png"].includes(file.type),
      {
        message: "Only JPEG and PNG files are allowed",
      }
    ),
});

export default function CategoryEditForm({
  categoryToEdit = {},
  onHandleCategory,
}: CategoryEditFormProps): JSX.Element {
  const { id: isEditCategory, ...editValues } = categoryToEdit;
  const isEditSession = Boolean(isEditCategory);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditSession
      ? {
          title: categoryToEdit.title,
          description: categoryToEdit.description,
          image: undefined,
        }
      : {},
    mode: "onChange",
  });
  const { isValid, isSubmitting } = form.formState;

  function onSubmit(data: FormSchema) {
    console.log(data);
    if (
      data.title === editValues.title &&
      data.description === editValues.description &&
      !data.image
    )
      return;
    if (isEditSession) {
      onHandleCategory({ ...data, image: data.image, id: isEditCategory });
    } else {
      onHandleCategory({ ...data });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Titel..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Beskrivning..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormControl>
                <input
                  className="file:bg-teal-600 file:text-teal-50 file:border-0 file:rounded file:py-2 file:px-3 hover:file:bg-teal-500 file:cursor-pointer"
                  type="file"
                  id={value?.name}
                  accept="image/jpeg, image/png"
                  onChange={(event) =>
                    onChange(event.target.files && event.target.files[0])
                  }
                  {...fieldProps}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogClose asChild>
          <Button
            className="w-full"
            disabled={!isValid || isSubmitting}
            type="submit"
          >
            {isSubmitting
              ? "Laddar..."
              : isEditSession
              ? "Ändra"
              : "Skapa kategori"}
          </Button>
        </DialogClose>
      </form>
    </Form>
  );
}
