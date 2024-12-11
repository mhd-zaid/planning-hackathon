"use client";

import useRoleUser from "@/utils/hook/useRole";

export default function Home() {
  const { renderCalendar, renderNavigation, role } = useRoleUser();

  return (
    <div className="flex gap-3">
      {renderNavigation[role]}
      <div className="flex-1 py-5 pe-3">{renderCalendar[role]}</div>
    </div>
  );
}
