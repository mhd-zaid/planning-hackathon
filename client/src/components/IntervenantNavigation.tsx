"use client";

import { useEffect, useState } from "react";
import { useCalendarContext } from "@/utils/context/calendar";
import { useDataContext } from "@/utils/context/data";
import LogoutButton from "./Logout";
import useRoleUser from "@/utils/hook/useRoleUser";
import { Classes } from "@/utils/types/classes.interface";
import { Event } from "@/utils/types/event.interface";
import AvailableSlotsModal from "./AvailableSlotModal";
import { User } from "@/utils/types/user.interface";
import { toast } from "react-toastify";

export default function IntervenantNavigation() {
  const { classes, fetchSchoolDays, fetchAvailabilities } = useDataContext();

  const {
    selectedClassId,
    setSelectedClassId,
    events,
    displayedCalendarIntervenant,
    setDisplayedCalendarIntervenant,
  } = useCalendarContext();

  const { role, user } = useRoleUser();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const closeModal = () => setIsModalOpen(false);
  const formatAvaibilities = (newEvent: Event[]) => {
    const formatedEvent = newEvent.flatMap((event) => [
      {
        beginDate: event.start + "T08:00:00",
        endDate: event.start + "T12:00:00",
        isFavorite: false,
      },
      {
        beginDate: event.start + "T13:00:00",
        endDate: event.start + "T18:00:00",
        isFavorite: false,
      },
    ]);
    return formatedEvent;
  };

  const postAvaibilities = async (events: Event[]) => {
    if(!user) return
    const newEvent = events
      .map((event) => {
        if (event.id.startsWith("new-")) {
          return event;
        } else {
          return null;
        }
      })
      .filter((event) => event) as Event[];

    if (!newEvent || !newEvent.length) {
      toast.error("Aucune disponibilité à enregistrer");
      return;
    }

    const body = formatAvaibilities(newEvent);

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/availabilities/${user?.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      toast.success("Disponibilités enregistrées");
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde des disponibilités");
      console.log("error", error);
    }finally{fetchAvailabilities(user.id)}
  };

  const teacherClasses = classes
    .flatMap((classe) =>
      classe.subjectClasses.map((subjectClasse) => {
        if (subjectClasse.teacher.id === user?.id) {
          return classe;
        } else {
          return null;
        }
      })
    )
    .filter((teacher) => teacher) as Classes[];

  useEffect(() => {
    if (!!selectedClassId) {
      fetchSchoolDays(selectedClassId);
    }
  }, [selectedClassId]);

  useEffect(() => {
    if (!user) return;
    fetchAvailabilities(user?.id);
  }, [user]);

  useEffect(() => {
    if (selectedClassId) return;

    if (teacherClasses && teacherClasses.length > 0) {
      setSelectedClassId(teacherClasses[0].id);
    }
  }, [teacherClasses]);

  if (!role) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="h-screen p-3 shadow-lg shadow-first space-y-2 w-72 dark:bg-gray-50 dark:text-gray-800 border-r border-second flex flex-col justify-between">
      <div>
        <div className="flex items-center p-2 space-x-4">
          <img
            src="https://images.unsplash.com/photo-1629054881775-ced62585d800?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            className="w-12 h-12 rounded-full dark:bg-gray-500"
          />
          <div>
            <h2 className="text-lg font-semibold">
              {user?.firstname} {user?.lastname}
            </h2>
          </div>
        </div>

        <label className="block mt-6 mb-2 text-lg font-medium text-gray-900 text-center">
          Que voulez vous faire ?
        </label>
        <select
          id="classe"
          className="bg-gray-50 border border-first text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          onChange={(e) =>
            setDisplayedCalendarIntervenant(
              e.target.value as "planning" | "dispo"
            )
          }
        >
          <option key={"planning"} value={"planning"}>
            Consulter mon planning
          </option>
          <option key={"dispo"} value={"dispo"}>
            Ajouter des disponibilité
          </option>
        </select>

        {displayedCalendarIntervenant === "dispo" && (
          <ul>
            <br />
            <p className="text-lg">Mes classes : </p>
            {teacherClasses?.map((classe: Classes) => (
              <li key={classe.id}>
                <div className="flex p-2 rounded hover:bg-gray-100 my-4">
                  <div className="flex items-center h-5">
                    <input
                      id={`input-index-${classe.name}`}
                      type="radio"
                      name="classe-radio"
                      value={classe.id}
                      checked={selectedClassId === classe.id}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      onChange={(e) => {
                        setSelectedClassId(e.target.value);
                      }}
                    />
                  </div>
                  <div className="ms-2 text-sm">
                    <label
                      htmlFor={`input-index-${classe.name}`}
                      className="font-medium text-gray-900"
                    >
                      <div className="font-bold">{classe.name}</div>
                    </label>
                  </div>
                </div>
              </li>
            ))}
            <li>
            <button
              onClick={() => postAvaibilities(events)}
              className=" text-white text-lg w-full text-center p-2 my-5 rounded-lg bg-first"
            >
              Enregistrer les jours
            </button>
          </li>
          </ul>
        )}
      </div>
      <div>
        <AvailableSlotsModal
          onClose={closeModal}
          isOpen={isModalOpen}
          userId={(user as User).id}
        />
        <div>
          <button
            onClick={() => {
              setIsModalOpen(true);
            }}
            className=" text-white text-lg w-full text-center p-2 my-5 rounded-lg bg-first"
          >
            Suggestion des crénaux
          </button>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
