import { Button } from "@/components/ui/button";
type SettingsHeaderProps = {
  activeTab: { title: string; isActive: boolean }[];
  setActiveTab: React.Dispatch<
    React.SetStateAction<{ title: string; isActive: boolean }[]>
  >;
};

export default function SettingsHeader({
  activeTab,
  setActiveTab,
}: SettingsHeaderProps): JSX.Element {
  function handleTabClick(title: string) {
    setActiveTab((prev) =>
      prev.map((t) => ({ ...t, isActive: t.title === title }))
    );
  }
  return (
    <div className="space-y-4">
      <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Inställningar
      </h1>

      <div className="bg-zinc-100 h-9 items-center space-x-1 rounded-md border border-zinc-20 p-1 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 inline-flex">
        {activeTab.map((tab) => (
          <Button
            key={tab.title}
            onClick={() => handleTabClick(tab.title)}
            variant="ghost"
            className={`px-3 py-1 h-7 text-zinc-500 ${
              tab.isActive
                ? "bg-white text-zinc-950 hover:bg-white hover:text-zinc-950 shadow"
                : ""
            }`}
          >
            {tab.title}
          </Button>
        ))}
      </div>
    </div>
  );
}
