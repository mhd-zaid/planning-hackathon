import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridWeek from "@fullcalendar/timegrid";
import frLocale from "@fullcalendar/core/locales/fr";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import { useDataContext } from "@/utils/context/data";
import { useCalendarContext } from "@/utils/context/calendar";
import { uuidv4 } from "uuidv7";
import useRoleUser from "@/utils/hook/useRoleUser";
import { EventClickArg } from "@fullcalendar/core/index.js";
import { toast } from "react-toastify";
import ModalIntervenantDeleteEvent from "./ModalIntervenantDeleteEvent";

export default function IntervenantCalendar() {
  const headerToolbarProps = {
    left: "prev,next today",
    center: "title",
    right: "timeGridWeek dayGridMonth",
  };

  const {
    schoolDays,
    fetchSchoolDays,
    fetchAvailabilities,
    availabilities,
    fetchWorkHours,
    workHours,
  } = useDataContext();

  const {
    semesterRange,
    setEvents,
    events,
    selectedClassId,
    displayedCalendarIntervenant,
    workHourEvent,
    setWorkhourEvent,
  } = useCalendarContext();

  const { user } = useRoleUser();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [idWorkHourToDelete, setIdWorkHourToDelete] = useState<string>("");

  const fillEvents = () => {
    setEvents([]);
    schoolDays.forEach((schoolDay) => {
      const event = {
        id: schoolDay.id,
        title: schoolDay.class.name,
        start: schoolDay.date,
        end: undefined,
        display: "background",
        color: "#d9ffb2",
      };
      setEvents((prev) => [...prev, event]);
    });
  };

  const fillAvailabilities = () => {
    availabilities.forEach((availabilities) => {
      const event = {
        id: availabilities.id || "",
        title: "Disponibilité",
        start: availabilities.beginDate,
        end: undefined,
      };
      setEvents((prev) => [...prev, event]);
    });
  };

  const fillWorkHoursEvent = () => {
    setWorkhourEvent([]);
    workHours.forEach((workHour) => {
      const event = {
        id: workHour.id,
        title: "Cours de ??",
        start: workHour.beginDate,
        end: workHour.endDate,
      };
      setWorkhourEvent((prev) => [...prev, event]);
    });
  };

  const dateClick = (info: DateClickArg) => {
    const dateFromApi = events
      .sort((event) => (event.id.startsWith("new-") ? -1 : 1))
      .find((event) => event.start === info.dateStr);

    const eventAlreadyExist = events.some(
      (event) => event.start.startsWith(info.dateStr) && !event.display
    );

    if (!dateFromApi || eventAlreadyExist || dateFromApi.id.startsWith("new-"))
      return;

    setEvents([
      ...events,
      {
        id: `new-${uuidv4()}`,
        title: "Disponibilité ",
        start: info.dateStr,
        end: undefined,
      },
    ]);
  };

  const deleteEvent = async (info: EventClickArg) => {
    if (!user) return;

    if (!!info.event.backgroundColor) return;

    if (info.event.id.startsWith("new-")) {
      setEvents(events.filter((event) => event.id !== info.event.id));
      return;
    }

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/availabilities/${info.event.id}?`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setEvents(events.filter((event) => event.id !== info.event.id));

      toast.success("Disponibilité supprimée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression de la disponibilité");
    } finally {
      fetchAvailabilities(user.id);
    }
  };

  const deleteWorkHour = async (info: EventClickArg) => {
    console.log("info", info);
    setIdWorkHourToDelete(info.event.id);
    setShowModal(true);
  };

  useEffect(() => {
    fillEvents();
    fillAvailabilities();
  }, [schoolDays]);

  useEffect(() => {
    if (!user) return;
    fetchAvailabilities(user.id);
    fetchWorkHours(user.id);
  }, [user]);

  useEffect(() => {
    fillWorkHoursEvent();
  }, [workHours]);

  useEffect(() => {
    fetchSchoolDays(selectedClassId);
  }, []);

  return (
    <>
      {displayedCalendarIntervenant === "planning" && (
        <>
          <FullCalendar
            key="dayGrid"
            plugins={[dayGridPlugin, timeGridWeek, interactionPlugin]}
            headerToolbar={headerToolbarProps}
            locale={frLocale}
            nowIndicator={true}
            height={"90%"}
            events={workHourEvent}
            eventClick={deleteWorkHour}
            initialView="dayGridMonth"
          />

          <ModalIntervenantDeleteEvent
            showModal={showModal}
            setShowModal={setShowModal}
            idToDelete={idWorkHourToDelete}
          />
        </>
      )}

      {displayedCalendarIntervenant === "dispo" && (
        <FullCalendar
          plugins={[dayGridPlugin, timeGridWeek, interactionPlugin]}
          headerToolbar={headerToolbarProps}
          locale={frLocale}
          nowIndicator={true}
          height={"89%"}
          selectable={false}
          dragScroll={true}
          events={events}
          editable={true}
          validRange={semesterRange || undefined}
          dateClick={dateClick}
          eventClick={deleteEvent}
        />
      )}
    </>
  );
}
