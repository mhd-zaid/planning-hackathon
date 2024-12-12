import { createContext, useContext, useEffect, useState } from "react";
import { getBranches, getSchoolDaysByClass } from "../api/getBranches";
import { Filliere } from "../types/filliere.interface";
import { SchoolDays } from "../types/school-days.interface";

interface DataContextType {
  fillieres: Filliere[];
  schoolDays: SchoolDays[];
  fetchBranches: () => void;
  fetchSchoolDays: (idClass: string) => void;
}

const DataContext = createContext<DataContextType>({
  fillieres: [],
  schoolDays: [],
  fetchBranches: () => {},
  fetchSchoolDays: () => {},
});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [fillieres, setFillieres] = useState([]);
  const [schoolDays, setSchoolDays] = useState([]);

  const fetchBranches = async () => {
    const filliere = await getBranches();
    setFillieres(filliere);
  };

  const fetchSchoolDays = async (idClass: string) => {
    const schoolDays = await getSchoolDaysByClass(idClass);
    setSchoolDays(schoolDays);
  };

  const value = {
    fillieres,
    schoolDays,
    fetchBranches,
    fetchSchoolDays,
  };

  useEffect(() => {
    if (!fillieres.length) fetchBranches();
  }, []);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataContext = () => useContext(DataContext);
