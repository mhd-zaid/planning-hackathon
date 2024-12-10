export default function SideNavigation() {
  return (
    <aside className="w-64 h-screen ">
      <div className="overflow-y-auto py-5 px-3 h-full bg-white border-r border-gray-200">
        <ul className="space-y-2">
          <li>
            <button
              className="w-full text-start p-2 rounded-lg hover:bg-gray-100"
              onClick={() => console.log("Go to disponibilité")}
            >
              Disponibilité
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}
