import { Workhour } from "../types/work-hour.interface";

export const getWorkHoursByTeacher = async (idUser: string) => {
  if(!idUser) return [];
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}/work-hours/${idUser}`
    );
    const data: Workhour[] = await response.json();
    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
