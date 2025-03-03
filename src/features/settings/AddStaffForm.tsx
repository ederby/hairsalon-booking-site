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
import { StaffType } from "@/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPen } from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import { useEditStaff } from "./useEditStaff";

type AddStaffFormProps = {
  staff: StaffType | undefined;
};

type FormSchema = z.infer<typeof formSchema> & {
  image?: File | undefined;
};

const formSchema = z.object({
  name: z.string().nonempty("Namn är obligatorisk"),
  role: z.string().nonempty("Roll är obligatorisk"),
  image: z.any(),
  email: z.string().email("Felaktig email-adress"),
  phone: z
    .string()
    .nonempty()
    .min(10, "Telefonnummer är obligatorisk och måste vara 10 siffror"),
  id: z.number().int(),
});

export default function AddStaffForm({
  staff,
}: AddStaffFormProps): JSX.Element {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: staff?.name || "",
      role: staff?.role || "",
      image: "",
      email: staff?.email || "",
      phone: staff?.phone || "",
      id: staff?.id || -1,
    },
    mode: "onChange",
  });
  const { onEditStaff, isEditingStaff } = useEditStaff();

  const onSubmit = (data: Omit<FormSchema, "created_at" | "isActive">) => {
    console.log(data);
    onEditStaff(data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Namn</FormLabel>
              <FormControl>
                <Input placeholder="Namn..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Roll</FormLabel>
              <FormControl>
                <Input placeholder="Roll..." {...field} />
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
              <FormLabel>Välj en bild</FormLabel>
              <FormControl>
                <Input
                  className="pt-1.5 file:text-[var(--primary-600)] focus-visible:ring-[var(--primary-600)]"
                  type="file"
                  id={value?.name}
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
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefon</FormLabel>
              <FormControl>
                <Input placeholder="Telefon..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Controller
          name="id"
          control={form.control}
          render={({ field }) => <input type="hidden" {...field} />}
        />
        <DialogClose asChild>
          <div className="flex justify-end gap-4">
            <Button variant="outline">Stäng</Button>
            <Button disabled={!form.formState.isValid} type="submit">
              {isEditingStaff ? (
                <Loader2 className="animate-spin" />
              ) : (
                <UserPen strokeWidth={1.5} />
              )}
              {isEditingStaff ? "Uppdaterar..." : "Uppdatera"}
            </Button>
          </div>
        </DialogClose>
      </form>
    </FormProvider>
  );
}
