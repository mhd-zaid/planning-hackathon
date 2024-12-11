import Logout from "./Logout";

export default function SchoolNavigation() {
  return (
    <aside className="w-64 h-screen ">
      <div className="overflow-y-auto py-5 px-3 h-full bg-white border-r border-gray-200">
        <h1 className="text-4xl font-bold text-center mb-5">Ecole</h1>
        <ul className="space-y-2">
          <li>
            <button
              className="w-full text-start p-2 rounded-lg hover:bg-gray-100"
              onClick={() => console.log("Go to disponibilité")}
            >
              Disponibilité
            </button>
          </li>
          <li>
            <Logout />
          </li>
        </ul>
      </div>
    </aside>
  );
}
