import { AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";
import EditCategory from "./EditCategory";
import EditForm from "./EditForm";

type CategoryListItemProps = {
  title: string;
  description: string;
  image: string;
};

export default function CategoryListItem({
  title,
  description,
  image,
}: CategoryListItemProps): JSX.Element {
  return (
    <AccordionItem value={title} className="hover:bg-teal-50 px-2 relative">
      <AccordionTrigger>
        <div className="flex items-center gap-2">
          <div className="h-12 w-12 min-h-12 min-w-12 rounded overflow-hidden">
            <img src={image} alt={title} />
          </div>
          <div className="flex flex-col">
            <span className="text-base">{title}</span>
          </div>
        </div>
      </AccordionTrigger>

      <EditCategory title={title}>
        <EditForm title={title} description={description} image={image} />
      </EditCategory>
      <AccordionContent>{title}</AccordionContent>
    </AccordionItem>
  );
}
