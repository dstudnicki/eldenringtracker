"use client";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";

// async function getData() {
//     const response = await fetch("http://localhost:3000/api/bosses");

//     if (!response.ok) {
//         // This will activate the closest `error.js` Error Boundary
//         throw new Error("Failed to fetch data");
//     }

//     return response.json();
// }

export default function BossesPage() {
    // const data = await getData();
    // console.log(data);

    const [data, setData] = useState([]);
    const [isSelected, setIsSelected] = useState<{ [key: string]: any }>({});

    const fetchData = async () => {
        const data = await axios.get("http://localhost:3000/api/bosses");
        setData(data.data);
    };

    const toggleSelected = (id: number) => {
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
                        <Card key={boss.id}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-md font-medium">{boss.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="pb-0 text-2xl font-bold">
                                {boss.image ? <Image className="rounded-md" width={300} height={300} src={boss.image} alt="Picture of boss" /> : <p>No image</p>}
                            </CardContent>
                            <CardContent className="text-xs text-muted-foreground">{boss.location}</CardContent>
                            <button onClick={() => toggleSelected(boss.id)}>Check</button>
                        </Card>
                    ) : null
                )}
            </div>
        </main>
    );
}
