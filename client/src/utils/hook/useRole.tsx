import StudentCalendar from "@/components/StudentCalendar";
import { RoleUser } from "../types/role-user.hook";
import IntervenantCalendar from "@/components/IntervenantCalendar";
import SchoolCalendar from "@/components/SchoolCalendar";
import StudentNavigation from "@/components/StudentNavigation";
import IntervenantNavigation from "@/components/IntervenantNavigation";
import SchoolNavigation from "@/components/SchoolNavigation";

export default function useRoleUser() {
  const role = RoleUser.SCHOOL;

  const renderCalendar = {
    [RoleUser.STUDENT]: <StudentCalendar />,
    [RoleUser.INTERVENANT]: <IntervenantCalendar />,
    [RoleUser.SCHOOL]: <SchoolCalendar />,
  };

  const renderNavigation = {
    [RoleUser.STUDENT]: <StudentNavigation />,
    [RoleUser.INTERVENANT]: <IntervenantNavigation />,
    [RoleUser.SCHOOL]: <SchoolNavigation />,
  };
  return {
    renderCalendar,
    renderNavigation,
    role,
  };
}
