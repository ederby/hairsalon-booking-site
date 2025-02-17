import ContentHeader from "@/components/layout/ContentHeader";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ExtraServiceTableItem from "./ExtraServiceTableItem";
import { useExtraServices } from "./useExtraServices";
import ResponsiveDialog from "@/components/layout/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddExtraserviceForm from "./AddExtraserviceForm";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function ExtraServiceTable() {
  const { extraServices } = useExtraServices();
  const [animationParent] = useAutoAnimate();

  return (
    <div>
      <ContentHeader>
        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Tilläggstjänster
        </h1>
        <ResponsiveDialog
          title="Skapa en ny tilläggstjänst"
          trigger={
            <Button variant="outline">
              <Plus /> Skapa ny tilläggstjänst
            </Button>
          }
        >
          <AddExtraserviceForm />
        </ResponsiveDialog>
      </ContentHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead colSpan={2} className="w-[100px]">
              Namn
            </TableHead>
            <TableHead className="text-right">Pris</TableHead>
            <TableHead className="text-right">Varaktighet</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody ref={animationParent}>
          {extraServices?.map((extraService) => (
            <ExtraServiceTableItem
              key={extraService.id}
              extraService={extraService}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
