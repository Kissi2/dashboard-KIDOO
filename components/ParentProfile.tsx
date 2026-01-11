import FamilyMembers from "./FamilyMembers";

export default function ParentProfile({ id }: { id: string }) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Profil du parent #{id}</h2>
      <div className="mb-4">
        <p><strong>Nom:</strong> Jean Dupont</p>
        <p><strong>Email:</strong> jean@email.com</p>
        <p><strong>Téléphone:</strong> +225 0707070707</p>
      </div>
      <h3 className="text-lg font-semibold mb-2">Membres de la famille</h3>
      <FamilyMembers parentId={id} />
    </div>
  );
}