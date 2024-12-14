"use client";

import { useEffect } from "react";
import { useCalendarContext } from "@/utils/context/calendar";
import { useDataContext } from "@/utils/context/data";
import LogoutButton from "./Logout";
import useRoleUser from "@/utils/hook/useRoleUser";
import { User } from "@/utils/types/user.interface";
import { Classes } from "@/utils/types/classes.interface";
import { Event } from "@/utils/types/event.interface";
import { avaibilities } from "@/utils/types/avaibilities.interface";

export default function IntervenantNavigation() {
  const { classes, fetchSchoolDays, fetchAvailabilities } = useDataContext();
  // const [user, setUser] = useState();
  const { selectedClassId, setSelectedClassId, events } = useCalendarContext();

  const { role } = useRoleUser()

  const getDatesBetween = (startDate: string, endDate: string) => {
    const dates = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate < end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const formatEventsToDayDate = (events: Event[], formNew?: boolean) => {
    const dates: { date: string }[] = events.flatMap((event) => {
      if (formNew && !event.id.startsWith("NEW-")) {
        return [];
      }

      if (!event.end) {
        return [
          {
            date: event.start,
          },
        ];
      } else {
        const dates = getDatesBetween(event.start, event.end);
        return dates.map((date) => ({
          date: date.toISOString().split("T")[0],
        }));
      }
    });

    return dates;
  };

  const calculRestHour = (classe: Classes | undefined) => {
    if (!classe) return 0;

    const restHourByClasse = classe.subjectClasses.reduce((acc, current) => {
      return (
        acc + current.subject.nbHoursQuota + current.subject.nbHoursQuotaExam
      );
    }, 0);

    return restHourByClasse;
  };

  const calculHourAlreadyPlaced = (classe: Classes, events: Event[]) => {
    if (!events || !events.length) return 0;

    const baseHour = calculRestHour(classe);

    const HOUR_BY_DAY = 8;
    const dayAlreadyPlaced = formatEventsToDayDate(events).length;

    return baseHour - dayAlreadyPlaced * HOUR_BY_DAY;
  };

  const userstr = localStorage.getItem("loggedInUser");
  const user: User = userstr && JSON.parse(userstr);

  const formatAvaibilities = (newEvent: Event[]) => {
     const formatedEvent = newEvent.flatMap(event => 
     ([{
      beginDate: event.start + "T08:00:00",
      endDate: event.start + "T12:00:00" ,
      isFavorite: false,
     }, {
      beginDate: event.start + "T13:00:00",
      endDate: event.start + "T18:00:00",
      isFavorite: false,
     }])
     ) 
     return formatedEvent
  }

  const postAvaibilities = async(events: Event[]) => {
    const newEvent = events.map(event => {
      if(event.id.startsWith("new-")) {
        return event
      } else {
        return null
      }
    }).filter(event => event) as Event[]
    if(!newEvent) return
    const body = formatAvaibilities(newEvent)

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/availabilities/${user.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
    } catch (error) {
      console.log("error", error);
    }
  }

  const teacherClasses = classes.flatMap((classe) => classe.subjectClasses.map((subjectClasse) => {
    if(subjectClasse.teacher.id === user.id){
      return classe
    } else {
      return null
    }
  })).filter((teacher) => teacher) as Classes[]

  useEffect(() => {
    if (!!selectedClassId) {
      fetchSchoolDays(selectedClassId);
    }
  }, [selectedClassId]);

  useEffect(() => {
    if (!!selectedClassId) {
      fetchAvailabilities(user.id);
    }
  }, [selectedClassId]);

  useEffect(() => {
    if (!!selectedClassId) {
      return;
    }
    if (teacherClasses && teacherClasses.length > 0) {
      setSelectedClassId(teacherClasses[0].id);
    }
  }, [teacherClasses]);

  if (!role) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="h-screen p-3 space-y-2 w-72 dark:bg-gray-50 dark:text-gray-800 border-r border-second flex flex-col justify-between">
      <div>
        <div className="flex items-center p-2 space-x-4">
          <img
            src="https://source.unsplash.com/100x100/portrait"
            alt=""
            className="w-12 h-12 rounded-full dark:bg-gray-500"
          />
          <div>
            <h2 className="text-lg font-semibold">
              {user.firstname} {user.lastname}
            </h2>
          </div>
        </div>
        <ul><br />
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
                      classe.restHour = calculHourAlreadyPlaced(classe, events);
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
                    {classe.restHour && (
                      <p className="text-xs font-normal text-gray-500">
                        Il reste {classe.restHour} heures à placé
                      </p>
                    )}
                  </label>
                </div>
              </div>
            </li>
          ))}
          <li>
          <button
            onClick={() => postAvaibilities(events)}
            className="w-full text-center p-2 my-5 rounded-lg bg-first"
          >
            Enregistrer les jours
          </button>
          </li>
        </ul>
      </div>

      <div>
        <div>
          <ul className="pt-4 pb-2 space-y-1 text-sm">
            <li>
              <LogoutButton />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
