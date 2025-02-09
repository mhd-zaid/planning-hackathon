import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners"; // Importation du spinner

interface ModalGeneratePlanningProps {
  isOpen: boolean;
  classId: string;
  onClose: () => void;
  onWorkHoursValidated: () => void;
}

const ModalGeneratePlanning: React.FC<ModalGeneratePlanningProps> = ({ isOpen, onClose, classId, onWorkHoursValidated }) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [potentialWorkHours, setPotentialWorkHours] = useState<any[]>([]); // Tableau pour stocker les horaires potentiels récupérés
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isConfirmDisabled = !startDate || !endDate || new Date(startDate) > new Date(endDate) || isLoading;

  const fetchPotentialWorkHours = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/plannings/${classId}?start=${startDate}&end=${endDate}`,
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

  const handleDeleteWorkHour = (index: number) => {
    const newWorkHours = [...potentialWorkHours];
    newWorkHours.splice(index, 1);
    setPotentialWorkHours(newWorkHours);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const mappedWorkHours = mapWorkHoursToApiFormat(potentialWorkHours);
      console.log("Mapped Work Hours:", mappedWorkHours);

      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/work-hours`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mappedWorkHours),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création des horaires.");
      }

      const data = await response.json();
      console.log("API Response:", data);
      toast.success("Les heures de travail ont été générées avec succès!");
      onWorkHoursValidated();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la création des horaires:", error);
      toast.error("Une erreur est survenue lors de la création des horaires.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setStartDate("");
      setEndDate("");
      setPotentialWorkHours([]);
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[600px] shadow-lg relative">
        {/* Croix rouge pour fermer */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-lg"
        >
          ❌
        </button>

        {potentialWorkHours.length === 0 && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Génération de planning</h2>
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

        {potentialWorkHours.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Heures de travail potentielles</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {potentialWorkHours.map((workHour, index) => (
                <div key={index} className="flex justify-between items-center border p-2 rounded-md shadow-sm">
                  <div>
                    <p>
                      <strong>{new Date(workHour.startDate).toLocaleString()}</strong> -{" "}
                      <strong>{new Date(workHour.endDate).toLocaleString()}</strong>
                    </p>
                    <p>
                      Professeur : {workHour.teacher.firstname} {workHour.teacher.lastname}
                    </p>
                    <p>
                      Matière : <span style={{ color: workHour.subject.color }}>{workHour.subject.name}</span>
                    </p>
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
          {potentialWorkHours.length === 0 && (
            <button
              className={`px-4 py-2 rounded-md text-white ${isConfirmDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
              onClick={fetchPotentialWorkHours}
              disabled={isConfirmDisabled}
            >
              {isLoading ? <ClipLoader size={20} color="#fff" /> : "Confirmer"}
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
              {isLoading ? <ClipLoader size={20} color="#fff" /> : "Valider"}
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
