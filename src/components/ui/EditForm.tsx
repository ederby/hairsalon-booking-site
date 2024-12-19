import { z } from "zod";
import { Button } from "./button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./form";
import { Input } from "./input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "./textarea";
import { CategoryUpdateType } from "@/services/types";
import { DialogClose } from "./dialog";

type EditFormProps = {
  title: string;
  description: string;
  id: number;
  mutate: (category: CategoryUpdateType) => void;
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

export default function EditForm({
  title,
  description,
  id,
  mutate,
}: EditFormProps): JSX.Element {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title,
      description,
      image: undefined,
    },
    mode: "onChange",
  });
  const { isValid, isSubmitting } = form.formState;

  function onSubmit(data: FormSchema) {
    mutate({ ...data, image: data.image, id: id });
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
          <Button className="w-full" disabled={!isValid} type="submit">
            {isSubmitting ? "Laddar..." : "Ändra"}
          </Button>
        </DialogClose>
      </form>
    </Form>
  );
}
