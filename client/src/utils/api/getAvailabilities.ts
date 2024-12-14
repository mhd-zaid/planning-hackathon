import { Avaibilities } from "../types/avaibilities.interface";

export const getAvailabilities = async (idTeacher: string) => {
  if (!idTeacher) return [];
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}/availabilities/${idTeacher}`
    );
    const data: Avaibilities[] = await response.json();
    return data || [];
  } catch (error) {
    console.log(error);
    return [] as Avaibilities[];
  }
};
