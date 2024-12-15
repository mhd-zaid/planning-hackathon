import { Classrooms } from "../types/classrooms.interface";

export const getClassrooms = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/rooms/`);
    const data: Classrooms[] = await response.json();
    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
