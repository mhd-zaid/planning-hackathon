import { User } from "../types/user.interface";

export default async function getUsers() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users`);
    const data: User[] = await response.json();

    return data || [];
  } catch (error) {
    console.log(error);
    return [] as User[];
  }
}
