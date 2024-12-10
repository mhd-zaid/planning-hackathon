import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function StudentCalendar() {
  return <FullCalendar plugins={[dayGridPlugin]} />;
}
