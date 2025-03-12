"use client";
import { columns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface ProfileCharacters {
  id: string;
  name: string;
  status: string;
  progress: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}

export default function ProfileCharacters() {
  const { data: session } = useSession();
  const userId = session && session.user ? (session?.user as User).id : null;

  const [data, setData] = useState<ProfileCharacters[]>([]);

  const tasks = [
    {
      name: "Default profile",
      status: "in progress",
      progress: "16/165",
    },
  ];

  useEffect(() => {
    const fetchCharacterProfile = async () => {
      try {
        const response = await fetch("api/someEndpoint", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userId}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        setData(data);
      } catch (error) {
        console.error("Failed adding character profile", error);
      }
    };

    fetchCharacterProfile();
  }, [userId]);

  return (
    <>
      <div className="flex h-full flex-1 flex-col space-y-8">
        <DataTable data={tasks} columns={columns} />
      </div>
    </>
  );
}
