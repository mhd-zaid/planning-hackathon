import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridWeek from "@fullcalendar/timegrid";
import frLocale from "@fullcalendar/core/locales/fr";
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from "react";

interface Event {
  title: string;
  start: string;
  end: string;
}

export default function SchoolCalendar() {
  const headerToolbarProps = {
    left: "prev,next today",
    center: "title",
    right: "timeGridWeek dayGridMonth",
  };

  const [events, setEvents] = useState<Array<Event>>([]);
  // Ici j'ai besoin de récupérer les jours de disponibilité de l'école

  // Je dois pouvoir administrer les jours de disponibilité de l'école

  // const events = [
  //   {
  //     title: "The Title",
  //     start: "2024-12-01",
  //     end: "2024-12-10",
  //   },
  // ];

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridWeek, interactionPlugin]}
      headerToolbar={headerToolbarProps}
      weekends={true}
      locale={frLocale}
      nowIndicator={true}
      height={"100%"}
      dateClick={(info) =>
        setEvents([
          ...events,
          { title: "Jour ouvré", start: info.dateStr, end: info.dateStr },
        ])
      }
      select={(info) => console.log(info)}
      selectable={true}
      dragScroll={true}
      events={events}
      editable={true}
    />
  );
}
