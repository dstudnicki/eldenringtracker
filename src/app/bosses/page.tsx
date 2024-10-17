"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Toaster } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Check, ChevronsUpDown, Rotate3D, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { set } from "zod";

export default function BossesPage() {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const currentEnv =
    process.env.NODE_ENV === "development" ? "http://localhost:3000" : baseURL;

  const router = useRouter();
  const searchParams = useSearchParams();
  const regionValue = searchParams.get("region");
  const bossValue = searchParams.get("boss");

  const { data: session } = useSession();
  const userId = session && session.user ? (session?.user as any).id : null;

  const [data, setData] = useState<
    {
      _id: string;
      name: string;
      image: string;
      location: string;
      region: string;
    }[]
  >([]);
  const [selectedBosses, setSelectedBosses] = useState<
    {
      id: string;
      name: string;
      image: string;
      location: string;
      region: string;
    }[]
  >([]);
  const [isSelected, setIsSelected] = useState<{ [key: string]: boolean }>({});
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [openRegion, setOpenRegion] = useState(false);
  const [openBosses, setOpenBosses] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRateLimited, setIsRateLimited] = useState(false);
  console.log(isRateLimited);

  const dataLocations = data.map((boss) => boss.region);
  const dataBosses = data.map((boss) => boss.name);

  // Function to remove duplicates from array
  const filterDuplicates = (a: any[]) => {
    const seen: { [key: string]: boolean } = {};
    return a.filter((item) =>
      seen.hasOwnProperty(item) ? false : (seen[item] = true),
    );
  };

  const locationsForFilter = filterDuplicates(dataLocations);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${currentEnv}/api/bosses`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userId}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSelectedBosses = async () => {
    try {
      const response = await axios.get(`${currentEnv}/api/selectedBosses`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userId}`,
        },
      });
      setSelectedBosses(response.data);
    } catch (error) {
      console.error("Error fetching selected bosses:", error);
    }
  };

  // Function to select a boss
  const toggleSelected = async (id: string, name: string) => {
    if (!session || !session.user) {
      toast.error("You need to be logged in to select a boss");
      return;
    }

    try {
      const response = await fetch(`${currentEnv}/api/bosses`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userId}`,
        },
        body: JSON.stringify({ id, name }),
      });

      if (response.status === 429) {
        toast.error("Rate limit exceeded wait for a minute.");
        setIsRateLimited(true);
      } else if (!response.ok) {
        toast.error("Failed to select a boss try again.");
      } else {
        toast(`Successfully selected ${name}`, {
          description: "Sunday, December 03, 2023 at 9:00 AM",
        });
        setIsSelected((prevState) => ({ ...prevState, [id]: !prevState[id] }));
        setIsRateLimited(false);
      }

      await fetchSelectedBosses();
    } catch (error) {
      console.error("Error selecting boss:", error);
    }
  };

  // Function to delete selected bosses
  const toggleDeleted = async (id: string, name: string) => {
    try {
      const response = await fetch(`${currentEnv}/api/selectedBosses`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userId}`,
        },
        body: JSON.stringify({ id, name }),
      });
      setIsSelected((prevState) => ({ ...prevState, [id]: !prevState[id] }));

      if (!response.ok) {
        throw new Error("Failed to undo boss from selected bosses");
      }
      await fetchSelectedBosses();
      toast.success(`Successfully removed ${name} from selected bosses`);
    } catch (error) {
      console.error("Error deleting boss:", error);
      toast.error("Failed to delete boss");
    }
  };

  // Function to filter data based on selected region
  const showFilteredData = () => {
    const formattedRegionValue = regionValue
      ? regionValue.replace(/-/g, " ")
      : "";
    const formattedBossValue = bossValue ? bossValue.replace(/-/g, " ") : "";

    if (formattedRegionValue) {
      return data.filter((boss) => boss.region === formattedRegionValue);
    } else if (formattedBossValue) {
      return data.filter((boss) => boss.name === formattedBossValue);
    } else return data;
  };

  // Function to handle location select
  const handleLocationSelect = (selectedRegion: string) => {
    const formattedRegion = selectedRegion.replace(/ /g, "-");

    regionValue === formattedRegion
      ? router.push(`/bosses`)
      : router.push(`?region=${formattedRegion}`);

    setOpenRegion(false);
  };

  useEffect(() => {
    if (regionValue) {
      const formattedRegion = regionValue.replace(/-/g, " ");
      const isValidRegion = locationsForFilter.some(
        (region: string) =>
          region.toLowerCase() === formattedRegion.toLowerCase(),
      );
      if (!isValidRegion) {
        router.push("/bosses");
      }
    }
  }, [regionValue, router, locationsForFilter]);

  // Function to handle boss select
  const handleBossSelect = (selectedBoss: string) => {
    const formattedBoss = selectedBoss.replace(/ /g, "-");

    bossValue === formattedBoss
      ? router.push(`/bosses`)
      : router.push(`?boss=${formattedBoss}`);

    setOpenBosses(false);
  };

  useEffect(() => {
    if (bossValue) {
      const formattedBoss = bossValue.replace(/-/g, " ");
      const isValidBoss = dataBosses.some(
        (boss: string) => boss.toLowerCase() === formattedBoss.toLowerCase(),
      );
      if (!isValidBoss) {
        router.push("/bosses");
      }
    }
  }, [bossValue, router, dataBosses]);

  // Function to handle toggle view
  const handleToggleView = () => {
    setShowSelectedOnly((prev) => !prev);
    router.push(`/bosses`);
  };

  useEffect(() => {
    fetchData();
    fetchSelectedBosses();
  }, []);

  // If showSelectedOnly is true, display selected bosses, otherwise display filtered data
  const displayedData = showSelectedOnly ? selectedBosses : showFilteredData();

  return (
    <main className="flex flex-col px-4 text-xl xl:container sm:px-8 lg:px-12">
      <>
        <div className="flex flex-col md:flex-row md:gap-4">
          <div className="flex gap-2 sm:gap-4">
            <Popover open={openRegion} onOpenChange={setOpenRegion}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openRegion}
                >
                  {regionValue
                    ? locationsForFilter.find(
                        (region) => region.replace(/ /g, "-") === regionValue,
                      ) || "Filter by region..." // Fallback if not found
                    : "Filter by region..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Search region..." />
                  <CommandList>
                    <CommandEmpty>No region found.</CommandEmpty>
                    <CommandGroup>
                      {locationsForFilter.map((region) => (
                        <CommandItem
                          key={region}
                          value={region}
                          onSelect={() => handleLocationSelect(region)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              regionValue === region.replace(/ /g, "-")
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {region}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Popover open={openBosses} onOpenChange={setOpenBosses}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openBosses}
                >
                  {bossValue
                    ? dataBosses.find(
                        (boss) => boss.replace(/ /g, "-") === bossValue,
                      ) || "Filter by boss..." // Fallback if not found
                    : "Filter by boss..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Search boss..." />
                  <CommandList>
                    <CommandEmpty>No boss found.</CommandEmpty>
                    <CommandGroup>
                      {dataBosses.map((boss) => (
                        <CommandItem
                          key={boss}
                          value={boss}
                          onSelect={() => handleBossSelect(boss)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              bossValue === boss.replace(/ /g, "-")
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {boss}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="mt-2 md:mt-0">
            <Button variant="outline" onClick={handleToggleView}>
              {showSelectedOnly ? "View All Bosses" : "View Selected Bosses"}
            </Button>
          </div>
        </div>

        <section className="mt-2 grid grid-rows-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="mt-2 flex flex-col space-y-3">
                  <Skeleton className="mb-2 flex h-5 w-[250px]" />
                  <Skeleton className="h-[160px] w-[300px] rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="mb-6 h-5 w-[250px]" />
                    <div className="me-10 flex justify-end">
                      <Skeleton className="h-10 w-10 rounded-md" />
                    </div>
                  </div>
                </div>
              ))
            : displayedData.map((boss: any) =>
                !isSelected[boss._id] ? (
                  <Card
                    key={boss._id}
                    className="flex flex-col justify-between"
                  >
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">
                        {boss.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-0 text-2xl font-bold">
                      {boss.image ? (
                        <Image
                          className="max-h-40 w-full rounded-md"
                          width={300}
                          height={300}
                          src={boss.image}
                          alt="Picture of boss"
                        />
                      ) : (
                        <p>No image found.</p>
                      )}
                    </CardContent>
                    <CardContent className="mt-2 text-sm">
                      <span className="font-bold">Location:</span>
                      <span className="text-muted-foreground">
                        {" "}
                        {boss.location}
                      </span>
                    </CardContent>
                    <CardContent className="flex justify-end">
                      {isRateLimited ? (
                        <Spinner size="small" />
                      ) : showSelectedOnly ? (
                        <Button
                          className="hover:invert"
                          variant="outline"
                          size="icon"
                          onClick={() => toggleDeleted(boss.id, boss.name)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          className="hover:invert"
                          variant="outline"
                          size="icon"
                          onClick={() => toggleSelected(boss._id, boss.name)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ) : null,
              )}
        </section>
      </>
      <Toaster />
    </main>
  );
}
