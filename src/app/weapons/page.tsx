import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getData() {
    const response = await fetch("https://eldenring.fanapis.com/api/weapons");

    if (!response.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error("Failed to fetch data");
    }

    return response.json();
}

export default async function WeaponsPage() {
    const data = await getData();
    console.log(data);

    return (
        <main className="flex flex-col px-4 lg:px-8 xl:px-24">
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 grid-rows-1 gap-4">
                {data.data.map((weapon: any) => (
                    <Card key={weapon.id}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-md font-medium">{weapon.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground">{weapon.category}</CardContent>
                        <CardContent className="pb-0 text-2xl font-bold">
                            {weapon.image ? <Image className="rounded-md" width={300} height={300} src={weapon.image} alt="Picture of boss" /> : <p>No image</p>}
                        </CardContent>
                        <CardContent className="text-xs text-muted-foreground">{weapon.description}</CardContent>
                    </Card>
                ))}
            </div>
        </main>
    );
}
