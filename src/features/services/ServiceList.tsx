import ResponsiveDialog from "@/components/layout/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import AddServiceForm from "./AddServiceForm";
import ServiceListItem from "./ServiceListItem";
import { useCreateService } from "./useCreateService";
import { useServices } from "./useServices";
import { useChangeOrderServices } from "./useChangeOrderServices";

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
  const [dragableServices, setDragableServices] = useState(
    sortedServices ?? []
  );
  const { onCreateService } = useCreateService();
  const [animationParent] = useAutoAnimate();

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 20,
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200,
      tolerance: 6,
    },
  });
  const pointerSensor = useSensor(PointerSensor);
  const sensors = useSensors(
    mouseSensor,
    keyboardSensor,
    touchSensor,
    pointerSensor
  );
  const { onChangeOrderServices } = useChangeOrderServices();

  useEffect(() => {
    setDragableServices(sortedServices ?? []);
  }, [sortedServices]);

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;

    if (!over || active.id === over.id) return;

    setDragableServices((services) => {
      const originalPos = services.findIndex(
        (service) => service.id === Number(active.id)
      );
      const newPos = services.findIndex(
        (service) => service.id === Number(over.id)
      );

      if (originalPos === -1 || newPos === -1) return services;

      const updatedServices = arrayMove(services, originalPos, newPos);
      onChangeOrderServices(updatedServices);
      return arrayMove(services, originalPos, newPos);
    });
  }

  return (
    <div className="flex flex-col">
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <SortableContext
          items={dragableServices.map((service) => service.id)}
          strategy={verticalListSortingStrategy}
        >
          {dragableServices.length ? (
            <ul ref={animationParent} className="rounded overflow-hidden ml-6">
              {dragableServices.map((service) => (
                <ServiceListItem key={service.id} service={service} />
              ))}
            </ul>
          ) : (
            <span className="ml-6">
              Det finns inga tjänster till denna kategorien än.
            </span>
          )}
        </SortableContext>
      </DndContext>

      <Button
        onClick={() => setOpenResponsiveDialog((s) => !s)}
        variant="outline"
        className="my-4 ml-6"
      >
        <Plus /> Skapa ny tjänst
      </Button>
      <ResponsiveDialog
        className="absolute right-10 top-6 h-8 w-8 rounded bg-zinc-100 text-zinc-500 hover:bg-teal-600 hover:text-teal-50 px-[10px]"
        title="Skapa en ny tjänst"
        open={openResponsiveDialog}
        setOpen={setOpenResponsiveDialog}
      >
        <AddServiceForm onHandleService={onCreateService} categoryID={id} />
      </ResponsiveDialog>
    </div>
  );
}
