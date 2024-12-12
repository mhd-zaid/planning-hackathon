import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridWeek from "@fullcalendar/timegrid";
import frLocale from "@fullcalendar/core/locales/fr";
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from "react";
import { useCalendarContext } from "@/utils/context/calendar";

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

  const { semesterRange } = useCalendarContext();

  const [events, setEvents] = useState<Array<Event>>([]);

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
      height={"100%"}
      selectable={true}
      dragScroll={true}
      events={events}
      editable={true}
      validRange={semesterRange || undefined}
      select={(info) =>
        setEvents([
          ...events,
          { title: "Jour dispo", start: info.startStr, end: info.endStr },
        ])
      }
    />
  );
}
