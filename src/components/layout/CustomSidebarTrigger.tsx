import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useSidebar } from "../ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export default function CustomSidebarTrigger() {
  const { toggleSidebar, open } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <div
      className="flex items-center gap-1 cursor-pointer hover:text-teal-800"
      onClick={toggleSidebar}
    >
      {open ? (
        <PanelLeftClose size={20} strokeWidth={1.5} />
      ) : (
        <PanelLeftOpen size={20} strokeWidth={1.5} />
      )}
      <span className="text-sm">
        {isMobile ? "Öppna meny" : open ? "Stäng meny" : "Öppna meny"}
      </span>
    </div>
  );
}
