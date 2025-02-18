"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import hero from "../images/MENU_Knowledge_00193.png";
import Footer from "@/components/footer";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  const dynamicRoute = session ? "/bosses" : "/register";

  return (
    <main className="px-4 xl:container sm:px-8 lg:px-12">
      <section className="flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-6xl font-bold sm:text-7xl">
            Track your Elden Ring progress
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Make your journey through the Lands Between easier by tracking your
            in game progress.
          </p>
          <Button className="mt-6 rounded-full p-7 text-xl">
            <Link href={dynamicRoute}>Get Started</Link>
          </Button>
        </div>
        <div className="hidden md:block">
          <Image src={hero} width={800} height={800} alt="hero" />
        </div>
      </section>
      <div className="mt-16">
        <Card className="grid justify-evenly gap-4 rounded-3xl border p-0 shadow-lg md:flex md:p-4 lg:p-8">
          <div className="p-4">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">
                Bosses Defeated
              </CardTitle>
            </CardHeader>
            <CardContent className="text-lg font-light">
              Keep track of the formidable foes you have conquered. Mark each
              boss as you defeat them and see your progress through the games
              toughest challenges.
            </CardContent>
          </div>
          <div className="p-4">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">
                Items Collected
              </CardTitle>
            </CardHeader>
            <CardContent className="text-lg font-light">
              Organize and monitor the powerful artifacts and essential items
              you have gathered. Ensure you dont miss any key equipment on your
              journey.
            </CardContent>
          </div>
          <div className="p-4">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">
                Game Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="text-lg font-light">
              Track your overall progress through the Lands Between. Stay on top
              of main quests, side missions, and hidden secrets to fully
              complete your adventure.
            </CardContent>
          </div>
        </Card>
      </div>
      <Footer />
    </main>
  );
}
