"use client";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Toaster } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function BossesPage() {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const { data: session } = useSession();
    const session1 = session && session.user ? session.user.id : undefined;
    const userId = session1;

    const [data, setData] = useState([]);
    const [isSelected, setIsSelected] = useState<{ [key: string]: any }>({});
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(true); // Add loading state
    const dataLocations = data.map((boss: any) => boss.location);

    const filteredLocations = (a: any[]) => {
        var seen: { [key: string]: boolean } = {};
        return a.filter(function (item) {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
    };

    const locationsForFilter = filteredLocations(dataLocations);

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/bosses", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userId}`, // Use session token for authorization
                },
            });
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    const toggleSelected = async (id: string, name: string) => {
        if (!session || !session.user) {
            toast.error("You need to be logged in to select a boss");
            return;
        }

        try {
            const response = await fetch(`${baseURL}/api/bosses`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${(session?.user as any).id}`, // Use session token for authorization
                },
                body: JSON.stringify({ id, name }),
            });

            if (!response.ok) {
                throw new Error("Failed to select a boss");
            }

            setIsSelected((prevState) => ({ ...prevState, [id]: !prevState[id] }));

            toast(`Successfully selected ${name}`, {
                description: "Sunday, December 03, 2023 at 9:00 AM",
                action: {
                    label: "Undo",
                    onClick: async () => {
                        setIsSelected((prevState) => ({ ...prevState, [id]: !prevState[id] }));
                        const response = await fetch(`${baseURL}/api/bosses`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${(session?.user as any).id}`, // Use session token for authorization
                            },
                            body: JSON.stringify({ id, name }),
                        });

                        if (!response.ok) {
                            throw new Error("Failed to undo select a boss");
                        }
                    },
                },
            });
        } catch (error) {
            console.error("Error selecting boss:", error);
            toast.error("Failed to select boss");
        }
    };

    const showFilteredData = () => {
        if (value) {
            return data.filter((boss: any) => boss.location === value);
        } else {
            return data;
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <main className="flex flex-col px-4 sm:px-8 lg:px-12 xl:px-0 xl:container">
            {loading ? (
                <Skeleton className="h-9 w-[200px]" />
            ) : (
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                            {value ? locationsForFilter.find((location) => location === value) : "Select location..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Search location..." />
                            <CommandList>
                                <CommandEmpty>No location found.</CommandEmpty>
                                <CommandGroup>
                                    {locationsForFilter.map((location) => (
                                        <CommandItem
                                            key={location}
                                            value={location}
                                            onSelect={(currentValue) => {
                                                setValue(currentValue === value ? "" : currentValue);
                                                setOpen(false);
                                            }}>
                                            <Check className={cn("mr-2 h-4 w-4", value === location ? "opacity-100" : "opacity-0")} />
                                            {location}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            )}
            <section className="grid sm:grid-cols-2 lg:grid-cols-4 grid-rows-1 gap-4 mt-2">
                {loading
                    ? // Display skeleton loaders when loading
                      Array.from({ length: 8 }).map((_, index) => (
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
                    : showFilteredData().map((boss: any) =>
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
                                      <Button className="hover:invert" variant="outline" size="icon" onClick={() => toggleSelected(boss._id, boss.name)}>
                                          <Check className="h-4 w-4" />
                                      </Button>
                                  </CardContent>
                              </Card>
                          ) : null
                      )}
            </section>
            <Toaster />
        </main>
    );
}
