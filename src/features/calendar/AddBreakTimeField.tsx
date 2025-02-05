import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { incrementTime } from "@/lib/helpers";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

type AddBreakTimeFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  handleTyping: () => void;
};

export default function AddBreakTimeField<T extends FieldValues>({
  control,
  name,
  handleTyping,
}: AddBreakTimeFieldProps<T>): JSX.Element {
  return (
    <div className="flex flex-col w-full">
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div className="flex">
            <Button
              type="button"
              className="rounded-r-none border-r-0 px-2 h-9 text-zinc-500"
              variant="outline"
              onClick={() => field.onChange(incrementTime(field.value, -15))}
            >
              <ChevronLeft size={16} strokeWidth={1.5} />
            </Button>
            <Input
              className="rounded-none shadow-none justify-center relative z-10 h-9 text-sm"
              type="time"
              value={field.value}
              onChange={(v) => {
                handleTyping();
                field.onChange(v);
              }}
              step="900"
            />
            <Button
              type="button"
              className="rounded-l-none border-l-0 px-2 h-9 text-zinc-500"
              variant="outline"
              onClick={() => field.onChange(incrementTime(field.value, 15))}
            >
              <ChevronRight size={16} strokeWidth={1.5} />
            </Button>
          </div>
        )}
      />
    </div>
  );
}
