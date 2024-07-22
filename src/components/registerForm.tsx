"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const formSchema = z
    .object({
        email: z.string().min(2, "Email must be at least 2 characters long").max(50, "Email must be at most 50 characters long").email("This is not a valid email"),
        password: z.string().min(8, "Password must be at least 8 characters long").max(50, "Password must be at most 50 characters long"),
        confirmPassword: z.string().min(8, "Confirm Password must be at least 8 characters long").max(50, "Confirm Password must be at most 50 characters long"),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: "custom",
                message: "The passwords did not match",
                path: ["confirmPassword"],
            });
        }
    });

export default function RegisterForm() {
    // 1. Define your form.
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        }).then(async () => {
            await signIn("credentials", {
                email: values.email,
                password: values.password,
            });
        });

        router.push("./");
    }

    return (
        <Form {...form}>
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
                            <FormDescription>This is your email used to sign into our app.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Password <span className="text-muted-foreground">(at least 8 characters long)</span>
                            </FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormDescription>This is your password.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormDescription>Please confirm your password.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="space-x-1">
                    <span>Already have an account?</span>
                    <Link className="font-bold" href="./login">
                        Log in.
                    </Link>
                </div>
                <Button type="submit">Sign up</Button>
            </form>
        </Form>
    );
}
