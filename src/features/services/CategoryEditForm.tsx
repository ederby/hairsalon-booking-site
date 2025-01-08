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

type CategoryEditFormProps = {
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

export default function CategoryEditForm({
  categoryToEdit = {},
  onHandleCategory,
}: CategoryEditFormProps): JSX.Element {
  const { id: isEditCategory, ...editValues } = categoryToEdit;
  const isEditSession = Boolean(isEditCategory);
  const { staff } = useStaff();
  const { categories } = useCategories();
  const { staffByCategoryID, fetchingStaffByCategoryID } = useStaffByCategoryID(
    isEditCategory ?? -1
  );
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
    console.log(staff);
    if (
      title === editValues.title &&
      description === editValues.description &&
      !image &&
      // staff.every((element) => staffByCategoryID?.includes(element))
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

  if (fetchingStaffByCategoryID) return <Spinner />;

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
            <FormItem>
              <FormLabel className="block mb-1">Välj en bild</FormLabel>
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

        {/* <FormField
          control={form.control}
          name="staff"
          render={() => (
            <FormItem>
              <FormLabel>Personal</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {staff
                    ?.filter((s) => s.id !== -1)
                    .map((staffMember) => (
                      <label
                        key={staffMember.id}
                        className="flex items-center space-x-2"
                      >
                        <Controller
                          name="staff"
                          control={form.control}
                          render={({ field: { value, onChange } }) => (
                            <Checkbox
                              value={staffMember.id}
                              defaultChecked={staffByCategoryID?.includes(
                                staffMember.id
                              )}
                              checked={value?.includes(staffMember.id)}
                              onCheckedChange={(checked) =>
                                onChange(
                                  checked
                                    ? [...(value || []), staffMember.id]
                                    : value?.filter((v) => v !== staffMember.id)
                                )
                              }
                            />
                          )}
                        />
                        <span>{staffMember.name}</span>
                      </label>
                    ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

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
                  render={({ field: { value = [], onChange } }) => (
                    <ToggleGroup
                      type="multiple"
                      value={value.map(String)}
                      onValueChange={(newValue) => {
                        const findStaff = newValue
                          .map(
                            (name) => staff?.find((s) => s.name === name)?.id
                          )
                          .filter((id) => id !== undefined) as number[];

                        console.log(findStaff);
                        console.log(value);

                        let newStaffs: number[] = [];
                        if (findStaff.length > 0) {
                          const staffId = findStaff[0];
                          if (value.includes(staffId)) {
                            newStaffs = value.filter((v) => v !== staffId);
                          } else {
                            newStaffs = [...value, staffId];
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
                          aria-label={s.name}
                          className={`${
                            staffsActive?.includes(s.id)
                              ? "bg-amber-400 text-amber-900 hover:bg-amber-400 hover:text-amber-900"
                              : ""
                          }`}
                        >
                          <span>{s.name}</span>
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
              ? "Ändra"
              : "Skapa kategori"}
          </Button>
        </DialogClose>
      </form>
    </FormProvider>
  );
}
//------>
