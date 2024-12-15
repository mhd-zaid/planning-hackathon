import { Unavailabilities } from "../types/unavailabilities.interface";

export const getUnvailabilities = async (idUser: string) => {
  if (!idUser) return [];

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}/unavailabilities/${idUser}`
    );
    const data: Unavailabilities[] = await response.json();
    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
