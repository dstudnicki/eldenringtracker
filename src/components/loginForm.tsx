"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage, FormField } from "@/components/ui/form";
import { Icons } from "./ui/icons";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const formSchema = z.object({
    email: z.string().min(2, "Email must be at least 2 characters long").max(50, "Email must be at most 50 characters long").email("This is not a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters long").max(50, "Password must be at most 50 characters long"),
});

export default function LoginForm() {
    const [loginError, setLoginError] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const router = useRouter();

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoginError({ email: "", password: "" });

        const response = await signIn("credentials", {
            email: values.email,
            password: values.password,
        });

        if (response?.error) {
            setLoginError({
                email: "Invalid email or password.",
                password: "Invalid email or password.",
            });
        } else {
            router.push("/");
        }
    }

    return (
        <div className="grid gap-6">
            <Form {...form}>
                {loginError.email && <p className="text-red-500">{loginError.email}</p>}
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="johndoe@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Sign in</Button>
                </form>
            </Form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <Button variant="outline" type="button" disabled={isLoading} onClick={() => signIn("google")}>
                    {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : <Icons.google className="mr-2 h-4 w-4" />} Google
                </Button>
                <Button variant="outline" type="button" disabled={isLoading} onClick={() => signIn("github")}>
                    {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : <Icons.gitHub className="mr-2 h-4 w-4" />} GitHub
                </Button>
            </div>
        </div>
    );
}
