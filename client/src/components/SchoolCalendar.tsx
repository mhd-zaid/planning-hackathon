import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridWeek from "@fullcalendar/timegrid";
import frLocale from "@fullcalendar/core/locales/fr";
import interactionPlugin from "@fullcalendar/interaction";
import { useCalendarContext } from "@/utils/context/calendar";
import { DateSelectArg } from "@fullcalendar/core/index.js";
import { useDataContext } from "@/utils/context/data";

export default function SchoolCalendar() {
  const { semesterRange, events, setEvents, selectedClassId } =
    useCalendarContext();
  const { fillieres } = useDataContext();

  const headerToolbarProps = {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth",
  };

  const selectedClasse = fillieres
    .flatMap((filliere) => filliere.classes)
    .find((classe) => classe.id === selectedClassId);

  const eventsOverlap = (
    dateStartNewEvent: string,
    dateEndNewEvent: string,
    dateStartRegisteredEvent: string,
    dateEndRegisteredEvent?: string
  ) => {
    if (!dateEndRegisteredEvent) {
      return (
        dateStartRegisteredEvent >= dateStartNewEvent &&
        dateStartRegisteredEvent <= dateEndNewEvent
      );
    }

    return (
      (dateStartNewEvent >= dateStartRegisteredEvent &&
        dateStartNewEvent < dateEndRegisteredEvent) ||
      (dateEndNewEvent > dateStartRegisteredEvent &&
        dateEndNewEvent <= dateEndRegisteredEvent) ||
      (dateStartNewEvent <= dateStartRegisteredEvent &&
        dateEndNewEvent >= dateEndRegisteredEvent)
    );
  };

  const processSelectDateOnOneDay = (event: DateSelectArg) => {
    const dateStartNewEvent = new Date(event.startStr).toISOString();
    const dateEndNewEvent = new Date(event.endStr).toISOString();

    const eventExist = events.some((event) => {
      const dateStartRegisteredEvent = new Date(event.start).toISOString();
      const dateEndRegisteredEvent =
        event.end && new Date(event.end).toISOString();

      if (!dateEndRegisteredEvent) {
        return dateStartNewEvent === dateStartRegisteredEvent;
      }

      return eventsOverlap(
        dateStartNewEvent,
        dateEndNewEvent,
        dateStartRegisteredEvent,
        dateEndRegisteredEvent
      );
    });

    if (eventExist) {
      alert("Un seul événement par jour est autorisé.");
    } else {
      setEvents([
        ...events,
        {
          title: selectedClasse?.name || "",
          start: event.startStr,
          end: undefined,
        },
      ]);
    }
  };

  const processSelectDateOnMultipleDays = (event: DateSelectArg) => {
    const dateStartNewEvent = new Date(event.startStr).toISOString();
    const dateEndNewEvent = new Date(event.endStr).toISOString();

    const eventExist = events.some((event) => {
      const dateStartRegisteredEvent = new Date(event.start).toISOString();
      const dateEndRegisteredEvent =
        event.end && new Date(event.end).toISOString();

      if (!dateEndRegisteredEvent) {
        return (
          dateStartRegisteredEvent >= dateStartNewEvent &&
          dateStartRegisteredEvent <= dateEndNewEvent
        );
      }

      return eventsOverlap(
        dateStartNewEvent,
        dateEndNewEvent,
        dateStartRegisteredEvent,
        dateEndRegisteredEvent
      );
    });

    if (eventExist) {
      alert("Un seul événement par jour est autorisé.");
    } else {
      setEvents([
        ...events,
        {
          title: selectedClasse?.name || "",
          start: event.startStr,
          end: event.endStr,
        },
      ]);
    }
  };

  const selectDate = (event: DateSelectArg) => {
    const dateStart = new Date(event.startStr);
    const dateEnd = new Date(event.endStr);

    const startDay = dateStart.toLocaleDateString("fr-FR").split("/")[0];
    const endDay = dateEnd.toLocaleDateString("fr-FR").split("/")[0];

    const isOneDayEvent = Number(endDay) === Number(startDay) + 1;

    if (isOneDayEvent) {
      processSelectDateOnOneDay(event);
      return;
    }

    processSelectDateOnMultipleDays(event);
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
