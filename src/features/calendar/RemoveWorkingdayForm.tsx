import Spinner from "@/components/layout/Spinner";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { useCalendar } from "@/context/CalendarContext";
import { useStaff } from "@/hooks/useStaff";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarMinus, Loader2 } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import CustomCalendar from "./CustomCalendar";
import CustomStaffSelect from "./CustomStaffSelect";
import { useDeleteWorkday } from "./useDeleteWorkday";

type OnSubmitType = z.infer<typeof formSchema>;

const formSchema = z.object({
  staff: z.string().nonempty("Välj en person"),
  date: z.date({ required_error: "Välj ett datum" }),
});

export default function RemoveWorkingdayForm() {
  const { fetchingStaff } = useStaff();
  const { currentStaffMember } = useCalendar();
  const { onDeleteWorkday, isDeletingWorkday } = useDeleteWorkday();

  const initialValues = {
    staff: currentStaffMember?.id.toString() || "",
    date: new Date(),
  };

  const form = useForm<OnSubmitType>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  function onSubmit(data: OnSubmitType) {
    const date = format(data.date, "yyyy-MM-dd");
    const staffID = parseInt(data.staff);

    onDeleteWorkday({ staffID, date });
  }

  if (fetchingStaff) return <Spinner />;

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 min-w-full"
      >
        <CustomStaffSelect control={form.control} name="staff" />
        <CustomCalendar control={form.control} name="date" />

        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Stäng</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button disabled={!form.formState.isValid} type="submit">
              {isDeletingWorkday ? (
                <Loader2 className="animate-spin" />
              ) : (
                <CalendarMinus strokeWidth={1.5} />
              )}
              {isDeletingWorkday ? "Tar bort" : "Ta bort"}
            </Button>
          </DialogClose>
        </div>
      </form>
    </FormProvider>
  );
}
