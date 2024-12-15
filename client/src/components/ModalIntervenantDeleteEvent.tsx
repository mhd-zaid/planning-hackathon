import { useDataContext } from "@/utils/context/data";
import useRoleUser from "@/utils/hook/useRoleUser";
import { Teacher } from "@/utils/types/teacher.interface";
import { Unavailabilities } from "@/utils/types/unavailabilities.interface";
import { Dispatch } from "react";
import { toast } from "react-toastify";

type ModalIntervenantDeleteEventProps = {
  showModal: boolean;
  setShowModal: Dispatch<React.SetStateAction<boolean>>;
  idToDelete: string;
};

export default function ModalIntervenantDeleteEvent({
  showModal,
  setShowModal,
  idToDelete,
}: ModalIntervenantDeleteEventProps) {
  const { fetchWorkHours } = useDataContext();
  const { user } = useRoleUser();

  const deleteWorkHours = async () => {
    if (!user) return;

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/work-hours/${idToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Disponibilité supprimée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression de la disponibilité");
    } finally {
      fetchWorkHours(user.id);
      setShowModal(false);
    }
  };
  return (
    <div
      tabIndex={-1}
      className={`${
        showModal ? "" : "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
    >
      <div className="bg-white rounded-lg p-6 w-[600px] shadow-lg relative">
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-lg"
        >
          ❌
        </button>
        <h2 className="text-lg font-bold mb-5">
          Suppression d'une heure de cours
        </h2>

        <p>
          Êtes-vous sûr de vouloir supprimer cette heure de cours ? Cela va vous
          assigner une absence.
        </p>

        <div className="flex items-center border-t border-gray-200 mt-5 pt-5">
          <button
            onClick={deleteWorkHours}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Valider la suppression
          </button>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
