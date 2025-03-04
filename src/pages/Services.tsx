import Spinner from "@/components/layout/Spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryList from "@/features/services/CategoryList";
import ExtraServiceTable from "@/features/services/ExtraServiceTable";
import { useCategories } from "@/features/services/useCategories";

export default function Services() {
  const { categories, isLoadingCategories } = useCategories();

  if (isLoadingCategories) return <Spinner />;

  return (
    <Tabs defaultValue="categories" className="w-full flex flex-col">
      <TabsList className="grid grid-cols-2 self-end mb-4 w-full">
        <TabsTrigger value="categories">Kategorier</TabsTrigger>
        <TabsTrigger value="extraservices">Tilläggstjänster</TabsTrigger>
      </TabsList>
      <TabsContent value="categories">
        <CategoryList categories={categories ?? []} />
      </TabsContent>
      <TabsContent value="extraservices">
        <ExtraServiceTable />
      </TabsContent>
    </Tabs>
  );
}
