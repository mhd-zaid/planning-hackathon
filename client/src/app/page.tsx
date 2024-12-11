"use client";

import { CalendarProvider, useCalendarContext } from "@/utils/context/calendar";
import useRoleUser from "@/utils/hook/useRoleUser";
import { useState } from "react";

export default function Home() {
  return (
    <CalendarProvider>
      <Layout /> 
    </CalendarProvider>
  );
}

export function Layout() {
  const { renderCalendar, renderNavigation, role } = useRoleUser();
  const { showAdmin } = useCalendarContext();

  return(
    <div className="flex gap-3">
        {renderNavigation[role]}
        {showAdmin? 
          <div>
            <div>
              <p>Les Intervennants</p>
            </div>
            <div>
              <p>Les Matières</p>
            </div>
            <div>
              <p>Les Salles</p>
            </div>
          </div>
          :<div className="flex-1 py-5 pe-3">{renderCalendar[role]}</div>}
      </div>
  );
}