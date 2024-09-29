import { Skeleton } from "@/components/ui/skeleton";

export default function BossesFallback() {
    return (
        <main className="flex flex-col px-4 sm:px-8 lg:px-12 xl:px-0 xl:container">
            <section className="grid sm:grid-cols-2 lg:grid-cols-4 grid-rows-1 gap-4 mt-2">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="flex flex-col space-y-3 mt-8">
                        <Skeleton className="flex h-5 w-[250px] mb-2" />
                        <Skeleton className="h-[160px] w-[300px] rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-[250px] mb-6" />
                            <div className="flex justify-end me-10">
                                <Skeleton className="h-10 w-10 rounded-md" />
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </main>
    );
}
