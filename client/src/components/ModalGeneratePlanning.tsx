import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface ModalGeneratePlanningProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalGeneratePlanning: React.FC<ModalGeneratePlanningProps> = ({ isOpen, onClose }) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [potentialWorkHours, setPotentialWorkHours] = useState<any[]>([]); // Tableau pour stocker les horaires potentiels récupérés
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Définir si le bouton "Confirmer" doit être activé ou non
  const isConfirmDisabled = !startDate || !endDate || new Date(startDate) > new Date(endDate) || isLoading;

  // Fonction pour récupérer les potential work hours après avoir confirmé les dates
  const fetchPotentialWorkHours = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/plannings/63b9e30f-e87f-4e5c-acb2-3db6ac65bf79?start=2024-12-01&end=2024-12-31`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des horaires.");
      }
      const data = await response.json();
      setPotentialWorkHours(data.potentialWorkHours || []);
      console.log("Potential Work Hours:", data.potentialWorkHours);
    } catch (error) {
      console.error("Erreur lors de la récupération des horaires:", error);
      toast.error("Une erreur est survenue lors de la récupération des horaires.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour supprimer un créneau de la liste des horaires potentiels
  const handleDeleteWorkHour = (index: number) => {
    const newWorkHours = [...potentialWorkHours];
    newWorkHours.splice(index, 1);
    setPotentialWorkHours(newWorkHours);
  };

  // Fonction pour valider la création des work hours
  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      // Mapper les horaires potentiels au format attendu par l'API
      const mappedWorkHours = mapWorkHoursToApiFormat(potentialWorkHours);

      console.log("Mapped Work Hours:", mappedWorkHours);
  
      // Faire la requête API pour créer les work hours
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/work-hours`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mappedWorkHours), // Envoyer les données mappées
      });
  
      if (!response.ok) {
        throw new Error("Erreur lors de la création des horaires.");
      }
  
      const data = await response.json();
      console.log("API Response:", data);
      toast.success("Les heures de travail ont été générées avec succès!");
      onClose(); // Fermer la modal après la validation
    } catch (error) {
      console.error("Erreur lors de la création des horaires:", error);
      toast.error("Une erreur est survenue lors de la création des horaires.");
    } finally {
      setIsLoading(false);
    }
  };
  // Réinitialiser la modal à chaque fermeture
  useEffect(() => {
    if (!isOpen) {
      // Réinitialiser tous les états lorsque la modal est fermée
      setStartDate("");
      setEndDate("");
      setPotentialWorkHours([]);
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[600px] shadow-lg"> {/* Augmenter la largeur de la modal */}
        {/* Première partie de la modal (sélecteurs de dates et bouton de confirmation) */}
        {potentialWorkHours.length === 0 && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Sélectionnez une plage de dates</h2>

            <div className="mb-4">
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <input
                type="date"
                id="start-date"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin
              </label>
              <input
                type="date"
                id="end-date"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </>
        )}

        {/* Affichage des potential work hours une fois les dates confirmées */}
        {potentialWorkHours.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Heures de travail potentielles</h3>
            <div className="space-y-2">
              {potentialWorkHours.map((workHour, index) => (
                <div key={index} className="flex justify-between items-center border p-2 rounded-md shadow-sm">
                  <div>
                    <p>
                      <strong>{new Date(workHour.startDate).toLocaleString()}</strong> -{" "}
                      <strong>{new Date(workHour.endDate).toLocaleString()}</strong>
                    </p>
                    <p>Professeur : {workHour.teacher.firstname} {workHour.teacher.lastname}</p>
                    <p>Matière : <span style={{ color: workHour.subject.color }}>{workHour.subject.name}</span></p>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteWorkHour(index)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2"
            onClick={onClose}
            disabled={isLoading}
          >
            Annuler
          </button>
          {potentialWorkHours.length === 0 && (
            <button
              className={`px-4 py-2 rounded-md text-white ${isConfirmDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
              onClick={() => {
                fetchPotentialWorkHours();
              }}
              disabled={isConfirmDisabled}
            >
              {isLoading ? "Chargement..." : "Confirmer"}
            </button>
          )}
        </div>

        {potentialWorkHours.length > 0 && (
          <div className="mt-4 flex justify-end">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? "Chargement..." : "Valider"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const mapWorkHoursToApiFormat = (workHours: any[]) => {
    return workHours.map((workHour) => ({
      beginDate: new Date(workHour.startDate).toISOString(),
      endDate: new Date(workHour.endDate).toISOString(),
      subjectClassId: workHour.subjectClassId,
    }));
  };
  

export default ModalGeneratePlanning;
