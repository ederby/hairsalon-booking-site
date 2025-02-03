import { FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { useCategories } from "../services/useCategories";
import { useServices } from "./useServices";

type CustomServiceSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  className?: string;
  label?: string;
};

export default function CustomServiceSelect<T extends FieldValues>({
  control,
  name,
  className = "space-y-2",
  label = "Tjänst",
}: CustomServiceSelectProps<T>): JSX.Element {
  const { categories } = useCategories();
  const { services } = useServices();
  return (
    <div className={className}>
      <FormLabel>{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={(e) => {
              field.onChange(e);
            }}
          >
            <SelectTrigger className="">
              {field.value === "0" ? (
                <span>Välj en tjänst</span>
              ) : (
                <SelectValue placeholder="Välj en tjänst" />
              )}
            </SelectTrigger>
            <SelectContent>
              {categories?.map((category) => (
                <SelectGroup key={category.id}>
                  <SelectLabel>{category.title}</SelectLabel>
                  {services
                    ?.filter((service) => service.categoryID === category.id)
                    .map((service) => (
                      <SelectItem
                        key={service.id}
                        value={service.id.toString()}
                      >
                        <span>{service.title}</span>
                      </SelectItem>
                    ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
