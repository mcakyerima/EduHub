import { MobileSidebar } from "./mobile-sidebar"

export const Navbar = () => {
    return (
        <div className="p-3 border-b flex h-full items-center bg-white shadow-sm">
            <MobileSidebar/>
        </div>
    )
}