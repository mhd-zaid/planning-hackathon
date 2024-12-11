import { createContext, useContext, useState } from "react";
import { SemesterRange } from "../types/semester-range.interface";

interface CalendarContextType {
  semesterRange: SemesterRange | null;
  setSemesterRange: React.Dispatch<React.SetStateAction<SemesterRange | null>>;
}

const CalendarContext = createContext<CalendarContextType>({
  semesterRange: null,
  setSemesterRange: () => {},
});

export const CalendarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [semesterRange, setSemesterRange] = useState<SemesterRange | null>(
    null
  );

  const value = {
    semesterRange,
    setSemesterRange,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarContext = () => useContext(CalendarContext);
