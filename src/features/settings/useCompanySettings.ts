import { getCompanySettings } from "@/services/apiSettings";
import { CompanySettingsType } from "@/services/types";
import { useQuery } from "@tanstack/react-query";

export function useCompanySettings() {
  const { data: companySettings, isLoading: isLoadingCompanySettings } =
    useQuery<CompanySettingsType>({
      queryKey: ["companysettings"],
      queryFn: getCompanySettings,
    });

  return { companySettings, isLoadingCompanySettings };
}
