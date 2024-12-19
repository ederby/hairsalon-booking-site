import { updateCategories } from "@/services/apiServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";
import CategoryListItemSkeleton from "./CategoryListItemSkeleton";
import EditCategory from "./EditCategory";
import EditForm from "./EditForm";
import { useToast } from "@/hooks/use-toast";

type CategoryListItemProps = {
  title: string;
  description: string;
  image: string;
  id: number;
};

export default function CategoryListItem({
  title,
  description,
  image,
  id,
}: CategoryListItemProps): JSX.Element {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate, isPending: isUpdatingCategory } = useMutation({
    mutationFn: updateCategories,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Hurra!",
        description: "Kategorin har uppdaterats",
        onSuccess: true,
      });
    },
    onError: () => {
      toast({
        title: "Attans!",
        description: "Kategorin kunde inte uppdaterats",
        onSuccess: false,
      });
    },
  });

  return (
    <AccordionItem value={title} className="hover:bg-teal-50 px-2 relative">
      <AccordionTrigger>
        {isUpdatingCategory ? (
          <CategoryListItemSkeleton />
        ) : (
          <div className="flex items-center gap-2">
            <div className="h-12 w-12 min-h-12 min-w-12 rounded overflow-hidden">
              <img src={image} alt={title} />
            </div>
            <div className="flex flex-col">
              <span className="text-base">{title}</span>
            </div>
          </div>
        )}
      </AccordionTrigger>

      <EditCategory title={title}>
        <EditForm
          title={title}
          description={description}
          id={id}
          mutate={mutate}
        />
      </EditCategory>
      <AccordionContent>{title}</AccordionContent>
    </AccordionItem>
  );
}
