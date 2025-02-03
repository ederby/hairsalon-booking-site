import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { EllipsisVertical } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";

type DropdownMenuCustomProps = {
  className?: string;
  children: React.ReactNode;
  trigger?: React.ReactNode;
} & ComponentPropsWithoutRef<typeof DropdownMenu>;

export default function DropdownMenuCustom({
  className = "",
  children,
  trigger,
  ...props
}: DropdownMenuCustomProps): JSX.Element {
  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild className={className}>
        {trigger || (
          <Button variant="outline" className="h-8 w-8">
            <EllipsisVertical />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-20 z-[5000]" side="top" align="start">
        <DropdownMenuGroup>{children}</DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
