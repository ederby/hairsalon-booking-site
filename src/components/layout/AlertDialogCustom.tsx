import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type CategoryDeleteAlertProps = {
  title: string;
  description: string;
  open: boolean;
  actionText: string;
  setOpen?: (open: boolean) => void;
  onClick?: () => void;
};

export default function AlertDialogCustom({
  title,
  description,
  open,
  actionText,
  setOpen,
  onClick,
}: CategoryDeleteAlertProps): JSX.Element {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Tillbaka</AlertDialogCancel>
          <AlertDialogAction
            onClick={onClick}
            className="bg-red-600 hover:bg-red-500"
          >
            {actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
