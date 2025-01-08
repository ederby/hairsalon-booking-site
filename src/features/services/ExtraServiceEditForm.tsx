import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ExtraservicesType } from "@/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useCategories } from "./useCategories";
import { useCreateExtraService } from "./useCreateExtraService";
import { useEditExtraService } from "./useEditExtraService";

const formSchema = z.object({
  title: z.string().nonempty("Titel är obligatorisk"),
  duration: z.number().min(1, "Tidsåtgång måste vara minst 1"),
  price: z.number().min(1, "Pris måste vara minst 1"),
  categoryIDs: z.array(z.number()).nonempty("Välj minst en kategori"),
});

type ExtraServiceEditFormProps = {
  extraServiceToEdit?: {
    id?: number;
    title?: string;
    duration?: number;
    price?: number;
    categoryIDs?: number[];
  };
};

export default function ExtraServiceEditForm({
  extraServiceToEdit = {},
}: ExtraServiceEditFormProps): JSX.Element {
  const [categoriesActive, setCategoriesActive] = useState<number[]>(
    extraServiceToEdit.categoryIDs || []
  );
  const { categories } = useCategories();
  const { onCreateExtraService } = useCreateExtraService();
  const { id: isEditExtraService, ...editValues } = extraServiceToEdit;
  const isEditSession = Boolean(isEditExtraService);
  const { onEditExtraService } = useEditExtraService();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: extraServiceToEdit.title || "",
      duration: extraServiceToEdit.duration || 0,
      price: extraServiceToEdit.price || 0,
      categoryIDs: categoriesActive,
    },
    mode: "onChange",
  });
  const { isValid, isSubmitting } = form.formState;

  function onSubmit(data: Omit<ExtraservicesType, "id">) {
    const { categoryIDs, duration, price, title } = data;
    console.log(categoryIDs);

    if (
      duration === editValues.duration &&
      title === editValues.title &&
      price === editValues.price &&
      categoryIDs.toString() === editValues.categoryIDs?.toString()
    )
      return;

    if (isEditSession) {
      onEditExtraService({ ...data, id: isEditExtraService ?? -1 });
    } else {
      onCreateExtraService(data);
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titel</FormLabel>
              <FormControl>
                <Input placeholder="Titel..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Tidsåtgång</FormLabel>
                <FormControl>
                  <Input
                    className="flex-1"
                    type="number"
                    placeholder="Tidåtgång..."
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Pris</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Pris..."
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="categoryIDs"
          control={form.control}
          render={() => (
            <FormItem className="flex-1">
              <FormLabel>Kategorier</FormLabel>
              <FormControl>
                <Controller
                  name="categoryIDs"
                  control={form.control}
                  render={({ field: { value, onChange } }) => (
                    <ToggleGroup
                      type="multiple"
                      value={value.map(String)}
                      onValueChange={(newValue) => {
                        const findCategories: number =
                          newValue
                            .map(
                              (title) =>
                                categories?.find(
                                  (category) => category.title === title
                                )?.id
                            )
                            .filter((id) => id !== undefined)
                            .shift() ?? -1;

                        console.log(newValue);
                        let newCategories: number[] = [];
                        if (value.includes(findCategories ?? -1))
                          newCategories = value.filter(
                            (v) => v !== findCategories
                          );
                        else newCategories = [...value, findCategories];

                        setCategoriesActive(newCategories);
                        onChange(newCategories);
                      }}
                    >
                      {categories?.map((category) => (
                        <ToggleGroupItem
                          key={category.id}
                          size="lg"
                          value={category.title}
                          aria-label={category.title}
                          className={`${
                            categoriesActive.includes(category.id)
                              ? "bg-amber-400 text-amber-900 hover:bg-amber-400 hover:text-amber-900"
                              : ""
                          }`}
                        >
                          <span>{category.title}</span>
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  )}
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
              ? "Redigera tilläggstjänst"
              : "Skapa tilläggstjänst"}
          </Button>
        </DialogClose>
      </form>
    </FormProvider>
  );
}
