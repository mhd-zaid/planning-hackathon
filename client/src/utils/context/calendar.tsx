import { createContext, useContext, useState } from "react";
import { SemesterRange } from "../types/semester-range.interface";
import { Event } from "../types/event.interface";
import { RoleUser } from "../types/role-user.enum";

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
  showCalendarWorkHour: boolean;
  setShowCalendarWorkHour: React.Dispatch<React.SetStateAction<boolean>>;
  workHourEvent: Event[];
  setWorkhourEvent: React.Dispatch<React.SetStateAction<Event[]>>;
  selectedTeacherId: string;
  setSelectedTeacherId: React.Dispatch<React.SetStateAction<string>>;
  displayedByRole: RoleUser;
  setDisplayedByRole: React.Dispatch<React.SetStateAction<RoleUser>>;
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
  showCalendarWorkHour: false,
  setShowCalendarWorkHour: () => {},
  workHourEvent: [],
  setWorkhourEvent: () => {},
  selectedTeacherId: "",
  setSelectedTeacherId: () => {},
  displayedByRole: RoleUser.manager,
  setDisplayedByRole: () => {},
});

export const CalendarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [semesterRange, setSemesterRange] = useState<SemesterRange | null>(
    null
  );
  const [displayedByRole, setDisplayedByRole] = useState<RoleUser>(
    RoleUser.manager
  );

  const [events, setEvents] = useState<Event[]>([]);

  const [showAdmin, setShowAdmin] = useState(false);

  const [selectedFilliere, setSelectedFilliere] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [showCalendarWorkHour, setShowCalendarWorkHour] = useState(false);
  const [workHourEvent, setWorkhourEvent] = useState<Event[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");

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
    showCalendarWorkHour,
    setShowCalendarWorkHour,
    workHourEvent,
    setWorkhourEvent,
    selectedTeacherId,
    setSelectedTeacherId,
    displayedByRole,
    setDisplayedByRole,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarContext = () => useContext(CalendarContext);
