import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function SchoolCalendar() {
  return <FullCalendar plugins={[dayGridPlugin]} />;
}
