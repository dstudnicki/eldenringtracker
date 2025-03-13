"use client";
import { Table } from "@tanstack/react-table";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/data-table-view-options";
import { useSession } from "next-auth/react";
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const { data: session } = useSession();
  const userId = session && session.user ? (session?.user as User).id : null;

  const addCharacterProfile = async () => {
    try {
      const response = await fetch("/api/characterProfiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userId}`,
        },
        body: JSON.stringify({
          name: "",
          status: "In progress",
          progress: "0/165",
        }),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed adding character profile", error);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter characters..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
      <Button
        variant="outline"
        className="h-8"
        onClick={() => addCharacterProfile()}
      >
        <Plus />
      </Button>
    </div>
  );
}
