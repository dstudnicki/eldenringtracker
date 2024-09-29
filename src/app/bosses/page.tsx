"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Toaster } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function BossesPage() {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const currentEnv = process.env.NODE_ENV === "development" ? "http://localhost:3000" : baseURL;

    const router = useRouter();
    const searchParams = useSearchParams();
    const regionValue = searchParams.get("region");

    const { data: session } = useSession();
    const userId = session && session.user ? (session?.user as any).id : null;

    const [data, setData] = useState<{ _id: string; name: string; image: string; location: string; region: string }[]>([]);
    const [selectedBosses, setSelectedBosses] = useState<{ id: string; name: string; image: string; location: string; region: string }[]>([]);
    const [isSelected, setIsSelected] = useState<{ [key: string]: boolean }>({});
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const dataLocations = data.map((boss) => boss.region);

    // Function to remove duplicates from array
    const filterDuplicates = (a: any[]) => {
        const seen: { [key: string]: boolean } = {};
        return a.filter((item) => (seen.hasOwnProperty(item) ? false : (seen[item] = true)));
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

            if (!response.ok) {
                throw new Error("Failed to select a boss");
            }

            setIsSelected((prevState) => ({ ...prevState, [id]: !prevState[id] }));
            await fetchSelectedBosses();

            toast(`Successfully selected ${name}`, {
                description: "Sunday, December 03, 2023 at 9:00 AM",
                action: {
                    label: "Undo",
                    onClick: async () => {
                        setIsSelected((prevState) => ({ ...prevState, [id]: !prevState[id] }));
                        const undoResponse = await fetch(`${currentEnv}/api/bosses`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${userId}`,
                            },
                            body: JSON.stringify({ id, name }),
                        });

                        if (!undoResponse.ok) {
                            throw new Error("Failed to undo select a boss");
                        }
                        await fetchSelectedBosses();
                    },
                },
            });
        } catch (error) {
            console.error("Error selecting boss:", error);
            toast.error("Failed to select boss");
        }
    };

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
        if (regionValue) {
            return data.filter((boss) => boss.region === regionValue);
        } else {
            return data;
        }
    };

    // Function to handle location select
    const handleLocationSelect = (selectedRegion: string) => {
        regionValue === selectedRegion ? router.push(`/bosses`) : router.push(`?region=${selectedRegion}`);
        setOpen(false);
    };

    // Function to handle toggle view
    const handleToggleView = () => {
        setShowSelectedOnly((prev) => !prev);
    };

    useEffect(() => {
        fetchData();
        fetchSelectedBosses();
    }, []);

    // If showSelectedOnly is true, display selectedBosses, otherwise display filtered data
    const displayedData = showSelectedOnly ? selectedBosses : showFilteredData();

    return (
        <main className="flex flex-col px-4 sm:px-8 lg:px-12 xl:px-0 xl:container">
            <>
                <div className="flex gap-4">
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                                {regionValue ? locationsForFilter.find((region) => region === regionValue) : "Search region..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder="Search region..." />
                                <CommandList>
                                    <CommandEmpty>No location found.</CommandEmpty>
                                    <CommandGroup>
                                        {locationsForFilter.map((region) => (
                                            <CommandItem key={region} value={region} onSelect={() => handleLocationSelect(region)}>
                                                <Check className={cn("mr-2 h-4 w-4", regionValue === region ? "opacity-100" : "opacity-0")} />
                                                {region}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <Button variant="outline" onClick={handleToggleView}>
                        {showSelectedOnly ? "View All Bosses" : "View Selected Bosses"}
                    </Button>
                </div>
                <section className="grid sm:grid-cols-2 lg:grid-cols-4 grid-rows-1 gap-4 mt-2">
                    {loading
                        ? Array.from({ length: 8 }).map((_, index) => (
                              <div key={index} className="flex flex-col space-y-3 mt-8">
                                  <Skeleton className="flex h-5 w-[250px] mb-2" />
                                  <Skeleton className="h-[160px] w-[300px] rounded-xl" />
                                  <div className="space-y-2">
                                      <Skeleton className="h-5 w-[250px] mb-6" />
                                      <div className="flex justify-end me-10">
                                          <Skeleton className="h-10 w-10 rounded-md" />
                                      </div>
                                  </div>
                              </div>
                          ))
                        : displayedData.map((boss: any) =>
                              !isSelected[boss._id] ? (
                                  <Card key={boss._id} className="flex flex-col justify-between">
                                      <CardHeader>
                                          <CardTitle className="text-xl font-bold">{boss.name}</CardTitle>
                                      </CardHeader>
                                      <CardContent className="pb-0 text-2xl font-bold">
                                          {boss.image ? <Image className="rounded-md max-h-40 w-full" width={300} height={300} src={boss.image} alt="Picture of boss" /> : <p>No image found.</p>}
                                      </CardContent>
                                      <CardContent className="text-sm mt-2">
                                          <span className="font-bold">Location:</span>
                                          <span className="text-muted-foreground"> {boss.location}</span>
                                      </CardContent>
                                      <CardContent className="flex justify-end">
                                          {showSelectedOnly ? (
                                              <Button className="hover:invert" variant="outline" size="icon" onClick={() => toggleDeleted(boss.id, boss.name)}>
                                                  <X className="h-4 w-4" />
                                              </Button>
                                          ) : (
                                              <Button className="hover:invert" variant="outline" size="icon" onClick={() => toggleSelected(boss._id, boss.name)}>
                                                  <Check className="h-4 w-4" />
                                              </Button>
                                          )}
                                      </CardContent>
                                  </Card>
                              ) : null
                          )}
                </section>
            </>
            <Toaster />
        </main>
    );
}
