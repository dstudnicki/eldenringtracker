import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import hero from "../images/MENU_Knowledge_00193.png";

export default function Home() {
    return (
        <main className="flex flex-col px-4 lg:px-8 xl:px-24">
            <section className="flex justify-between items-center">
                <div>
                    <h1 className="mb-1 font-bold text-7xl">Track your Elden Ring progress</h1>
                    <p className="mt-6 text-lg text-muted-foreground">Make your journey through the Lands Between easier by tracking your game progress</p>
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

            <footer className="rounded-lg shadow mt-20">
                <div className="mx-auto p-4 md:py-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <a href="https://flowbite.com/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Elden Ring Tracker</span>
                        </a>
                        <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                            <li>
                                <a href="#" className="hover:underline me-4 md:me-6">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline me-4 md:me-6">
                                    Bosses
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline me-4 md:me-6">
                                    Weapons
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">
                                    Account
                                </a>
                            </li>
                        </ul>
                    </div>
                    <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                    <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
                        © 2024{" "}
                        <a href="https://flowbite.com/" className="hover:underline">
                            Elden Ring Tracker
                        </a>
                    </span>
                </div>
            </footer>
        </main>
    );
}
