import EditUserForm from "../../../components/EditUserForm";

export default function EditParent({ params }: { params: { id: string } }) {
  return <EditUserForm id={params.id} />;
}