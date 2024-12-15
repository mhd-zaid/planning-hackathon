import { Teacher } from "@/utils/types/teacher.interface";
import { Unavailabilities } from "@/utils/types/unavailabilities.interface";
import { Dispatch } from "react";

type ModalUnvalabilitiesProps = {
  showModal: boolean;
  setShowModal: Dispatch<React.SetStateAction<boolean>>;
  teacher: Teacher | undefined;
  unavailabilities: Unavailabilities[];
};

export default function ModalUnvalabilities({
  showModal,
  setShowModal,
  teacher,
  unavailabilities,
}: ModalUnvalabilitiesProps) {
  if (!unavailabilities.length || !teacher) return null;

  return (
    <div
      tabIndex={-1}
      className={`${
        showModal ? "" : "hidden"
      } overflow-y-auto bg-black bg-opacity-50 overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
    >
      <div className="bg-white rounded-lg p-6 w-[600px] shadow-lg relative">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Absence de l&apos;intervenant {teacher.firstname} {teacher.lastname}
        </h2>
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-lg"
        >
          ❌
        </button>

        <div className="border-b border-gray-300 my-5 m-auto" />
        <ul>
          {unavailabilities.map((unavailability) => (
            <li key={unavailability.id}>
              Le{" "}
              <span className="font-bold">
                {new Date(unavailability.date).toLocaleDateString()}
              </span>{" "}
              sur le cours de{" "}
              <span className="font-bold">
                {unavailability.subjectClass.subject.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
