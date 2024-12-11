import React, { ChangeEvent, useState } from "react";
import { redirect } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users`);
      if (!response.ok) {
        throw new Error("Impossible de récupérer les utilisateurs.");
      }

      const users = await response.json();
      const user = users.find((u) => u.email === email);

      if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        setTimeout(() => {
          redirect("/");
        }, 10);
      } else {
        setMessage("Adresse email introuvable.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Une erreur est survenue. Veuillez réessayer.");
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
