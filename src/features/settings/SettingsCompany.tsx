import Spinner from "@/components/layout/Spinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileCheck, Info, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useCompanySettings } from "./useCompanySettings";
import { useEditCompanySettings } from "./useEditCompanySettings";

type FormSchema = z.infer<typeof formSchema>;

const formSchema = z.object({
  companyName: z.string().nonempty("Företagsnamn är obligatoriskt"),
  companyLogo: z
    .instanceof(File)
    .optional()
    .refine((file) => file === undefined || file.size <= 5 * 1024 * 1024, {
      message: "Filstorleken får inte vara större än 5MB",
    })
    .refine(
      (file) =>
        file === undefined ||
        ["image/jpeg", "image/png", "image/svg+xml"].includes(file.type),
      {
        message: "Använd filformaten .jpeg, .png eller .svg",
      }
    ),
});

export default function SettingsCompany() {
  const [openDialog, setOpenDialog] = useState(false);
  const { companySettings, isLoadingCompanySettings } = useCompanySettings();
  const { onEditCompanySettings, isEditingCompanySettings } =
    useEditCompanySettings();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: companySettings?.companyName || "",
      companyLogo: undefined,
    },
  });

  useEffect(() => {
    if (companySettings) {
      form.reset({
        companyName: companySettings.companyName,
        companyLogo: undefined,
      });
    }
  }, [form, companySettings]);

  function onSubmit(data: FormSchema) {
    console.log(data);
    onEditCompanySettings({ ...data, id: companySettings?.id || 0 });
    form.reset({ companyLogo: undefined });
  }

  if (isLoadingCompanySettings) return <Spinner />;

  return (
    <>
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between space-x-2">
          <h4 className="scroll-m-20 text-md font-semibold tracking-tight">
            Företagsinformation
          </h4>
          <Info
            className="cursor-pointer text-[var(--primary-700)]"
            onClick={() => setOpenDialog(true)}
            strokeWidth={1.5}
            size={16}
          />
        </div>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <Controller
              name="companyName"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="companyName">Företagsnamn</Label>
                  <Input
                    {...field}
                    type="text"
                    className="input"
                    placeholder="Företagsnamn"
                  />
                </div>
              )}
            />

            <Controller
              name="companyLogo"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <div className="space-y-2">
                  <Label htmlFor="companyLogo">Företagslogga</Label>
                  <Input
                    className="pt-1.5 file:text-[var(--primary-600)] focus-visible:ring-[var(--primary-600)]"
                    type="file"
                    id={value?.name}
                    accept="image/jpeg, image/png, image/svg+xml"
                    onChange={(event) =>
                      onChange(event.target.files && event.target.files[0])
                    }
                    {...fieldProps}
                  />
                </div>
              )}
            />
            <h1 className="text-primary-">hejsansvenjsan</h1>

            <div className="flex justify-end">
              <Button
                disabled={!form.formState.isValid || !form.formState.isDirty}
                type="submit"
              >
                {isEditingCompanySettings ? (
                  <>
                    <Loader2 className="animate-spin" /> <span>Sparar</span>
                  </>
                ) : (
                  <>
                    <FileCheck strokeWidth={1.5} />
                    {!form.formState.isValid || !form.formState.isDirty
                      ? "Sparat"
                      : "Spara"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="overflow-y-auto max-h-full">
          <DialogHeader>
            <DialogTitle>Företagsinformation</DialogTitle>
            <DialogDescription>
              Här anger du ditt företagsnamn och kan ladda upp en företagslogga
              som syns genom applikationen.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
