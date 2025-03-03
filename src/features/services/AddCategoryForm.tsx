import Spinner from "@/components/layout/Spinner";
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
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useStaff } from "@/hooks/useStaff";
import { useStaffByCategoryID } from "@/hooks/useStaffByCategoryID";
import { CategoryEditType } from "@/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useCategories } from "./useCategories";
import { useEditStaffCategories } from "./useEditStaffCategories";
import { Loader2, PencilLine, Plus } from "lucide-react";

type AddCategoryFormProps = {
  categoryToEdit?: {
    title?: string;
    description?: string;
    id?: number;
  };
  onHandleCategory: (category: CategoryEditType) => void;
};
type FormSchema = z.infer<typeof formSchema>;

const formSchema = z.object({
  title: z.string().nonempty("Titel är obligatorisk"),
  description: z.string().nonempty("Beskrivning är obligatorisk"),
  image: z
    .instanceof(File)
    .optional()
    .refine((file) => file === undefined || file.size <= 5 * 1024 * 1024, {
      message: "Filstorleken får inte vara större än 5MB",
    })
    .refine(
      (file) =>
        file === undefined || ["image/jpeg", "image/png"].includes(file.type),
      {
        message: "Använd filformaten .jpeg eller .png",
      }
    ),
  staff: z.array(z.number()).nonempty("Välj minst en person"),
});

export default function AddCategoryForm({
  categoryToEdit = {},
  onHandleCategory,
}: AddCategoryFormProps): JSX.Element {
  const { id: isEditCategory, ...editValues } = categoryToEdit;
  const isEditSession = Boolean(isEditCategory);
  const { staff, isLoadingStaff } = useStaff();
  const { categories, isLoadingCategories } = useCategories();
  const { staffByCategoryID, isLoadingStaffByCategoryID } =
    useStaffByCategoryID(isEditCategory ?? -1);
  const { onEditStaffCategories } = useEditStaffCategories();
  const [staffsActive, setStaffsActive] = useState<number[]>([]);

  useEffect(() => {
    if (staffByCategoryID) setStaffsActive(staffByCategoryID);
  }, [staffByCategoryID]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: categoryToEdit.title || "",
      description: categoryToEdit.description || "",
      image: undefined,
      staff: isEditSession ? staffByCategoryID : [],
    },
    mode: "onChange",
  });

  const memoizedCategoryToEdit = useMemo(
    () => ({
      id: categoryToEdit.id,
      title: categoryToEdit.title,
      description: categoryToEdit.description,
    }),
    [categoryToEdit.id, categoryToEdit.title, categoryToEdit.description]
  );

  const { reset } = form;
  useEffect(() => {
    if (isEditSession && staffByCategoryID) {
      reset({
        title: memoizedCategoryToEdit.title || "",
        description: memoizedCategoryToEdit.description || "",
        image: undefined,
        staff: staffByCategoryID,
      });
    }
  }, [staffByCategoryID, isEditSession, memoizedCategoryToEdit, reset]);

  const { isValid, isSubmitting } = form.formState;

  function onSubmit(data: FormSchema) {
    const { description, image, title, staff } = data;

    if (
      title === editValues.title &&
      description === editValues.description &&
      !image &&
      staff.toString() === staffByCategoryID?.toString()
    )
      return;
    if (isEditSession) {
      onHandleCategory({
        description,
        title,
        image,
        id: isEditCategory,
        staff,
      });
      onEditStaffCategories({ isEditCategory: isEditCategory ?? -1, staff });
    } else {
      onHandleCategory({
        description,
        title,
        image,
        order: categories!.length,
        staff,
      });
    }
  }

  if (isLoadingStaffByCategoryID || isLoadingStaff || isLoadingCategories)
    return <Spinner />;

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

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beskrivning</FormLabel>
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
            <FormItem className="space-y-3">
              <FormLabel className="block">Välj en bild</FormLabel>
              <FormControl>
                <Input
                  className="pt-1.5 file:text-[var(--primary-600)] focus-visible:ring-[var(--primary-600)]"
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

        <FormField
          name="staff"
          control={form.control}
          render={() => (
            <FormItem className="flex-1">
              <FormLabel>Personal</FormLabel>
              <FormControl>
                <Controller
                  name="staff"
                  control={form.control}
                  render={({ field: { value = [], onChange } }) => {
                    const staffValues = value as number[];
                    return (
                      <ToggleGroup
                        className="flex justify-start flex-wrap gap-2"
                        type="multiple"
                        value={value.map(String)}
                        onValueChange={(newValue) => {
                          const findStaff = newValue
                            .map(
                              (name) => staff?.find((s) => s.name === name)?.id
                            )
                            .filter((id) => id !== undefined) as number[];

                          let newStaffs: number[] = [];
                          if (findStaff.length > 0) {
                            const staffId: number = findStaff[0];
                            if (staffValues.includes(staffId)) {
                              newStaffs = staffValues.filter(
                                (v) => v !== staffId
                              );
                            } else {
                              newStaffs = [...staffValues, staffId];
                            }
                          }
                          setStaffsActive(newStaffs);
                          onChange(newStaffs);
                        }}
                      >
                        {staff?.map((s) => (
                          <ToggleGroupItem
                            key={s.id}
                            size="lg"
                            value={s.name}
                            variant="outline"
                            aria-label={s.name}
                            className={`flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-foreground file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-600)] disabled:cursor-not-allowed disabled:opacity-50 file:cursor-pointer ${
                              staffsActive?.includes(s.id)
                                ? "bg-[var(--primary-600)] text-white hover:bg-[var(--primary-600)] hover:text-white"
                                : ""
                            }`}
                          >
                            <span>{s.name}</span>
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    );
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button disabled={!isValid || isSubmitting} type="submit">
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : isEditSession ? (
                <PencilLine strokeWidth={1.5} />
              ) : (
                <Plus strokeWidth={1.5} />
              )}
              {isSubmitting
                ? "Laddar..."
                : isEditSession
                ? "Ändra"
                : "Skapa kategori"}
            </Button>
          </DialogClose>
        </div>
      </form>
    </FormProvider>
  );
}
//------>
