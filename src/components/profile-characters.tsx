"use client";
import { columns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface ProfileCharacters {
  _id: string;
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
  console.log(data);

  const fetchCharacterProfile = async () => {
    try {
      const response = await fetch("/api/characterProfiles", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userId}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();

      setData(data);
    } catch (error) {
      console.error("Failed getting character profiles", error);
    }
  };

  useEffect(() => {
    fetchCharacterProfile();
  }, []);

  return (
    <>
      <div className="flex h-full flex-1 flex-col space-y-8">
        <DataTable data={data} columns={columns} />
      </div>
    </>
  );
}
