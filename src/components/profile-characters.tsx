import { columns } from "@/components/columns";
import { DataTable } from "@/components/data-table";

export default function ProfileCharacters() {
  const tasks = [
    {
      name: "John Doe",
      status: "in progress",
      progress: "documentation",
    },
    {
      name: "John Doe",
      status: "in progress",
      progress: "documentation",
    },
    {
      name: "John Doe",
      status: "in progress",
      progress: "documentation",
    },
  ];

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
        <DataTable data={tasks} columns={columns} />
      </div>
    </>
  );
}
