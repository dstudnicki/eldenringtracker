import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import hero from "../images/MENU_Knowledge_00193.png";
import Footer from "@/components/footer";

export default function Home() {
    return (
        <>
            <main className="px-4 lg:px-8 xl:px-80">
                <section className="flex justify-between items-center">
                    <div>
                        <h1 className="mb-1 font-bold text-7xl">Track your Elden Ring progress</h1>
                        <p className="mt-6 text-lg text-muted-foreground">Make your journey through the Lands Between easier by tracking your in game progress.</p>
                        <Button className="mt-6 text-xl p-8 rounded-full">Get started</Button>
                    </div>
                    <div>
                        <Image src={hero} width={800} height={800} alt="hero" />
                    </div>
                </section>
                <div className="mt-20">
                    <Card className="flex justify-evenly rounded-3xl border p-8 shadow-lg">
                        <div className="p-4">
                            <CardHeader>
                                <CardTitle className="text-3xl font-bold">Bosses Defeated</CardTitle>
                            </CardHeader>
                            <CardContent className="text-lg font-light">
                                Keep track of the formidable foes you've conquered. Mark each boss as you defeat them and see your progress through the game's toughest challenges.
                            </CardContent>
                        </div>
                        <div className="p-4">
                            <CardHeader>
                                <CardTitle className="text-3xl font-bold">Items Collected</CardTitle>
                            </CardHeader>
                            <CardContent className="text-lg font-light">
                                Organize and monitor the powerful artifacts and essential items you've gathered. Ensure you don't miss any key equipment on your journey.
                            </CardContent>
                        </div>
                        <div className="p-4">
                            <CardHeader>
                                <CardTitle className="text-3xl font-bold">Game Progress</CardTitle>
                            </CardHeader>
                            <CardContent className="text-lg font-light">
                                Track your overall progress through the Lands Between. Stay on top of main quests, side missions, and hidden secrets to fully complete your adventure.
                            </CardContent>
                        </div>
                    </Card>
                </div>
            </main>
            <Footer />
        </>
    );
}
