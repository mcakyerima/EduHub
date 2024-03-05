import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";

export const Sidebar = () => {
    return (
        <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
            <div className="p-5 flex items-center gap-x-2">
                <Logo/>
                <span className="text-xl text-blue-700 font-bold">EduHub</span>
            </div>
            <div className="flex flex-col w-full">
                <SidebarRoutes/>
            </div>

        </div>
    );
}