"use client";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";

export default function BossesPage() {
    const [data, setData] = useState({ bosses: [] });
    const [isSelected, setIsSelected] = useState(false);

    const fetchData = async () => {
        const data = await axios.get("http://localhost:3000/api/bosses");
        setData(data.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <main className="flex flex-col px-4 lg:px-8 xl:px-24">
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 grid-rows-1 gap-4">
                {!isSelected ? (
                    data.bosses.map((boss: any) => (
                        <Card key={boss.id}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-md font-medium">{boss.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="pb-0 text-2xl font-bold">
                                {boss.image ? <Image className="rounded-md" width={300} height={300} src={boss.image} alt="Picture of boss" /> : <p>No image</p>}
                            </CardContent>
                            <CardContent className="text-xs text-muted-foreground">{boss.location}</CardContent>
                            <button onClick={() => setIsSelected(!isSelected)}>Check</button>
                        </Card>
                    ))
                ) : (
                    <p>Checked</p>
                )}
            </div>
        </main>
    );
}
