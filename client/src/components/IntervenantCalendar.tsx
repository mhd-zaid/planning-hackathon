import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridWeek from "@fullcalendar/timegrid";
import frLocale from "@fullcalendar/core/locales/fr";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect } from "react";
import { useDataContext } from "@/utils/context/data";
import { useCalendarContext } from "@/utils/context/calendar";
import { uuidv4 } from "uuidv7";
import useRoleUser from "@/utils/hook/useRoleUser";

export default function IntervenantCalendar() {
  const headerToolbarProps = {
    left: "prev,next today",
    center: "title",
    right: "timeGridWeek dayGridMonth",
  };

  const { schoolDays, fetchSchoolDays, fetchAvailabilities, availabilities } =
    useDataContext();

  const { semesterRange, setEvents, events, selectedClassId } =
    useCalendarContext();

  const { user } = useRoleUser();

  const fillEvents = () => {
    setEvents([]);
    schoolDays.forEach((schoolDay) => {
      const event = {
        id: schoolDay.id,
        title: schoolDay.class.name,
        start: schoolDay.date,
        end: undefined,
        display: "background",
        color: "#d9ffb2",
      };
      setEvents((prev) => [...prev, event]);
    });
  };

  const fillAvailabilities = () => {
    setEvents([])
    availabilities.forEach((availabilities) => {
      const event = {
        id: availabilities.id || "",
        title: "Disponibilité",
        start: availabilities.beginDate,
        end: undefined,
      };
      setEvents((prev) => [...prev, event]);
    });
  };

  useEffect(() => {
    fillEvents();
  }, [schoolDays]);

  useEffect(() => {
    fillAvailabilities();
  }, [availabilities]);

  useEffect(() => {
    if (!user) return;
    fetchAvailabilities(user.id);
  }, [user]);

  useEffect(() => {
    fetchSchoolDays(selectedClassId);
  }, []);

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridWeek, interactionPlugin]}
      headerToolbar={headerToolbarProps}
      locale={frLocale}
      nowIndicator={true}
      height={"89%"}
      selectable={false}
      dragScroll={true}
      events={events}
      editable={true}
      validRange={semesterRange || undefined}
      select={(info) =>
        setEvents([
          ...events,
          {
            id: "test",
            title: "Disponibilité ",
            start: info.startStr,
            end: info.endStr,
          },
        ])
      }
      dateClick={(info) => {
        const dateFromApi = events
          .sort((event) => (event.id.startsWith("new-") ? -1 : 1))
          .find((event) => event.start === info.dateStr);
        if (!dateFromApi || dateFromApi.id.startsWith("new-")) return;

        setEvents([
          ...events,
          {
            id: `new-${uuidv4()}`,
            title: "Disponibilité ",
            start: info.dateStr,
            end: undefined,
          },
        ]);
      }}
    />
  );
}
