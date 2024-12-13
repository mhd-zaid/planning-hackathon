import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners'; // Importer le spinner de react-spinners
import 'react-toastify/dist/ReactToastify.css';




interface AvailableSlotsModalProps {
  onClose: () => void;
  isOpen: boolean;
  userId: string;
}

const AvailableSlotsModal: React.FC<AvailableSlotsModalProps> = ({ onClose, isOpen, userId }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const [slots, setSlots] = useState<any[]>([]);

  const getSlots = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/replacements/teacher/${userId}`
      );
      const data = await response.json();
      setSlots(data);
      console.log(data);
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(() => {
    if (isOpen) {
      getSlots();
    }
  }, [isOpen]); // Déclencher lorsque isOpen change

  const acceptSlot = async (slotId: string) => {
    setLoading(slotId);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/replacements/${slotId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) throw new Error('Erreur serveur lors de l\'acceptation du créneau');
  
      const data = await response.json();
      toast.success('Créneau accepté avec succès');
      setIsSuccess(true);
  
      // Supprimer le slot accepté du tableau
      setSlots((prevSlots) => prevSlots.filter((slot) => slot.id !== slotId));
    } catch (error) {
      toast.error(`Erreur lors de l'acceptation du créneau: ${(error as Error).message}`);
      setIsSuccess(false);
    } finally {
      setLoading(null);
    }
  };
  
  const deleteSlot = async (slotId: string) => {
    setLoading(slotId);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/replacements/${slotId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) throw new Error('Erreur serveur lors de la suppression du créneau');
  
      const data = await response.json();
      toast.success('Créneau supprimé avec succès');
      setIsSuccess(true);
  
      // Supprimer le slot supprimé du tableau
      setSlots((prevSlots) => prevSlots.filter((slot) => slot.id !== slotId));
    } catch (error) {
      toast.error(`Erreur lors de la suppression du créneau: ${(error as Error).message}`);
      setIsSuccess(false);
    } finally {
      setLoading(null);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 flex flex-col justify-between relative"> {/* Ajusté pour centrer et ajouter flex */}
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-white text-xl"
        >
          ❌
        </button>
        <h2 className="text-xl font-semibold text-center mb-4">Créneaux Disponibles</h2>
        <div className="space-y-4 flex flex-col justify-center items-center"> {/* Centrer les éléments */}
          {slots.map((slot) => (
            <div key={slot.id} className="flex justify-center items-center w-full">
              <p className="text-gray-700 font-semibold">
                {new Date(slot.beginDate).toLocaleString()} - {new Date(slot.endDate).toLocaleString()}
              </p>
              <div className="flex space-x-4 ml-6">
                <button
                  onClick={() => acceptSlot(slot.id)}
                  className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none"
                  disabled={loading === slot.id}
                >
                  {loading === slot.id ? (
                    <ClipLoader color="#ffffff" size={20} />
                  ) : (
                    '✔' // Coche bleue pour accepter
                  )}
                </button>
                <button
                  onClick={() => deleteSlot(slot.id)}
                  className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 focus:outline-none font-semibold"
                  disabled={loading === slot.id}
                >
                  {loading === slot.id ? (
                    <ClipLoader color="#ffffff" size={20} />
                  ) : (
                    'X'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvailableSlotsModal;
