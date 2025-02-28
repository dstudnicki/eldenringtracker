import { Metadata } from "next";
import Image from "next/image";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

const characters = {
  data: [
    {
      id: 1,
      name: "John Doe",
      status: "In Progress",
      bossesProgress: "15/165",
    },
    {
      id: 2,
      name: "John Doe",
      status: "In Progress",
      bossesProgress: "15/165",
    },
  ],
};

export function ProfileCharacters() {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col md:flex">
        <div className="mb-4 grid grid-cols-3">
          <h3 className="text-md font-semibold">Name</h3>
          <span className="text-md font-semibold">Status</span>
          <span className="text-md font-semibold">Progress</span>
        </div>
        {characters.data.map((character) => (
          <div key={character.id} className="mt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">{character.name}</h3>
              <span className="text-sm">{character.status}</span>
              <span className="text-sm">{character.bossesProgress}</span>
              <DataTableRowActions />
            </div>
            <Separator className="mt-2" />
          </div>
        ))}
      </div>
    </>
  );
}
