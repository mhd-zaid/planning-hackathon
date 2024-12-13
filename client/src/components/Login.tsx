import React, { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import getUsers from "@/utils/api/getUsers";
import { User } from "@/utils/types/user.interface";
import { useDataContext } from "@/utils/context/data";

const Login = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  // const { users } = useDataContext();
  const { users } = useDataContext();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const users = await getUsers();

    const user = users.find((u) => u.email === email);

    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      switch (user.role) {
        case "student":
          router.push("/");
          break;
        case "professor":
          router.push("/");
          break;
        case "manager":
          router.push("/");
          break;
        default:
          setMessage("Rôle inconnu. Veuillez contacter un administrateur.");
      }
    } else {
      setMessage("Adresse email introuvable.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white rounded-lg w-full max-w-lg p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Planning Hackathon
        </h1>
        <h3 className="text-lg text-center text-gray-600 mb-4">
          Connectez-vous !
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Adresse Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-first focus:border-first"
              placeholder="Entrez votre email"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-first text-white font-medium py-2 rounded-md hover:bg-second transition"
          >
            Se Connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
