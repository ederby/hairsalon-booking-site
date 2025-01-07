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

const formSchema = z.object({
  title: z.string().nonempty("Titel är obligatorisk"),
  duration: z.number().min(1, "Tidsåtgång måste vara minst 1"),
  price: z.number().min(1, "Pris måste vara minst 1"),
  categoryIDs: z.array(z.number()).nonempty("Välj minst en kategori"),
});

export default function ExtraServiceEditForm(): JSX.Element {
  const [categoriesActive, setCategoriesActive] = useState<number[]>([]);
  const { categories } = useCategories();
  const { onCreateExtraService } = useCreateExtraService();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      duration: 0,
      price: 0,
      categoryIDs: categoriesActive,
    },
    mode: "onChange",
  });
  const { isValid, isSubmitting } = form.formState;

  function onSubmit(data: Omit<ExtraservicesType, "id">) {
    console.log(data);
    onCreateExtraService(data);
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

        <div className="w-full overflow-hidden">
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
                            variant="outline"
                            size="lg"
                            value={category.title}
                            aria-label={category.title}
                            className={`${
                              categoriesActive.includes(category.id)
                                ? "bg-teal-600 hover:bg-teal-600 text-teal-50 hover:text-teal-50"
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
        </div>

        <DialogClose asChild>
          <Button
            className="w-full"
            disabled={!isValid || isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Laddar..." : "Skapa tilläggstjänst"}
          </Button>
        </DialogClose>
      </form>
    </FormProvider>
  );
}
