import { createContext, useContext, useEffect, useState } from "react";
import { getBranches } from "../api/getBranches";
import { Filliere } from "../types/filliere.interface";

interface DataContextType {
  fetchBranches: () => void;
  fillieres: Filliere[];
}

const DataContext = createContext<DataContextType>({
  fetchBranches: () => {},
  fillieres: [],
});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [fillieres, setFillieres] = useState([]);

  const fetchBranches = async () => {
    const filliere = await getBranches();
    setFillieres(filliere);
  };

  const value = {
    fetchBranches,
    fillieres,
  };

  useEffect(() => {
    if (!fillieres.length) fetchBranches();
  }, []);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataContext = () => useContext(DataContext);
