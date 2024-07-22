import Link from "next/link";

export default function Footer() {
    return (
        <footer className="mt-20 px-4 sm:px-8 lg:px-12 xl:px-0 xl:container">
            <div className="mx-auto py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <a href="https://flowbite.com/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Elden Ring Tracker</span>
                    </a>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                        <li>
                            <Link href="./" className="hover:underline me-4 md:me-6">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="./bosses" className="hover:underline me-4 md:me-6">
                                Bosses
                            </Link>
                        </li>
                        {/* <li>
                            <a href="#" className="hover:underline me-4 md:me-6">
                                Weapons
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">
                                Account
                            </a>
                        </li> */}
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
    );
}
