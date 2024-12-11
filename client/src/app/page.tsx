"use client";

import { CalendarProvider } from "@/utils/context/calendar";
import { DataProvider } from "@/utils/context/data";
import useRoleUser from "@/utils/hook/useRoleUser";

export default function Home() {
  const { renderCalendar, renderNavigation, role } = useRoleUser();

  return (
    <DataProvider>
      <CalendarProvider>
        <div className="flex gap-3">
          {renderNavigation[role]}
          <div className="flex-1 py-5 pe-3">{renderCalendar[role]}</div>
        </div>
      </CalendarProvider>
    </DataProvider>
  );
}
