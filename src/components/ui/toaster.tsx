import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { Check, CircleX } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        onSuccess,
        description,
        action,
        ...props
      }) {
        console.log(onSuccess);
        return (
          <Toast
            className={`${
              onSuccess
                ? "bg-emerald-100 border-emerald-500"
                : "bg-red-100 border-red-400"
            } border-0 border-t-2 rounded-md`}
            key={id}
            {...props}
          >
            <div
              className={`flex gap-2 items-start ${
                onSuccess ? "text-emerald-500" : "text-red-400"
              }`}
            >
              <div className="mt-[-1px]">
                {onSuccess ? <Check /> : <CircleX />}
              </div>
              <div className="flex flex-col">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
