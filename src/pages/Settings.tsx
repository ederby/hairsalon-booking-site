import SettingsBookings from "@/features/settings/SettingsBookings";
import SettingsCompany from "@/features/settings/SettingsCompany";
import SettingsGeneral from "@/features/settings/SettingsGeneral";
import SettingsHeader from "@/features/settings/SettingsHeader";
import SettingsStaff from "@/features/settings/SettingsStaff";
import { useState } from "react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState(() => [
    {
      title: "Personal",
      isActive: true,
    },
    {
      title: "Bokningar",
      isActive: false,
    },
    {
      title: "Företag",
      isActive: false,
    },
    {
      title: "Allmänt",
      isActive: false,
    },
  ]);
  function renderActiveTab() {
    const active = activeTab.find((tab) => tab.isActive);
    switch (active?.title) {
      case "Personal":
        return <SettingsStaff />;
      case "Bokningar":
        return <SettingsBookings />;
      case "Företag":
        return <SettingsCompany />;
      case "Allmänt":
        return <SettingsGeneral />;
      default:
        return null;
    }
  }
  return (
    <div className="space-y-4">
      <SettingsHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <div>{renderActiveTab()}</div>
    </div>
  );
}
