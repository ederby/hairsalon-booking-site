import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

type ResponsiveDialogProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
  trigger?: React.ReactNode | null;
};

export default function ResponsiveDialog({
  title,
  children,
  className = "",
  trigger = null,
}: ResponsiveDialogProps): JSX.Element {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState<boolean>(false);

  if (isMobile)
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild className={className}>
          {trigger}
        </DrawerTrigger>
        <DrawerContent className="px-4 pb-4">
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription className="hidden"></DrawerDescription>
          </DrawerHeader>
          {children}
        </DrawerContent>
      </Drawer>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className={className}>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
