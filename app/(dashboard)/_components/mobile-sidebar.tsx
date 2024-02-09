import { Menu } from 'lucide-react';
import { Sidebar } from './sidebar';

import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet";


export const MobileSidebar = () => {
    return (
        <Sheet>
            <SheetTrigger className="md:hidden pr-3 hover:opacity-75 transition">
                <Menu/>
            </SheetTrigger>
            <SheetContent side='left' className='p-0 bg-white'>
                <Sidebar/>
            </SheetContent>
        </Sheet>
    )
}