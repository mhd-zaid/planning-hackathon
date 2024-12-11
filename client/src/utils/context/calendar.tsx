import { createContext, useContext, useState } from "react";
import { SemesterRange } from "../types/semester-range.interface";
import { Event } from "../types/event.interface";

interface CalendarContextType {
  semesterRange: SemesterRange | null;
  setSemesterRange: React.Dispatch<React.SetStateAction<SemesterRange | null>>;
  showAdmin: boolean;
  setShowAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  selectedFilliere: string;
  setSelectedFilliere: React.Dispatch<React.SetStateAction<string>>;
  selectedClassId: string;
  setSelectedClassId: React.Dispatch<React.SetStateAction<string>>;
}

const CalendarContext = createContext<CalendarContextType>({
  semesterRange: null,
  setSemesterRange: () => {},
  showAdmin: false,
  setShowAdmin: () => {},
  events: [],
  setEvents: () => {},
  selectedFilliere: "",
  setSelectedFilliere: () => {},
  selectedClassId: "",
  setSelectedClassId: () => {},
});

export const CalendarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [semesterRange, setSemesterRange] = useState<SemesterRange | null>(
    null
  );

  const [events, setEvents] = useState<Event[]>([]);

  const [showAdmin, setShowAdmin] = useState(false);

  const [selectedFilliere, setSelectedFilliere] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  const value = {
    semesterRange,
    setSemesterRange,
    showAdmin,
    setShowAdmin,
    events,
    setEvents,
    selectedFilliere,
    setSelectedFilliere,
    selectedClassId,
    setSelectedClassId,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarContext = () => useContext(CalendarContext);
