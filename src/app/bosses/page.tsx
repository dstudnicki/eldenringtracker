import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getData() {
    const response = await fetch("https://eldenring.fanapis.com/api/bosses?limit=100");

    if (!response.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error("Failed to fetch data");
    }

    return response.json();
}

export default async function BossesPage() {
    const data = await getData();
    console.log(data);

    return (
        <main className="flex flex-col px-4 lg:px-8 xl:px-24">
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 grid-rows-1 gap-4">
                {data.data.map((boss: any) => (
                    <Card key={boss.id}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-md font-medium">{boss.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-0 text-2xl font-bold">
                            {" "}
                            {boss.image ? <Image className="rounded-md" width={300} height={300} src={boss.image} alt="Picture of boss" /> : <p>No image</p>}
                        </CardContent>
                        <CardContent className="text-xs text-muted-foreground">{boss.location}</CardContent>
                    </Card>
                ))}
            </div>
        </main>
    );
}
