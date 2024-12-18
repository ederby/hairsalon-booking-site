import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

type EditCategoryProps = {
  title: string;
  children: React.ReactNode;
};

export default function EditCategory({
  title,
  children,
}: EditCategoryProps): JSX.Element {
  return (
    <Dialog>
      <DialogTrigger
        onClick={() => console.log("Knapp")}
        className="absolute right-10 top-6 h-8 w-8 rounded bg-zinc-100 text-zinc-500 hover:bg-teal-600 hover:text-teal-50 px-[10px]"
      >
        <Pencil size={14} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Redigera {title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
