"use client";
import { CalendarProvider, useCalendarContext } from "@/utils/context/calendar";
import { DataProvider } from "@/utils/context/data";
import useRoleUser from "@/utils/hook/useRoleUser";

export default function Home() {
  return (
    <DataProvider>
      <CalendarProvider>
        <Layout />
      </CalendarProvider>
    </DataProvider>
  );
}

export function Layout() {
  const { renderCalendar, renderNavigation, role } = useRoleUser();
  const { showAdmin } = useCalendarContext();

  if (!role){
    return null;
  }

  return (
    <div className="flex gap-3 mr-3">
        {renderNavigation[role]}
        {showAdmin? (
          <div className="p-8 flex flex-col flex-wrap h-screen w-screen">
            <div className="flex-1 border rounded-md px-10 py-4">
              <div className="flex flex-row items-center">
                <div className="px-4 py-2 text-lg font-semibold rounded dark:bg-gray-400 dark:text-gray-50 mx-4">
                  <div className="relative flex flex-row">
                    <img src="https://source.unsplash.com/30x30/portrait" alt="" className="w-10 h-10 border rounded-full dark:bg-gray-500 dark:border-gray-300" />
                    <p className="my-auto pl-4">Adrien Morin</p>
                  </div>
                </div>
                <div className="px-6 py-2 text-lg font-semibold rounded dark:bg-gray-400 dark:text-gray-50 mx-4">
                  <div className="relative flex flex-row">
                    <img src="https://source.unsplash.com/30x30/?portrait" alt="" className="w-10 h-10 border rounded-full dark:bg-gray-500 dark:border-gray-300" />
                    <p className="my-auto pl-4">Adrien Morin</p>
                  </div>
                </div>
                <div className="px-6 py-2 text-lg font-semibold rounded dark:bg-gray-400 dark:text-gray-50 mx-4">
                  <div className="relative flex flex-row">
                    <img src="https://source.unsplash.com/30x30/?portrait" alt="" className="w-10 h-10 border rounded-full dark:bg-gray-500 dark:border-gray-300" />
                    <p className="my-auto pl-4">Adrien Morin</p>
                  </div>
                </div>
                <div className="px-6 py-2 text-lg font-semibold rounded dark:bg-gray-400 dark:text-gray-50 mx-4">
                  <div className="relative flex flex-row">
                    <img src="https://source.unsplash.com/30x30/?portrait" alt="" className="w-10 h-10 border rounded-full dark:bg-gray-500 dark:border-gray-300" />
                    <p className="my-auto pl-4">Adrien Morin</p>
                  </div>
                </div>
                <div className="px-6 py-2 text-lg font-semibold rounded dark:bg-gray-400 dark:text-gray-50 mx-4">
                  <div className="relative flex flex-row">
                    <img src="https://source.unsplash.com/30x30/?portrait" alt="" className="w-10 h-10 border rounded-full dark:bg-gray-500 dark:border-gray-300" />
                    <p className="my-auto pl-4">Adrien Morin</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 mt-10 border rounded-md px-10 py-4">
              <div className="flex flex-row items-center">
                <div className="px-4 py-2 text-lg font-semibold rounded dark:bg-first dark:text-gray-50 mx-4">
                  <div className="relative flex flex-row">
                    <p className="my-auto">Typescript</p>
                  </div>
                </div>
                <div className="px-6 py-2 text-lg font-semibold rounded dark:bg-first dark:text-gray-50 mx-4">
                  <div className="relative flex flex-row">
                    <p className="my-auto">Symfony</p>
                  </div>
                </div>
                <div className="px-6 py-2 text-lg font-semibold rounded dark:bg-first dark:text-gray-50 mx-4">
                  <div className="relative flex flex-row">
                    <p className="my-auto">React</p>
                  </div>
                </div>
                <div className="px-6 py-2 text-lg font-semibold rounded dark:bg-first dark:text-gray-50 mx-4">
                  <div className="relative flex flex-row">
                    <p className="my-auto">Nodejs</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 mt-10 border rounded-md px-10 py-4">
              <p>Les Salles</p>
              <div className="flex flex-row items-center">
                <div className="px-6 py-2 text-lg font-semibold rounded dark:bg-first dark:text-gray-50 mx-4">
                  <div className="relative flex flex-row">
                    <p className="my-auto">A1</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
      ) : (
        <div className="flex-1">
          <div className="bg-first px-8 py-6 text-2xl font-bold text-white text-center -ml-3 mb-2 -mr-3">Calendrier synaloptique des cours</div>
          {renderCalendar[role]}
        </div>
      )}
    </div>
  );
}
