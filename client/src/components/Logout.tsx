import { redirect } from 'next/navigation'

const LogoutButton = () => {

  const handleLogout = () => {
    // Supprimer les informations utilisateur du localStorage
    localStorage.removeItem('loggedInUser');
    // Rediriger vers la page de connexion
    redirect('/login');
  };

    return(
        <button onClick={handleLogout} className="w-full text-start p-2 rounded-lg bg-first hover:bg-second">Se Deconnecter</button>
    );
}
export default LogoutButton;