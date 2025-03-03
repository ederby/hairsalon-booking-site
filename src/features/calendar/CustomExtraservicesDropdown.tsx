import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormLabel } from "@/components/ui/form";
import { ChevronDown, X } from "lucide-react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { useExtraServices } from "../services/useExtraServices";

type CustomExtraservicesDropdownProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  className?: string;
  label?: string;
  selectedExtraServices: number[];
  setSelectedExtraServices: React.Dispatch<React.SetStateAction<number[]>>;
};

export default function CustomExtraservicesDropdown<T extends FieldValues>({
  selectedExtraServices,
  setSelectedExtraServices,
  control,
  name,
  className = "w-full space-y-2",
  label = "Tilläggstjänster",
}: CustomExtraservicesDropdownProps<T>): JSX.Element {
  const { extraServices } = useExtraServices();

  function deleteExtraService(id: number) {
    setSelectedExtraServices((s) =>
      s.filter((extraService) => extraService !== id)
    );
  }

  function handleExtraServiceChange(value: string) {
    setSelectedExtraServices((s) => {
      const selectedOption = +value;
      if (s.includes(selectedOption)) {
        return [...s.filter((extraService) => extraService !== selectedOption)];
      } else {
        return [...s, selectedOption];
      }
    });
  }
  return (
    <div className={className}>
      <FormLabel>{label}</FormLabel>
      <Controller
        control={control}
        name={name}
        render={() => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between hover:bg-transparent hover:border-zinc-200 hover:text-zinc-900 py-1 h-9"
              >
                <span className="font-normal">
                  Välj{" "}
                  {`${
                    selectedExtraServices.length > 0
                      ? "(" + selectedExtraServices.length + " valda)"
                      : ""
                  }`}
                </span>
                <ChevronDown className="text-zinc-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="DropdownMenuContent">
              {extraServices
                ?.filter((extraService) => extraService.isActive)
                .map((extraService) => {
                  return (
                    <DropdownMenuCheckboxItem
                      className="w-full"
                      key={extraService.id}
                      checked={selectedExtraServices.includes(extraService.id)}
                      onCheckedChange={() => {
                        handleExtraServiceChange(extraService.id.toString());
                      }}
                    >
                      {extraService.title}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />
      <ul className="flex text-[11px] gap-1 flex-wrap mt-2">
        {extraServices
          ?.filter((service) => selectedExtraServices.includes(service.id))
          .map((service) => (
            <li
              className="flex gap-1 bg-[var(--primary-600)] text-[var(--primary-50)] py-1 px-2 rounded font-semibold"
              key={service.id}
            >
              <X
                size={16}
                strokeWidth={1.5}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteExtraService(service.id);
                }}
              />
              {service.title}
            </li>
          ))}
      </ul>
    </div>
  );
}
