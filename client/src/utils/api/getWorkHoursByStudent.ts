import { Workhour } from "../types/work-hour.interface";

export const getWorkHoursByStudent = async (idClass: string) => {
  if(!idClass) return [];
  
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}/work-hours/get-by-class/${idClass}`
    );
    const data: Workhour[] = await response.json();
    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
