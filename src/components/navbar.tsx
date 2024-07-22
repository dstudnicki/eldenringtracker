"use client";
import { ModeToggle } from "./toggle";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { UserNav } from "./user-nav";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Navbar({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
    const { data: session } = useSession();

    const dynamicRoute = !session && "/bosses" ? "/register" : "/bosses";
    const pathname = usePathname();
    const [selectedLink, setSelectedLink] = useState<string | null>(null);

    const linkClass = (href: string) => cn("text-lg font-medium transition-colors", href === selectedLink ? "" : "text-muted-foreground hover:text-primary");

    useEffect(() => {
        if (pathname === "/") {
            setSelectedLink("/");
        } else {
            setSelectedLink(pathname);
        }
    }, [pathname]);

    return (
        <div className="hidden sm:flex justify-between px-4 sm:px-8 lg:px-12 xl:px-0 xl:container py-16">
            <nav className={cn("flex items-center justify-start", className)} {...props}>
                <span className="text-2xl font-bold">Elden Ring Tracker</span>
                <div className="ms-16 space-x-4 lg:space-x-6">
                    <Link href="./" legacyBehavior>
                        <a onClick={() => setSelectedLink("/")} className={linkClass("/")}>
                            Home
                        </a>
                    </Link>
                    <Link href={dynamicRoute} legacyBehavior>
                        <a onClick={() => setSelectedLink("/bosses")} className={linkClass("/bosses")}>
                            Bosses
                        </a>
                    </Link>
                </div>
            </nav>
            <div className="flex items-center gap-4">
                <ModeToggle />
                <UserNav />
            </div>
        </div>
    );
}
