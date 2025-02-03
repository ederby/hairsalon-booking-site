import { FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStaff } from "@/hooks/useStaff";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

type CustomStaffSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  className?: string;
  label?: string;
};

export default function CustomStaffSelect<T extends FieldValues>({
  control,
  name,
  className = "space-y-2",
  label = "Personal",
}: CustomStaffSelectProps<T>): JSX.Element {
  const { staff } = useStaff();
  return (
    <div className={className}>
      <FormLabel htmlFor="staff">{label}</FormLabel>
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
            <SelectTrigger>
              <SelectValue placeholder="Välj en person" />
            </SelectTrigger>
            <SelectContent>
              {staff?.map((staffMember) => (
                <SelectItem
                  key={staffMember.id}
                  value={staffMember.id.toString()}
                >
                  <span>{staffMember.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
