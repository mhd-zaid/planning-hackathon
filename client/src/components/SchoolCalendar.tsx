import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridWeek from "@fullcalendar/timegrid";
import frLocale from "@fullcalendar/core/locales/fr";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { useCalendarContext } from "@/utils/context/calendar";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core/index.js";
import { useDataContext } from "@/utils/context/data";
import { useEffect, useState } from "react";
import { uuidv4 } from "uuidv7";
import ModalWorkHour from "./ModalWorkHour";
import ModalDeleteWorkHour from "./ModalDeleteWorkHour";
import { RoleUser } from "@/utils/types/role-user.enum";

export default function SchoolCalendar() {
  const {
    events,
    workHourEvent,
    studentEvents,
    semesterRange,
    displayedByRole,
    setEvents,
    setWorkhourEvent,
    setStudentEvents,
  } = useCalendarContext();

  const { schoolDays, workHours, studentWorkHours } = useDataContext();

  const gridDisplayed = {
    [RoleUser.manager]: "dayGridMonth",
    [RoleUser.professor]: "timeGridWeek",
    [RoleUser.student]: "timeGridWeek dayGridMonth",
  };

  const headerToolbarProps = {
    left: "prev,next today",
    center: "title",
    right: gridDisplayed[displayedByRole],
  };

  const [idToDelete, setIdToDelete] = useState<string>("");
  const [eventWorkHour, setEventWorkHour] = useState<DateClickArg>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);

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
          id: `NEW-${uuidv4()}`,
          title: "Jour d'école",
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
          id: `NEW-${uuidv4()}`,
          title: "Jour d'école",
          start: event.startStr,
          end: event.endStr,
        },
      ]);
    }
  };

  const dateClickSchoolDay = () => {
    if (!!!semesterRange) {
      alert("Veuillez sélectionner une période.");
    }
  };

  const deleteSchoolDay = async (e: EventClickArg) => {
    if (!!!semesterRange) {
      alert("Veuillez sélectionner une période pour modifier le calendrier");
      return;
    }

    setEvents(events.filter((event) => event.id !== e.event._def.publicId));

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/school-days/${e.event._def.publicId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const deleteWorkHour = async (e: EventClickArg) => {
    setShowModalDelete(true);
    setIdToDelete(e.event._def.publicId);
  };

  const selectDateSchoolDay = (event: DateSelectArg) => {
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

  const dateClickWorkHour = (eventWorkHour: DateClickArg) => {
    setEventWorkHour(eventWorkHour);

    setShowModal(true);
  };

  const fillEvents = () => {
    setEvents([]);
    schoolDays.forEach((schoolDay) => {
      const event = {
        id: schoolDay.id,
        title: "Jour d'école",
        start: schoolDay.date,
        end: undefined,
      };

      setEvents((prev) => [...prev, event]);
    });
  };

  const fillWorkHoursEvents = () => {
    setWorkhourEvent([]);

    workHours.forEach((workHour) => {
      const event = {
        id: workHour.id,
        title: "Professeur",
        start: workHour.beginDate,
        end: workHour.endDate,
      };

      setWorkhourEvent((prev) => [...prev, event]);
    });
  };

  const fillStudentHours = () => {
    setStudentEvents([]);

    studentWorkHours.forEach((studentWorkHour) => {
      const event = {
        id: studentWorkHour.id,
        title: studentWorkHour.subjectClass.subject.name,
        start: studentWorkHour.beginDate,
        end: studentWorkHour.endDate,
      };

      setStudentEvents((prev) => [...prev, event]);
    });
  };

  useEffect(() => {
    fillEvents();
  }, [schoolDays]);

  useEffect(() => {
    fillWorkHoursEvents();
  }, [workHours]);

  useEffect(() => {
    fillStudentHours();
  }, [studentWorkHours]);

  return (
    <>
      {displayedByRole === RoleUser.manager && (
        <FullCalendar
          key="dayGrid"
          plugins={[dayGridPlugin, timeGridWeek, interactionPlugin]}
          headerToolbar={headerToolbarProps}
          locale={frLocale}
          nowIndicator={true}
          height={"90%"}
          events={events}
          editable={true}
          validRange={semesterRange || undefined}
          selectable={!!semesterRange}
          dateClick={dateClickSchoolDay}
          eventClick={deleteSchoolDay}
          select={selectDateSchoolDay}
          initialView="dayGridMonth"
          eventStartEditable={false}
        />
      )}

      {displayedByRole === RoleUser.professor && (
        <>
          <FullCalendar
            key="workHour"
            plugins={[dayGridPlugin, timeGridWeek, interactionPlugin]}
            slotMinTime={"08:00:00"}
            slotMaxTime={"18:00:00"}
            slotDuration={"01:00:00"}
            expandRows={true}
            height={"90%"}
            headerToolbar={headerToolbarProps}
            locale={frLocale}
            nowIndicator={true}
            events={workHourEvent}
            editable={true}
            dateClick={dateClickWorkHour}
            eventClick={deleteWorkHour}
            initialView="timeGridWeek"
            eventStartEditable={false}
          />

          <ModalWorkHour
            showModal={showModal}
            setShowModal={setShowModal}
            eventWorkHour={eventWorkHour}
          />

          <ModalDeleteWorkHour
            showModalDelete={showModalDelete}
            setShowModalDelete={setShowModalDelete}
            idToDelete={idToDelete}
          />
        </>
      )}

      {displayedByRole === RoleUser.student && (
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
      )}
    </>
  );
}
