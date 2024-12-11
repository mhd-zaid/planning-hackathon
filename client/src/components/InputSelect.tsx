type InputSelectProps = {
  setSelectedFilliere: React.Dispatch<React.SetStateAction<string>>;
};

export default function InputSelect({ setSelectedFilliere }: InputSelectProps) {
  return (
    <>
      <label
        htmlFor="filliere"
        className="block mb-2 text-sm font-medium text-gray-900 "
      >
        Sélectionner une filière
      </label>
      <select
        id="filliere"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        onChange={(e) => setSelectedFilliere(e.target.value)}
      >
        <option value={""}>Choisir une fillière</option>
        <option value="IW">Ingénierie web</option>
        <option value="SE">Sécurité</option>
      </select>
    </>
  );
}
