import StudentCalendar from "@/components/StudentCalendar";
import { RoleUser } from "../types/role-user.enum";
import IntervenantCalendar from "@/components/IntervenantCalendar";
import SchoolCalendar from "@/components/SchoolCalendar";
import StudentNavigation from "@/components/StudentNavigation";
import IntervenantNavigation from "@/components/IntervenantNavigation";
import SchoolNavigation from "@/components/SchoolNavigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "../types/user.interface";

export default function useRoleUser() {
  const [role, setRole] = useState<RoleUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (!loggedInUser) {
      setRole(null);
      router.push("/login");
      return;
    }

    const user = JSON.parse(loggedInUser);
    setRole(user.role as RoleUser);
    setUser(user);
  }, []);

  const renderCalendar = {
    [RoleUser.student]: <StudentCalendar />,
    [RoleUser.professor]: <IntervenantCalendar />,
    [RoleUser.manager]: <SchoolCalendar />,
  };

  const renderNavigation = {
    [RoleUser.student]: <StudentNavigation />,
    [RoleUser.professor]: <IntervenantNavigation />,
    [RoleUser.manager]: <SchoolNavigation />,
  };

  return {
    renderCalendar,
    renderNavigation,
    role,
    user,
  };
}
