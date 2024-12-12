import { Filliere } from "../types/filliere.interface";

export const getBranches = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/branches`);
    const data: Filliere[] = await response.json();
    return data || [];
  } catch (error) {
    console.log(error);
    return [] as Filliere[];
  }
};
