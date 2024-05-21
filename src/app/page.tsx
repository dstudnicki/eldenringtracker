"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Home() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
        <main className="flex flex-col px-4 lg:px-8 xl:px-24">
            <h1 className="mb-6 mt-6 sm:mt-0 font-bold text-3xl">Dashboard</h1>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 grid-rows-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-0 text-2xl font-bold">$54,321.90</CardContent>
                    <CardContent className="text-xs text-muted-foreground">+20,1% from last month</CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-0 text-2xl font-bold">$54,321.90</CardContent>
                    <CardContent className="text-xs text-muted-foreground">+20,1% from last month</CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-0 text-2xl font-bold">$54,321.90</CardContent>
                    <CardContent className="text-xs text-muted-foreground">+20,1% from last month</CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-0 text-2xl font-bold">$54,321.90</CardContent>
                    <CardContent className="text-xs text-muted-foreground">+20,1% from last month</CardContent>
                </Card>
                <Card className="sm:col-span-2 md:row-span-3">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold">Overview</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="row-span-3">
                    <CardHeader className="lg:px-2 xl:px-4 2xl:px-6 pb-1">
                        <CardTitle className="text-md font-semibold">Recent Sales</CardTitle>
                    </CardHeader>
                    <CardContent className="lg:px-2 xl:px-4 2xl:px-6 pb-4 text-sm text-muted-foreground">You made 265 sales this month.</CardContent>
                    <div className="flex items-center justify-between px-4 lg:px-2 xl:px-4 2xl:px-6 pb-4">
                        <div className="flex items-center lg:gap-2 xl:gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=Abby&backgroundColor=d1d4f9" alt="@shadcn" />
                            </Avatar>
                            <div>
                                <p className="pb-0 font-bold">Olivia Brian</p>
                                <p className="text-xs text-muted-foreground">o.brian@email.com</p>
                            </div>
                        </div>
                        <p className="pb-0 font-bold">+$345.90</p>
                    </div>
                    <div className="flex items-center justify-between px-4 lg:px-2 xl:px-4 2xl:px-6 pb-4">
                        <div className="flex items-center lg:gap-2 xl:gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=Abby&backgroundColor=d1d4f9" alt="@shadcn" />
                            </Avatar>
                            <div>
                                <p className="pb-0 font-bold">Olivia Brian</p>
                                <p className="text-xs text-muted-foreground">o.brian@email.com</p>
                            </div>
                        </div>
                        <p className="pb-0 font-bold">+$345.90</p>
                    </div>
                    <div className="flex items-center justify-between px-4 lg:px-2 xl:px-4 2xl:px-6 pb-4">
                        <div className="flex items-center lg:gap-2 xl:gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=Abby&backgroundColor=d1d4f9" alt="@shadcn" />
                            </Avatar>
                            <div>
                                <p className="pb-0 font-bold">Olivia Brian</p>
                                <p className="text-xs text-muted-foreground">o.brian@email.com</p>
                            </div>
                        </div>
                        <p className="pb-0 font-bold">+$345.90</p>
                    </div>
                </Card>
            </div>
        </main>
    );
}
