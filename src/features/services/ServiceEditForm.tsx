import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ServicesType } from "@/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ServiceEditFormProps = {
  serviceToEdit?: ServicesType;
  categoryID: number;
  onHandleService: (
    service: ServiceToSubmit & {
      isActive: boolean;
      id: number;
      categoryID: number;
    }
  ) => void;
};
type FormSchema = z.infer<typeof formSchema> & {
  id: number;
  isActive: boolean;
};
type ServiceToSubmit = {
  title: string;
  description: string;
  duration: number;
  price: number;
};

const formSchema = z.object({
  title: z.string().nonempty("Titel är obligatorisk"),
  description: z.string().nonempty("Beskrivning är obligatorisk"),
  duration: z.number().min(1, "Tidsåtgång måste vara minst 1"),
  price: z.number().min(1, "Pris måste vara minst 1"),
});

const defaultService: FormSchema = {
  id: 0,
  title: "",
  description: "",
  duration: 0,
  price: 0,
  isActive: true,
};

export default function ServiceEditForm({
  serviceToEdit = defaultService,
  categoryID,
  onHandleService,
}: ServiceEditFormProps): JSX.Element {
  const { id: isEditService, ...editValues } = serviceToEdit;
  const isEditSession = Boolean(isEditService);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditSession
      ? {
          title: serviceToEdit.title,
          description: serviceToEdit.description,
          duration: serviceToEdit.duration,
          price: serviceToEdit.price,
        }
      : {
          title: "",
          description: "",
          duration: 0,
          price: 0,
        },
    mode: "onChange",
  });
  const { isValid, isSubmitting } = form.formState;

  function onSubmit(data: ServiceToSubmit) {
    if (
      data.title === editValues.title &&
      data.description === editValues.description &&
      data.duration === editValues.duration &&
      data.price === editValues.price
    )
      return;
    if (isEditSession) {
      onHandleService({
        ...data,
        isActive: true,
        id: isEditService,
        categoryID: editValues.categoryID || 0,
      });
    } else {
      onHandleService({ ...data, isActive: true, categoryID, id: -1 });
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

        <div className="flex gap-3">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Tidåtgång</FormLabel>
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
              : "Skapa tjänst"}
          </Button>
        </DialogClose>
      </form>
    </Form>
  );
}
