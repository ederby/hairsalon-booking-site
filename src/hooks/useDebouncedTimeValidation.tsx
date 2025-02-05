import { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { parse, format, addMinutes } from "date-fns";
import { UseFormReturn, FieldValues, Path, PathValue } from "react-hook-form";

interface UseDebouncedTimeValidationProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  startTimeField: Path<T>;
  endTimeField: Path<T>;
}

export function useDebouncedTimeValidation<T extends FieldValues>({
  form,
  startTimeField,
  endTimeField,
}: UseDebouncedTimeValidationProps<T>) {
  const [isTyping, setIsTyping] = useState(false);
  const watchStartTime = form.watch(startTimeField);
  const watchEndTime = form.watch(endTimeField);

  const handleTyping = () => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 500);
  };

  useEffect(() => {
    const debouncedValidation = debounce(() => {
      if (watchStartTime && watchEndTime) {
        const startTime = parse(watchStartTime, "HH:mm", new Date());
        const endTime = parse(watchEndTime, "HH:mm", new Date());

        if (startTime >= endTime) {
          form.setValue(
            endTimeField,
            format(addMinutes(startTime, 15), "HH:mm") as PathValue<T, Path<T>>
          );
        }
      }
    }, 300);

    if (isTyping) {
      debouncedValidation();
    } else {
      if (watchStartTime && watchEndTime) {
        const startTime = parse(watchStartTime, "HH:mm", new Date());
        const endTime = parse(watchEndTime, "HH:mm", new Date());

        if (startTime >= endTime) {
          form.setValue(
            endTimeField,
            format(addMinutes(startTime, 15), "HH:mm") as PathValue<T, Path<T>>
          );
        }
      }
    }

    return () => {
      debouncedValidation.cancel();
    };
  }, [
    watchStartTime,
    watchEndTime,
    form,
    isTyping,
    startTimeField,
    endTimeField,
  ]);

  return { handleTyping };
}
