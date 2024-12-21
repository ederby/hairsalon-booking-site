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
    <ToastProvider swipeDirection="left">
      {toasts.map(function ({
        id,
        title,
        onSuccess,
        description,
        action,
        ...props
      }) {
        return (
          <Toast className="rounded-md" key={id} {...props}>
            <div className={`flex gap-2 items-start`}>
              <div className="mt-[-1px]">
                {onSuccess ? (
                  <Check color="#16a34a" />
                ) : (
                  <CircleX color="#dc2626" />
                )}
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
