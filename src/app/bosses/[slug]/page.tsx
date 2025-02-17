"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

interface User {
  name: string;
  email: string;
  image: string;
  id: string;
}

interface Boss {
  _id: string;
  name: string;
  image: string;
  location: string;
  region: string;
}

export default function Page({ params }: { params: { slug: string } }) {
  const { data: session } = useSession();
  const userId = session && session.user ? (session?.user as User).id : null;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Boss | null>(null);

  useEffect(() => {
    if (!params.slug || session === undefined || !userId) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/bosses/${params.slug}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userId}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch boss data");
        }
        const data: Boss = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.slug, userId]);

  return (
    <section className="mt-2 flex justify-center">
      {loading ? (
        <div className="mt-2 flex flex-col space-y-3">
          <Skeleton className="mb-2 flex h-5 w-[250px]" />
          <Skeleton className="h-[160px] w-[300px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="mb-6 h-5 w-[250px]" />
          </div>
        </div>
      ) : data ? (
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-bold">{data.name}</CardTitle>
          </CardHeader>
          <CardContent className="pb-0 text-2xl font-bold">
            {data.image ? (
              <Image
                className="w-full rounded-md"
                width={300}
                height={300}
                src={data.image}
                alt="Picture of boss"
              />
            ) : (
              <p>No image found.</p>
            )}
          </CardContent>
          <CardContent className="mt-2 flex flex-col text-sm">
            <div>
              <span className="font-bold">Region:</span>
              <span className="text-muted-foreground"> {data.region}</span>
            </div>
            <div>
              <span className="font-bold">Location:</span>
              <span className="text-muted-foreground"> {data.location}</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <p>Not found</p>
      )}
    </section>
  );
}
