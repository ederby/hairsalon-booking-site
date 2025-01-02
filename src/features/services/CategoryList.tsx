import ResponsiveDialog from "@/components/layout/ResponsiveDialog";
import Spinner from "@/components/layout/Spinner";
import { Button } from "@/components/ui/button";
import { CategoryListType } from "@/services/types";
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
import { Plus } from "lucide-react";
import ContentHeader from "../../components/layout/ContentHeader";
import { Accordion } from "../../components/ui/accordion";
import CategoryEditForm from "./CategoryEditForm";
import CategoryListItem from "./CategoryListItem";
import { useChangeOrderCategories } from "./useChangeOrderCategories";
import { useCreateCategory } from "./useCreateCategory";

type CategoryListProps = {
  categories: CategoryListType[];
};

export default function CategoryList({
  categories,
}: CategoryListProps): JSX.Element {
  const { onCreateCategory, isCreatingCategory } = useCreateCategory();
  const { onChangeOrderCategories } = useChangeOrderCategories();

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
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

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;

    if (!over || active.id === over.id) return;

    const originalPos = categories.findIndex(
      (category) => category.id === Number(active.id)
    );
    const newPos = categories.findIndex(
      (category) => category.id === Number(over.id)
    );
    const updatedCategories = arrayMove(categories, originalPos, newPos);
    onChangeOrderCategories(updatedCategories);
  }

  return (
    <div>
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <SortableContext
          items={categories.map((category) => category.id)}
          strategy={verticalListSortingStrategy}
        >
          <ContentHeader>
            <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Kategorier
            </h1>
            <ResponsiveDialog
              title="Skapa en ny kategori"
              trigger={
                <Button variant="outline">
                  <Plus /> Skapa ny kategori
                </Button>
              }
            >
              <CategoryEditForm onHandleCategory={onCreateCategory} />
            </ResponsiveDialog>
          </ContentHeader>

          {isCreatingCategory ? (
            <Spinner />
          ) : (
            <Accordion type="single" collapsible className="border rounded">
              {categories.map((category) => (
                <CategoryListItem
                  key={category.id}
                  id={category.id}
                  title={category.title}
                  description={category.description}
                  image={category.image}
                />
              ))}
            </Accordion>
          )}
        </SortableContext>
      </DndContext>
    </div>
  );
}
