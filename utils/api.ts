import { Disaster } from "../types/disaster";

export const fetchDisasters = async (): Promise<Disaster[]> => {
  try {
    const res = await fetch(
      "https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries"
    );
    const json = await res.json();
    return json.DisasterDeclarationsSummaries;
  } catch (error) {
    console.error("Disaster data fetch failed:", error);
    return [];
  }
};
