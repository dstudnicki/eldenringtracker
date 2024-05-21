"use client";
import { ModeToggle } from "./toggle";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { UserNav } from "./user-nav";
import { usePathname } from "next/navigation";

export default function Navbar({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
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
        <div className="hidden sm:flex justify-evenly px-4 lg:px-8 xl:px-24 py-20">
            <nav className={cn("flex w-full items-center justify-start space-x-4 lg:space-x-6", className)} {...props}>
                <Link href="/" legacyBehavior>
                    <a onClick={() => setSelectedLink("/")} className={linkClass("/")}>
                        Dashboard
                    </a>
                </Link>
                <Link href="/bosses" legacyBehavior>
                    <a onClick={() => setSelectedLink("/bosses")} className={linkClass("/bosses")}>
                        Bosses
                    </a>
                </Link>
                <Link href="/weapons" legacyBehavior>
                    <a onClick={() => setSelectedLink("/weapons")} className={linkClass("/weapons")}>
                        Weapons
                    </a>
                </Link>
            </nav>
            <div className="flex items-center gap-4">
                <ModeToggle />
                <UserNav />
            </div>
        </div>
    );
}
