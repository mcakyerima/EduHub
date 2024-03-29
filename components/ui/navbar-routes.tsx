"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import Link  from 'next/link';
import { SearchInput } from "../search-input";

export const NavbarRoutes = () => {
    const pathname = usePathname();
    const router = useRouter();

    // check if pathname is teacher or student and show sidebar
    // routes based on that.

    const isTeacherPage = pathname?.startsWith("/teacher");
    const isPlayerPage = pathname?.includes("/chapter");
    const isSearchPage = pathname?.includes('/search')

    return (
        <>
        {isSearchPage && (
            <div className="hidden md:block">
                <SearchInput/>
            </div>
        )}
            <div className="flex gap-x-2 ml-auto">
                { isTeacherPage || isPlayerPage ? (
                    <Link href="/">
                        <Button size="sm" variant="ghost">
                            <LogOut className="h-5 w-5 mr-2"/>
                            Exit
                        </Button>
                    </Link>
                ) : (
                    <Link href="/teacher/courses">
                        <Button size="sm" variant="ghost">
                            Teacher mode
                        </Button>
                    </Link>
                )}
                <UserButton
                    afterSignOutUrl="/"
                />
            </div>
        </>
    )
}