"use client";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";

export default function BossesPage() {
    const [data, setData] = useState([]);
    const [isSelected, setIsSelected] = useState<{ [key: string]: any }>({});
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const dataLocations = data.map((boss: any) => boss.location);

    const filteredLocations = (a: any[]) => {
        var seen: { [key: string]: boolean } = {};
        return a.filter(function (item) {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
    };

    const locationsForFilter = filteredLocations(dataLocations);

    const fetchData = async () => {
        const data = await axios.get("http://localhost:3000/api/bosses");
        setData(data.data);
    };

    const toggleSelected = async (id: string, name: string) => {
        await axios.patch("http://localhost:3000/api/bosses", { id, name });
        setIsSelected((prevState) => ({ ...prevState, [id]: !prevState[id] }));

        toast(`Succesfully selected ${name}`, {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: {
                label: "Undo",
                onClick: () => {
                    setIsSelected((prevState) => ({ ...prevState, [id]: !prevState[id] }));
                    axios.patch("http://localhost:3000/api/bosses", { id });
                },
            },
        });
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
            <section className="grid sm:grid-cols-2 lg:grid-cols-4 grid-rows-1 gap-4 mt-2">
                {showFilteredData().map((boss: any) =>
                    !isSelected[boss.id] ? (
                        <Card key={boss.id} className="flex flex-col justify-between">
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
                                <Button className="hover:invert" variant="outline" size="icon" onClick={() => toggleSelected(boss.id, boss.name)}>
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
