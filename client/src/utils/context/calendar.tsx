import { createContext, useContext, useState } from "react";
import { SemesterRange } from "../types/semester-range.interface";

interface CalendarContextType {
  semesterRange: SemesterRange | null;
  setSemesterRange: React.Dispatch<React.SetStateAction<SemesterRange | null>>;
  showAdmin : boolean;
  setShowAdmin : React.Dispatch<React.SetStateAction<boolean>>;
}

const CalendarContext = createContext<CalendarContextType>({
  semesterRange: null,
  setSemesterRange: () => {},
  showAdmin: false,
  setShowAdmin: () => {},
});

export const CalendarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [semesterRange, setSemesterRange] = useState<SemesterRange | null>(
    null
  );

  const [showAdmin, setShowAdmin] = useState(false);

  const value = {
    semesterRange,
    setSemesterRange,
    showAdmin,
    setShowAdmin,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarContext = () => useContext(CalendarContext);
