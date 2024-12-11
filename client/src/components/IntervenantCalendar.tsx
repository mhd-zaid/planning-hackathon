import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridWeek from "@fullcalendar/timegrid";
import frLocale from "@fullcalendar/core/locales/fr";

export default function IntervenantCalendar() {
  const headerToolbarProps = {
    left: "prev,next today",
    center: "title",
    right: "timeGridWeek dayGridMonth",
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridWeek]}
      headerToolbar={headerToolbarProps}
      weekends={true}
      locale={frLocale}
      nowIndicator={true}
      height={"100%"}
    />
  );
}
