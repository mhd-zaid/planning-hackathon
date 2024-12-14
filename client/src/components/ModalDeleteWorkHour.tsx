import { useCalendarContext } from "@/utils/context/calendar";
import { useDataContext } from "@/utils/context/data";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";

type ModalDeleteWorkHourProps = {
  showModalDelete: boolean;
  setShowModalDelete: Dispatch<SetStateAction<boolean>>;
  idToDelete: string | undefined;
};

export default function ModalDeleteWorkHour({
  showModalDelete,
  setShowModalDelete,
  idToDelete,
}: ModalDeleteWorkHourProps) {
  const { workHourEvent, setWorkhourEvent, selectedTeacherId } =
    useCalendarContext();
  const { fetchWorkHours } = useDataContext();
  const [cause, setCause] = useState<boolean>(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setWorkhourEvent(workHourEvent.filter((event) => event.id !== idToDelete));

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/work-hours/${idToDelete}${
          cause ? "?isUnavailable=true" : ""
        }`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(
        `Créneau supprimé avec succès${cause ? "pour cause d'absence" : "."}`
      );
      setShowModalDelete(false);
    } catch (error) {
      toast.error("Erreur lors de la suppression du créneau");
      console.log(error);
    } finally {
      fetchWorkHours(selectedTeacherId);
    }
  };

  return (
    <div
      tabIndex={-1}
      className={`${
        showModalDelete ? "" : "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
    >
      <form onSubmit={submit}>
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          <div className="relative bg-white rounded-lg shadow">
            <div className="flex flex-col gap-5 items-center justify-between p-4 md:p-5 border-b rounded-t">
              <h3 className="text-xl font-semibold text-gray-900 self-start">
                Supprimer pour cause d&apos;absence ?
              </h3>
              <div className="flex gap-3">
                <input
                  id={`input-index-cause`}
                  type="radio"
                  name="input-index-cause"
                  value={"true"}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  onClick={() => setCause(true)}
                />
                <label>Oui</label>
              </div>

              <div className="flex gap-3">
                <input
                  id={`input-index-cause`}
                  type="radio"
                  name="input-index-cause"
                  value={"false"}
                  defaultChecked={true}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  onClick={() => setCause(false)}
                />
                <label>Non</label>
              </div>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              >
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Créer
              </button>
              <button
                type="button"
                onClick={() => setShowModalDelete(false)}
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
