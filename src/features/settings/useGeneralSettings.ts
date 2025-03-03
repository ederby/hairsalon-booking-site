import { getGeneralSettings } from "@/services/apiSettings";
import { GeneralSettingsType } from "@/services/types";
import { useQuery } from "@tanstack/react-query";

export function useGeneralSettings() {
  const { data: generalSettings, isLoading: isLoadingGeneralSettings } =
    useQuery<GeneralSettingsType>({
      queryKey: ["generalsettings"],
      queryFn: getGeneralSettings,
    });

  return { generalSettings, isLoadingGeneralSettings };
}
