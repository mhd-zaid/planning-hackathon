import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridWeek from "@fullcalendar/timegrid";
import frLocale from "@fullcalendar/core/locales/fr";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";
import { useDataContext } from "@/utils/context/data";
import { useCalendarContext } from "@/utils/context/calendar";
import { uuidv4 } from "uuidv7";

interface Event {
  title: string;
  start: string;
  end: string;
}

export default function IntervenantCalendar() {
  const headerToolbarProps = {
    left: "prev,next today",
    center: "title",
    right: "timeGridWeek dayGridMonth",
  };

  const { schoolDays, fetchSchoolDays, fetchWorkHour } = useDataContext();

  const { semesterRange,setEvents, events, selectedClassId } = useCalendarContext();

  // const [events, setEvents] = useState<Array<Event>>([]);

  const fillEvents = () => {
    setEvents([]);
    schoolDays.forEach((schoolDay) => {
      const event = {
        id: schoolDay.id,
        title: schoolDay.class.name,
        start: schoolDay.date,
        end: undefined,
        display: 'background',
        color: '#d9ffb2',
      };
      setEvents((prev) => [...prev, event]);
    });
  };

  useEffect(() => {
    fillEvents();
    console.log('ici', schoolDays)
  }, [schoolDays]);

  useEffect(() => {
    fetchSchoolDays(selectedClassId)
    fetchWorkHour(userAgent.id)
  }, []);

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridWeek, interactionPlugin]}
      // slotMinTime="08:00:00"
      // slotMaxTime="18:00:00"
      // events={[
      //   { title: 'Matinée', start: '2024-12-12T08:00:00', end: '2024-12-12T12:00:00' },
      //   { title: 'Après-midi', start: '2024-12-12T13:00:00', end: '2024-12-12T18:00:00' },
      // ]}
      // slotDuration="00:30:00"
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
          { id: 'test', title: "Disponibilité ", start: info.startStr, end: info.endStr },
        ])
      }
      dateClick={(info) => {
        const dateFromApi = events.sort((event => event.id.startsWith("new-")? -1:1)).find((event) => event.start === info.dateStr)
        if(!dateFromApi || dateFromApi.id.startsWith("new-")) return

        setEvents([
          ...events,
          { id: `new-${uuidv4()}`, title: "Disponibilité ", start: info.dateStr, end: undefined },
        ])
      }
      }
    />
  );
}
