import { columns } from "@/components/columns";
import { DataTable } from "@/components/data-table";

export default function ProfileCharacters() {
  const tasks = [
    {
      name: "Default profile",
      status: "in progress",
      progress: "16/165",
    },
  ];

  return (
    <>
      <div className="flex h-full flex-1 flex-col space-y-8">
        <DataTable data={tasks} columns={columns} />
      </div>
    </>
  );
}
