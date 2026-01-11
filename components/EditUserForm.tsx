export default function EditUserForm({ id }: { id: string }) {
  return (
    <form className="p-6 max-w-md bg-white shadow rounded">
      <h2 className="text-lg font-bold mb-4">Modifier le parent #{id}</h2>
      <label className="block mb-2">
        Nom:
        <input className="w-full p-2 border rounded" defaultValue="Jean Dupont" />
      </label>
      <label className="block mb-2">
        Email:
        <input className="w-full p-2 border rounded" defaultValue="jean@email.com" />
      </label>
      <label className="block mb-2">
        Téléphone:
        <input className="w-full p-2 border rounded" defaultValue="0707070707" />
      </label>
      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Mettre à jour</button>
    </form>
  );
}