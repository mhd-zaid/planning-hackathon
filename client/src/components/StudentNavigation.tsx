import LogoutButton from "./Logout";

export default function StudentNavigation() {
  return (
    <aside className="w-64 h-screen ">
      <div className="overflow-y-auto py-5 px-3 h-full bg-white border-r border-gray-200 flex flex-col justify-between">
      <div>
        <h1 className="text-4xl font-bold text-center mb-5">Etudiant</h1>
        <ul className="space-y-2">
          <li>
            
          </li>
        </ul>
      </div>
      <div>
        <ul className="space-y-2">
          <li>
            <LogoutButton />
          </li>
        </ul>
      </div>
        
      </div>
    </aside>
  );
}
