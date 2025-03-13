"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "../data/schema";
import { DataTableRowActions } from "./data-table-row-actions";
import { useState } from "react";

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: () => <>Name</>,
    cell: ({ row }) => {
      const name = row.original.name;

      const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        row.original.name = newName;

        try {
          await fetch(`/api/characterProfiles`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName }),
          });
        } catch (error) {
          console.error("Failed to update name", error);
        }
      };

      return (
        <div className="flex space-x-2">
          <input
            type="text"
            className="max-w-[500px] truncate bg-inherit font-medium"
            defaultValue={name}
            onBlur={handleChange}
            placeholder="Enter character name..."
          />
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <>Status</>,
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span>{row.getValue("status")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "progress",
    header: () => <>Progress</>,
    cell: ({ row }) => {
      return <span>{row.getValue("progress")}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
