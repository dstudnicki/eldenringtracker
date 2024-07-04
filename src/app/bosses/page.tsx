"use client";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function BossesPage() {
    const [data, setData] = useState([]);
    const [isSelected, setIsSelected] = useState<{ [key: string]: any }>({});

    const fetchData = async () => {
        const data = await axios.get("http://localhost:3000/api/bosses");
        setData(data.data);
    };

    const toggleSelected = async (id: string) => {
        const response = await axios.patch("http://localhost:3000/api/bosses", { id });

        setIsSelected((prevState) => ({ ...prevState, [id]: !prevState[id] }));
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <main className="flex flex-col px-4 lg:px-8 xl:px-24">
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 grid-rows-1 gap-4">
                {data.map((boss: any) =>
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
                                <Button className="hover:invert" variant="outline" size="icon" onClick={() => toggleSelected(boss.id)}>
                                    <Check className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ) : null
                )}
            </div>
        </main>
    );
}
