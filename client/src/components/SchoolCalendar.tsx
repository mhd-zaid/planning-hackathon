import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridWeek from "@fullcalendar/timegrid";
import frLocale from "@fullcalendar/core/locales/fr";
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from "react";
import { useCalendarContext } from "@/utils/context/calendar";
// import useCalendar from "@/utils/hook/useCalendar";

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

  const { semesterRange } = useCalendarContext();

  const [events, setEvents] = useState<Array<Event>>([]);

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
      locale={frLocale}
      nowIndicator={true}
      height={"100%"}
      dragScroll={true}
      events={events}
      editable={true}
      validRange={semesterRange || undefined}
      selectable={!!semesterRange}
      select={(info) =>
        setEvents([
          ...events,
          { title: "Jour ouvré", start: info.startStr, end: info.endStr },
        ])
      }
    />
  );
}
