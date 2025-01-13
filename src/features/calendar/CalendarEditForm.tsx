import Spinner from "@/components/layout/Spinner";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { BookingInfoType } from "@/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useCategories } from "../services/useCategories";
import { useExtraServices } from "../services/useExtraServices";
import { useServices } from "./useServices";
import { set } from "date-fns";

type CalendarEditFormProps = {
  booking: BookingInfoType & { Subject: string };
};

const formSchema = z.object({
  service: z.string().nonempty("Titel är obligatorisk"),
  extraservices: z.string().nonempty("Beskrivning är obligatorisk"),
});

export default function CalendarEditForm({
  booking,
}: CalendarEditFormProps): JSX.Element {
  const { Subject: service } = booking;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service: service || "",
      extraservices: "",
    },
    mode: "onChange",
  });
  const { services, isLoadingServices } = useServices();
  const { categories, isLoadingCategories } = useCategories();
  const { extraServices, isLoadingExtraServices } = useExtraServices();
  const [selectedService, setSelectedServices] = useState<number | null>(
    booking.serviceID
  );
  const [selectedExtraService, setSelectedExtraServices] = useState<number[]>(
    []
  );

  function onSubmit() {
    console.log("Form submitted");
  }

  function handleServiceChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedServices(event.target.value ? Number(event.target.value) : null);
  }

  function handleExtraServiceChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const selectedOptions = +event.target.value;
    setSelectedExtraServices((s) => {
      if (s.includes(selectedOptions))
        return [
          ...s.filter((extraService) => extraService !== selectedOptions),
          selectedOptions,
        ];
      else return [...s, selectedOptions];
    });
  }

  if (isLoadingServices || isLoadingCategories || isLoadingExtraServices) {
    return <Spinner />;
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="service"
          render={() => (
            <FormItem>
              <FormLabel>Tjänst</FormLabel>
              <FormControl>
                <select
                  id="service-select"
                  value={selectedService ?? ""}
                  onChange={handleServiceChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Välj en tjänst</option>
                  {categories?.map((category) => (
                    <optgroup key={category.id} label={category.title}>
                      {services
                        ?.filter(
                          (service) => service.categoryID === category.id
                        )
                        .map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.title}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="extraservices"
          render={() => (
            <FormItem>
              <FormLabel>Tilläggstjänster</FormLabel>
              <FormControl>
                <select
                  id="service-select"
                  value={selectedExtraService ?? ""}
                  onChange={handleExtraServiceChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Välj tilläggstjänster</option>

                  {extraServices?.map((extraService) => (
                    <option key={extraService.id} value={extraService.id}>
                      {selectedExtraService.includes(extraService.id)
                        ? "✓ "
                        : ""}
                      {extraService.title}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
              <ul>
                {extraServices
                  ?.filter((service) =>
                    selectedExtraService.includes(service.id)
                  )
                  .map((service) => (
                    <li key={service.id}>
                      {}
                      {service.title}
                    </li>
                  ))}
              </ul>
            </FormItem>
          )}
        />
      </form>
    </FormProvider>
  );
}
