import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Calendar from "./Calendar";
import BookingHistory from "./BookingHistory";

export default function Scheduler() {
  return (
    <Tabs defaultValue="categories" className="w-full flex flex-col">
      <TabsList className="grid grid-cols-2 self-end mb-4 w-full">
        <TabsTrigger value="categories">Kalender</TabsTrigger>
        <TabsTrigger value="extraservices">Historik</TabsTrigger>
      </TabsList>
      <TabsContent value="categories">
        <Calendar />
      </TabsContent>
      <TabsContent value="extraservices">
        <BookingHistory />
      </TabsContent>
    </Tabs>
  );
}
