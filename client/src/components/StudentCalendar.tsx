import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridWeek from "@fullcalendar/timegrid";
import frLocale from "@fullcalendar/core/locales/fr";
import interactionPlugin from "@fullcalendar/interaction";
import { useDataContext } from "@/utils/context/data";
import { useCalendarContext } from "@/utils/context/calendar";
import { useState, useEffect } from "react";



export default function StudentCalendar() {

  const headerToolbarProps = {
    left: "prev,next today",
    center: "title",
    right: "timeGridWeek dayGridMonth",
  };

  const { schoolDays, fetchSchoolDays } = useDataContext();

  const { semesterRange, setEvents, events, selectedClassId } = useCalendarContext();

  const fillEvents = () => {
    setEvents([]);
    schoolDays.forEach((schoolDay) => {
      const event = {
        id: schoolDay.id,
        title: schoolDay.class.name,
        start: schoolDay.date,
        end: undefined,
        display: 'background',
        color: '#b2b2b2',
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
  }, []);

  return (
    <FullCalendar 
      plugins={[dayGridPlugin, timeGridWeek, interactionPlugin]} 
      headerToolbar={headerToolbarProps}
      locale={frLocale}
      nowIndicator={true}
      height={"89%"}
      selectable={true}
      dragScroll={true}
      events={events}
      editable={true}
      validRange={semesterRange || undefined}
  />
  );
}
