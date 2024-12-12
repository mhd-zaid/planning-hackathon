import { redirect } from 'next/navigation'

const LogoutButton = () => {

  const handleLogout = () => {
    // Supprimer les informations utilisateur du localStorage
    localStorage.removeItem('loggedInUser');
    // Rediriger vers la page de connexion
    redirect('/login');
  };

    return(
      <a rel="noopener noreferrer" onClick={handleLogout} className="flex items-center p-2 space-x-3 rounded-md bg-first hover:bg-second cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 fill-current dark:text-white">
        <path d="M440,424V88H352V13.005L88,58.522V424H16v32h86.9L352,490.358V120h56V456h88V424ZM320,453.642,120,426.056V85.478L320,51Z"></path>
        <rect width="32" height="64" x="256" y="232"></rect>
      </svg>
      <span className='text-lg text-white'>Se deconnecter</span>
    </a>
    );
}
export default LogoutButton;