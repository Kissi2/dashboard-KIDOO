/* eslint-disable @typescript-eslint/no-unused-vars */
export default function FamilyMembers({ parentId }: { parentId: string }) {
  const children = [
    { id: "a", name: "Léa Dupont", age: 10 },
    { id: "b", name: "Tom Dupont", age: 7 },
  ];

  return (
    <ul className="list-disc pl-6">
      {children.map((child) => (
        <li key={child.id} className="mb-1">
          {child.name} ({child.age} ans)
          <button className="ml-4 text-sm text-red-600 hover:underline">Supprimer</button>
        </li>
      ))}
    </ul>
  );
}