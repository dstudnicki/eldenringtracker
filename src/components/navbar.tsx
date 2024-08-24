"use client";
import { ModeToggle } from "./toggle";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { UserNav } from "./user-nav";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function Navbar({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
    const { data: session } = useSession();

    // function classNames(...classes: string[]) {
    //     return classes.filter(Boolean).join(" ")
    //   }

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
        <div className="flex justify-between px-4 sm:px-8 lg:px-12 xl:px-0 xl:container py-16">
            <nav className={cn("flex items-center justify-end sm:justify-start w-full sm:w-auto", className)} {...props}>
                <span className="hidden sm:block text-2xl font-bold">Elden Ring Tracker</span>
                <div className="sm:hidden">
                    <Sheet key="left">
                        <ModeToggle />
                        <SheetTrigger asChild>
                            <Button variant="ghost">
                                <svg className="block h-6 w-6 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <title>Mobile menu</title>
                                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
                                </svg>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetHeader className="text-left">
                                {session ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage
                                                        src={session.user?.image || "https://api.dicebear.com/7.x/notionists/svg?seed=Abby&backgroundColor=d1d4f9"}
                                                        alt="User profile picture"
                                                    />
                                                    <AvatarFallback>SC</AvatarFallback>
                                                </Avatar>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56" align="end" forceMount>
                                            <DropdownMenuLabel className="font-normal">
                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                                                    <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <SheetTitle>Elden Ring Tracker</SheetTitle>
                                )}
                            </SheetHeader>
                            <div className="grid gap-4 py-8">
                                <a href="./">Home</a>
                                <a href={dynamicRoute}>Bosses</a>
                            </div>
                            {session ? (
                                <SheetClose asChild>
                                    <Link onClick={() => signOut()} href="./register">
                                        <Button className="w-full" type="submit">
                                            Log out
                                        </Button>
                                    </Link>
                                </SheetClose>
                            ) : (
                                <SheetFooter className="gap-2">
                                    <SheetClose asChild>
                                        <Link href="./register">
                                            <Button className="w-full" type="submit">
                                                Sign up
                                            </Button>
                                        </Link>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Link href="./login">
                                            <Button className="w-full" variant="secondary" type="submit">
                                                Sign in
                                            </Button>
                                        </Link>
                                    </SheetClose>
                                </SheetFooter>
                            )}
                        </SheetContent>
                    </Sheet>
                </div>
                <div className="hidden sm:flex ms-16 space-x-4 lg:space-x-6">
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
            <div className="hidden sm:flex items-center gap-4">
                <ModeToggle />
                <UserNav />
            </div>
        </div>
    );
}
