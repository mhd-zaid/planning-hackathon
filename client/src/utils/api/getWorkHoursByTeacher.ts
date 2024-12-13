import { Workhour } from "../types/work-hour.interface";

export const getWorkHoursByTeacher = async (idTeacher: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}/work-hours/${idTeacher}`
    );
    const data: Workhour[] = await response.json();
    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
