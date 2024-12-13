import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridWeek from "@fullcalendar/timegrid";
import frLocale from "@fullcalendar/core/locales/fr";
import interactionPlugin from "@fullcalendar/interaction";
import { useDataContext } from "@/utils/context/data";
import { useCalendarContext } from "@/utils/context/calendar";
import { useEffect } from "react";
import useRoleUser from "@/utils/hook/useRoleUser";

export default function StudentCalendar() {
  const headerToolbarProps = {
    left: "prev,next today",
    center: "title",
    right: "timeGridWeek dayGridMonth",
  };

  const { fetchStudentWorkHours, studentWorkHours } = useDataContext();

  const { setStudentEvents, studentEvents } = useCalendarContext();

  const { user } = useRoleUser();

  const fillStudentHours = () => {
    setStudentEvents([]);

    studentWorkHours.forEach((studentWorkHour) => {
      const event = {
        id: studentWorkHour.id,
        title: "Cours de ??",
        start: studentWorkHour.beginDate,
        end: studentWorkHour.endDate,
      };

      setStudentEvents((prev) => [...prev, event]);
    });
  };

  useEffect(() => {
    fillStudentHours();
  }, [studentWorkHours]);

  useEffect(() => {
    fetchStudentWorkHours(user.classId);
  }, []);

  return (
    <FullCalendar
      key="dayGrid"
      plugins={[dayGridPlugin, timeGridWeek, interactionPlugin]}
      headerToolbar={headerToolbarProps}
      locale={frLocale}
      nowIndicator={true}
      height={"90%"}
      events={studentEvents}
      initialView="dayGridMonth"
    />
  );
}
