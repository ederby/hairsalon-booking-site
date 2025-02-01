import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingHistory from "./BookingHistory";
import Schedule from "./Schedule";
import CalendarProvider from "@/context/CalendarContext";

export default function Scheduler() {
  return (
    <CalendarProvider>
      <Tabs defaultValue="categories" className="w-full flex flex-col">
        <TabsList className="grid grid-cols-2 self-end mb-4 w-full">
          <TabsTrigger value="categories">Kalender</TabsTrigger>
          <TabsTrigger value="extraservices">Historik</TabsTrigger>
        </TabsList>
        <TabsContent value="categories">
          <Schedule />
        </TabsContent>
        <TabsContent value="extraservices">
          <BookingHistory />
        </TabsContent>
      </Tabs>
    </CalendarProvider>
  );
}
