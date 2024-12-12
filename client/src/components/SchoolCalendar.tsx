"use client"

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridWeek from "@fullcalendar/timegrid";
import frLocale from "@fullcalendar/core/locales/fr";
import interactionPlugin from "@fullcalendar/interaction";
import { useCalendarContext } from "@/utils/context/calendar";
import { DateSelectArg } from "@fullcalendar/core/index.js";
import { useDataContext } from "@/utils/context/data";

export default function SchoolCalendar() {
  const headerToolbarProps = {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth",
  };

  const { semesterRange, events, setEvents, selectedClassId } =
    useCalendarContext();

  const { fillieres } = useDataContext();

  const selectedClasse = fillieres
    .flatMap((filliere) => filliere.classes)
    .find((classe) => classe.id === selectedClassId);

  const selectDate = (info: DateSelectArg) => {
    const dateStart = new Date(info.startStr);
    const dateEnd = new Date(info.endStr);

    const eventExists = events.some((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return (
        (dateStart >= eventStart && dateStart < eventEnd) ||
        (dateEnd > eventStart && dateEnd <= eventEnd) ||
        (dateStart <= eventStart && dateEnd >= eventEnd)
      );
    });

    if (eventExists) {
      alert("Un seul événement par jour est autorisé.");
    } else {
      setEvents([
        ...events,
        {
          title: selectedClasse?.name || "",
          start: info.startStr,
          end: info.endStr,
          // display: "background",
        },
      ]);
    }
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridWeek, interactionPlugin]}
      headerToolbar={headerToolbarProps}
      locale={frLocale}
      nowIndicator={true}
      height={"100%"}
      events={events}
      editable={true}
      validRange={semesterRange || undefined}
      selectable={!!semesterRange}
      dateClick={() =>
        !!!semesterRange && alert("Veuillez sélectionner une période")
      }
      eventClick={(e) =>
        setEvents(events.filter((event) => event.title !== e.event._def.title))
      }
      select={selectDate}
    />
  );
}
