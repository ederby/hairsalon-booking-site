import ResponsiveDialog from "@/components/layout/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import ServiceEditForm from "./ServiceEditForm";
import ServiceListItem from "./ServiceListItem";
import { useCreateService } from "./useCreateService";
import { useServices } from "./useServices";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type ServiceListProps = {
  id: number;
};

export default function ServiceList({ id }: ServiceListProps): JSX.Element {
  const [openResponsiveDialog, setOpenResponsiveDialog] =
    useState<boolean>(false);
  const { services } = useServices(id);
  const sortedServices = services?.sort((a, b) => {
    if (a.isActive === b.isActive) return 0;
    return a.isActive ? -1 : 1;
  });
  const { onCreateService } = useCreateService();
  const [animationParent] = useAutoAnimate();

  return (
    <div className="flex flex-col">
      {services?.length ? (
        <ul ref={animationParent} className="rounded overflow-hidden">
          {sortedServices?.map((service) => (
            <ServiceListItem key={service.id} service={service} />
          ))}
        </ul>
      ) : (
        <span>Det finns inga tjänster till denna kategorien än.</span>
      )}

      <Button
        onClick={() => setOpenResponsiveDialog((s) => !s)}
        variant="outline"
        className="my-4"
      >
        <Plus /> Skapa ny tjänst
      </Button>
      <ResponsiveDialog
        className="absolute right-10 top-6 h-8 w-8 rounded bg-zinc-100 text-zinc-500 hover:bg-teal-600 hover:text-teal-50 px-[10px]"
        title="Skapa en ny tjänst"
        open={openResponsiveDialog}
        setOpen={setOpenResponsiveDialog}
      >
        <ServiceEditForm onHandleService={onCreateService} categoryID={id} />
      </ResponsiveDialog>
    </div>
  );
}
