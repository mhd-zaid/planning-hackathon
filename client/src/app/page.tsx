"use client";

import SideNavigation from "@/components/SideNavigation";
import StudentCalendar from "@/components/StudentCalendar";
import IntervenantCalendar from "@/components/IntervenantCalendar";
import SchoolCalendar from "@/components/SchoolCalendar";

enum RoleUser {
  STUDENT = "STUDENT",
  INTERVENANT = "INTERVENANT",
  SCHOOL = "SCHOOL",
}

export default function Home() {
  const defaultRole = RoleUser.INTERVENANT;

  const renderCalendar = {
    [RoleUser.STUDENT]: <StudentCalendar />,
    [RoleUser.INTERVENANT]: <IntervenantCalendar />,
    [RoleUser.SCHOOL]: <SchoolCalendar />,
  };

  return (
    <div className="flex gap-3">
      <SideNavigation />
      <div className="flex-1 py-5 pe-3">{renderCalendar[defaultRole]}</div>
    </div>
  );
}
